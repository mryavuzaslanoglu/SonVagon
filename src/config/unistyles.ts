import { StyleSheet } from 'react-native-unistyles';
import { lightColors, darkColors } from '@/theme/colors';
import { Spacing, BorderRadius, FontSize, FontWeight, Shadows } from '@/theme/tokens';

const sharedTokens = {
  spacing: Spacing,
  borderRadius: BorderRadius,
  fontSize: FontSize,
  fontWeight: FontWeight,
  shadows: Shadows,
};

const lightTheme = {
  colors: lightColors,
  ...sharedTokens,
};

const darkTheme = {
  colors: darkColors,
  ...sharedTokens,
};

type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  settings: {
    adaptiveThemes: true,
  },
});
