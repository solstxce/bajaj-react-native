import { Platform, ViewStyle } from "react-native";

export const headingFont = Platform.select({
  ios: "SF Pro Display",
  android: "sans-serif",
  default: "System",
});

export const bodyFont = Platform.select({
  ios: "SF Pro Text",
  android: "sans-serif",
  default: "System",
});

export const colors = {
  brand: "#005BAC",
  brandDeep: "#003D7A",
  brandSecondary: "#008DD2",
  brandLight: "#E6F3FF",

  text: "#0F172A",
  textSecondary: "#64748B",
  border: "rgba(0,91,172,0.08)",

  card: "#FFFFFF",
  cardGlass: "rgba(255,255,255,0.94)",
  bg: "#F5F7FA",
  bgWhite: "#FFFFFF",
  bgGray: "#EEF2F7",

  success: "#12B76A",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#008DD2",

  white: "#FFFFFF",
  black: "#000000",

  slate50: "#F8FAFC",
  slate100: "#F1F5F9",
  slate200: "#E2E8F0",
  slate300: "#CBD5E1",
  slate400: "#94A3B8",
  slate500: "#64748B",
  slate600: "#475569",
  slate700: "#334155",
  slate800: "#1E293B",
  slate900: "#0F172A",

  emerald50: "#ECFDF5",
  emerald200: "#A7F3D0",
  emerald500: "#10B981",
  emerald600: "#059669",
  emerald700: "#047857",

  rose50: "#FFF1F2",
  rose200: "#FECDD3",
  rose500: "#F43F5E",
  rose600: "#E11D48",
  rose700: "#BE123C",

  sky50: "#F0F9FF",
  sky200: "#BAE6FD",
  sky500: "#0EA5E9",
  sky600: "#0284C7",
  sky700: "#0369A1",

  amber50: "#FFFBEB",
  amber200: "#FDE68A",
  amber500: "#F59E0B",
  amber700: "#B45309",

  orange50: "#FFF7ED",
  orange200: "#FED7AA",
  orange500: "#F97316",
  orange600: "#EA580C",
  orange700: "#C2410C",

  red50: "#FEF2F2",
  red500: "#EF4444",
  red700: "#B91C1C",
};

export const spacing = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 20,
  "3xl": 24,
  "4xl": 32,
  "5xl": 40,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  "2xl": 18,
  "3xl": 20,
  "4xl": 24,
  "5xl": 26,
  "6xl": 28,
  full: 9999,
};

export const fontSize = {
  xs: 11,
  sm: 12,
  base: 13,
  md: 14,
  lg: 15,
  xl: 16,
  "2xl": 17,
  "3xl": 19,
  "4xl": 22,
  "5xl": 28,
};

export const shadows: Record<string, ViewStyle> = {
  card: Platform.select({
    web: { boxShadow: "0 10px 24px rgba(0,91,172,0.04)" },
    default: { shadowColor: "rgba(0,91,172,0.04)", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 1, shadowRadius: 24, elevation: 4 },
  }),
  shell: Platform.select({
    web: { boxShadow: "0 20px 60px rgba(0,91,172,0.06)" },
    default: { shadowColor: "rgba(0,91,172,0.06)", shadowOffset: { width: 0, height: 20 }, shadowOpacity: 1, shadowRadius: 60, elevation: 8 },
  }),
  modal: Platform.select({
    web: { boxShadow: "0 8px 30px rgba(0,0,0,0.15)" },
    default: { shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 30, elevation: 12 },
  }),
};
