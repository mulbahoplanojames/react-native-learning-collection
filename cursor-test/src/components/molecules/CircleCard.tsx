/**
 * Circle Card Component
 * Displays community circle information
 */

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CommunityCircle } from "../../types";
import { colors, spacing } from "../../design-system";
import { format } from "date-fns";

interface CircleCardProps {
  circle: CommunityCircle;
  onPress?: () => void;
  showJoinButton?: boolean;
  isMember?: boolean;
  onJoin?: () => void;
}

export function CircleCard({
  circle,
  onPress,
  showJoinButton = false,
  isMember = false,
  onJoin,
}: CircleCardProps) {
  const CardContent = (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>
            {circle.category.replace("_", " ")}
          </Text>
        </View>
        {circle.isPrivate && (
          <View style={styles.privateBadge}>
            <Text style={styles.privateText}>🔒 Private</Text>
          </View>
        )}
        {circle.isAnonymous && (
          <View style={styles.anonymousBadge}>
            <Text style={styles.anonymousText}>👤 Anonymous</Text>
          </View>
        )}
      </View>

      <Text style={styles.name}>{circle.name}</Text>

      {circle.description && (
        <Text style={styles.description} numberOfLines={2}>
          {circle.description}
        </Text>
      )}

      <View style={styles.footer}>
        <Text style={styles.memberCount}>👥 {circle.memberCount} members</Text>
        <Text style={styles.createdDate}>
          {format(new Date(circle.createdAt), "MMM yyyy")}
        </Text>
      </View>

      {showJoinButton && (
        <View style={styles.actions}>
          {isMember ? (
            <View style={styles.memberBadge}>
              <Text style={styles.memberText}>Member</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.joinButton}
              onPress={onJoin}
              activeOpacity={0.7}
            >
              <Text style={styles.joinButtonText}>Join Circle</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
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
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    backgroundColor: colors.primary[100],
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary[700],
    textTransform: "capitalize",
  },
  privateBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    backgroundColor: colors.neutral[100],
  },
  privateText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  anonymousBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    backgroundColor: colors.neutral[100],
  },
  anonymousText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  memberCount: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  createdDate: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  actions: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  joinButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.primary[600],
    alignItems: "center",
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.inverse,
  },
  memberBadge: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.success[100],
    alignItems: "center",
  },
  memberText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.success[700],
  },
});
