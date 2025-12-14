/**
 * KoloHealth Spacing System
 * Consistent 4px/8px grid system for generous whitespace
 */

export const spacing = {
  // Base spacing unit (4px)
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 40,
  "3xl": 48,
  "4xl": 64,
  "5xl": 80,
  "6xl": 96,
} as const;

// Semantic spacing names
export const semanticSpacing = {
  // Component internal spacing
  componentPadding: spacing.md,
  componentGap: spacing.sm,

  // Layout spacing
  screenPadding: spacing.lg,
  sectionGap: spacing.xl,
  cardPadding: spacing.md,
  cardGap: spacing.sm,

  // Form spacing
  inputPadding: spacing.md,
  inputGap: spacing.sm,
  formGap: spacing.lg,

  // List spacing
  listItemGap: spacing.md,
  listSectionGap: spacing.xl,
} as const;

export type SpacingKey = keyof typeof spacing;
