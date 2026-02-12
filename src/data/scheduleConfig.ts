export const SCHEDULE_CONFIG = {
  // Full line (Halkalı-Gebze) interval
  fullLineInterval: 15,
  // Short line (Ataköy-Pendik) individual interval (combined with full line gives ~7-8 min)
  shortLineInterval: 15,
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
    shortToHalkaliLate: 'Zeytinburnu',
  },
  // After this hour, short line toHalkali trains terminate at Zeytinburnu instead of Ataköy
  shortToHalkaliCutoffHour: 21,
};
