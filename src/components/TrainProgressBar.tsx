import React from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

interface Props {
  remainingMs: number;
  intervalMinutes: number;
  color?: string;
}

export function TrainProgressBar({
  remainingMs,
  intervalMinutes,
  color,
}: Props) {
  const barColor = color ?? styles.defaultColor.color;
  const totalMs = intervalMinutes * 60 * 1000;
  const elapsed = totalMs - remainingMs;
  const progress = Math.max(0, Math.min(1, elapsed / totalMs));

  return (
    <View style={styles.track}>
      <View
        style={[
          styles.fill,
          { width: `${progress * 100}%`, backgroundColor: barColor },
        ]}
      />
      <View
        style={[
          styles.trainDot,
          {
            left: `${progress * 100}%`,
            backgroundColor: barColor,
            shadowColor: barColor,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  track: {
    height: 6,
    borderRadius: theme.borderRadius.pill,
    overflow: "visible",
    position: "relative",
    backgroundColor: theme.colors.borderLight,
  },
  fill: {
    height: "100%",
    borderRadius: theme.borderRadius.pill,
  },
  trainDot: {
    position: "absolute",
    top: -5,
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: -8,
    borderWidth: 3,
    borderColor: theme.colors.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  defaultColor: {
    color: theme.colors.primary,
  },
}));
