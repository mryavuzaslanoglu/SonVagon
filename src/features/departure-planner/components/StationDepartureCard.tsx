import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Ionicons } from '@expo/vector-icons';
import { StationDeparturePlan } from '@/types';
import { formatDistance } from '@/utils/locationUtils';
import { CatchableTrainRow } from './CatchableTrainRow';

interface Props {
  plan: StationDeparturePlan;
}

export const StationDepartureCard = memo(function StationDepartureCard({
  plan,
}: Props) {
  const { stationInfo, catchableTrains, hasTrains } = plan;
  const { station, distanceMeters, walkingDurationText } = stationInfo;
  const hasRecommended = catchableTrains.some((t) => t.isRecommended);

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
          {catchableTrains.map((ct, i) => (
            <CatchableTrainRow key={`${ct.train.time}-${i}`} item={ct} />
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
    gap: theme.spacing.xs,
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
