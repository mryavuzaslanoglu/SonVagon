import { Station, Direction, NextTrainInfo, StationSchedule, TrainRouteType, UpcomingTrain } from '../types';
import { parseTimeToMinutes, minutesToTimeString } from './timeUtils';
import { SCHEDULE_CONFIG } from '../data/scheduleConfig';

// ─── Helpers ──────────────────────────────────────────────────

function getDestination(direction: Direction, routeType: TrainRouteType): string {
  const d = SCHEDULE_CONFIG.destinations;
  if (direction === 'toHalkali') {
    return routeType === 'full' ? d.fullToHalkali : d.shortToHalkali;
  }
  return routeType === 'full' ? d.fullToGebze : d.shortToGebze;
}

function terminusInfo(direction: Direction): NextTrainInfo {
  return {
    direction,
    directionLabel: direction === 'toHalkali' ? 'Halkalı' : 'Gebze',
    remainingMs: 0,
    remainingMinutes: 0,
    remainingSeconds: 0,
    nextTrainTime: '',
    isServiceOver: true,
    isBeforeService: false,
    firstTrain: '',
    lastTrain: '',
    routeType: 'full',
    destination: '',
  };
}

// ─── Single schedule calculation ──────────────────────────────

function calcNextFromSchedule(
  schedule: StationSchedule,
  now: Date,
  direction: Direction,
  routeType: TrainRouteType,
): NextTrainInfo {
  const { firstTrain, lastTrain, intervalMinutes } = schedule;
  const destination = getDestination(direction, routeType);
  const directionLabel = direction === 'toHalkali' ? 'Halkalı' : 'Gebze';

  const firstMinutes = parseTimeToMinutes(firstTrain);
  let lastMinutes = parseTimeToMinutes(lastTrain);
  if (lastMinutes < firstMinutes) lastMinutes += 1440;

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const nowSeconds = now.getSeconds();

  let adjustedNow = nowMinutes;
  if (nowMinutes < 300 && firstMinutes > 300) {
    adjustedNow = nowMinutes + 1440;
  }

  // Before service
  if (adjustedNow < firstMinutes) {
    const diffMs = ((firstMinutes - adjustedNow) * 60 - nowSeconds) * 1000;
    return {
      direction, directionLabel,
      remainingMs: diffMs,
      remainingMinutes: Math.floor(diffMs / 60000),
      remainingSeconds: Math.ceil((diffMs % 60000) / 1000),
      nextTrainTime: firstTrain,
      isServiceOver: false, isBeforeService: true,
      firstTrain, lastTrain, routeType, destination,
    };
  }

  // After service
  if (adjustedNow > lastMinutes) {
    return {
      direction, directionLabel,
      remainingMs: 0, remainingMinutes: 0, remainingSeconds: 0,
      nextTrainTime: '',
      isServiceOver: true, isBeforeService: false,
      firstTrain, lastTrain, routeType, destination,
    };
  }

  // During service
  const elapsedSeconds = (adjustedNow - firstMinutes) * 60 + nowSeconds;
  const intervalSeconds = intervalMinutes * 60;
  const remainder = elapsedSeconds % intervalSeconds;
  const secondsToNext = remainder === 0 ? intervalSeconds : intervalSeconds - remainder;

  const trainIndex = Math.ceil(elapsedSeconds / intervalSeconds);
  const nextTrainMinutes = firstMinutes + trainIndex * intervalMinutes;

  if (nextTrainMinutes > lastMinutes) {
    return {
      direction, directionLabel,
      remainingMs: 0, remainingMinutes: 0, remainingSeconds: 0,
      nextTrainTime: '',
      isServiceOver: true, isBeforeService: false,
      firstTrain, lastTrain, routeType, destination,
    };
  }

  const remainingMs = secondsToNext * 1000;
  return {
    direction, directionLabel,
    remainingMs,
    remainingMinutes: Math.floor(secondsToNext / 60),
    remainingSeconds: secondsToNext % 60,
    nextTrainTime: minutesToTimeString(nextTrainMinutes),
    isServiceOver: false, isBeforeService: false,
    firstTrain, lastTrain, routeType, destination,
  };
}

// ─── Pick best next train from full + short ───────────────────

function pickBestNext(a: NextTrainInfo | null, b: NextTrainInfo | null): NextTrainInfo {
  if (!a && !b) return terminusInfo('toHalkali');
  if (!a) return b!;
  if (!b) return a;

  // Both service over
  if (a.isServiceOver && b.isServiceOver) return a;
  if (a.isServiceOver) return b;
  if (b.isServiceOver) return a;

  // Both before service → pick whichever starts first
  if (a.isBeforeService && b.isBeforeService) {
    return a.remainingMs <= b.remainingMs ? a : b;
  }
  if (a.isBeforeService) return b;
  if (b.isBeforeService) return a;

  // Both running → pick soonest
  return a.remainingMs <= b.remainingMs ? a : b;
}

// ─── Public API ───────────────────────────────────────────────

export function calculateNextTrain(
  station: Station,
  direction: Direction,
  now: Date,
): NextTrainInfo {
  const fullSchedule = station.schedule[direction];
  const shortKey = direction === 'toHalkali' ? 'shortToHalkali' : 'shortToGebze';
  const shortSchedule = station.schedule[shortKey as keyof typeof station.schedule] as StationSchedule | null | undefined;

  const fullNext = fullSchedule
    ? calcNextFromSchedule(fullSchedule, now, direction, 'full')
    : null;
  const shortNext = shortSchedule
    ? calcNextFromSchedule(shortSchedule, now, direction, 'short')
    : null;

  const best = pickBestNext(fullNext, shortNext);
  // Fix direction label in case terminusInfo was used
  best.direction = direction;
  best.directionLabel = direction === 'toHalkali' ? 'Halkalı' : 'Gebze';
  return best;
}

/**
 * Get upcoming trains from a single schedule.
 */
function getTrainsFromSchedule(
  schedule: StationSchedule,
  now: Date,
  count: number,
  direction: Direction,
  routeType: TrainRouteType,
): UpcomingTrain[] {
  const { firstTrain, lastTrain, intervalMinutes } = schedule;
  const destination = getDestination(direction, routeType);

  const firstMinutes = parseTimeToMinutes(firstTrain);
  let lastMinutes = parseTimeToMinutes(lastTrain);
  if (lastMinutes < firstMinutes) lastMinutes += 1440;

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const nowSeconds = now.getSeconds();

  let adjustedNow = nowMinutes;
  if (nowMinutes < 300 && firstMinutes > 300) {
    adjustedNow = nowMinutes + 1440;
  }

  // Before service → show from first train
  if (adjustedNow < firstMinutes) {
    const result: UpcomingTrain[] = [];
    for (let i = 0; i < count; i++) {
      const trainMin = firstMinutes + i * intervalMinutes;
      if (trainMin > lastMinutes) break;
      result.push({
        time: minutesToTimeString(trainMin),
        minutesFromNow: Math.max(0, trainMin - adjustedNow),
        routeType,
        destination,
      });
    }
    return result;
  }

  // After service
  if (adjustedNow > lastMinutes) return [];

  // During service
  const elapsedSeconds = (adjustedNow - firstMinutes) * 60 + nowSeconds;
  const intervalSeconds = intervalMinutes * 60;
  const startIndex = Math.ceil(elapsedSeconds / intervalSeconds);

  const result: UpcomingTrain[] = [];
  for (let i = 0; i < count; i++) {
    const idx = startIndex + i;
    const trainMin = firstMinutes + idx * intervalMinutes;
    if (trainMin > lastMinutes) break;
    result.push({
      time: minutesToTimeString(trainMin),
      minutesFromNow: Math.max(0, Math.ceil(trainMin - adjustedNow)),
      routeType,
      destination,
    });
  }
  return result;
}

/**
 * Get upcoming N trains for a station + direction.
 * Merges full line and short line trains, sorted by time.
 */
export function getUpcomingTrains(
  station: Station,
  direction: Direction,
  now: Date,
  count: number = 4,
): UpcomingTrain[] {
  const fullSchedule = station.schedule[direction];
  const shortKey = direction === 'toHalkali' ? 'shortToHalkali' : 'shortToGebze';
  const shortSchedule = station.schedule[shortKey as keyof typeof station.schedule] as StationSchedule | null | undefined;

  const fullTrains = fullSchedule
    ? getTrainsFromSchedule(fullSchedule, now, count * 2, direction, 'full')
    : [];
  const shortTrains = shortSchedule
    ? getTrainsFromSchedule(shortSchedule, now, count * 2, direction, 'short')
    : [];

  // Merge and sort by minutesFromNow
  const merged = [...fullTrains, ...shortTrains]
    .sort((a, b) => a.minutesFromNow - b.minutesFromNow);

  return merged.slice(0, count);
}

export function getStationCountdowns(
  station: Station,
  now: Date,
): { toHalkali: NextTrainInfo; toGebze: NextTrainInfo } {
  return {
    toHalkali: calculateNextTrain(station, 'toHalkali', now),
    toGebze: calculateNextTrain(station, 'toGebze', now),
  };
}
