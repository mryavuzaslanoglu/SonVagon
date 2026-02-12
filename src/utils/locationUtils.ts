import { Station } from '../types';

/**
 * Haversine formula: calculate distance between two coordinates in meters.
 */
export function getDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Find the nearest station to the given coordinates.
 */
export function findNearestStation(
  latitude: number,
  longitude: number,
  stationsList: Station[]
): { station: Station; distanceMeters: number } | null {
  if (stationsList.length === 0) return null;

  let nearest = stationsList[0];
  let minDist = getDistanceMeters(latitude, longitude, nearest.latitude, nearest.longitude);

  for (let i = 1; i < stationsList.length; i++) {
    const dist = getDistanceMeters(latitude, longitude, stationsList[i].latitude, stationsList[i].longitude);
    if (dist < minDist) {
      minDist = dist;
      nearest = stationsList[i];
    }
  }

  return { station: nearest, distanceMeters: minDist };
}

/**
 * Format distance for display.
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}
