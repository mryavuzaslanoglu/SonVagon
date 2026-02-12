import { Station, Direction, NextTrainInfo, TrainRouteType, UpcomingTrain } from '../types';
import { parseTimeToMinutes, minutesToTimeString } from './timeUtils';
import { SCHEDULE_CONFIG } from '../data/scheduleConfig';

function getRouteInfo(
  station: Station,
  direction: Direction,
  trainIndex: number
): { routeType: TrainRouteType; destination: string } {
  const isFastZone = SCHEDULE_CONFIG.fastIntervalStationIds.includes(station.id);

  if (direction === 'toGebze' && isFastZone) {
    const isShort = trainIndex % 2 !== 0;
    return {
      routeType: isShort ? 'short' : 'full',
      destination: isShort
        ? SCHEDULE_CONFIG.destinations.toGebze.short
        : SCHEDULE_CONFIG.destinations.toGebze.full,
    };
  }

  if (direction === 'toHalkali') {
    return {
      routeType: 'full',
      destination: SCHEDULE_CONFIG.destinations.toHalkali.full,
    };
  }

  return {
    routeType: 'full',
    destination: SCHEDULE_CONFIG.destinations.toGebze.full,
  };
}

export function calculateNextTrain(
  station: Station,
  direction: Direction,
  now: Date
): NextTrainInfo {
  const schedule = station.schedule[direction];
  const directionLabel = direction === 'toHalkali' ? 'Halkalı' : 'Gebze';

  if (!schedule) {
    return {
      direction,
      directionLabel,
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

  const { firstTrain, lastTrain, intervalMinutes } = schedule;
  const firstMinutes = parseTimeToMinutes(firstTrain);
  let lastMinutes = parseTimeToMinutes(lastTrain);

  if (lastMinutes < firstMinutes) {
    lastMinutes += 1440;
  }

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const nowSeconds = now.getSeconds();

  let adjustedNowMinutes = nowMinutes;
  if (nowMinutes < 300 && firstMinutes > 300) {
    adjustedNowMinutes = nowMinutes + 1440;
  }

  if (adjustedNowMinutes < firstMinutes) {
    const diffMinutes = firstMinutes - adjustedNowMinutes;
    const diffMs = (diffMinutes * 60 - nowSeconds) * 1000;
    const { routeType, destination } = getRouteInfo(station, direction, 0);
    return {
      direction,
      directionLabel,
      remainingMs: diffMs,
      remainingMinutes: Math.floor(diffMs / 60000),
      remainingSeconds: Math.ceil((diffMs % 60000) / 1000),
      nextTrainTime: firstTrain,
      isServiceOver: false,
      isBeforeService: true,
      firstTrain,
      lastTrain,
      routeType,
      destination,
    };
  }

  if (adjustedNowMinutes > lastMinutes) {
    return {
      direction,
      directionLabel,
      remainingMs: 0,
      remainingMinutes: 0,
      remainingSeconds: 0,
      nextTrainTime: '',
      isServiceOver: true,
      isBeforeService: false,
      firstTrain,
      lastTrain,
      routeType: 'full',
      destination: '',
    };
  }

  const elapsedSinceFirst = adjustedNowMinutes - firstMinutes;
  const elapsedSeconds = elapsedSinceFirst * 60 + nowSeconds;
  const intervalSeconds = intervalMinutes * 60;

  const remainder = elapsedSeconds % intervalSeconds;
  let secondsToNext: number;

  if (remainder === 0) {
    secondsToNext = intervalSeconds;
  } else {
    secondsToNext = intervalSeconds - remainder;
  }

  const trainIndex = Math.ceil(elapsedSeconds / intervalSeconds);
  const nextTrainMinutes = firstMinutes + trainIndex * intervalMinutes;

  if (nextTrainMinutes > lastMinutes) {
    return {
      direction,
      directionLabel,
      remainingMs: 0,
      remainingMinutes: 0,
      remainingSeconds: 0,
      nextTrainTime: '',
      isServiceOver: true,
      isBeforeService: false,
      firstTrain,
      lastTrain,
      routeType: 'full',
      destination: '',
    };
  }

  const remainingMs = secondsToNext * 1000;
  const { routeType, destination } = getRouteInfo(station, direction, trainIndex);

  return {
    direction,
    directionLabel,
    remainingMs,
    remainingMinutes: Math.floor(secondsToNext / 60),
    remainingSeconds: secondsToNext % 60,
    nextTrainTime: minutesToTimeString(nextTrainMinutes),
    isServiceOver: false,
    isBeforeService: false,
    firstTrain,
    lastTrain,
    routeType,
    destination,
  };
}

/**
 * Get upcoming N trains for a station + direction.
 */
export function getUpcomingTrains(
  station: Station,
  direction: Direction,
  now: Date,
  count: number = 4
): UpcomingTrain[] {
  const schedule = station.schedule[direction];
  if (!schedule) return [];

  const { firstTrain, lastTrain, intervalMinutes } = schedule;
  const firstMinutes = parseTimeToMinutes(firstTrain);
  let lastMinutes = parseTimeToMinutes(lastTrain);
  if (lastMinutes < firstMinutes) lastMinutes += 1440;

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const nowSeconds = now.getSeconds();

  let adjustedNowMinutes = nowMinutes;
  if (nowMinutes < 300 && firstMinutes > 300) {
    adjustedNowMinutes = nowMinutes + 1440;
  }

  // Before service
  if (adjustedNowMinutes < firstMinutes) {
    const result: UpcomingTrain[] = [];
    for (let i = 0; i < count; i++) {
      const trainMinutes = firstMinutes + i * intervalMinutes;
      if (trainMinutes > lastMinutes) break;
      const { routeType, destination } = getRouteInfo(station, direction, i);
      const minsFromNow = trainMinutes - adjustedNowMinutes;
      result.push({
        time: minutesToTimeString(trainMinutes),
        minutesFromNow: Math.max(0, minsFromNow),
        routeType,
        destination,
      });
    }
    return result;
  }

  // After service
  if (adjustedNowMinutes > lastMinutes) return [];

  // During service
  const elapsedSinceFirst = adjustedNowMinutes - firstMinutes;
  const elapsedSeconds = elapsedSinceFirst * 60 + nowSeconds;
  const intervalSeconds = intervalMinutes * 60;
  const startIndex = Math.ceil(elapsedSeconds / intervalSeconds);

  const result: UpcomingTrain[] = [];
  for (let i = 0; i < count; i++) {
    const idx = startIndex + i;
    const trainMinutes = firstMinutes + idx * intervalMinutes;
    if (trainMinutes > lastMinutes) break;
    const { routeType, destination } = getRouteInfo(station, direction, idx);
    const minsFromNow = trainMinutes - adjustedNowMinutes;
    result.push({
      time: minutesToTimeString(trainMinutes),
      minutesFromNow: Math.max(0, Math.ceil(minsFromNow)),
      routeType,
      destination,
    });
  }
  return result;
}

export function getStationCountdowns(
  station: Station,
  now: Date
): { toHalkali: NextTrainInfo; toGebze: NextTrainInfo } {
  return {
    toHalkali: calculateNextTrain(station, 'toHalkali', now),
    toGebze: calculateNextTrain(station, 'toGebze', now),
  };
}
