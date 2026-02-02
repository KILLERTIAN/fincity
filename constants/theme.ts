/**
 * Kid-friendly financial game theme with vibrant gradients and playful colors
 */

import { Platform } from 'react-native';

const tintColorLight = '#FF6B6B';
const tintColorDark = '#4ECDC4';

export const Colors = {
  light: {
    text: '#2C3E50',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#7F8C8D',
    tabIconDefault: '#BDC3C7',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECF0F1',
    background: '#2C3E50',
    tint: tintColorDark,
    icon: '#95A5A6',
    tabIconDefault: '#7F8C8D',
    tabIconSelected: tintColorDark,
  },
};

export const GameColors = {
  // Duolingo-inspired Palette
  primary: '#58CC02', // Duo Green
  primaryDark: '#46A302',
  secondary: '#1CB0F6', // Duo Blue
  secondaryDark: '#1899D6',
  warning: '#FFC800', // Duo Yellow
  warningDark: '#E5A400',
  error: '#FF4B4B',   // Duo Red
  errorDark: '#D33131',
  orange: '#FF9600',  // Duo Orange
  orangeDark: '#E58700',
  purple: '#CE82FF',  // Duo Purple
  purpleDark: '#AF69EF',

  // Headspace-inspired Palette
  background: '#FFF4E0', // Soft peach/cream
  backgroundLight: '#FFFAF5', // Even lighter background
  card: '#FFFFFF',
  cardBackground: '#FFFFFF',
  text: '#3C3C3C',
  textPrimary: '#3C3C3C',
  textSecondary: '#777777',
  textLight: '#AFAFAF',

  // Progress/Money
  moneyGreen: '#58CC02',
  moneyYellow: '#FFC800',
  moneyRed: '#FF4B4B',

  // Status colors
  online: '#58CC02',
  offline: '#AFAFAF',

  // UI colors
  border: '#E5E5E5',
  shadow: '#000000',
  white: '#FFFFFF',

  // Legacy mappings for compatibility
  buttonPrimary: '#58CC02',
  buttonSecondary: '#1CB0F6',
  buttonSuccess: '#58CC02',
  buttonWarning: '#FFC800',
  gradientStart: '#58CC02',
  gradientMiddle: '#1CB0F6',
  gradientEnd: '#CE82FF',
  textWhite: '#FFFFFF',
  cardShadow: 'rgba(0,0,0,0.1)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const BorderRadius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 36,
  full: 9999,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 36,
  display: 48,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    rounded: 'SF Pro Rounded',
    mono: 'Menlo',
  },
  default: {
    sans: 'sans-serif',
    serif: 'serif',
    rounded: 'sans-serif',
    mono: 'monospace',
  },
  web: {
    sans: "DIN Next Rounded, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'DIN Next Rounded', 'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});