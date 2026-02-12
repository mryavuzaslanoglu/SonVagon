export const SCHEDULE_CONFIG = {
  // Full line (Halkalı-Gebze) interval
  fullLineInterval: 15,
  // Short line (Ataköy-Pendik) interval
  shortLineInterval: 8,
  // Map region for initial view
  mapRegion: {
    latitude: 40.9800,
    longitude: 29.0500,
    latitudeDelta: 0.35,
    longitudeDelta: 0.55,
  },
  // Marmaray line color
  lineColor: '#E53935',
  // Destination labels
  destinations: {
    fullToGebze: 'Gebze',
    fullToHalkali: 'Halkalı',
    shortToGebze: 'Pendik',
    shortToHalkali: 'Ataköy',
  },
};
