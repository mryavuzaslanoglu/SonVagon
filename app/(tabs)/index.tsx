import React, { useState, useMemo, useCallback } from "react";
import { View, Text, SectionList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native-unistyles";
import { stations } from "@/data/stations";
import { useMinuteKey } from "@/stores";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import { useStationNavigation } from "@/features/stations/hooks/useStationNavigation";
import { useStationCardRenderer } from "@/hooks/useStationCardRenderer";
import { SearchBar } from "@/components/SearchBar";
import { StationSection } from "@/types";

export default function StationsScreen() {
  const { navigateToStation } = useStationNavigation();
  const minuteKey = useMinuteKey();
  const [searchQuery, setSearchQuery] = useState("");
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorite = useFavoritesStore((s) => s.isFavorite);

  const sections = useMemo((): StationSection[] => {
    const filtered = searchQuery
      ? stations.filter(
          (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.district.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : stations;

    const avrupa = filtered.filter((s) => s.side === "avrupa");
    const asya = filtered.filter((s) => s.side === "asya");

    const result: StationSection[] = [];
    if (avrupa.length > 0)
      result.push({ title: "Avrupa Yakası", data: avrupa, type: "avrupa" });
    if (asya.length > 0)
      result.push({ title: "Anadolu Yakası", data: asya, type: "asya" });
    return result;
  }, [searchQuery]);

  const renderItem = useStationCardRenderer({
    navigateToStation,
    isFavorite,
    toggleFavorite,
    minuteKey,
  });

  const renderSectionHeader = useCallback(
    ({ section }: { section: StationSection }) => {
      const isAvrupa = section.type === "avrupa";
      return (
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon(isAvrupa)}>
            <Ionicons
              name="globe-outline"
              size={14}
              color={
                isAvrupa ? styles.avrupaColor.color : styles.asyaColor.color
              }
            />
          </View>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionLine(isAvrupa)} />
          <Text style={styles.sectionCount(isAvrupa)}>
            {section.data.length}
          </Text>
        </View>
      );
    },
    [],
  );

  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create((theme) => ({
  container: { flex: 1, backgroundColor: theme.colors.background },
  listContent: { paddingBottom: theme.spacing.xxxl },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm + 2,
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  sectionIcon: (isAvrupa: boolean) => ({
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: isAvrupa
      ? theme.colors.avrupaBadgeLight
      : theme.colors.asyaBadgeLight,
  }),
  sectionTitle: { fontSize: 14, fontWeight: "700", color: theme.colors.text },
  sectionLine: (isAvrupa: boolean) => ({
    flex: 1,
    height: 1,
    backgroundColor:
      (isAvrupa ? theme.colors.avrupaBadge : theme.colors.asyaBadge) + "20",
  }),
  sectionCount: (isAvrupa: boolean) => ({
    fontSize: 13,
    fontWeight: "700" as const,
    color: isAvrupa ? theme.colors.avrupaBadge : theme.colors.asyaBadge,
  }),
  avrupaColor: { color: theme.colors.avrupaBadge },
  asyaColor: { color: theme.colors.asyaBadge },
}));
