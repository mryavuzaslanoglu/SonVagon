import { useCallback } from 'react';
import { getNow } from '@/stores';
import { getStationCountdowns, getUpcomingTrains } from '@/utils/scheduleCalculator';
import { StationCard } from '@/components/StationCard';
import { Station } from '@/types';

interface UseStationCardRendererParams {
  navigateToStation: (id: string) => void;
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  minuteKey: number;
}

export function useStationCardRenderer({
  navigateToStation,
  favoriteIds,
  toggleFavorite,
  minuteKey,
}: UseStationCardRendererParams) {
  const renderItem = useCallback(
    ({ item }: { item: Station }) => {
      const now = getNow();
      const countdowns = getStationCountdowns(item, now);
      const upH = getUpcomingTrains(item, 'toHalkali', now, 4);
      const upG = getUpcomingTrains(item, 'toGebze', now, 4);
      return (
        <StationCard
          station={item}
          toHalkali={countdowns.toHalkali}
          toGebze={countdowns.toGebze}
          upcomingHalkali={upH}
          upcomingGebze={upG}
          onPress={() => navigateToStation(item.id)}
          isFavorite={favoriteIds.includes(item.id)}
          onToggleFavorite={toggleFavorite}
        />
      );
    },
    // minuteKey in deps forces re-render every minute
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [minuteKey, navigateToStation, favoriteIds, toggleFavorite]
  );

  return renderItem;
}
