/**
 * Centralized design tokens for Sabha.
 * Structured for future sharing with React Native via a shared package.
 */
export const colors = {
  background: {
    primary: "#FAFBFC",
    secondary: "#FFFFFF",
    sidebar: "#FFFFFF",
    card: "#FFFFFF",
  },
  border: "#E8ECF2",
  text: {
    primary: "#111827",
    secondary: "#6B7280",
    muted: "#9CA3AF",
  },
  accent: {
    primary: "#4F46E5",
    primaryHover: "#4338CA",
    primaryMuted: "#EEF2FF",
  },
  semantic: {
    success: "#16A34A",
    successMuted: "#F0FDF4",
    warning: "#F59E0B",
    warningMuted: "#FFFBEB",
    danger: "#DC2626",
    dangerMuted: "#FEF2F2",
    info: "#2563EB",
    infoMuted: "#EFF6FF",
  },
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const radius = {
  button: 12,
  input: 12,
  card: 20,
  dialog: 24,
} as const;

export const fontSize = {
  xs: 12,
  sm: 13,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
} as const;

export const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const shadows = {
  soft: "0 1px 2px 0 rgb(0 0 0 / 0.03), 0 1px 3px 0 rgb(0 0 0 / 0.04)",
  elevated:
    "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 4px 12px 0 rgb(0 0 0 / 0.03)",
} as const;

export const sidebar = {
  widthExpanded: 260,
  widthCollapsed: 72,
} as const;
