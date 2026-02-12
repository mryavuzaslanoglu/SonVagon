import {
  Direction,
  NearbyStationInfo,
  CatchableTrain,
  StationDeparturePlan,
  BufferTime,
} from '@/types';
import { getUpcomingTrains } from '@/utils/scheduleCalculator';
import { minutesToTimeString, parseTimeToMinutes } from '@/utils/timeUtils';

const MAX_TRAINS_PER_DESTINATION = 2;
const UPCOMING_FETCH_COUNT = 8;

/**
 * Compute departure plans for nearby stations.
 * Pure function — no side effects.
 */
export function computeDeparturePlans(
  nearbyStations: NearbyStationInfo[],
  direction: Direction,
  bufferMinutes: BufferTime,
  now: Date,
): StationDeparturePlan[] {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const plans = nearbyStations.map((stationInfo) => {
    const walkingSeconds = stationInfo.walkingDurationSeconds ?? 0;
    const walkingMinutes = Math.ceil(walkingSeconds / 60);

    const upcomingTrains = getUpcomingTrains(
      stationInfo.station,
      direction,
      now,
      UPCOMING_FETCH_COUNT,
    );

    const catchableTrains: CatchableTrain[] = [];
    // Track count per destination (e.g., "Gebze": 2, "Pendik": 2)
    const countByDestination = new Map<string, number>();

    for (const train of upcomingTrains) {
      const dest = train.destination;
      const destCount = countByDestination.get(dest) ?? 0;
      if (destCount >= MAX_TRAINS_PER_DESTINATION) continue;

      const trainMinutes = parseTimeToMinutes(train.time);
      const leaveByMinutes = trainMinutes - walkingMinutes - bufferMinutes;
      const leaveByMinutesFromNow = leaveByMinutes - nowMinutes;

      // Skip trains whose leave-by time has already passed.
      // -1 min tolerance accounts for seconds not tracked in minute-level math.
      if (leaveByMinutesFromNow < -1) continue;

      const arrivalMinutes = trainMinutes - bufferMinutes;

      catchableTrains.push({
        train,
        leaveByTime: minutesToTimeString(leaveByMinutes),
        leaveByMinutesFromNow: Math.max(0, leaveByMinutesFromNow),
        arrivalAtStationTime: minutesToTimeString(arrivalMinutes),
        bufferMinutes,
        isRecommended: false,
      });

      countByDestination.set(dest, destCount + 1);
    }

    return {
      stationInfo,
      catchableTrains,
      hasTrains: catchableTrains.length > 0,
    };
  });

  // Mark the globally best (soonest leaveBy) train as recommended
  let bestPlanIdx = -1;
  let bestTrainIdx = -1;
  let bestLeaveBy = Infinity;

  plans.forEach((plan, pi) => {
    plan.catchableTrains.forEach((ct, ti) => {
      if (ct.leaveByMinutesFromNow < bestLeaveBy) {
        bestLeaveBy = ct.leaveByMinutesFromNow;
        bestPlanIdx = pi;
        bestTrainIdx = ti;
      }
    });
  });

  if (bestPlanIdx >= 0 && bestTrainIdx >= 0) {
    plans[bestPlanIdx].catchableTrains[bestTrainIdx].isRecommended = true;
  }

  return plans;
}
