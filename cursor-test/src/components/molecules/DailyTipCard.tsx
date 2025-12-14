/**
 * Daily Tip Card Component
 * Displays daily wellness tips
 */

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, spacing } from "../../design-system";

interface DailyTipCardProps {
  tip: string;
  category?: string;
  onPress?: () => void;
}

export function DailyTipCard({ tip, category, onPress }: DailyTipCardProps) {
  const CardContent = (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>💡</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>Daily Tip</Text>
        {category && (
          <Text style={styles.category}>{category}</Text>
        )}
        <Text style={styles.tip}>{tip}</Text>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.warning[50],
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.warning[200],
    marginBottom: spacing.md,
  },
  iconContainer: {
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 32,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.warning[700],
    marginBottom: spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  category: {
    fontSize: 12,
    color: colors.warning[600],
    marginBottom: spacing.xs,
    textTransform: "capitalize",
  },
  tip: {
    fontSize: 15,
    color: colors.text.primary,
    lineHeight: 22,
  },
});

