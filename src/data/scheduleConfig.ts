export const SCHEDULE_CONFIG = {
  normalIntervalMinutes: 10,
  fastIntervalMinutes: 8,
  // Stations with 8-minute intervals (Halkalı - Ataköy section)
  fastIntervalStationIds: [
    'halkali', 'mustafa-kemal', 'kucukcekmece', 'florya-akvaryum',
    'florya', 'yesilkoy', 'yesilyurt', 'atakoy',
  ],
  // Map region for initial view
  mapRegion: {
    latitude: 40.9800,
    longitude: 29.0500,
    latitudeDelta: 0.35,
    longitudeDelta: 0.55,
  },
  // Marmaray line color
  lineColor: '#E53935',
  // Destination labels based on route type
  destinations: {
    toGebze: {
      short: 'Ataköy',
      full: 'Gebze',
    },
    toHalkali: {
      full: 'Halkalı',
    },
  },
};
