import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandMMKVStorage } from '@/shared/utils/storage';

interface FavoritesState {
  favoriteIds: string[];
  toggleFavorite: (stationId: string) => void;
  isFavorite: (stationId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      toggleFavorite: (stationId: string) => {
        const current = get().favoriteIds;
        const exists = current.includes(stationId);
        set({
          favoriteIds: exists
            ? current.filter((id) => id !== stationId)
            : [...current, stationId],
        });
      },
      isFavorite: (stationId: string) => {
        return get().favoriteIds.includes(stationId);
      },
    }),
    {
      name: 'sonvagon-favorites',
      storage: createJSONStorage(() => zustandMMKVStorage),
    },
  ),
);

// Selectors
export const useFavoriteIds = () => useFavoritesStore((s) => s.favoriteIds);
export const useToggleFavorite = () => useFavoritesStore((s) => s.toggleFavorite);
