import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Station } from '../types';
import { findNearestStation } from '../utils/locationUtils';

interface NearestStationResult {
  station: Station | null;
  distanceMeters: number;
  loading: boolean;
  error: string | null;
}

/**
 * Hook that finds the nearest station to the user's current location.
 */
export function useNearestStation(stationsList: Station[]): NearestStationResult {
  const [result, setResult] = useState<NearestStationResult>({
    station: null,
    distanceMeters: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function locate() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (!cancelled) {
            setResult({
              station: null,
              distanceMeters: 0,
              loading: false,
              error: 'Konum izni verilmedi',
            });
          }
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (cancelled) return;

        const nearest = findNearestStation(
          location.coords.latitude,
          location.coords.longitude,
          stationsList
        );

        if (nearest) {
          setResult({
            station: nearest.station,
            distanceMeters: nearest.distanceMeters,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setResult({
            station: null,
            distanceMeters: 0,
            loading: false,
            error: 'Konum alınamadı',
          });
        }
      }
    }

    locate();

    return () => {
      cancelled = true;
    };
  }, [stationsList]);

  return result;
}
