import React, { memo, useMemo } from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Ionicons } from '@expo/vector-icons';
import { StationDeparturePlan, CatchableTrain } from '@/types';
import { formatDistance } from '@/utils/locationUtils';
import { CatchableTrainRow } from './CatchableTrainRow';

interface Props {
  plan: StationDeparturePlan;
}

interface DestinationGroup {
  destination: string;
  isFull: boolean;
  trains: CatchableTrain[];
}

export const StationDepartureCard = memo(function StationDepartureCard({
  plan,
}: Props) {
  const { stationInfo, catchableTrains, hasTrains } = plan;
  const { station, distanceMeters, walkingDurationText, walkingDurationSeconds } = stationInfo;
  const hasRecommended = catchableTrains.some((t) => t.isRecommended);
  const walkingMinutes = Math.ceil((walkingDurationSeconds ?? 0) / 60);

  const groups = useMemo((): DestinationGroup[] => {
    const map = new Map<string, DestinationGroup>();
    for (const ct of catchableTrains) {
      const key = ct.train.destination;
      if (!map.has(key)) {
        map.set(key, {
          destination: key,
          isFull: ct.train.routeType === 'full',
          trains: [],
        });
      }
      map.get(key)!.trains.push(ct);
    }
    // Full line first, short line second
    return Array.from(map.values()).sort((a, b) =>
      a.isFull === b.isFull ? 0 : a.isFull ? -1 : 1,
    );
  }, [catchableTrains]);

  const hasMultipleDestinations = groups.length > 1;

  return (
    <View style={[styles.card, hasRecommended && styles.cardRecommended]}>
      <View style={styles.header}>
        <View style={styles.stationInfo}>
          <Text style={styles.stationName}>{station.name}</Text>
          <Text style={styles.district}>{station.district}</Text>
        </View>
        <View style={styles.walkingInfo}>
          <Ionicons name="walk-outline" size={16} color={styles.walkingIcon.color} />
          <Text style={styles.walkingText}>
            {formatDistance(distanceMeters)}
          </Text>
          {walkingDurationText && (
            <Text style={styles.walkingDuration}>
              {walkingDurationText}
            </Text>
          )}
        </View>
      </View>

      {hasTrains ? (
        <View style={styles.trainList}>
          {groups.map((group) => (
            <View key={group.destination}>
              {hasMultipleDestinations && (
                <View style={styles.groupHeader}>
                  <View
                    style={[
                      styles.groupDot,
                      group.isFull ? styles.fullRouteDot : styles.shortRouteDot,
                    ]}
                  />
                  <Text style={styles.groupTitle}>
                    {group.destination} seferleri
                  </Text>
                </View>
              )}
              {group.trains.map((ct, i) => (
                <CatchableTrainRow
                  key={`${ct.train.time}-${i}`}
                  item={ct}
                  stationName={station.name}
                  stationLat={station.latitude}
                  stationLng={station.longitude}
                  walkingMinutes={walkingMinutes}
                />
              ))}
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.noTrains}>
          <Text style={styles.noTrainsText}>
            Yakalanabilecek tren yok
          </Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardRecommended: {
    borderColor: theme.colors.success,
    borderWidth: 1.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  stationInfo: {
    flex: 1,
  },
  stationName: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  district: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  walkingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  walkingIcon: {
    color: theme.colors.textSecondary,
  },
  walkingText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textSecondary,
  },
  walkingDuration: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
  trainList: {
    gap: theme.spacing.sm,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
  },
  groupDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  fullRouteDot: {
    backgroundColor: theme.colors.fullRoute,
  },
  shortRouteDot: {
    backgroundColor: theme.colors.shortRoute,
  },
  groupTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSecondary,
  },
  noTrains: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  noTrainsText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
}));
