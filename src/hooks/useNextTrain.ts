import { useMemo } from 'react';
import { Station, NextTrainInfo } from '../types';
import { getStationCountdowns } from '../utils/scheduleCalculator';

/**
 * Hook that returns next train info for both directions at a given station.
 * Recalculates every time `now` changes (should be every second from useCurrentTime).
 */
export function useNextTrain(
  station: Station | undefined,
  now: Date
): { toHalkali: NextTrainInfo; toGebze: NextTrainInfo } | null {
  return useMemo(() => {
    if (!station) return null;
    return getStationCountdowns(station, now);
  }, [station, now]);
}
