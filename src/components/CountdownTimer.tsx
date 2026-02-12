import React from "react";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { NextTrainInfo } from "../types";

interface Props {
  info: NextTrainInfo;
  size?: "large" | "small";
}

export function CountdownTimer({ info, size = "small" }: Props) {
  const isLarge = size === "large";

  if (info.isServiceOver && !info.firstTrain) {
    return (
      <View style={styles.container}>
        <Text style={[styles.statusText, isLarge && styles.statusLarge]}>
          Son Durak
        </Text>
      </View>
    );
  }

  if (info.isServiceOver) {
    return (
      <View style={styles.container}>
        <Text
          style={[styles.serviceOverText, isLarge && styles.serviceOverLarge]}
        >
          Sefer Bitti
        </Text>
        {isLarge && (
          <Text style={styles.infoSubtext}>İlk sefer: {info.firstTrain}</Text>
        )}
      </View>
    );
  }

  if (info.isBeforeService) {
    return (
      <View style={styles.container}>
        <Text style={[styles.beforeText, isLarge && styles.beforeTextLarge]}>
          İlk sefer
        </Text>
        <Text style={[isLarge ? styles.timeLarge : styles.timeSmall]}>
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
            isUrgent && styles.urgentText,
          ]}
          accessibilityLabel={`${mins} dakika`}
        >
          {mins}
        </Text>
        <Text
          style={[
            isLarge ? styles.unitLarge : styles.unitSmall,
            isUrgent && styles.urgentText,
          ]}
        >
          dk
        </Text>
      </View>
      {isLarge && info.destination ? (
        <View style={styles.destBadge}>
          <View style={styles.destDot(info.routeType === "full")} />
          <Text style={styles.destLabel}>{info.destination}</Text>
          <View style={styles.routeChip(info.routeType === "full")}>
            <Text style={styles.routeChipText(info.routeType === "full")}>
              {info.routeType === "full" ? "Tam Hat" : "Kısa Hat"}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: "center",
  },
  minuteRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
  },
  minutesLarge: {
    fontSize: 56,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
    lineHeight: 64,
    color: theme.colors.text,
  },
  minutesSmall: {
    fontSize: 22,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
    color: theme.colors.text,
  },
  urgentText: {
    color: theme.colors.danger,
  },
  unitLarge: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 6,
    color: theme.colors.textSecondary,
  },
  unitSmall: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  serviceOverText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textMuted,
  },
  serviceOverLarge: {
    fontSize: 22,
  },
  beforeText: {
    fontSize: 11,
    fontWeight: "500",
    color: theme.colors.warning,
  },
  beforeTextLarge: {
    fontSize: 16,
  },
  timeSmall: {
    fontSize: 16,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
    color: theme.colors.text,
  },
  timeLarge: {
    fontSize: 40,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
    color: theme.colors.text,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "500",
    color: theme.colors.textMuted,
  },
  statusLarge: {
    fontSize: 20,
  },
  infoSubtext: {
    fontSize: 13,
    marginTop: theme.spacing.xs,
    color: theme.colors.textSecondary,
  },
  destBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: theme.spacing.md,
  },
  destDot: (isFull: boolean) => ({
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: isFull ? theme.colors.fullRoute : theme.colors.shortRoute,
  }),
  destLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.textSecondary,
  },
  routeChip: (isFull: boolean) => ({
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: isFull
      ? theme.colors.fullRouteLight
      : theme.colors.shortRouteLight,
  }),
  routeChipText: (isFull: boolean) => ({
    fontSize: 11,
    fontWeight: "700" as const,
    color: isFull ? theme.colors.fullRoute : theme.colors.shortRoute,
  }),
}));
