import React, { useMemo } from "react";
import { View, Text, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native-unistyles";
import { stations } from "@/data/stations";
import { useMinuteKey } from "@/stores";
import { useFavoritesStore, useFavoriteIds } from "@/stores/useFavoritesStore";
import { useStationNavigation } from "@/features/stations/hooks/useStationNavigation";
import { useStationCardRenderer } from "@/hooks/useStationCardRenderer";

function EmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons
          name="star-outline"
          size={48}
          color={styles.emptyStarColor.color}
        />
      </View>
      <Text style={styles.emptyTitle}>Henüz Favori Yok</Text>
      <Text style={styles.emptySubtitle}>
        İstasyonlar sekmesinden yıldıza dokunarak{"\n"}favori istasyonlarınızı
        ekleyin
      </Text>
    </View>
  );
}

export default function FavoritesScreen() {
  const { navigateToStation } = useStationNavigation();
  const minuteKey = useMinuteKey();
  const favoriteIds = useFavoriteIds();
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorite = useFavoritesStore((s) => s.isFavorite);

  const favoriteStations = useMemo(() => {
    return stations.filter((s) => favoriteIds.includes(s.id));
  }, [favoriteIds]);

  const renderItem = useStationCardRenderer({
    navigateToStation,
    isFavorite,
    toggleFavorite,
    minuteKey,
  });

  if (favoriteStations.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <View style={styles.headerBadge}>
          <Ionicons
            name="star"
            size={16}
            color={styles.headerBadgeText.color}
          />
          <Text style={styles.headerBadgeText}>
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

const styles = StyleSheet.create((theme) => ({
  container: { flex: 1, backgroundColor: theme.colors.background },
  headerBar: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.pill,
    backgroundColor: theme.colors.favoriteGoldLight,
  },
  headerBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.favoriteGold,
  },
  listContent: { paddingBottom: theme.spacing.xxxl },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xxl,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.favoriteGoldLight,
    ...theme.shadows.card,
  },
  emptyStarColor: { color: theme.colors.favoriteGold },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    color: theme.colors.textSecondary,
  },
}));
