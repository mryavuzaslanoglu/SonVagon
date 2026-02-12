import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BorderRadius } from '../constants/theme';
import { useColors } from '../contexts/ThemeContext';

interface Props {
  remainingMs: number;
  intervalMinutes: number;
  color?: string;
}

export function TrainProgressBar({ remainingMs, intervalMinutes, color }: Props) {
  const colors = useColors();
  const barColor = color ?? colors.primary;
  const totalMs = intervalMinutes * 60 * 1000;
  const elapsed = totalMs - remainingMs;
  const progress = Math.max(0, Math.min(1, elapsed / totalMs));

  return (
    <View style={[styles.track, { backgroundColor: colors.borderLight }]}>
      <View style={[styles.fill, { width: `${progress * 100}%`, backgroundColor: barColor }]} />
      <View style={[
        styles.trainDot,
        {
          left: `${progress * 100}%`,
          backgroundColor: barColor,
          borderColor: colors.white,
          shadowColor: barColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 8,
          elevation: 4,
        },
      ]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: BorderRadius.pill,
    overflow: 'visible',
    position: 'relative',
  },
  fill: {
    height: '100%',
    borderRadius: BorderRadius.pill,
  },
  trainDot: {
    position: 'absolute',
    top: -5,
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: -8,
    borderWidth: 3,
  },
});
