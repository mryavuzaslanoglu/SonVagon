import Constants from 'expo-constants';

interface WalkingDirectionsResult {
  durationSeconds: number;
  durationText: string;
}

/**
 * Fetch walking duration from Google Maps Directions API.
 * Returns null on failure (caller should use haversine fallback).
 */
export async function fetchWalkingDirections(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number,
): Promise<WalkingDirectionsResult | null> {
  const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey;
  if (!apiKey) return null;

  try {
    const url =
      `https://maps.googleapis.com/maps/api/directions/json` +
      `?origin=${originLat},${originLng}` +
      `&destination=${destLat},${destLng}` +
      `&mode=walking&language=tr&key=${apiKey}`;

    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (data.status !== 'OK' || !data.routes?.length) return null;

    const leg = data.routes[0].legs[0];
    return {
      durationSeconds: leg.duration.value,
      durationText: leg.duration.text,
    };
  } catch {
    return null;
  }
}

/**
 * Haversine-based walking time estimate.
 * Assumes 5 km/h walking speed (1.39 m/s).
 */
export function estimateWalkingSeconds(distanceMeters: number): number {
  return Math.ceil(distanceMeters / 1.39);
}

export function formatWalkingDuration(seconds: number): string {
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} dk`;
}
