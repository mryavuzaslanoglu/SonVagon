import { Direction, TrainRouteType, TravelOffset } from '@/types';
import { stations } from '@/data/stations';
import { parseTimeToMinutes } from '@/utils/timeUtils';
import { getScheduleKey } from '@/utils/scheduleUtils';
import { MINUTES_IN_DAY } from '@/constants/time';

// ─── Types ──────────────────────────────────────────────────

interface RouteOffsets {
  direction: Direction;
  routeType: TrainRouteType;
  originStationId: string;
  offsets: TravelOffset[];
}

// ─── Cached offsets (computed once at import time) ──────────

const offsetCache = new Map<string, RouteOffsets>();

function getCacheKey(direction: Direction, routeType: TrainRouteType): string {
  return `${direction}-${routeType}`;
}

/**
 * Derive travel time offsets from `firstTrain` differences.
 *
 * For toGebze: stations sorted by ascending order (west → east).
 * For toHalkali: stations sorted by descending order (east → west).
 *
 * The origin station's firstTrain is the baseline (offset = 0).
 * Every subsequent station's offset = its firstTrain - origin's firstTrain.
 */
function computeOffsets(
  direction: Direction,
  routeType: TrainRouteType,
): RouteOffsets {
  const key = getScheduleKey(direction, routeType);

  // Filter stations that have a schedule for this direction+routeType
  const eligible = stations.filter((s) => {
    const sched = s.schedule[key];
    return sched != null;
  });

  // Sort: toGebze = ascending order, toHalkali = descending order
  const sorted =
    direction === 'toGebze'
      ? [...eligible].sort((a, b) => a.order - b.order)
      : [...eligible].sort((a, b) => b.order - a.order);

  if (sorted.length === 0) {
    return { direction, routeType, originStationId: '', offsets: [] };
  }

  const origin = sorted[0];
  const originSchedule = origin.schedule[key]!;
  const originFirstMinutes = parseTimeToMinutes(originSchedule.firstTrain);

  const offsets: TravelOffset[] = sorted.map((station) => {
    const sched = station.schedule[key]!;
    let stationFirstMinutes = parseTimeToMinutes(sched.firstTrain);

    // Handle midnight crossover
    if (stationFirstMinutes < originFirstMinutes - 720) {
      stationFirstMinutes += MINUTES_IN_DAY;
    }

    return {
      stationId: station.id,
      stationName: station.name,
      order: station.order,
      minutesFromOrigin: stationFirstMinutes - originFirstMinutes,
    };
  });

  return {
    direction,
    routeType,
    originStationId: origin.id,
    offsets,
  };
}

/**
 * Get cached travel offsets for a direction + route type.
 */
export function getTravelOffsets(
  direction: Direction,
  routeType: TrainRouteType,
): RouteOffsets {
  const cacheKey = getCacheKey(direction, routeType);
  let cached = offsetCache.get(cacheKey);
  if (!cached) {
    cached = computeOffsets(direction, routeType);
    offsetCache.set(cacheKey, cached);
  }
  return cached;
}

/**
 * Get the total travel time (in minutes) from origin to terminus for a route.
 */
export function getTotalTravelTime(
  direction: Direction,
  routeType: TrainRouteType,
): number {
  const { offsets } = getTravelOffsets(direction, routeType);
  if (offsets.length === 0) return 0;
  return offsets[offsets.length - 1].minutesFromOrigin;
}
