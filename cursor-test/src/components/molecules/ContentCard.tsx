/**
 * Content Card Component
 * Displays wellness content (article, video, audio, etc.)
 */

import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { WellnessContent, ContentType } from "../../types";
import { colors, spacing } from "../../design-system";
import { format } from "date-fns";

interface ContentCardProps {
  content: WellnessContent;
  onPress?: () => void;
  showCategory?: boolean;
}

export function ContentCard({
  content,
  onPress,
  showCategory = true,
}: ContentCardProps) {
  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case "article":
        return "📄";
      case "video":
        return "🎥";
      case "audio":
        return "🎧";
      case "program":
        return "📚";
      case "guide":
        return "📖";
      default:
        return "📄";
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "";
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const CardContent = (
    <View style={styles.card}>
      {content.thumbnailUrl ? (
        <Image
          source={{ uri: content.thumbnailUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.thumbnailPlaceholder}>
          <Text style={styles.thumbnailIcon}>
            {getContentTypeIcon(content.contentType)}
          </Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.typeIcon}>
            {getContentTypeIcon(content.contentType)}
          </Text>
          {showCategory && (
            <Text style={styles.category}>
              {content.category.replace("_", " ")}
            </Text>
          )}
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {content.title}
        </Text>

        {content.description && (
          <Text style={styles.description} numberOfLines={2}>
            {content.description}
          </Text>
        )}

        <View style={styles.footer}>
          {content.durationMinutes && (
            <Text style={styles.duration}>
              {formatDuration(content.durationMinutes)}
            </Text>
          )}
          <Text style={styles.views}>{content.viewCount} views</Text>
          {content.publishedAt && (
            <Text style={styles.date}>
              {format(new Date(content.publishedAt), "MMM dd")}
            </Text>
          )}
        </View>
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
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  thumbnail: {
    width: "100%",
    height: 200,
    backgroundColor: colors.neutral[200],
  },
  thumbnailPlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: colors.primary[100],
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnailIcon: {
    fontSize: 48,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  typeIcon: {
    fontSize: 16,
  },
  category: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.primary[600],
    textTransform: "capitalize",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  duration: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  views: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  date: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginLeft: "auto",
  },
});

