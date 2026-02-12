import { useState, useEffect, useRef } from 'react';
import { Station, NearbyStationInfo } from '@/types';
import {
  fetchWalkingDirections,
  estimateWalkingSeconds,
  formatWalkingDuration,
} from '../utils/walkingDirectionsApi';

interface NearbyStationInput {
  station: Station;
  distanceMeters: number;
}

interface WalkingResult {
  stationInfos: NearbyStationInfo[];
  loading: boolean;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function useWalkingDirections(
  latitude: number | null,
  longitude: number | null,
  nearbyStations: NearbyStationInput[],
): WalkingResult {
  const [result, setResult] = useState<WalkingResult>({
    stationInfos: [],
    loading: false,
  });

  const cacheRef = useRef<{
    key: string;
    data: NearbyStationInfo[];
    timestamp: number;
  } | null>(null);

  useEffect(() => {
    if (latitude == null || longitude == null || nearbyStations.length === 0) {
      setResult({ stationInfos: [], loading: false });
      return;
    }

    // Build cache key from rounded coordinates + station IDs
    const cacheKey = `${latitude.toFixed(4)},${longitude.toFixed(4)}:${nearbyStations.map((s) => s.station.id).join(',')}`;
    const cached = cacheRef.current;
    if (cached && cached.key === cacheKey && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      setResult({ stationInfos: cached.data, loading: false });
      return;
    }

    let cancelled = false;
    setResult((prev) => ({ ...prev, loading: true }));

    async function fetchAll() {
      const results: NearbyStationInfo[] = await Promise.all(
        nearbyStations.map(async ({ station, distanceMeters }) => {
          const apiResult = await fetchWalkingDirections(
            latitude!,
            longitude!,
            station.latitude,
            station.longitude,
          );

          if (apiResult) {
            return {
              station,
              distanceMeters,
              walkingDurationSeconds: apiResult.durationSeconds,
              walkingDurationText: apiResult.durationText,
            };
          }

          // Haversine fallback
          const fallbackSeconds = estimateWalkingSeconds(distanceMeters);
          return {
            station,
            distanceMeters,
            walkingDurationSeconds: fallbackSeconds,
            walkingDurationText: formatWalkingDuration(fallbackSeconds),
          };
        }),
      );

      if (!cancelled) {
        cacheRef.current = { key: cacheKey, data: results, timestamp: Date.now() };
        setResult({ stationInfos: results, loading: false });
      }
    }

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [latitude, longitude, nearbyStations]);

  return result;
}
