import { MIDNIGHT_THRESHOLD_MINUTES, MINUTES_IN_DAY } from '@/constants/time';

/**
 * Parse "HH:MM" string to total minutes since midnight.
 * Handles times past midnight (e.g., "00:30" after "23:50" is treated as next day = 1470 min).
 */
export function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Convert total minutes to "HH:MM" string.
 */
export function minutesToTimeString(totalMinutes: number): string {
  const normalized = ((totalMinutes % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Get current time as total minutes since midnight.
 */
export function getCurrentTimeMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

/**
 * Get current seconds component.
 */
export function getCurrentSeconds(): number {
  return new Date().getSeconds();
}

/**
 * Format remaining milliseconds to MM:SS display string.
 */
export function formatCountdown(remainingMs: number): { minutes: number; seconds: number; display: string } {
  if (remainingMs <= 0) {
    return { minutes: 0, seconds: 0, display: '00:00' };
  }
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  return { minutes, seconds, display };
}

/**
 * Format "HH:MM" time string for Turkish display.
 */
export function formatTimeDisplay(time: string): string {
  return time;
}

/**
 * Check if timeA is "after" timeB, handling midnight crossover.
 * Used for last train times that go past midnight (e.g., "00:30").
 */
export function isAfterMidnight(time: string): boolean {
  const minutes = parseTimeToMinutes(time);
  return minutes < MIDNIGHT_THRESHOLD_MINUTES; // Before 05:00 is considered "after midnight" (next day)
}
