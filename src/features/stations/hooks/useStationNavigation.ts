import { useCallback } from "react";
import { useRouter } from "expo-router";

/**
 * Shared hook for navigating to station detail screen.
 * Eliminates duplicated router.push logic across screens.
 */
export function useStationNavigation() {
  const router = useRouter();

  const navigateToStation = useCallback(
    (stationId: string) => {
      router.push({ pathname: "/station/[id]", params: { id: stationId } });
    },
    [router],
  );

  return { navigateToStation };
}
