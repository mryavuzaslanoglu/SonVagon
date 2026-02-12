import { Direction, TrainRouteType } from '@/types';

/**
 * Get the schedule key for a given direction/routeType combo.
 */
export function getScheduleKey(
  direction: Direction,
  routeType: TrainRouteType,
): 'toHalkali' | 'toGebze' | 'shortToHalkali' | 'shortToGebze' {
  if (routeType === 'full') return direction;
  return direction === 'toHalkali' ? 'shortToHalkali' : 'shortToGebze';
}
