import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';

export type LocationError = 'permission_denied' | 'services_disabled' | 'location_failed';

interface UserLocationResult {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: LocationError | null;
  refresh: () => void;
}

const CACHED_MAX_AGE_MS = 60_000;
const CACHED_REQUIRED_ACCURACY = 200;

export function useUserLocation(): UserLocationResult {
  const [state, setState] = useState<Omit<UserLocationResult, 'refresh'>>({
    latitude: null,
    longitude: null,
    loading: true,
    error: null,
  });
  const [trigger, setTrigger] = useState(0);

  const refresh = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    setTrigger((t) => t + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function locate() {
      try {
        // 1. Check if device location services are enabled
        const servicesEnabled = await Location.hasServicesEnabledAsync();
        if (!servicesEnabled) {
          if (!cancelled) {
            setState({
              latitude: null,
              longitude: null,
              loading: false,
              error: 'services_disabled',
            });
          }
          return;
        }

        // 2. Request foreground permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (!cancelled) {
            setState({
              latitude: null,
              longitude: null,
              loading: false,
              error: 'permission_denied',
            });
          }
          return;
        }

        // 3. Try cached location first for faster UX
        let location = await Location.getLastKnownPositionAsync({
          maxAge: CACHED_MAX_AGE_MS,
          requiredAccuracy: CACHED_REQUIRED_ACCURACY,
        });

        // 4. Fall back to fresh GPS fix
        if (!location) {
          location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
        }

        if (!cancelled) {
          setState({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            loading: false,
            error: null,
          });
        }
      } catch {
        if (!cancelled) {
          setState({
            latitude: null,
            longitude: null,
            loading: false,
            error: 'location_failed',
          });
        }
      }
    }

    locate();
    return () => {
      cancelled = true;
    };
  }, [trigger]);

  return { ...state, refresh };
}
