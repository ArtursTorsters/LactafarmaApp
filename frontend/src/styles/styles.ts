import { StyleSheet } from "react-native";
// import { colors, spacing, typography } from './styles';
export const colors = {
  // Primary colors
  primary: "#2E86AB",
  primaryLight: "#A23B72",
  primaryDark: "#F18F01",

  // Status colors
  success: "#28a745",
  warning: "#ffc107",
  error: "#dc3545",
  info: "#17a2b8",

  // Risk level colors
  riskVeryLow: "#28a745",
  riskLow: "#6f42c1",
  riskModerate: "#ffc107",
  riskHigh: "#fd7e14",
  riskVeryHigh: "#dc3545",
  riskUnknown: "#6c757d",

  // Neutral colors
  white: "#FFFFFF",
  black: "#000000",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray800: "#1F2937",
  gray900: "#111827",

  // Medical theme
  medical: {
    background: "#F8FAFC",
    card: "#FFFFFF",
    border: "#E2E8F0",
    text: "#334155",
    textLight: "#64748B",
    accent: "#0EA5E9",
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
} as const;

export const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },
  fontWeights: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// Global StyleSheet for reuse across components
export const globalStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },

  // Container styles
  medicalContainer: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: spacing.xs,
    marginBottom: 64,
    zIndex: 10,
  },
  searchContainer: {
    flex: 1,
    zIndex: 1,
    paddingTop: 0,

  },
  warningContainer: {
    marginTop: spacing.xl,
    zIndex: -1,
  },

  safeArea: {
    flex: 1,
    paddingTop: 28,
    backgroundColor: colors.medical.background,
  },

  contentContainer: {
    flex: 1,
    padding: spacing.md,
  },

  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.medical.background,
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  message: {
    fontSize: typography.fontSizes.base,
    color: colors.gray700,
    textAlign: "center",
    marginVertical: spacing.md,
    lineHeight: typography.lineHeights.normal * typography.fontSizes.base,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
    marginTop: spacing.sm,
  },
  retryText: {
    color: colors.white,
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.medium,
    marginLeft: spacing.sm,
  },

  // Search Component Styles
  searchHeader: {
    paddingBottom: 8,
    zIndex: 10,
  },

  searchHeaderFullscreen: {
    backgroundColor: "white",
    paddingBottom: 8,
    zIndex: 10,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingTop: 10,
  },

  searchLoadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },

  searchErrorContainer: {
    backgroundColor: "#FEF2F2",
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#EF4444",
  },

  searchResultsContainer: {
    flex: 1,
    marginTop: 8,
  },

  searchResultItem: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    minHeight: 60,
  },

  searchResultItemText: {
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },

  searchResultItemCategory: {
    color: "#6B7280",
    fontSize: 12,
    fontStyle: "italic",
  },

  searchEmptyStateContainer: {
    alignItems: "center",
    paddingVertical: 32,
    flex: 1,
    justifyContent: "center",
  },

  searchEmptyStateText: {
    color: "#6B7280",
    textAlign: "center",
    marginTop: -24,
  },

  searchEmptyStateSubtext: {
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 4,
  },

  searchFullScreenEmpty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  searchFullScreenEmptyText: {
    color: "#9CA3AF",
    textAlign: "center",
    fontSize: 12,
    lineHeight: 24,
    marginBottom: 10,
  },

  // Loading Details Overlay
  loadingDetailsOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    backgroundColor: "#ffffffff",
  },

  loadingDetailsContent: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
  },

  loadingDetailsText: {
    marginTop: 12,
    color: "#374151",
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  modalHeader: {
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },

  modalCloseButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },

  modalLoadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalLoadingText: {
    marginTop: 16,
    color: "#64748B",
  },

  modalErrorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  modalErrorTitle: {
    color: "#EF4444",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },

  modalErrorText: {
    textAlign: "center",
    marginBottom: 24,
    color: "#64748B",
  },

  modalErrorButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#3B82F6",
    borderRadius: 8,
  },

  modalErrorButtonText: {
    color: "white",
    fontWeight: "600",
  },

  modalScrollView: {
    flex: 1,
  },

  modalScrollContent: {
    padding: 16,
  },

  modalDrugCardContainer: {
    marginBottom: 24,
  },

  modalBasicInfoCard: {
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  modalDrugTitle: {
    marginBottom: 16,
    color: "#1E293B",
  },

  // modalRiskLevelContainer: {
  //   marginTop: 16,

  // },

  modalRiskLevelLabel: {
    fontWeight: "600",
    marginBottom: 4,
    color: "#475569",
  },

  modalRiskLevelText: {
    color: "#1E293B",
  },

  modalDescriptionLabel: {
    fontWeight: "600",
    marginBottom: 4,
    color: "#000000ff",
    fontSize: 16,
  },

  modalDescriptionText: {
    lineHeight: 22,
    color: "#374151",
  },

  modalRiskInfoCard: {
    // marginBottom: 24,
    // backgroundColor: '#FEF3C7',
    // padding: 16,
    // borderRadius: 12,
    // borderLeftWidth: 4,
    // borderLeftColor: '#F59E0B',
  },

  modalRiskInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  modalRiskInfoTitle: {
    marginLeft: 8,
    color: "#92400E",
    fontSize: 16,
  },

  modalRiskInfoText: {
    lineHeight: 22,
    // color: '#78350F',
  },

  modalAlternativesCard: {
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  modalAlternativesHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  modalAlternativesTitle: {
    marginLeft: 8,
    color: "#047857",
    fontSize: 16,
  },

  modalAlternativeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  modalAlternativeBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
    marginRight: 12,
  },

  modalAlternativeText: {
    flex: 1,
    color: "#374151",
  },

  modalLastUpdateContainer: {
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginTop: 8,
  },

  modalLastUpdateText: {
    fontStyle: "italic",
    color: "#9CA3AF",
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
    fontSize: typography.fontSizes["2xl"],
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
    fontSize: typography.fontSizes.sm,
    color: colors.medical.text,
    // lineHeight: typography.fontSizes.base * typography.lineHeights.normal,
  },

  link: {
    color: colors.primary,
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
    alignItems: "center",
    justifyContent: "center",
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
    alignItems: "center",
    justifyContent: "center",
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

  inputFocused: {
    borderColor: colors.medical.accent,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },

  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
    color: "#333",
  },

  resultItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  resultText: {
    fontSize: 16,
    color: "#333",
  },

  category: {
    fontSize: 12,
    color: "#666",
  },

  noResults: {
    marginTop: 10,
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },

  errorText: {
    color: colors.error,
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
  statusText: {
    color: colors.white,
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.medium,
  },

  // Layout utilities
  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  spaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  centered: {
    justifyContent: "center",
    alignItems: "center",
  },

  // List utilities
  flatListContainer: {
    flex: 1,
  },

  flatListContent: {
    flexGrow: 1,
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

export const modalStyles = StyleSheet.create({
  // Modal Container
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },

  headerTitle: {
    fontSize: typography.fontSizes["2xl"],
    fontWeight: typography.fontWeights.bold,
    color: colors.medical.text,
  },

  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 16,
    fontSize: typography.fontSizes.base,
    color: "#64748B",
  },

  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  errorTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: "#EF4444",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },

  errorText: {
    fontSize: typography.fontSizes.base,
    textAlign: "center",
    marginBottom: 24,
    color: "#64748B",
  },

  errorButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#3B82F6",
    borderRadius: 8,
  },

  errorButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: typography.fontSizes.base,
  },

  // Scroll Content
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: 16,
  },

  // Drug Header Card
  drugHeaderCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    // borderLeftColor: '#F59E0B',

    borderLeftWidth: 4,
  },

  drugName: {
    fontSize: typography.fontSizes["3xl"],
    fontWeight: typography.fontWeights.bold,
    color: colors.gray800,
    marginBottom: spacing.sm,
  },

  // Risk Badge
  riskBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  riskBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginRight: spacing.sm,
  },

  riskDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.sm,
  },

  riskText: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
  },

  category: {
    fontSize: typography.fontSizes.sm,
    color: colors.gray500,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Risk Description
  riskDescriptionContainer: {
    padding: spacing.sm,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },

  riskDescriptionText: {
    fontSize: typography.fontSizes.base,
    lineHeight: 22,
    color: "#000000ff",
  },

  // Description Card
  descriptionCard: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  sectionLabel: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.gray800,
    marginBottom: spacing.sm,
  },

  descriptionText: {
    fontSize: typography.fontSizes.base,
    lineHeight: 24,
    color: colors.gray700,
  },

  // Alternatives Card
  alternativesCard: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  alternativesHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  alternativesTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    marginLeft: spacing.sm,
    color: "#047857",
  },

  alternativeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },

  alternativeBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
    marginRight: spacing.md,
  },

  alternativeText: {
    flex: 1,
    fontSize: typography.fontSizes.base,
    color: colors.gray700,
  },

  // Last Update
  lastUpdateContainer: {
    alignItems: "center",
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginTop: spacing.sm,
  },

  lastUpdateText: {
    fontSize: typography.fontSizes.sm,
    fontStyle: "italic",
    color: "#9CA3AF",
  },
});

export const medicalDisclaimerStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },

  header: {
    flexDirection: "row",
    marginBottom: spacing.sm,
  },

  title: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.gray800,
    flex: 1,
  },

  text: {
    fontSize: typography.fontSizes.xs,
    color: colors.gray700,
    lineHeight: typography.lineHeights.relaxed * typography.fontSizes.sm,
    marginBottom: spacing.md,
  },

  attribution: {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray300,
  },

  attributionTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semibold,
    color: colors.gray800,
    marginBottom: spacing.xs,
  },

  attributionText: {
    fontSize: typography.fontSizes.xs,
    color: colors.gray600,
    marginBottom: 2,
  },
  textSmall: {
       fontSize: typography.fontSizes.xs,
    color: colors.gray700,
    lineHeight: typography.lineHeights.relaxed * typography.fontSizes.sm,
    marginBottom: spacing.md,
  }
});
