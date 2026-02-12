import {
  Direction,
  NearbyStationInfo,
  CatchableTrain,
  StationDeparturePlan,
  BufferTime,
} from '@/types';
import { getUpcomingTrains } from '@/utils/scheduleCalculator';
import { minutesToTimeString, parseTimeToMinutes } from '@/utils/timeUtils';

const MAX_TRAINS_PER_STATION = 3;
const UPCOMING_FETCH_COUNT = 6;

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

    for (const train of upcomingTrains) {
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

      if (catchableTrains.length >= MAX_TRAINS_PER_STATION) break;
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
