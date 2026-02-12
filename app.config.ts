import { ExpoConfig, ConfigContext } from 'expo/config';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY ?? '';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'SonVagon',
  slug: 'sonvagon',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: 'sonvagon',
  userInterfaceStyle: 'dark',
  newArchEnabled: true,
  splash: {
    image: './assets/icon.png',
    resizeMode: 'contain',
    backgroundColor: '#0F1318',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.sonvagon.app',
    config: {
      googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#0F1318',
    },
    package: 'com.sonvagon.app',
    config: {
      googleMaps: {
        apiKey: GOOGLE_MAPS_API_KEY,
      },
    },
    permissions: [
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.ACCESS_FINE_LOCATION',
    ],
  },
  experiments: {
    typedRoutes: true,
  },
  plugins: [
    ['expo-router', { root: './app' }],
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          'Konumunuz en yakın istasyonu bulmak için kullanılacaktır.',
      },
    ],
    'expo-font',
    'expo-asset',
  ],
  extra: {
    router: { root: './app' },
    eas: { projectId: '01378a4d-6d8b-4c80-ad07-bf7cd692e673' },
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  },
});
