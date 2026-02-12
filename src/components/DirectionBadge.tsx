import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BorderRadius, Spacing } from '../constants/theme';
import { useColors } from '../contexts/ThemeContext';
import { Direction, TrainRouteType } from '../types';

interface Props {
  direction: Direction;
  compact?: boolean;
  destination?: string;
  routeType?: TrainRouteType;
}

export function DirectionBadge({ direction, compact = false, destination, routeType }: Props) {
  const colors = useColors();
  const isHalkali = direction === 'toHalkali';
  const label = isHalkali ? 'Halkalı' : 'Gebze';
  const arrow = isHalkali ? '←' : '→';
  const color = isHalkali ? colors.halkaliBadge : colors.gebzeBadge;
  const bgColor = isHalkali ? colors.halkaliBadgeLight : colors.gebzeBadgeLight;

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }, compact && styles.compact]}>
      <Text style={[styles.arrow, { color }, compact && styles.arrowCompact]}>{arrow}</Text>
      <Text style={[styles.label, { color }, compact && styles.labelCompact]}>
        {label}
      </Text>
      {destination && routeType && !compact ? (
        <View style={[
          styles.destChip,
          { backgroundColor: routeType === 'full' ? colors.fullRouteLight : colors.shortRouteLight },
        ]}>
          <View style={[
            styles.destDot,
            { backgroundColor: routeType === 'full' ? colors.fullRoute : colors.shortRoute },
          ]} />
          <Text style={[
            styles.destText,
            { color: routeType === 'full' ? colors.fullRoute : colors.shortRoute },
          ]}>
            {destination}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  compact: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  arrow: {
    fontSize: 14,
    fontWeight: '700',
  },
  arrowCompact: {
    fontSize: 11,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
  labelCompact: {
    fontSize: 11,
  },
  destChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  destDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  destText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
