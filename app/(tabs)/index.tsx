import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, SectionList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Spacing } from '../../src/constants/theme';
import { useColors } from '../../src/contexts/ThemeContext';
import { stations } from '../../src/data/stations';
import { useCurrentTime } from '../../src/hooks/useCurrentTime';
import { getStationCountdowns, getUpcomingTrains } from '../../src/utils/scheduleCalculator';
import { StationCard } from '../../src/components/StationCard';
import { SearchBar } from '../../src/components/SearchBar';
import { useFavoritesContext } from '../../src/contexts/FavoritesContext';
import { StationSection, Station } from '../../src/types';

export default function StationsScreen() {
  const colors = useColors();
  const router = useRouter();
  const now = useCurrentTime();
  const [searchQuery, setSearchQuery] = useState('');
  const { toggleFavorite, isFavorite } = useFavoritesContext();

  const sections = useMemo((): StationSection[] => {
    const filtered = searchQuery
      ? stations.filter((s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.district.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : stations;

    const avrupa = filtered.filter((s) => s.side === 'avrupa');
    const asya = filtered.filter((s) => s.side === 'asya');

    const result: StationSection[] = [];
    if (avrupa.length > 0) result.push({ title: 'Avrupa Yakasi', data: avrupa, type: 'avrupa' });
    if (asya.length > 0) result.push({ title: 'Anadolu Yakasi', data: asya, type: 'asya' });
    return result;
  }, [searchQuery]);

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

  const renderSectionHeader = useCallback(
    ({ section }: { section: StationSection }) => {
      const isAvrupa = section.type === 'avrupa';
      const dotColor = isAvrupa ? colors.avrupaBadge : colors.asyaBadge;
      const bgColor = isAvrupa ? colors.avrupaBadgeLight : colors.asyaBadgeLight;

      return (
        <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
          <View style={[styles.sectionIcon, { backgroundColor: bgColor }]}>
            <Ionicons name="globe-outline" size={14} color={dotColor} />
          </View>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
          <View style={[styles.sectionLine, { backgroundColor: dotColor + '20' }]} />
          <Text style={[styles.sectionCount, { color: dotColor }]}>
            {section.data.length}
          </Text>
        </View>
      );
    },
    [colors]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={true}
        initialNumToRender={10}
        maxToRenderPerBatch={8}
        windowSize={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingBottom: Spacing.xxxl },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.sm,
  },
  sectionIcon: {
    width: 24, height: 24, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  sectionTitle: { fontSize: 14, fontWeight: '700' },
  sectionLine: { flex: 1, height: 1 },
  sectionCount: { fontSize: 13, fontWeight: '700' },
});
