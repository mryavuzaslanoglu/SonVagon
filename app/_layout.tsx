import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FavoritesProvider } from '../src/contexts/FavoritesContext';
import { ThemeProvider, useColors, useIsDark } from '../src/contexts/ThemeContext';

function RootStack() {
  const colors = useColors();
  const isDark = useIsDark();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="station/[id]"
          options={{
            headerTitle: 'İstasyon Detay',
            headerBackTitle: 'Geri',
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <RootStack />
      </FavoritesProvider>
    </ThemeProvider>
  );
}
