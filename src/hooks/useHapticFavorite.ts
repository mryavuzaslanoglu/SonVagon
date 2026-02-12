import { useCallback } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export function useHapticFavorite(
  stationId: string,
  toggleFavorite: (id: string) => void,
) {
  return useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    toggleFavorite(stationId);
  }, [stationId, toggleFavorite]);
}
