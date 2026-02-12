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
 * Derive travel time offsets from `lastTrain` differences.
 *
 * For toGebze: stations sorted by ascending order (west → east).
 * For toHalkali: stations sorted by descending order (east → west).
 *
 * The origin station's lastTrain is the baseline (offset = 0).
 * Every subsequent station's offset = its lastTrain - origin's lastTrain.
 *
 * Why lastTrain? The last train of the day is a single through-train from
 * terminus to terminus, producing monotonically increasing times — unlike
 * firstTrain which starts from multiple depots.
 */
function computeFullLineOffsets(
  direction: Direction,
): RouteOffsets {
  const key = getScheduleKey(direction, 'full');

  const eligible = stations.filter((s) => {
    const sched = s.schedule[key];
    return sched != null;
  });

  const sorted =
    direction === 'toGebze'
      ? [...eligible].sort((a, b) => a.order - b.order)
      : [...eligible].sort((a, b) => b.order - a.order);

  if (sorted.length === 0) {
    return { direction, routeType: 'full', originStationId: '', offsets: [] };
  }

  const origin = sorted[0];
  const originSchedule = origin.schedule[key]!;
  const originLastMinutes = parseTimeToMinutes(originSchedule.lastTrain);

  const offsets: TravelOffset[] = sorted.map((station) => {
    const sched = station.schedule[key]!;
    let stationLastMinutes = parseTimeToMinutes(sched.lastTrain);

    // Handle midnight crossover
    if (stationLastMinutes < originLastMinutes - 720) {
      stationLastMinutes += MINUTES_IN_DAY;
    }

    return {
      stationId: station.id,
      stationName: station.name,
      order: station.order,
      minutesFromOrigin: stationLastMinutes - originLastMinutes,
    };
  });

  return {
    direction,
    routeType: 'full',
    originStationId: origin.id,
    offsets,
  };
}

/**
 * Derive short line offsets.
 *
 * The shortToHalkali lastTrain values are unreliable because after ~21:00
 * the short line route shortens from Ataköy–Pendik to Zeytinburnu–Pendik.
 * Stations west of Zeytinburnu (Bakırköy, Yenimahalle) then have lastTrain
 * values from an earlier train — producing NEGATIVE offsets.
 *
 * Solution: Always derive inter-station times from shortToGebze lastTrain
 * differences (which are monotonically increasing and consistent).
 * For shortToHalkali, reverse the offsets.
 */
function computeShortLineOffsets(
  direction: Direction,
): RouteOffsets {
  // ── Step 1: compute canonical offsets from shortToGebze ──
  const gebzeKey = 'shortToGebze';
  const gebzeEligible = stations.filter((s) => {
    const sched = s.schedule[gebzeKey as keyof typeof s.schedule];
    return sched != null;
  });
  const gebzeSorted = [...gebzeEligible].sort((a, b) => a.order - b.order);

  if (gebzeSorted.length === 0) {
    return { direction, routeType: 'short', originStationId: '', offsets: [] };
  }

  const gebzeOrigin = gebzeSorted[0]; // Ataköy
  const gebzeOriginSchedule = gebzeOrigin.schedule[gebzeKey as keyof typeof gebzeOrigin.schedule]!;
  const gebzeOriginLast = parseTimeToMinutes((gebzeOriginSchedule as { lastTrain: string }).lastTrain);

  const canonicalOffsets: TravelOffset[] = gebzeSorted.map((station) => {
    const sched = station.schedule[gebzeKey as keyof typeof station.schedule]!;
    let stationLast = parseTimeToMinutes((sched as { lastTrain: string }).lastTrain);

    if (stationLast < gebzeOriginLast - 720) {
      stationLast += MINUTES_IN_DAY;
    }

    return {
      stationId: station.id,
      stationName: station.name,
      order: station.order,
      minutesFromOrigin: stationLast - gebzeOriginLast,
    };
  });

  // ── Step 1b: add Pendik (shortToGebze terminus) using shortToHalkali data ──
  // Pendik has shortToHalkali but NOT shortToGebze, so it's missing from canonical.
  // Derive its offset from the adjacent station (Yunus) using shortToHalkali lastTrain diff.
  const halkaliOnlyTerminus = stations.find((s) => {
    const hasHalkali = s.schedule['shortToHalkali' as keyof typeof s.schedule] != null;
    const hasGebze = s.schedule[gebzeKey as keyof typeof s.schedule] != null;
    return hasHalkali && !hasGebze;
  });

  if (halkaliOnlyTerminus && canonicalOffsets.length > 0) {
    const lastCanonical = canonicalOffsets[canonicalOffsets.length - 1];
    const adjacentStation = stations.find((s) => s.id === lastCanonical.stationId);

    if (adjacentStation) {
      const terminusSched = halkaliOnlyTerminus.schedule['shortToHalkali' as keyof typeof halkaliOnlyTerminus.schedule];
      const adjacentSched = adjacentStation.schedule['shortToHalkali' as keyof typeof adjacentStation.schedule];
      if (terminusSched && adjacentSched) {
        const terminusLast = parseTimeToMinutes((terminusSched as { lastTrain: string }).lastTrain);
        const adjacentLast = parseTimeToMinutes((adjacentSched as { lastTrain: string }).lastTrain);
        // In toHalkali direction, terminus departs first, adjacent is later
        const extraTime = adjacentLast - terminusLast;
        canonicalOffsets.push({
          stationId: halkaliOnlyTerminus.id,
          stationName: halkaliOnlyTerminus.name,
          order: halkaliOnlyTerminus.order,
          minutesFromOrigin: lastCanonical.minutesFromOrigin + extraTime,
        });
      }
    }
  }

  // ── Step 2: return based on requested direction ──
  if (direction === 'toGebze') {
    // shortToGebze: Ataköy → Yunus (ascending order)
    // Exclude Pendik terminus which was added only for toHalkali reversal
    const gebzeEligibleIds = new Set(gebzeSorted.map((s) => s.id));
    const gebzeOffsets = canonicalOffsets.filter((o) => gebzeEligibleIds.has(o.stationId));
    return {
      direction,
      routeType: 'short',
      originStationId: gebzeOrigin.id,
      offsets: gebzeOffsets,
    };
  }

  // shortToHalkali: Pendik → (towards Ataköy)
  // Reverse the canonical offsets so the route goes east → west
  const totalTime = canonicalOffsets[canonicalOffsets.length - 1].minutesFromOrigin;
  const reversedOffsets = [...canonicalOffsets].reverse().map((o) => ({
    ...o,
    minutesFromOrigin: totalTime - o.minutesFromOrigin,
  }));

  // Filter to only stations that have a shortToHalkali schedule.
  // This matters because Ataköy has shortToHalkali=null (it's the terminus),
  // so trains tracked in the toHalkali direction shouldn't include Ataköy.
  const halkaliEligibleIds = new Set(
    stations
      .filter((s) => {
        const sched = s.schedule['shortToHalkali' as keyof typeof s.schedule];
        return sched != null;
      })
      .map((s) => s.id),
  );
  const filteredOffsets = reversedOffsets.filter((o) => halkaliEligibleIds.has(o.stationId));

  if (filteredOffsets.length === 0) {
    return { direction, routeType: 'short', originStationId: '', offsets: [] };
  }

  // Normalize: first station = offset 0
  const baseOffset = filteredOffsets[0].minutesFromOrigin;
  const normalizedOffsets = filteredOffsets.map((o) => ({
    ...o,
    minutesFromOrigin: o.minutesFromOrigin - baseOffset,
  }));

  return {
    direction,
    routeType: 'short',
    originStationId: filteredOffsets[0].stationId,
    offsets: normalizedOffsets,
  };
}

function computeOffsets(
  direction: Direction,
  routeType: TrainRouteType,
): RouteOffsets {
  if (routeType === 'short') {
    return computeShortLineOffsets(direction);
  }
  return computeFullLineOffsets(direction);
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
