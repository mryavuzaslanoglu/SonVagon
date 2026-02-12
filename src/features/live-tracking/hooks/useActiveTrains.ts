import { useMemo } from "react";
import { Direction, ActiveTrain } from "@/types";
import { useNow } from "@/stores";
import {
  getActiveTrainsByDirection,
  getAllActiveTrains,
} from "../utils/trainPositionCalculator";

/**
 * Hook that returns all active trains for a specific direction.
 * Updates every second via useNow selector.
 */
export function useActiveTrainsByDirection(
  direction: Direction,
): ActiveTrain[] {
  const now = useNow();
  return useMemo(
    () => getActiveTrainsByDirection(direction, now),
    [direction, now],
  );
}

/**
 * Hook that returns ALL active trains (both directions, both route types).
 * Updates every second. Use for the map view.
 */
export function useAllActiveTrains(): ActiveTrain[] {
  const now = useNow();
  return useMemo(() => getAllActiveTrains(now), [now]);
}
