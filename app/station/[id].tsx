import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Spacing, BorderRadius, Shadows } from '../../src/constants/theme';
import { useColors } from '../../src/contexts/ThemeContext';
import { stationMap } from '../../src/data/stations';
import { useCurrentTime } from '../../src/hooks/useCurrentTime';
import { useNextTrain } from '../../src/hooks/useNextTrain';
import { getUpcomingTrains } from '../../src/utils/scheduleCalculator';
import { useFavoritesContext } from '../../src/contexts/FavoritesContext';
import { CountdownTimer } from '../../src/components/CountdownTimer';
import { DirectionBadge } from '../../src/components/DirectionBadge';
import { TrainProgressBar } from '../../src/components/TrainProgressBar';
import { UpcomingTrain } from '../../src/types';

function UpcomingTrainsList({ trains }: { trains: UpcomingTrain[] }) {
  const colors = useColors();
  if (trains.length <= 1) return null;
  const rest = trains.slice(1);
  return (
    <View style={[styles.upcomingSection, { borderTopColor: colors.borderLight }]}>
      <Text style={[styles.upcomingLabel, { color: colors.textMuted }]}>Sonraki seferler</Text>
      <View style={styles.upcomingRow}>
        {rest.map((t, i) => (
          <View key={i} style={[styles.upcomingChip, { backgroundColor: colors.surfaceSecondary }]}>
            <Text style={[styles.upcomingTime, { color: colors.text }]}>{t.time}</Text>
            <View style={styles.upcomingMeta}>
              <View style={[styles.upcomingDot, {
                backgroundColor: t.routeType === 'full' ? colors.fullRoute : colors.shortRoute,
              }]} />
              <Text style={[styles.upcomingDest, { color: colors.textSecondary }]}>{t.destination}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function StationDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const station = stationMap.get(id ?? '');
  const now = useCurrentTime();
  const countdowns = useNextTrain(station, now);
  const { isFavorite, toggleFavorite } = useFavoritesContext();

  const upcomingH = useMemo(() =>
    station ? getUpcomingTrains(station, 'toHalkali', now, 5) : [],
    [station, now]
  );
  const upcomingG = useMemo(() =>
    station ? getUpcomingTrains(station, 'toGebze', now, 5) : [],
    [station, now]
  );

  if (!station || !countdowns) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.danger }]}>Istasyon bulunamadi</Text>
      </View>
    );
  }

  const favorite = isFavorite(station.id);
  const { toHalkali, toGebze } = countdowns;

  const handleToggleFavorite = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    toggleFavorite(station.id);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Stack.Screen
        options={{
          headerTitle: station.name,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerRight: () => (
            <TouchableOpacity
              onPress={handleToggleFavorite}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={{ marginRight: Spacing.sm }}
            >
              <Ionicons
                name={favorite ? 'star' : 'star-outline'}
                size={24}
                color={favorite ? colors.favoriteGold : colors.textMuted}
              />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Station Info */}
      <View style={styles.stationHeader}>
        <Text style={[styles.stationName, { color: colors.text }]}>{station.name}</Text>
        <View style={styles.infoRow}>
          <View style={[
            styles.sideBadge,
            { backgroundColor: station.side === 'avrupa' ? colors.avrupaBadgeLight : colors.asyaBadgeLight },
          ]}>
            <Text style={[
              styles.sideBadgeText,
              { color: station.side === 'avrupa' ? colors.avrupaBadge : colors.asyaBadge },
            ]}>
              {station.side === 'avrupa' ? 'Avrupa' : 'Anadolu'}
            </Text>
          </View>
          <Text style={[styles.districtText, { color: colors.textSecondary }]}>{station.district}</Text>
        </View>
      </View>

      {/* Transfers */}
      {station.transfers.length > 0 && (
        <View style={[styles.transfersCard, { backgroundColor: colors.surface }, Shadows.sm]}>
          <View style={styles.transferHeader}>
            <Ionicons name="git-branch-outline" size={16} color={colors.primary} />
            <Text style={[styles.transferTitle, { color: colors.text }]}>Aktarma Baglantilari</Text>
          </View>
          {station.transfers.map((t, i) => (
            <View key={i} style={styles.transferRow}>
              <View style={[styles.transferDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.transferText, { color: colors.textSecondary }]}>{t}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Halkalı Direction */}
      {station.schedule.toHalkali && (
        <View style={[styles.directionCard, { backgroundColor: colors.surface }, Shadows.card]}>
          <DirectionBadge
            direction="toHalkali"
            destination={toHalkali.destination}
            routeType={toHalkali.routeType}
          />
          <View style={styles.countdownContainer}>
            <CountdownTimer info={toHalkali} size="large" />
          </View>
          {!toHalkali.isServiceOver && !toHalkali.isBeforeService && (
            <TrainProgressBar
              remainingMs={toHalkali.remainingMs}
              intervalMinutes={station.schedule.toHalkali.intervalMinutes}
              color={colors.halkaliBadge}
            />
          )}
          <UpcomingTrainsList trains={upcomingH} />
          <View style={[styles.scheduleRow, { borderTopColor: colors.borderLight }]}>
            <View style={styles.scheduleItem}>
              <Ionicons name="sunny-outline" size={16} color={colors.textMuted} />
              <Text style={[styles.scheduleLabel, { color: colors.textMuted }]}>Ilk</Text>
              <Text style={[styles.scheduleTime, { color: colors.text }]}>{station.schedule.toHalkali.firstTrain}</Text>
            </View>
            <View style={[styles.scheduleDivider, { backgroundColor: colors.borderLight }]} />
            <View style={styles.scheduleItem}>
              <Ionicons name="moon-outline" size={16} color={colors.textMuted} />
              <Text style={[styles.scheduleLabel, { color: colors.textMuted }]}>Son</Text>
              <Text style={[styles.scheduleTime, { color: colors.text }]}>{station.schedule.toHalkali.lastTrain}</Text>
            </View>
            <View style={[styles.scheduleDivider, { backgroundColor: colors.borderLight }]} />
            <View style={styles.scheduleItem}>
              <Ionicons name="time-outline" size={16} color={colors.textMuted} />
              <Text style={[styles.scheduleLabel, { color: colors.textMuted }]}>Aralik</Text>
              <Text style={[styles.scheduleTime, { color: colors.text }]}>{station.schedule.toHalkali.intervalMinutes} dk</Text>
            </View>
          </View>
        </View>
      )}

      {/* Gebze Direction */}
      {station.schedule.toGebze && (
        <View style={[styles.directionCard, { backgroundColor: colors.surface }, Shadows.card]}>
          <DirectionBadge
            direction="toGebze"
            destination={toGebze.destination}
            routeType={toGebze.routeType}
          />
          <View style={styles.countdownContainer}>
            <CountdownTimer info={toGebze} size="large" />
          </View>
          {!toGebze.isServiceOver && !toGebze.isBeforeService && (
            <TrainProgressBar
              remainingMs={toGebze.remainingMs}
              intervalMinutes={station.schedule.toGebze.intervalMinutes}
              color={colors.gebzeBadge}
            />
          )}
          <UpcomingTrainsList trains={upcomingG} />
          <View style={[styles.scheduleRow, { borderTopColor: colors.borderLight }]}>
            <View style={styles.scheduleItem}>
              <Ionicons name="sunny-outline" size={16} color={colors.textMuted} />
              <Text style={[styles.scheduleLabel, { color: colors.textMuted }]}>Ilk</Text>
              <Text style={[styles.scheduleTime, { color: colors.text }]}>{station.schedule.toGebze.firstTrain}</Text>
            </View>
            <View style={[styles.scheduleDivider, { backgroundColor: colors.borderLight }]} />
            <View style={styles.scheduleItem}>
              <Ionicons name="moon-outline" size={16} color={colors.textMuted} />
              <Text style={[styles.scheduleLabel, { color: colors.textMuted }]}>Son</Text>
              <Text style={[styles.scheduleTime, { color: colors.text }]}>{station.schedule.toGebze.lastTrain}</Text>
            </View>
            <View style={[styles.scheduleDivider, { backgroundColor: colors.borderLight }]} />
            <View style={styles.scheduleItem}>
              <Ionicons name="time-outline" size={16} color={colors.textMuted} />
              <Text style={[styles.scheduleLabel, { color: colors.textMuted }]}>Aralik</Text>
              <Text style={[styles.scheduleTime, { color: colors.text }]}>{station.schedule.toGebze.intervalMinutes} dk</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl * 2,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: Spacing.xxl,
  },
  stationHeader: {
    marginBottom: Spacing.xl,
  },
  stationName: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom: Spacing.sm,
    letterSpacing: -0.5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sideBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  sideBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  districtText: {
    fontSize: 15,
  },
  transfersCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  transferHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  transferTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  transferRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  transferDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  transferText: {
    fontSize: 14,
  },
  directionCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  countdownContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  upcomingSection: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  upcomingLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  upcomingRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  upcomingChip: {
    flex: 1,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    alignItems: 'center',
    gap: 3,
  },
  upcomingTime: {
    fontSize: 15,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  upcomingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  upcomingDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  upcomingDest: {
    fontSize: 10,
    fontWeight: '500',
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
  },
  scheduleItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  scheduleDivider: {
    width: 1,
    height: 36,
  },
  scheduleLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
