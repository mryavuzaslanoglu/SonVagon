import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, Linking, Platform } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Ionicons } from '@expo/vector-icons';
import { CatchableTrain } from '@/types';

interface Props {
  item: CatchableTrain;
  stationName: string;
  stationLat: number;
  stationLng: number;
  walkingMinutes: number;
}

function openMapsWalking(destLat: number, destLng: number, label: string) {
  const encodedLabel = encodeURIComponent(label);
  const url = Platform.select({
    ios: `maps://app?daddr=${destLat},${destLng}&dirflg=w&q=${encodedLabel}`,
    default: `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=walking`,
  });
  Linking.openURL(url);
}

export const CatchableTrainRow = memo(function CatchableTrainRow({
  item,
  stationName,
  stationLat,
  stationLng,
  walkingMinutes,
}: Props) {
  const { leaveByTime, leaveByMinutesFromNow, arrivalAtStationTime, train, isRecommended } = item;
  const isNow = leaveByMinutesFromNow <= 0;
  const isFull = train.routeType === 'full';

  const handleOpenMaps = useCallback(() => {
    openMapsWalking(stationLat, stationLng, stationName);
  }, [stationLat, stationLng, stationName]);

  return (
    <View style={[styles.container, isRecommended && styles.containerRecommended]}>
      {/* Header: leave time + recommended badge */}
      <View style={styles.headerRow}>
        <View style={styles.leaveByRow}>
          <Text style={[styles.leaveByTime, isRecommended && styles.leaveByTimeRecommended]}>
            {isNow ? 'Şimdi çık!' : `${leaveByTime}'de çık`}
          </Text>
          {isRecommended && (
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedText}>Önerilen</Text>
            </View>
          )}
        </View>
        <Text style={styles.leaveByMinutes}>
          {isNow ? 'Hemen' : `${leaveByMinutesFromNow} dk sonra`}
        </Text>
      </View>

      {/* Timeline: evden çık → istasyon → tren */}
      <View style={styles.timeline}>
        <View style={styles.timelineStep}>
          <View style={styles.dot} />
          <Text style={styles.timelineTime}>{leaveByTime}</Text>
          <Text style={styles.timelineLabel}>Yola çık</Text>
        </View>

        <View style={styles.timelineLine}>
          <Text style={styles.timelineDuration}>{walkingMinutes} dk</Text>
        </View>

        <View style={styles.timelineStep}>
          <View style={[styles.dot, styles.dotStation]} />
          <Text style={styles.timelineTime}>{arrivalAtStationTime}</Text>
          <Text style={styles.timelineLabel}>İstasyonda ol</Text>
        </View>

        <View style={styles.timelineLine}>
          <Ionicons name="train-outline" size={10} color={styles.trainIcon.color} />
        </View>

        <View style={styles.timelineStep}>
          <View style={[styles.dot, isFull ? styles.dotFull : styles.dotShort]} />
          <Text style={styles.timelineTime}>{train.time}</Text>
          <View style={[styles.destinationBadge, isFull ? styles.fullRouteBg : styles.shortRouteBg]}>
            <Text style={[styles.destinationLabel, isFull ? styles.fullRouteText : styles.shortRouteText]}>
              {train.destination}
            </Text>
          </View>
        </View>
      </View>

      {/* Maps button */}
      <TouchableOpacity
        style={styles.mapsButton}
        onPress={handleOpenMaps}
        activeOpacity={0.7}
      >
        <Ionicons name="navigate-outline" size={14} color={styles.mapsButtonText.color} />
        <Text style={styles.mapsButtonText}>Yol tarifi al</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create((theme) => ({
  container: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  containerRecommended: {
    backgroundColor: theme.colors.asyaBadgeLight,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leaveByRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  leaveByTime: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  leaveByTimeRecommended: {
    color: theme.colors.success,
  },
  recommendedBadge: {
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
  leaveByMinutes: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  // ─── Timeline ──────────────────────────────
  timeline: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  timelineStep: {
    alignItems: 'center',
    gap: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.textMuted,
  },
  dotStation: {
    backgroundColor: theme.colors.primary,
  },
  dotFull: {
    backgroundColor: theme.colors.fullRoute,
  },
  dotShort: {
    backgroundColor: theme.colors.shortRoute,
  },
  timelineTime: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  timelineLabel: {
    fontSize: 9,
    color: theme.colors.textMuted,
  },
  timelineLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDuration: {
    fontSize: 8,
    color: theme.colors.textMuted,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 3,
  },
  trainIcon: {
    color: theme.colors.textMuted,
  },
  destinationBadge: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: theme.borderRadius.pill,
  },
  fullRouteBg: {
    backgroundColor: theme.colors.fullRouteLight,
  },
  shortRouteBg: {
    backgroundColor: theme.colors.shortRouteLight,
  },
  destinationLabel: {
    fontSize: 9,
    fontWeight: theme.fontWeight.semibold,
  },
  fullRouteText: {
    color: theme.colors.fullRoute,
  },
  shortRouteText: {
    color: theme.colors.shortRoute,
  },
  // ─── Maps Button ───────────────────────────
  mapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  mapsButtonText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.halkaliBadge,
  },
}));
