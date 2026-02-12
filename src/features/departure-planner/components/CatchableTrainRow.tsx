import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { CatchableTrain } from '@/types';

interface Props {
  item: CatchableTrain;
}

export const CatchableTrainRow = memo(function CatchableTrainRow({
  item,
}: Props) {
  const { leaveByTime, leaveByMinutesFromNow, train, isRecommended } = item;
  const isNow = leaveByMinutesFromNow <= 0;
  const isFull = train.routeType === 'full';

  return (
    <View style={[styles.row, isRecommended && styles.rowRecommended]}>
      <View style={styles.leaveSection}>
        <Text style={[styles.leaveByTime, isRecommended && styles.leaveByTimeRecommended]}>
          {isNow ? 'Şimdi çık!' : `${leaveByTime}'de çık`}
        </Text>
        <Text style={styles.leaveByMinutes}>
          {isNow ? 'Hemen' : `${leaveByMinutesFromNow} dk sonra`}
        </Text>
      </View>
      <View style={styles.trainSection}>
        <Text style={styles.trainTime}>{train.time}</Text>
        <View style={[styles.routeBadge, isFull ? styles.fullRouteBg : styles.shortRouteBg]}>
          <Text style={[styles.routeLabel, isFull ? styles.fullRouteText : styles.shortRouteText]}>
            {isFull ? 'Tam hat' : 'Kısa hat'}
          </Text>
        </View>
      </View>
      {isRecommended && (
        <View style={styles.recommendedBadge}>
          <Text style={styles.recommendedText}>Önerilen</Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm + 2,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
  },
  rowRecommended: {
    backgroundColor: theme.colors.asyaBadgeLight,
  },
  leaveSection: {
    flex: 1,
  },
  leaveByTime: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  leaveByTimeRecommended: {
    color: theme.colors.success,
  },
  leaveByMinutes: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  trainSection: {
    alignItems: 'flex-end',
    gap: 4,
  },
  trainTime: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  routeBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.pill,
  },
  fullRouteBg: {
    backgroundColor: theme.colors.fullRouteLight,
  },
  shortRouteBg: {
    backgroundColor: theme.colors.shortRouteLight,
  },
  routeLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
  },
  fullRouteText: {
    color: theme.colors.fullRoute,
  },
  shortRouteText: {
    color: theme.colors.shortRoute,
  },
  recommendedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: theme.colors.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.pill,
  },
  recommendedText: {
    fontSize: 9,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
  },
}));
