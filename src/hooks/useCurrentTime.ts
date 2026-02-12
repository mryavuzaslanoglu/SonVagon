import { useState, useEffect, useRef } from 'react';

/**
 * Single source of truth for current time.
 * Updates every second and provides a Date object.
 * All countdown components should use this instead of their own intervals.
 */
export function useCurrentTime(): Date {
  const [now, setNow] = useState(() => new Date());
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    // Sync to the next second boundary for precise ticking
    const msUntilNextSecond = 1000 - now.getMilliseconds();

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return now;
}
