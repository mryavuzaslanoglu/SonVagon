import { useMemo } from 'react';
import {
  useMinuteKey,
  useDirection,
  useSetDirection,
  useBufferMinutes,
  useSetBufferMinutes,
} from '@/stores';
import { useUserLocation } from './useUserLocation';
import { useNearbyStations } from './useNearbyStations';
import { useWalkingDirections } from './useWalkingDirections';
import { computeDeparturePlans } from '../utils/departurePlanCalculator';
import { StationDeparturePlan } from '@/types';

export function useDeparturePlanner() {
  const minuteKey = useMinuteKey();
  const { latitude, longitude, loading: locationLoading, error: locationError, refresh } = useUserLocation();
  const nearbyStations = useNearbyStations(latitude, longitude, 3);
  const { stationInfos, loading: walkingLoading } = useWalkingDirections(latitude, longitude, nearbyStations);

  const direction = useDirection();
  const setDirection = useSetDirection();
  const bufferMinutes = useBufferMinutes();
  const setBufferMinutes = useSetBufferMinutes();

  const isFarAway = useMemo(() => {
    if (nearbyStations.length === 0) return false;
    return nearbyStations[0].distanceMeters > 10000;
  }, [nearbyStations]);

  const plans: StationDeparturePlan[] = useMemo(() => {
    if (stationInfos.length === 0) return [];
    return computeDeparturePlans(stationInfos, direction, bufferMinutes, new Date());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stationInfos, direction, bufferMinutes, minuteKey]);

  return {
    plans,
    direction,
    setDirection,
    bufferMinutes,
    setBufferMinutes,
    loading: locationLoading || walkingLoading,
    locationLoading,
    walkingLoading,
    error: locationError,
    refresh,
    isFarAway,
  };
}
