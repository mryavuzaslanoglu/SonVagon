import React, { createContext, useContext } from 'react';
import { useFavorites } from '../hooks/useFavorites';

interface FavoritesContextType {
  favoriteIds: Set<string>;
  toggleFavorite: (stationId: string) => void;
  isFavorite: (stationId: string) => boolean;
  isLoaded: boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favoriteIds: new Set(),
  toggleFavorite: () => {},
  isFavorite: () => false,
  isLoaded: false,
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const favorites = useFavorites();
  return (
    <FavoritesContext.Provider value={favorites}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  return useContext(FavoritesContext);
}
