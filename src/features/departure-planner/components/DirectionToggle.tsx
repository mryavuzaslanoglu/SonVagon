import React, { memo } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Direction } from '@/types';

interface Props {
  direction: Direction;
  onDirectionChange: (d: Direction) => void;
}

export const DirectionToggle = memo(function DirectionToggle({
  direction,
  onDirectionChange,
}: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.segment,
          styles.leftSegment,
          direction === 'toHalkali' && styles.activeHalkali,
        ]}
        onPress={() => onDirectionChange('toHalkali')}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.label,
            direction === 'toHalkali' && styles.activeLabel,
          ]}
        >
          ← Halkalı
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.segment,
          styles.rightSegment,
          direction === 'toGebze' && styles.activeGebze,
        ]}
        onPress={() => onDirectionChange('toGebze')}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.label,
            direction === 'toGebze' && styles.activeLabel,
          ]}
        >
          Gebze →
        </Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  segment: {
    flex: 1,
    paddingVertical: theme.spacing.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  leftSegment: {
    borderRightWidth: 0.5,
    borderRightColor: theme.colors.border,
  },
  rightSegment: {
    borderLeftWidth: 0.5,
    borderLeftColor: theme.colors.border,
  },
  activeHalkali: {
    backgroundColor: theme.colors.halkaliBadge,
  },
  activeGebze: {
    backgroundColor: theme.colors.gebzeBadge,
  },
  label: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSecondary,
  },
  activeLabel: {
    color: theme.colors.white,
  },
}));
