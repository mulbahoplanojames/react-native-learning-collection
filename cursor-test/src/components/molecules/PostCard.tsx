/**
 * Post Card Component
 * Displays community circle posts
 */

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CirclePost } from "../../types";
import { colors, spacing } from "../../design-system";
import { format } from "date-fns";

interface PostCardProps {
  post: CirclePost;
  onPress?: () => void;
  onLike?: () => void;
  isLiked?: boolean;
  showActions?: boolean;
}

export function PostCard({
  post,
  onPress,
  onLike,
  isLiked = false,
  showActions = true,
}: PostCardProps) {
  const authorName = post.isAnonymous
    ? "Anonymous"
    : post.author
    ? `${post.author.firstName} ${post.author.lastName}`
    : "Unknown";

  const CardContent = (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {post.isAnonymous ? "?" : authorName[0]?.toUpperCase() || "U"}
          </Text>
        </View>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{authorName}</Text>
          <Text style={styles.postDate}>
            {format(new Date(post.createdAt), "MMM dd, yyyy • h:mm a")}
          </Text>
        </View>
      </View>

      <Text style={styles.content}>{post.content}</Text>

      {post.attachmentUrl && (
        <View style={styles.attachmentContainer}>
          <Text style={styles.attachmentText}>📎 Attachment</Text>
        </View>
      )}

      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onLike}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>{isLiked ? "❤️" : "🤍"}</Text>
            <Text
              style={[styles.actionText, isLiked && styles.actionTextActive]}
            >
              {post.likeCount || 0}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={onPress}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>
              {post.commentCount || 0} comments
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (onPress && !showActions) {
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
    alignItems: "center",
    marginBottom: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[500],
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  avatarText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: "600",
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  postDate: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  content: {
    fontSize: 15,
    color: colors.text.primary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  attachmentContainer: {
    padding: spacing.sm,
    backgroundColor: colors.neutral[100],
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  attachmentText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  actionIcon: {
    fontSize: 18,
  },
  actionText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  actionTextActive: {
    color: colors.primary[600],
    fontWeight: "600",
  },
});
