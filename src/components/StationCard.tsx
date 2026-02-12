import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native-unistyles';
import { Station, NextTrainInfo, UpcomingTrain } from '../types';
import { useHapticFavorite } from '@/hooks/useHapticFavorite';

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
  const isHalkali = direction === 'toHalkali';
  const label = isHalkali ? '← Halkalı' : 'Gebze →';

  if (info.isServiceOver && !info.firstTrain) {
    return null; // terminus
  }

  return (
    <View style={styles.dirMini(isHalkali)}>
      <Text style={styles.dirLabel(isHalkali)}>{label}</Text>

      {info.isServiceOver ? (
        <Text style={styles.dirStatusText}>Sefer Bitti</Text>
      ) : info.isBeforeService ? (
        <View style={styles.dirCountdownRow}>
          <Text style={styles.dirBeforeText}>İlk</Text>
          <Text style={styles.dirTime(isHalkali)}>{info.nextTrainTime}</Text>
        </View>
      ) : (
        <View style={styles.dirCountdownRow}>
          <Text style={styles.dirMinutes(isHalkali)}>
            {info.remainingMinutes}
          </Text>
          <Text style={styles.dirUnit(isHalkali)}>dk</Text>
        </View>
      )}

      {info.destination ? (
        <View style={styles.dirDestRow}>
          <View style={styles.dirDestDot(info.routeType === 'full')} />
          <Text style={styles.dirDestText}>{info.destination}</Text>
        </View>
      ) : null}

      {upcoming.length > 1 && (
        <Text style={styles.dirUpcoming} numberOfLines={1}>
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
  const handleToggleFavorite = useHapticFavorite(station.id, onToggleFavorite ?? (() => {}));

  return (
    <TouchableOpacity
      style={[styles.card, isFavorite && styles.cardFavorite]}
      onPress={onPress}
      activeOpacity={0.6}
      accessibilityRole="button"
      accessibilityLabel={`${station.name} istasyonu`}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {onToggleFavorite && (
            <TouchableOpacity
              onPress={handleToggleFavorite}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.starBtn}
              accessibilityRole="button"
              accessibilityLabel={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
            >
              <Ionicons
                name={isFavorite ? 'star' : 'star-outline'}
                size={20}
                color={isFavorite ? styles.starActive.color : styles.starInactive.color}
              />
            </TouchableOpacity>
          )}
          <View>
            <View style={styles.nameRow}>
              <Text style={styles.stationName}>{station.name}</Text>
              {station.transfers.length > 0 && (
                <View style={styles.transferBadge}>
                  <Ionicons name="git-branch-outline" size={10} color={styles.transferIcon.color} />
                </View>
              )}
            </View>
            <Text style={styles.district}>{station.district}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={styles.chevron.color} />
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

const styles = StyleSheet.create((theme) => ({
  card: {
    borderRadius: theme.borderRadius.xl,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.card,
  },
  cardFavorite: {
    borderWidth: 1.5,
    borderColor: theme.colors.favoriteGold + '40',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  starBtn: {
    marginRight: theme.spacing.sm,
  },
  starActive: {
    color: theme.colors.favoriteGold,
  },
  starInactive: {
    color: theme.colors.textMuted,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stationName: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.text,
  },
  transferBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primaryLight,
  },
  transferIcon: {
    color: theme.colors.primary,
  },
  district: {
    fontSize: 13,
    marginTop: 1,
    color: theme.colors.textSecondary,
  },
  chevron: {
    color: theme.colors.textMuted,
  },
  directionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  dirMini: (isHalkali: boolean) => ({
    flex: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center' as const,
    gap: 4,
    backgroundColor: isHalkali ? theme.colors.halkaliBadgeLight : theme.colors.gebzeBadgeLight,
  }),
  dirLabel: (isHalkali: boolean) => ({
    fontSize: 12,
    fontWeight: '700' as const,
    color: isHalkali ? theme.colors.halkaliBadge : theme.colors.gebzeBadge,
  }),
  dirCountdownRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  dirMinutes: (isHalkali: boolean) => ({
    fontSize: 28,
    fontWeight: '800' as const,
    fontVariant: ['tabular-nums'] as const,
    lineHeight: 34,
    color: isHalkali ? theme.colors.halkaliBadge : theme.colors.gebzeBadge,
  }),
  dirUnit: (isHalkali: boolean) => ({
    fontSize: 14,
    fontWeight: '600' as const,
    color: isHalkali ? theme.colors.halkaliBadge : theme.colors.gebzeBadge,
  }),
  dirTime: (isHalkali: boolean) => ({
    fontSize: 20,
    fontWeight: '700' as const,
    fontVariant: ['tabular-nums'] as const,
    color: isHalkali ? theme.colors.halkaliBadge : theme.colors.gebzeBadge,
  }),
  dirBeforeText: {
    fontSize: 12,
    fontWeight: '500',
    marginRight: 4,
    color: theme.colors.textSecondary,
  },
  dirStatusText: {
    fontSize: 13,
    fontWeight: '600',
    paddingVertical: 4,
    color: theme.colors.textMuted,
  },
  dirDestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dirDestDot: (isFull: boolean) => ({
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: isFull ? theme.colors.fullRoute : theme.colors.shortRoute,
  }),
  dirDestText: {
    fontSize: 10,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  dirUpcoming: {
    fontSize: 11,
    fontVariant: ['tabular-nums'],
    marginTop: 2,
    color: theme.colors.textMuted,
  },
}));
