import React, { useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  SectionList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';
import { Station, Direction, TimetableSection } from '@/types';
import { getAllDepartures } from '@/utils/scheduleCalculator';

interface Props {
  visible: boolean;
  onClose: () => void;
  station: Station;
  direction: Direction;
}

export function FullTimetableModal({ visible, onClose, station, direction }: Props) {
  const insets = useSafeAreaInsets();
  const isHalkali = direction === 'toHalkali';

  const sections = useMemo(
    () => getAllDepartures(station, direction),
    [station.id, direction],
  );

  const hasShortLine = useMemo(
    () => sections.some((s) => s.data.some((e) => e.routeType === 'short')),
    [sections],
  );

  const totalCount = useMemo(
    () => sections.reduce((sum, s) => sum + s.data.length, 0),
    [sections],
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.dirBadge(isHalkali)}>
              <Text style={styles.dirBadgeText(isHalkali)}>
                {isHalkali ? '← Halkalı' : 'Gebze →'}
              </Text>
            </View>
            <Text style={styles.headerStation} numberOfLines={1}>
              {station.name}
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} hitSlop={12}>
            <Ionicons name="close" size={24} color={styles.closeIcon.color} />
          </TouchableOpacity>
        </View>

        {/* Legend + count */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={styles.legendDot(true)} />
            <Text style={styles.legendText}>Tam Hat</Text>
          </View>
          {hasShortLine && (
            <View style={styles.legendItem}>
              <View style={styles.legendDot(false)} />
              <Text style={styles.legendText}>Kısa Hat</Text>
            </View>
          )}
          <Text style={styles.totalCount}>{totalCount} sefer</Text>
        </View>

        {/* Timetable */}
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => `${item.time}-${item.routeType}-${index}`}
          stickySectionHeadersEnabled
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionCount}>{section.data.length} sefer</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.rowTime}>{item.time}</Text>
              <View style={styles.rowDot(item.routeType === 'full')} />
              <Text style={styles.rowDest}>{item.destination}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  dirBadge: (isHalkali: boolean) => ({
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.pill,
    backgroundColor: isHalkali
      ? theme.colors.halkaliBadgeLight
      : theme.colors.gebzeBadgeLight,
  }),
  dirBadgeText: (isHalkali: boolean) => ({
    fontSize: 12,
    fontWeight: '700' as const,
    color: isHalkali ? theme.colors.halkaliBadge : theme.colors.gebzeBadge,
  }),
  headerStation: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
    flexShrink: 1,
  },
  closeIcon: { color: theme.colors.textSecondary },

  // Legend
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: (isFull: boolean) => ({
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: isFull ? theme.colors.fullRoute : theme.colors.shortRoute,
  }),
  legendText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  totalCount: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginLeft: 'auto' as const,
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceSecondary,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    fontVariant: ['tabular-nums'] as const,
    color: theme.colors.text,
  },
  sectionCount: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },

  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 10,
    gap: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  rowTime: {
    fontSize: 15,
    fontWeight: '700' as const,
    fontVariant: ['tabular-nums'] as const,
    color: theme.colors.text,
    width: 50,
  },
  rowDot: (isFull: boolean) => ({
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: isFull ? theme.colors.fullRoute : theme.colors.shortRoute,
  }),
  rowDest: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
}));
