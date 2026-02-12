// ─── Color Palettes ─────────────────────────────────────────

const shared = {
  primary: '#E53935',
  primaryDark: '#C62828',
  accent: '#FF9500',
  success: '#34C759',
  warning: '#FF9F0A',
  danger: '#FF3B30',
  white: '#FFFFFF',
  black: '#000000',
  halkaliBadge: '#007AFF',
  gebzeBadge: '#FF9500',
  avrupaBadge: '#AF52DE',
  asyaBadge: '#34C759',
  fullRoute: '#34C759',
  shortRoute: '#AF52DE',
  favoriteGold: '#FF9F0A',
  marmaray: '#E53935',
  tabActive: '#E53935',
};

export const LightColors = {
  ...shared,
  background: '#F2F2F7',
  surface: '#FFFFFF',
  surfaceSecondary: '#F9F9FB',
  surfaceElevated: '#FFFFFF',
  border: '#E5E5EA',
  borderLight: '#F2F2F7',
  primaryLight: '#FFF0F0',
  text: '#1C1C1E',
  textSecondary: '#636366',
  textMuted: '#AEAEB2',
  halkaliBadgeLight: '#EBF5FF',
  gebzeBadgeLight: '#FFF8EB',
  avrupaBadgeLight: '#F5EDFB',
  asyaBadgeLight: '#EDFBF0',
  fullRouteLight: '#EDFBF0',
  shortRouteLight: '#F5EDFB',
  favoriteGoldLight: '#FFF8EB',
  marmarayLight: '#FFF0F0',
  tabBarBg: '#FFFFFF',
  tabBarBorder: '#E5E5EA',
  tabInactive: '#8E8E93',
  cardShadowOpacity: 0.06,
};

export const DarkColors = {
  ...shared,
  background: '#0D1117',
  surface: '#161B22',
  surfaceSecondary: '#1C2333',
  surfaceElevated: '#1F2937',
  border: '#30363D',
  borderLight: '#21262D',
  primaryLight: '#3D1515',
  text: '#E6EDF3',
  textSecondary: '#8B949E',
  textMuted: '#484F58',
  halkaliBadgeLight: '#0D2240',
  gebzeBadgeLight: '#2D1D06',
  avrupaBadgeLight: '#1F0D33',
  asyaBadgeLight: '#0D2212',
  fullRouteLight: '#0D2212',
  shortRouteLight: '#1F0D33',
  favoriteGoldLight: '#2D1D06',
  marmarayLight: '#3D1515',
  tabBarBg: '#161B22',
  tabBarBorder: '#30363D',
  tabInactive: '#484F58',
  cardShadowOpacity: 0.3,
};

export type ThemeColors = typeof LightColors;

// Static fallback (light) - used where context is not available
export const Colors = LightColors;

// ─── Non-color design tokens ────────────────────────────────

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  colored: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  }),
};

// ─── Map Styles ─────────────────────────────────────────────

export const MapLightStyle = [
  { featureType: 'transit.line', elementType: 'geometry.fill', stylers: [{ color: '#E53935' }] },
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#D6EAF8' }] },
];

export const MapDarkStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
  { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#4b6878' }] },
  { featureType: 'land', elementType: 'geometry', stylers: [{ color: '#0d1117' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#283d6a' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#6f9ba5' }] },
  { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#023e58' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#98a5be' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2c6675' }] },
  { featureType: 'transit', elementType: 'labels.text.fill', stylers: [{ color: '#98a5be' }] },
  { featureType: 'transit.line', elementType: 'geometry.fill', stylers: [{ color: '#E53935' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4e6d70' }] },
];
