import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@sonvagon_favorites';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(FAVORITES_KEY).then((stored) => {
      if (stored) {
        try {
          const parsed: string[] = JSON.parse(stored);
          setFavoriteIds(new Set(parsed));
        } catch {}
      }
      setIsLoaded(true);
    });
  }, []);

  const persist = useCallback((ids: Set<string>) => {
    AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify([...ids]));
  }, []);

  const toggleFavorite = useCallback((stationId: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(stationId)) {
        next.delete(stationId);
      } else {
        next.add(stationId);
      }
      persist(next);
      return next;
    });
  }, [persist]);

  const isFavorite = useCallback(
    (stationId: string) => favoriteIds.has(stationId),
    [favoriteIds]
  );

  return { favoriteIds, toggleFavorite, isFavorite, isLoaded };
}
