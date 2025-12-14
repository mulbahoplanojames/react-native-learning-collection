/**
 * KoloHealth Theme Provider
 * Centralized theme configuration
 */

import { colors } from "./colors";
import { typography, textStyles } from "./typography";
import { spacing, semanticSpacing } from "./spacing";

export const theme = {
  colors,
  typography,
  textStyles,
  spacing,
  semanticSpacing,
} as const;

export type Theme = typeof theme;

// Theme provider context type
export interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}
