import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandMMKVStorage } from '@/shared/utils/storage';
import { Direction, BufferTime } from '@/types';

interface DeparturePlannerState {
  direction: Direction;
  bufferMinutes: BufferTime;
  setDirection: (direction: Direction) => void;
  setBufferMinutes: (minutes: BufferTime) => void;
}

export const useDeparturePlannerStore = create<DeparturePlannerState>()(
  persist(
    (set) => ({
      direction: 'toGebze',
      bufferMinutes: 3,
      setDirection: (direction: Direction) => set({ direction }),
      setBufferMinutes: (minutes: BufferTime) => set({ bufferMinutes: minutes }),
    }),
    {
      name: 'sonvagon-departure-planner',
      storage: createJSONStorage(() => zustandMMKVStorage),
    },
  ),
);

// Selectors
export const useDirection = () =>
  useDeparturePlannerStore((s) => s.direction);
export const useSetDirection = () =>
  useDeparturePlannerStore((s) => s.setDirection);
export const useBufferMinutes = () =>
  useDeparturePlannerStore((s) => s.bufferMinutes);
export const useSetBufferMinutes = () =>
  useDeparturePlannerStore((s) => s.setBufferMinutes);
