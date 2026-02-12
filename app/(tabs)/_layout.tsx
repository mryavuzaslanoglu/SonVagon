import { Tabs } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native-unistyles";
import { useIsDark, useToggleTheme } from "@/stores";

export default function TabLayout() {
  const isDark = useIsDark();
  const toggleTheme = useToggleTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: styles.tabActive.color,
        tabBarInactiveTintColor: styles.tabInactive.color,
        tabBarStyle: {
          ...styles.tabBar,
          borderTopWidth: 0.5,
          paddingBottom: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        headerStyle: {
          backgroundColor: styles.header.backgroundColor,
        },
        headerShadowVisible: false,
        headerTintColor: styles.header.color,
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 18,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "İstasyonlar",
          headerTitle: "SonVagon",
          headerTitleStyle: {
            fontWeight: "800",
            fontSize: 22,
            color: styles.brandTitle.color,
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={toggleTheme}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ marginRight: 16 }}
              accessibilityRole="button"
              accessibilityLabel={
                isDark ? "Açık temaya geç" : "Koyu temaya geç"
              }
            >
              <Ionicons
                name={isDark ? "sunny" : "moon"}
                size={22}
                color={styles.themeIcon.color}
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
          title: "Favoriler",
          headerTitle: "Favorilerim",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Harita",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create((theme) => ({
  tabBar: {
    backgroundColor: theme.colors.tabBarBg,
    borderColor: theme.colors.tabBarBorder,
    ...theme.shadows.sm,
  },
  tabActive: {
    color: theme.colors.tabActive,
  },
  tabInactive: {
    color: theme.colors.tabInactive,
  },
  header: {
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
  },
  brandTitle: {
    color: theme.colors.primary,
  },
  themeIcon: {
    color: theme.colors.textSecondary,
  },
}));
