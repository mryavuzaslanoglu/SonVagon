import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UnistylesRuntime } from 'react-native-unistyles';
import { zustandMMKVStorage } from '@/shared/utils/storage';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setDark: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: false,
      toggleTheme: () => {
        const next = !get().isDark;
        set({ isDark: next });
        UnistylesRuntime.setAdaptiveThemes(false);
        UnistylesRuntime.setTheme(next ? 'dark' : 'light');
      },
      setDark: (isDark: boolean) => {
        set({ isDark });
        UnistylesRuntime.setAdaptiveThemes(false);
        UnistylesRuntime.setTheme(isDark ? 'dark' : 'light');
      },
    }),
    {
      name: 'sonvagon-theme',
      storage: createJSONStorage(() => zustandMMKVStorage),
      onRehydrateStorage: () => (state) => {
        // Sync Unistyles theme on app launch after hydration
        if (state?.isDark) {
          UnistylesRuntime.setAdaptiveThemes(false);
          UnistylesRuntime.setTheme('dark');
        }
      },
    },
  ),
);

// Selectors
export const useIsDark = () => useThemeStore((s) => s.isDark);
export const useToggleTheme = () => useThemeStore((s) => s.toggleTheme);
