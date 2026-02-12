import React, { useMemo, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius, Shadows } from '../../src/constants/theme';
import { useColors } from '../../src/contexts/ThemeContext';
import { stations } from '../../src/data/stations';
import { useCurrentTime } from '../../src/hooks/useCurrentTime';
import { getStationCountdowns, getUpcomingTrains } from '../../src/utils/scheduleCalculator';
import { StationCard } from '../../src/components/StationCard';
import { useFavoritesContext } from '../../src/contexts/FavoritesContext';
import { Station } from '../../src/types';

function EmptyState() {
  const colors = useColors();
  return (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconCircle, { backgroundColor: colors.favoriteGoldLight }, Shadows.card]}>
        <Ionicons name="star-outline" size={48} color={colors.favoriteGold} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>Henuz Favori Yok</Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Istasyonlar sekmesinden yildiza dokunarak{'\n'}favori istasyonlarinizi ekleyin
      </Text>
    </View>
  );
}

export default function FavoritesScreen() {
  const colors = useColors();
  const router = useRouter();
  const now = useCurrentTime();
  const { favoriteIds, toggleFavorite, isFavorite } = useFavoritesContext();

  const favoriteStations = useMemo(() => {
    return stations.filter((s) => favoriteIds.has(s.id));
  }, [favoriteIds]);

  const handleStationPress = useCallback(
    (stationId: string) => {
      router.push({ pathname: '/station/[id]', params: { id: stationId } });
    },
    [router]
  );

  const renderItem = useCallback(
    ({ item }: { item: Station }) => {
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
          onPress={() => handleStationPress(item.id)}
          isFavorite={isFavorite(item.id)}
          onToggleFavorite={toggleFavorite}
        />
      );
    },
    [now, handleStationPress, isFavorite, toggleFavorite]
  );

  if (favoriteStations.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerBar}>
        <View style={[styles.headerBadge, { backgroundColor: colors.favoriteGoldLight }]}>
          <Ionicons name="star" size={16} color={colors.favoriteGold} />
          <Text style={[styles.headerBadgeText, { color: colors.favoriteGold }]}>
            {favoriteStations.length} favori
          </Text>
        </View>
      </View>
      <FlatList
        data={favoriteStations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
  headerBadge: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    gap: 6, paddingHorizontal: Spacing.md, paddingVertical: 6,
    borderRadius: BorderRadius.pill,
  },
  headerBadgeText: { fontSize: 13, fontWeight: '700' },
  listContent: { paddingBottom: Spacing.xxxl },
  emptyContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  emptyIconCircle: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl,
  },
  emptyTitle: { fontSize: 22, fontWeight: '700', marginBottom: Spacing.sm },
  emptySubtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
});
