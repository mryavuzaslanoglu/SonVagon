import { Tabs } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Shadows } from '../../src/constants/theme';
import { useColors, useIsDark, useToggleTheme } from '../../src/contexts/ThemeContext';

export default function TabLayout() {
  const colors = useColors();
  const isDark = useIsDark();
  const toggleTheme = useToggleTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBarBg,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 0.5,
          paddingBottom: 4,
          ...Shadows.sm,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerShadowVisible: false,
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'İstasyonlar',
          headerTitle: 'SonVagon',
          headerTitleStyle: {
            fontWeight: '800',
            fontSize: 22,
            color: colors.primary,
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={toggleTheme}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ marginRight: 16 }}
            >
              <Ionicons
                name={isDark ? 'sunny' : 'moon'}
                size={22}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="train-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoriler',
          headerTitle: 'Favorilerim',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Harita',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
