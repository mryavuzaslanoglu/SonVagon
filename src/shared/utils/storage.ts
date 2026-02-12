import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({
  id: 'sonvagon-storage',
});

/**
 * Zustand persist middleware storage adapter for MMKV.
 * Synchronous read/write — no FOUC on app launch.
 */
export const zustandMMKVStorage = {
  getItem: (name: string): string | null => {
    return storage.getString(name) ?? null;
  },
  setItem: (name: string, value: string): void => {
    storage.set(name, value);
  },
  removeItem: (name: string): void => {
    storage.remove(name);
  },
};
