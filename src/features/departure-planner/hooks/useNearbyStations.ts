import { useMemo } from 'react';
import { stations } from '@/data/stations';
import { findNearestNStations } from '@/utils/locationUtils';

export function useNearbyStations(
  latitude: number | null,
  longitude: number | null,
  count: number = 3,
) {
  return useMemo(() => {
    if (latitude == null || longitude == null) return [];
    return findNearestNStations(latitude, longitude, stations, count);
  }, [latitude, longitude, count]);
}
