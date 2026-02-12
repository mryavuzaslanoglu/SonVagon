import React, { memo } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { BufferTime } from '@/types';

const BUFFER_OPTIONS: BufferTime[] = [0, 3, 5, 10];

interface Props {
  value: BufferTime;
  onChange: (v: BufferTime) => void;
}

export const BufferTimeSelector = memo(function BufferTimeSelector({
  value,
  onChange,
}: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Tampon süre</Text>
      <View style={styles.row}>
        {BUFFER_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.pill, option === value && styles.pillActive]}
            onPress={() => onChange(option)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.pillText,
                option === value && styles.pillTextActive,
              ]}
            >
              {option} dk
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create((theme) => ({
  wrapper: {
    gap: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  pill: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.pill,
    backgroundColor: theme.colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pillActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  pillText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSecondary,
  },
  pillTextActive: {
    color: theme.colors.white,
  },
}));
