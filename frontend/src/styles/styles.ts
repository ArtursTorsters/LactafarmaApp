
import { StyleSheet } from 'react-native';

export const colors = {
  // Primary colors
  primary: '#2E86AB',
  primaryLight: '#A23B72',
  primaryDark: '#F18F01',

  // Status colors
  success: '#28a745',
  warning: '#ffc107',
  error: '#dc3545',
  info: '#17a2b8',

  // Risk level colors
  riskVeryLow: '#28a745',
  riskLow: '#6f42c1',
  riskModerate: '#ffc107',
  riskHigh: '#fd7e14',
  riskVeryHigh: '#dc3545',
  riskUnknown: '#6c757d',

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Medical theme
  medical: {
    background: '#F8FAFC',
    card: '#FFFFFF',
    border: '#E2E8F0',
    text: '#334155',
    textLight: '#64748B',
    accent: '#0EA5E9',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

export const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// Global StyleSheet for reuse across components
export const globalStyles = StyleSheet.create({
  // Container styles
  medicalContainer: {
    flex: 1,
    backgroundColor: colors.medical.background,
    paddingHorizontal: 10,
      marginTop: spacing.xs,
  },

  safeArea: {
    flex: 1,
    backgroundColor: colors.medical.background,
  },

  contentContainer: {
    flex: 1,
    padding: spacing.md,
  },

  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.medical.background,
  },

  // Card styles
  card: {
    backgroundColor: colors.medical.card,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.medical.border,
  },

  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: colors.medical.border,
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
  },

  // Text styles
  title: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.bold,
    color: colors.medical.text,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },

  subtitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.medical.text,
    marginBottom: spacing.sm,
  },

  bodyText: {
    fontSize: typography.fontSizes.base,
    color: colors.medical.text,
    lineHeight: typography.fontSizes.base * typography.lineHeights.normal,
  },
    link: {
  fontSize: typography.fontSizes.base,
    color: colors.medical.accent,
    lineHeight: typography.fontSizes.base * typography.lineHeights.normal,
    },
  lightText: {
    fontSize: typography.fontSizes.base,
    color: colors.medical.textLight,
    lineHeight: typography.fontSizes.base * typography.lineHeights.normal,
  },

  captionText: {
    fontSize: typography.fontSizes.sm,
    color: colors.medical.textLight,
    lineHeight: typography.fontSizes.sm * typography.lineHeights.normal,
  },

  // Button styles
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  primaryButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.semibold,
  },

  secondaryButton: {
    backgroundColor: colors.medical.card,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: colors.primary,
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.semibold,
  },

  // Input styles
  inputContainer: {
    backgroundColor: colors.medical.card,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.medical.border,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },

  input: {
    fontSize: typography.fontSizes.base,
    color: colors.medical.text,
    paddingVertical: spacing.md,
  },

  inputFocused: {
    borderColor: colors.medical.accent,
  },

  // Risk level badges
  riskBadgeVeryLow: {
    backgroundColor: colors.riskVeryLow,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },

  riskBadgeLow: {
    backgroundColor: colors.riskLow,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },

  riskBadgeModerate: {
    backgroundColor: colors.riskModerate,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },

  riskBadgeHigh: {
    backgroundColor: colors.riskHigh,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },

  riskBadgeVeryHigh: {
    backgroundColor: colors.riskVeryHigh,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },

  riskBadgeUnknown: {
    backgroundColor: colors.riskUnknown,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },

  riskBadgeText: {
    color: colors.white,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semibold,
  },

  // Status styles
  successContainer: {
    backgroundColor: colors.success,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  warningContainer: {
    backgroundColor: colors.warning,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  errorContainer: {
    backgroundColor: colors.error,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  statusText: {
    color: colors.white,
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.medium,
  },

  // Layout utilities
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Spacing utilities
  marginBottom: {
    marginBottom: spacing.md,
  },

  marginTop: {
    marginTop: spacing.md,
  },

  paddingHorizontal: {
    paddingHorizontal: spacing.md,
  },

  paddingVertical: {
    paddingVertical: spacing.md,
  },

  // Shadow utilities
  shadow: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  shadowLarge: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
});
