import {
  Direction,
  TrainRouteType,
  ActiveTrain,
  StationSchedule,
} from '@/types';
import { stations } from '@/data/stations';
import { parseTimeToMinutes, minutesToTimeString } from '@/utils/timeUtils';
import { getScheduleKey } from '@/utils/scheduleUtils';
import { MIDNIGHT_THRESHOLD_MINUTES, MINUTES_IN_DAY } from '@/constants/time';
import { getTravelOffsets } from './travelTimeDeriver';

// ─── Station lookup by ID ───────────────────────────────────

const stationById = new Map(stations.map((s) => [s.id, s]));

/**
 * Enumerate all train departures from origin for a given route.
 * Returns departure times in minutes-since-midnight.
 */
function enumerateDepartures(
  schedule: StationSchedule,
): number[] {
  const first = parseTimeToMinutes(schedule.firstTrain);
  let last = parseTimeToMinutes(schedule.lastTrain);
  if (last < first) last += MINUTES_IN_DAY;

  const departures: number[] = [];
  for (let t = first; t <= last; t += schedule.intervalMinutes) {
    departures.push(t);
  }
  return departures;
}

/**
 * Interpolate GPS position between two stations based on progress fraction.
 */
function interpolatePosition(
  stationAId: string,
  stationBId: string,
  progress: number,
): { latitude: number; longitude: number } {
  const a = stationById.get(stationAId);
  const b = stationById.get(stationBId);
  if (!a || !b) return { latitude: 0, longitude: 0 };

  return {
    latitude: a.latitude + progress * (b.latitude - a.latitude),
    longitude: a.longitude + progress * (b.longitude - a.longitude),
  };
}

/**
 * Calculate all currently active trains for a given direction + route type.
 *
 * Algorithm:
 * 1. Get the origin station and its schedule.
 * 2. Enumerate all departure times from origin.
 * 3. For each departure, project the train's position using travel offsets.
 * 4. If the current time falls between two station offsets, the train is active.
 * 5. Calculate fractional progress between those two stations.
 */
export function getActiveTrains(
  direction: Direction,
  routeType: TrainRouteType,
  now: Date,
): ActiveTrain[] {
  const routeData = getTravelOffsets(direction, routeType);
  const { offsets, originStationId } = routeData;

  if (offsets.length < 2 || !originStationId) return [];

  // Get origin schedule
  const origin = stationById.get(originStationId);
  if (!origin) return [];

  const schedKey = getScheduleKey(direction, routeType);
  const schedule = origin.schedule[schedKey] as StationSchedule | null | undefined;
  if (!schedule) return [];

  // Current time in minutes
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const nowSeconds = now.getSeconds();
  let adjustedNowMinutes = nowMinutes;

  // Handle post-midnight (before 05:00)
  const firstMinutes = parseTimeToMinutes(schedule.firstTrain);
  if (nowMinutes < MIDNIGHT_THRESHOLD_MINUTES && firstMinutes > MIDNIGHT_THRESHOLD_MINUTES) {
    adjustedNowMinutes = nowMinutes + MINUTES_IN_DAY;
  }

  const nowTotalSeconds = adjustedNowMinutes * 60 + nowSeconds;

  // Get all departures
  const departures = enumerateDepartures(schedule);

  // Total journey time
  const totalJourneyMinutes = offsets[offsets.length - 1].minutesFromOrigin;

  const activeTrains: ActiveTrain[] = [];

  for (let i = 0; i < departures.length; i++) {
    const departure = departures[i];
    const departureSeconds = departure * 60;

    // Time elapsed since this train departed origin
    const elapsedSeconds = nowTotalSeconds - departureSeconds;

    // Skip if train hasn't departed yet
    if (elapsedSeconds < 0) continue;

    // Skip if train has completed its journey (with 30s buffer for dwell at terminus)
    const journeySeconds = totalJourneyMinutes * 60;
    if (elapsedSeconds > journeySeconds + 30) continue;

    // Find which two stations the train is between
    const elapsedMinutes = elapsedSeconds / 60;

    let segmentStart = 0;
    let segmentEnd = 1;

    for (let j = 0; j < offsets.length - 1; j++) {
      if (
        elapsedMinutes >= offsets[j].minutesFromOrigin &&
        elapsedMinutes < offsets[j + 1].minutesFromOrigin
      ) {
        segmentStart = j;
        segmentEnd = j + 1;
        break;
      }
      // If past the last segment, train is at terminus
      if (j === offsets.length - 2 && elapsedMinutes >= offsets[j + 1].minutesFromOrigin) {
        segmentStart = j;
        segmentEnd = j + 1;
      }
    }

    const startOffset = offsets[segmentStart].minutesFromOrigin;
    const endOffset = offsets[segmentEnd].minutesFromOrigin;
    const segmentDuration = endOffset - startOffset;

    let progress = 0;
    if (segmentDuration > 0) {
      progress = Math.max(0, Math.min(1, (elapsedMinutes - startOffset) / segmentDuration));
    }

    const pos = interpolatePosition(
      offsets[segmentStart].stationId,
      offsets[segmentEnd].stationId,
      progress,
    );

    activeTrains.push({
      trainId: `${routeType}-${direction}-${i}`,
      routeType,
      direction,
      departureTime: minutesToTimeString(departure),
      currentStationIndex: segmentStart,
      nextStationIndex: segmentEnd,
      progress,
      currentStationId: offsets[segmentStart].stationId,
      nextStationId: offsets[segmentEnd].stationId,
      latitude: pos.latitude,
      longitude: pos.longitude,
    });
  }

  return activeTrains;
}

/**
 * Get ALL active trains across all directions and route types.
 */
export function getAllActiveTrains(now: Date): ActiveTrain[] {
  return [
    ...getActiveTrains('toGebze', 'full', now),
    ...getActiveTrains('toGebze', 'short', now),
    ...getActiveTrains('toHalkali', 'full', now),
    ...getActiveTrains('toHalkali', 'short', now),
  ];
}

/**
 * Get active trains for a specific direction (both full + short lines).
 */
export function getActiveTrainsByDirection(
  direction: Direction,
  now: Date,
): ActiveTrain[] {
  return [
    ...getActiveTrains(direction, 'full', now),
    ...getActiveTrains(direction, 'short', now),
  ];
}
