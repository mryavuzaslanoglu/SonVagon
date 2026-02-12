import React, { memo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { BorderRadius, Spacing, Shadows } from '../constants/theme';
import { useColors } from '../contexts/ThemeContext';
import { Station, NextTrainInfo, UpcomingTrain } from '../types';

interface Props {
  station: Station;
  toHalkali: NextTrainInfo;
  toGebze: NextTrainInfo;
  upcomingHalkali: UpcomingTrain[];
  upcomingGebze: UpcomingTrain[];
  onPress: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (stationId: string) => void;
}

function DirectionMiniCard({
  info,
  upcoming,
  direction,
}: {
  info: NextTrainInfo;
  upcoming: UpcomingTrain[];
  direction: 'toHalkali' | 'toGebze';
}) {
  const colors = useColors();
  const isHalkali = direction === 'toHalkali';
  const color = isHalkali ? colors.halkaliBadge : colors.gebzeBadge;
  const bgColor = isHalkali ? colors.halkaliBadgeLight : colors.gebzeBadgeLight;
  const label = isHalkali ? '← Halkalı' : 'Gebze →';

  if (info.isServiceOver && !info.firstTrain) {
    return null; // terminus
  }

  return (
    <View style={[styles.dirMini, { backgroundColor: bgColor }]}>
      <Text style={[styles.dirLabel, { color }]}>{label}</Text>

      {info.isServiceOver ? (
        <Text style={[styles.dirStatusText, { color: colors.textMuted }]}>Sefer Bitti</Text>
      ) : info.isBeforeService ? (
        <View style={styles.dirCountdownRow}>
          <Text style={[styles.dirBeforeText, { color: colors.textSecondary }]}>İlk</Text>
          <Text style={[styles.dirTime, { color }]}>{info.nextTrainTime}</Text>
        </View>
      ) : (
        <View style={styles.dirCountdownRow}>
          <Text style={[styles.dirMinutes, { color }]}>
            {info.remainingMinutes}
          </Text>
          <Text style={[styles.dirUnit, { color }]}>dk</Text>
        </View>
      )}

      {info.destination ? (
        <View style={styles.dirDestRow}>
          <View style={[styles.dirDestDot, {
            backgroundColor: info.routeType === 'full' ? colors.fullRoute : colors.shortRoute,
          }]} />
          <Text style={[styles.dirDestText, { color: colors.textSecondary }]}>{info.destination}</Text>
        </View>
      ) : null}

      {upcoming.length > 1 && (
        <Text style={[styles.dirUpcoming, { color: colors.textMuted }]} numberOfLines={1}>
          {upcoming.slice(1, 4).map(t => t.time).join('  ·  ')}
        </Text>
      )}
    </View>
  );
}

export const StationCard = memo(function StationCard({
  station,
  toHalkali,
  toGebze,
  upcomingHalkali,
  upcomingGebze,
  onPress,
  isFavorite = false,
  onToggleFavorite,
}: Props) {
  const colors = useColors();

  const handleToggleFavorite = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onToggleFavorite?.(station.id);
  }, [onToggleFavorite, station.id]);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.surface },
        Shadows.card,
        isFavorite && { borderWidth: 1.5, borderColor: colors.favoriteGold + '40' },
      ]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {onToggleFavorite && (
            <TouchableOpacity
              onPress={handleToggleFavorite}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.starBtn}
            >
              <Ionicons
                name={isFavorite ? 'star' : 'star-outline'}
                size={20}
                color={isFavorite ? colors.favoriteGold : colors.textMuted}
              />
            </TouchableOpacity>
          )}
          <View>
            <View style={styles.nameRow}>
              <Text style={[styles.stationName, { color: colors.text }]}>{station.name}</Text>
              {station.transfers.length > 0 && (
                <View style={[styles.transferBadge, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="git-branch-outline" size={10} color={colors.primary} />
                </View>
              )}
            </View>
            <Text style={[styles.district, { color: colors.textSecondary }]}>{station.district}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </View>

      {/* Direction cards */}
      <View style={styles.directionsRow}>
        {station.schedule.toHalkali && (
          <DirectionMiniCard
            info={toHalkali}
            upcoming={upcomingHalkali}
            direction="toHalkali"
          />
        )}
        {station.schedule.toGebze && (
          <DirectionMiniCard
            info={toGebze}
            upcoming={upcomingGebze}
            direction="toGebze"
          />
        )}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  starBtn: {
    marginRight: Spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stationName: {
    fontSize: 17,
    fontWeight: '700',
  },
  transferBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  district: {
    fontSize: 13,
    marginTop: 1,
  },
  directionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dirMini: {
    flex: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  dirLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  dirCountdownRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  dirMinutes: {
    fontSize: 28,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    lineHeight: 34,
  },
  dirUnit: {
    fontSize: 14,
    fontWeight: '600',
  },
  dirTime: {
    fontSize: 20,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  dirBeforeText: {
    fontSize: 12,
    fontWeight: '500',
    marginRight: 4,
  },
  dirStatusText: {
    fontSize: 13,
    fontWeight: '600',
    paddingVertical: 4,
  },
  dirDestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dirDestDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  dirDestText: {
    fontSize: 10,
    fontWeight: '500',
  },
  dirUpcoming: {
    fontSize: 11,
    fontVariant: ['tabular-nums'],
    marginTop: 2,
  },
});
