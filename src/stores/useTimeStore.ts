import { useEffect, useRef } from 'react';
import { create } from 'zustand';

interface TimeState {
  now: Date;
  _setNow: (date: Date) => void;
}

export const useTimeStore = create<TimeState>()((set) => ({
  now: new Date(),
  _setNow: (date: Date) => set({ now: date }),
}));

/**
 * Start the global 1-second tick. Call once at the app root.
 * Syncs to second boundary for precise ticking.
 */
export function useTimeTick(): void {
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    const setNow = useTimeStore.getState()._setNow;
    const msUntilNextSecond = 1000 - new Date().getMilliseconds();

    const timeout = setTimeout(() => {
      setNow(new Date());
      intervalRef.current = setInterval(() => {
        setNow(new Date());
      }, 1000);
    }, msUntilNextSecond);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
}

// ─── Selectors ──────────────────────────────────────────────

/**
 * Subscribe to second-level updates. Use for countdown displays and live tracking.
 */
export const useNow = () => useTimeStore((s) => s.now);

/**
 * Subscribe to half-minute updates. Use for station list cards.
 * Returns a key that changes every 30 seconds.
 */
export const useMinuteKey = () =>
  useTimeStore((s) => Math.floor(s.now.getTime() / 30000));

/**
 * Get current Date snapshot without subscribing (for one-time reads).
 */
export const getNow = () => useTimeStore.getState().now;
