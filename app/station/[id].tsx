import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';
import { stationMap } from '@/data/stations';
import { useNow } from '@/stores';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { getStationCountdowns, getUpcomingTrains } from '@/utils/scheduleCalculator';
import { TrainProgressBar } from '@/components/TrainProgressBar';
import { LiveRouteView } from '@/features/live-tracking';
import { useHapticFavorite } from '@/hooks/useHapticFavorite';
import { UpcomingTrain, NextTrainInfo, Direction } from '@/types';

function CompactCountdownStrip({
  stationId,
}: {
  stationId: string;
}) {
  const now = useNow();
  const station = stationMap.get(stationId)!;
  const countdowns = getStationCountdowns(station, now);

  const hasHalkali = !!station.schedule.toHalkali;
  const hasGebze = !!station.schedule.toGebze;

  return (
    <View style={styles.stripContainer}>
      {hasHalkali && (
        <CompactDirectionCard
          info={countdowns.toHalkali}
          direction="toHalkali"
          schedule={station.schedule.toHalkali!}
        />
      )}
      {hasGebze && (
        <CompactDirectionCard
          info={countdowns.toGebze}
          direction="toGebze"
          schedule={station.schedule.toGebze!}
        />
      )}
    </View>
  );
}

function CompactDirectionCard({
  info,
  direction,
  schedule,
}: {
  info: NextTrainInfo;
  direction: Direction;
  schedule: { intervalMinutes: number };
}) {
  const isHalkali = direction === 'toHalkali';
  const label = isHalkali ? '← Halkalı' : 'Gebze →';

  return (
    <View style={styles.compactCard(isHalkali)}>
      <View style={styles.compactHeader}>
        <Text style={styles.compactLabel(isHalkali)}>{label}</Text>
        {info.destination ? (
          <View style={styles.compactDestRow}>
            <View style={styles.compactDestDot(info.routeType === 'full')} />
            <Text style={styles.compactDestText}>{info.destination}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.compactCountdown}>
        {info.isServiceOver ? (
          <Text style={styles.compactStatusText}>Bitti</Text>
        ) : info.isBeforeService ? (
          <View style={styles.compactTimeRow}>
            <Text style={styles.compactBeforeLabel}>İlk</Text>
            <Text style={styles.compactTimeValue(isHalkali)}>{info.nextTrainTime}</Text>
          </View>
        ) : (
          <View style={styles.compactTimeRow}>
            <Text
              style={[
                styles.compactMinutes(isHalkali),
                info.remainingMinutes < 2 && styles.urgentText,
              ]}
            >
              {info.remainingMinutes}
            </Text>
            <Text
              style={[
                styles.compactUnit(isHalkali),
                info.remainingMinutes < 2 && styles.urgentText,
              ]}
            >
              dk
            </Text>
          </View>
        )}
      </View>

      {!info.isServiceOver && !info.isBeforeService && (
        <TrainProgressBar
          remainingMs={info.remainingMs}
          intervalMinutes={schedule.intervalMinutes}
          color={isHalkali ? styles.halkaliColor.color : styles.gebzeColor.color}
        />
      )}
    </View>
  );
}

function UpcomingSection({
  stationId,
  direction,
}: {
  stationId: string;
  direction: Direction;
}) {
  const now = useNow();
  const station = stationMap.get(stationId)!;
  const upcoming = getUpcomingTrains(station, direction, now, 5);

  if (upcoming.length <= 1) return null;
  const rest = upcoming.slice(1);
  const isHalkali = direction === 'toHalkali';

  return (
    <View style={styles.upcomingContainer}>
      <Text style={styles.upcomingTitle}>
        Sonraki ({isHalkali ? 'Halkalı' : 'Gebze'})
      </Text>
      <View style={styles.upcomingRow}>
        {rest.map((t, i) => (
          <View key={i} style={styles.upcomingChip}>
            <Text style={styles.upcomingTime}>{t.time}</Text>
            <View style={styles.upcomingMeta}>
              <View style={styles.upcomingDot(t.routeType === 'full')} />
              <Text style={styles.upcomingDest}>{t.destination}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function ScheduleInfo({ stationId }: { stationId: string }) {
  const station = stationMap.get(stationId)!;
  const schedules = [
    { key: 'toHalkali' as const, label: '← Halkalı' },
    { key: 'toGebze' as const, label: 'Gebze →' },
  ].filter((s) => station.schedule[s.key]);

  return (
    <View style={styles.scheduleCard}>
      {schedules.map(({ key, label }) => {
        const sched = station.schedule[key]!;
        return (
          <View key={key} style={styles.scheduleDirection}>
            <Text style={styles.scheduleDirLabel}>{label}</Text>
            <View style={styles.scheduleRow}>
              <View style={styles.scheduleItem}>
                <Ionicons name="sunny-outline" size={14} color={styles.mutedIcon.color} />
                <Text style={styles.scheduleTime}>{sched.firstTrain}</Text>
              </View>
              <View style={styles.scheduleDivider} />
              <View style={styles.scheduleItem}>
                <Ionicons name="moon-outline" size={14} color={styles.mutedIcon.color} />
                <Text style={styles.scheduleTime}>{sched.lastTrain}</Text>
              </View>
              <View style={styles.scheduleDivider} />
              <View style={styles.scheduleItem}>
                <Ionicons name="time-outline" size={14} color={styles.mutedIcon.color} />
                <Text style={styles.scheduleTime}>{sched.intervalMinutes} dk</Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default function StationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const station = stationMap.get(id ?? '');
  const isFav = useFavoritesStore((s) => s.isFavorite);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

  if (!station) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>İstasyon bulunamadı</Text>
      </View>
    );
  }

  const insets = useSafeAreaInsets();
  const favorite = isFav(station.id);
  const handleToggleFavorite = useHapticFavorite(station.id, toggleFavorite);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
    >
      <Stack.Screen
        options={{
          headerTitle: station.name,
          headerStyle: { backgroundColor: styles.container.backgroundColor },
          headerTintColor: styles.headerColor.color,
          headerRight: () => (
            <TouchableOpacity
              onPress={handleToggleFavorite}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={{ marginRight: 8 }}
              accessibilityRole="button"
              accessibilityLabel={favorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
            >
              <Ionicons
                name={favorite ? 'star' : 'star-outline'}
                size={24}
                color={favorite ? styles.favActive.color : styles.favInactive.color}
              />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Station Info — name is already in the navigation header */}
      <View style={styles.stationHeader}>
        <View style={styles.infoRow}>
          <View style={styles.sideBadge(station.side === 'avrupa')}>
            <Text style={styles.sideBadgeText(station.side === 'avrupa')}>
              {station.side === 'avrupa' ? 'Avrupa' : 'Anadolu'}
            </Text>
          </View>
          <Text style={styles.districtText}>{station.district}</Text>
        </View>
      </View>

      {/* Transfers */}
      {station.transfers.length > 0 && (
        <View style={styles.transfersRow}>
          <Ionicons name="git-branch-outline" size={14} color={styles.transferIcon.color} />
          {station.transfers.map((t, i) => (
            <Text key={i} style={styles.transferText}>{t}</Text>
          ))}
        </View>
      )}

      {/* Compact Countdown Strip */}
      <CompactCountdownStrip stationId={station.id} />

      {/* Live Route Views */}
      {station.schedule.toHalkali && (
        <LiveRouteView direction="toHalkali" highlightStationId={station.id} />
      )}
      {station.schedule.toGebze && (
        <LiveRouteView direction="toGebze" highlightStationId={station.id} />
      )}

      {/* Upcoming Trains */}
      {station.schedule.toHalkali && (
        <UpcomingSection stationId={station.id} direction="toHalkali" />
      )}
      {station.schedule.toGebze && (
        <UpcomingSection stationId={station.id} direction="toGebze" />
      )}

      {/* Schedule Info */}
      <ScheduleInfo stationId={station.id} />
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: theme.spacing.xxl,
    color: theme.colors.danger,
  },
  headerColor: {
    color: theme.colors.text,
  },

  // ─── Station Header ────────────────────────────────────────
  stationHeader: {
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  sideBadge: (isAvrupa: boolean) => ({
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.pill,
    backgroundColor: isAvrupa ? theme.colors.avrupaBadgeLight : theme.colors.asyaBadgeLight,
  }),
  sideBadgeText: (isAvrupa: boolean) => ({
    fontSize: 11,
    fontWeight: '600' as const,
    color: isAvrupa ? theme.colors.avrupaBadge : theme.colors.asyaBadge,
  }),
  districtText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },

  // ─── Transfers ─────────────────────────────────────────────
  transfersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    flexWrap: 'wrap',
  },
  transferIcon: {
    color: theme.colors.primary,
  },
  transferText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },

  // ─── Compact Countdown Strip ───────────────────────────────
  stripContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  compactCard: (isHalkali: boolean) => ({
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    backgroundColor: isHalkali
      ? theme.colors.halkaliBadgeLight
      : theme.colors.gebzeBadgeLight,
  }),
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  compactLabel: (isHalkali: boolean) => ({
    fontSize: 12,
    fontWeight: '700' as const,
    color: isHalkali ? theme.colors.halkaliBadge : theme.colors.gebzeBadge,
  }),
  compactDestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  compactDestDot: (isFull: boolean) => ({
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: isFull ? theme.colors.fullRoute : theme.colors.shortRoute,
  }),
  compactDestText: {
    fontSize: 10,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  compactCountdown: {
    marginBottom: theme.spacing.xs,
  },
  compactTimeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  compactMinutes: (isHalkali: boolean) => ({
    fontSize: 28,
    fontWeight: '800' as const,
    fontVariant: ['tabular-nums'] as const,
    lineHeight: 34,
    color: isHalkali ? theme.colors.halkaliBadge : theme.colors.gebzeBadge,
  }),
  compactUnit: (isHalkali: boolean) => ({
    fontSize: 14,
    fontWeight: '600' as const,
    color: isHalkali ? theme.colors.halkaliBadge : theme.colors.gebzeBadge,
  }),
  compactTimeValue: (isHalkali: boolean) => ({
    fontSize: 20,
    fontWeight: '700' as const,
    fontVariant: ['tabular-nums'] as const,
    color: isHalkali ? theme.colors.halkaliBadge : theme.colors.gebzeBadge,
  }),
  compactBeforeLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginRight: 4,
    color: theme.colors.textSecondary,
  },
  compactStatusText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  urgentText: {
    color: theme.colors.danger,
  },
  halkaliColor: { color: theme.colors.halkaliBadge },
  gebzeColor: { color: theme.colors.gebzeBadge },

  // ─── Upcoming Trains ───────────────────────────────────────
  upcomingContainer: {
    marginBottom: theme.spacing.md,
  },
  upcomingTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: theme.spacing.xs,
    color: theme.colors.textMuted,
  },
  upcomingRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  upcomingChip: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    alignItems: 'center',
    gap: 3,
    backgroundColor: theme.colors.surface,
  },
  upcomingTime: {
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    color: theme.colors.text,
  },
  upcomingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  upcomingDot: (isFull: boolean) => ({
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: isFull ? theme.colors.fullRoute : theme.colors.shortRoute,
  }),
  upcomingDest: {
    fontSize: 10,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },

  // ─── Schedule Info ─────────────────────────────────────────
  scheduleCard: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    gap: theme.spacing.md,
  },
  scheduleDirection: {
    gap: theme.spacing.xs,
  },
  scheduleDirLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  scheduleItem: {
    alignItems: 'center',
    gap: 2,
    flex: 1,
  },
  scheduleDivider: {
    width: 1,
    height: 28,
    backgroundColor: theme.colors.borderLight,
  },
  scheduleTime: {
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    color: theme.colors.text,
  },
  mutedIcon: { color: theme.colors.textMuted },
  favActive: { color: theme.colors.favoriteGold },
  favInactive: { color: theme.colors.textMuted },
}));
