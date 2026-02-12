import React from "react";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Direction, TrainRouteType } from "../types";

interface Props {
  direction: Direction;
  compact?: boolean;
  destination?: string;
  routeType?: TrainRouteType;
}

export function DirectionBadge({
  direction,
  compact = false,
  destination,
  routeType,
}: Props) {
  const isHalkali = direction === "toHalkali";
  const label = isHalkali ? "Halkalı" : "Gebze";
  const arrow = isHalkali ? "←" : "→";

  return (
    <View
      style={[styles.badge(isHalkali), compact && styles.compact]}
      accessibilityRole="text"
      accessibilityLabel={`${label} yönü`}
    >
      <Text style={[styles.arrow(isHalkali), compact && styles.arrowCompact]}>
        {arrow}
      </Text>
      <Text style={[styles.label(isHalkali), compact && styles.labelCompact]}>
        {label}
      </Text>
      {destination && routeType && !compact ? (
        <View style={styles.destChip(routeType)}>
          <View style={styles.destDot(routeType)} />
          <Text style={styles.destText(routeType)}>{destination}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  badge: (isHalkali: boolean) => ({
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    gap: 4,
    backgroundColor: isHalkali
      ? theme.colors.halkaliBadgeLight
      : theme.colors.gebzeBadgeLight,
  }),
  compact: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.sm,
  },
  arrow: (isHalkali: boolean) => ({
    fontSize: 14,
    fontWeight: "700" as const,
    color: isHalkali ? theme.colors.halkaliBadge : theme.colors.gebzeBadge,
  }),
  arrowCompact: {
    fontSize: 11,
  },
  label: (isHalkali: boolean) => ({
    fontSize: 14,
    fontWeight: "700" as const,
    color: isHalkali ? theme.colors.halkaliBadge : theme.colors.gebzeBadge,
  }),
  labelCompact: {
    fontSize: 11,
  },
  destChip: (routeType: TrainRouteType) => ({
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 4,
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor:
      routeType === "full"
        ? theme.colors.fullRouteLight
        : theme.colors.shortRouteLight,
  }),
  destDot: (routeType: TrainRouteType) => ({
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor:
      routeType === "full" ? theme.colors.fullRoute : theme.colors.shortRoute,
  }),
  destText: (routeType: TrainRouteType) => ({
    fontSize: 11,
    fontWeight: "600" as const,
    color:
      routeType === "full" ? theme.colors.fullRoute : theme.colors.shortRoute,
  }),
}));
