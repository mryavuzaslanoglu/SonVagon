import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTimeTick, useIsDark } from '@/stores';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { StyleSheet } from 'react-native-unistyles';

function RootStack() {
  const isDark = useIsDark();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: styles.header.backgroundColor },
          headerTintColor: styles.header.color,
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: styles.header.backgroundColor },
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
  useTimeTick();

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <RootStack />
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: {
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
  },
}));
