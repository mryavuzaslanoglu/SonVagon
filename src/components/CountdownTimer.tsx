import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing } from '../constants/theme';
import { useColors } from '../contexts/ThemeContext';
import { NextTrainInfo } from '../types';

interface Props {
  info: NextTrainInfo;
  size?: 'large' | 'small';
}

export function CountdownTimer({ info, size = 'small' }: Props) {
  const colors = useColors();
  const isLarge = size === 'large';

  if (info.isServiceOver && !info.firstTrain) {
    return (
      <View style={styles.container}>
        <Text style={[styles.statusText, { color: colors.textMuted }, isLarge && styles.statusLarge]}>Son Durak</Text>
      </View>
    );
  }

  if (info.isServiceOver) {
    return (
      <View style={styles.container}>
        <Text style={[styles.serviceOverText, { color: colors.textMuted }, isLarge && styles.serviceOverLarge]}>
          Sefer Bitti
        </Text>
        {isLarge && (
          <Text style={[styles.infoSubtext, { color: colors.textSecondary }]}>
            İlk sefer: {info.firstTrain}
          </Text>
        )}
      </View>
    );
  }

  if (info.isBeforeService) {
    return (
      <View style={styles.container}>
        <Text style={[styles.beforeText, { color: colors.warning }, isLarge && styles.beforeTextLarge]}>
          İlk sefer
        </Text>
        <Text style={[isLarge ? styles.timeLarge : styles.timeSmall, { color: colors.text }]}>
          {info.nextTrainTime}
        </Text>
      </View>
    );
  }

  const mins = info.remainingMinutes;
  const isUrgent = mins < 2;

  return (
    <View style={styles.container}>
      <View style={styles.minuteRow}>
        <Text
          style={[
            isLarge ? styles.minutesLarge : styles.minutesSmall,
            { color: isUrgent ? colors.danger : colors.text },
          ]}
        >
          {mins}
        </Text>
        <Text style={[
          isLarge ? styles.unitLarge : styles.unitSmall,
          { color: isUrgent ? colors.danger : colors.textSecondary },
        ]}>
          dk
        </Text>
      </View>
      {isLarge && info.destination ? (
        <View style={styles.destBadge}>
          <View style={[
            styles.destDot,
            { backgroundColor: info.routeType === 'full' ? colors.fullRoute : colors.shortRoute },
          ]} />
          <Text style={[styles.destLabel, { color: colors.textSecondary }]}>{info.destination}</Text>
          <View style={[
            styles.routeChip,
            { backgroundColor: info.routeType === 'full' ? colors.fullRouteLight : colors.shortRouteLight },
          ]}>
            <Text style={[
              styles.routeChipText,
              { color: info.routeType === 'full' ? colors.fullRoute : colors.shortRoute },
            ]}>
              {info.routeType === 'full' ? 'Tam Hat' : 'Kısa Hat'}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  minuteRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  minutesLarge: {
    fontSize: 56,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    lineHeight: 64,
  },
  minutesSmall: {
    fontSize: 22,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  unitLarge: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 6,
  },
  unitSmall: {
    fontSize: 12,
    fontWeight: '600',
  },
  serviceOverText: {
    fontSize: 13,
    fontWeight: '600',
  },
  serviceOverLarge: {
    fontSize: 22,
  },
  beforeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  beforeTextLarge: {
    fontSize: 16,
  },
  timeSmall: {
    fontSize: 16,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  timeLarge: {
    fontSize: 40,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
  },
  statusLarge: {
    fontSize: 20,
  },
  infoSubtext: {
    fontSize: 13,
    marginTop: Spacing.xs,
  },
  destBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.md,
  },
  destDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  destLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  routeChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  routeChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
