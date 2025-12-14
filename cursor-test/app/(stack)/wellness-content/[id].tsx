/**
 * Wellness Content Detail Screen
 */

import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useWellness } from "../../../src/hooks/data/useWellness";
import { Button } from "../../../src/components/atoms";
import { colors, spacing } from "../../../src/design-system";
import { ContentType } from "../../../src/types/enums";
import { format } from "date-fns";

export default function WellnessContentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getContentById, incrementView } = useWellness();

  const {
    data: content,
    isLoading,
  } = getContentById(id);

  // Increment view count when content is viewed
  useEffect(() => {
    if (content) {
      incrementView(content.id);
    }
  }, [content?.id, incrementView]);

  const getContentTypeLabel = (type: ContentType) => {
    switch (type) {
      case ContentType.ARTICLE:
        return "Article";
      case ContentType.VIDEO:
        return "Video";
      case ContentType.AUDIO:
        return "Audio Guide";
      case ContentType.PROGRAM:
        return "Program";
      case ContentType.GUIDE:
        return "Guide";
      default:
        return "Content";
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "";
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} hours ${mins} minutes` : `${hours} hours`;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading content...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!content) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Content not found</Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView style={styles.scrollView}>
        {content.thumbnailUrl && (
          <Image
            source={{ uri: content.thumbnailUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        )}

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {getContentTypeLabel(content.contentType)}
              </Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {content.category.replace("_", " ")}
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{content.title}</Text>

          {content.description && (
            <Text style={styles.description}>{content.description}</Text>
          )}

          <View style={styles.meta}>
            {content.durationMinutes && (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Duration:</Text>
                <Text style={styles.metaValue}>
                  {formatDuration(content.durationMinutes)}
                </Text>
              </View>
            )}
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Views:</Text>
              <Text style={styles.metaValue}>{content.viewCount}</Text>
            </View>
            {content.publishedAt && (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Published:</Text>
                <Text style={styles.metaValue}>
                  {format(new Date(content.publishedAt), "MMM dd, yyyy")}
                </Text>
              </View>
            )}
          </View>

          {content.tags && content.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              <Text style={styles.tagsLabel}>Tags:</Text>
              <View style={styles.tags}>
                {content.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {content.contentUrl && (
            <View style={styles.contentSection}>
              {content.contentType === ContentType.VIDEO ? (
                <View style={styles.videoPlaceholder}>
                  <Text style={styles.videoPlaceholderText}>
                    Video Player
                  </Text>
                  <Text style={styles.videoPlaceholderSubtext}>
                    {content.contentUrl}
                  </Text>
                  <Button
                    title="Play Video"
                    onPress={() => {
                      // TODO: Open video player
                    }}
                    fullWidth
                    style={styles.playButton}
                  />
                </View>
              ) : content.contentType === ContentType.AUDIO ? (
                <View style={styles.audioPlaceholder}>
                  <Text style={styles.audioPlaceholderText}>
                    Audio Player
                  </Text>
                  <Text style={styles.audioPlaceholderSubtext}>
                    {content.contentUrl}
                  </Text>
                  <Button
                    title="Play Audio"
                    onPress={() => {
                      // TODO: Open audio player
                    }}
                    fullWidth
                    style={styles.playButton}
                  />
                </View>
              ) : (
                <View style={styles.articleContent}>
                  <Text style={styles.articleText}>
                    {content.description || "Article content would be displayed here."}
                  </Text>
                  {content.contentUrl && (
                    <Button
                      title="Read Full Article"
                      onPress={() => {
                        // TODO: Open article in webview or external browser
                      }}
                      variant="outline"
                      fullWidth
                      style={styles.readButton}
                    />
                  )}
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  thumbnail: {
    width: "100%",
    height: 250,
    backgroundColor: colors.neutral[200],
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    backgroundColor: colors.primary[100],
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary[700],
    textTransform: "capitalize",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: spacing.md,
    lineHeight: 36,
  },
  description: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  meta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  metaItem: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  metaLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.secondary,
  },
  metaValue: {
    fontSize: 14,
    color: colors.text.primary,
  },
  tagsContainer: {
    marginBottom: spacing.lg,
  },
  tagsLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    backgroundColor: colors.neutral[100],
  },
  tagText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  contentSection: {
    marginTop: spacing.lg,
  },
  videoPlaceholder: {
    padding: spacing.xl,
    backgroundColor: colors.neutral[100],
    borderRadius: 12,
    alignItems: "center",
  },
  videoPlaceholderText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  videoPlaceholderSubtext: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginBottom: spacing.lg,
  },
  audioPlaceholder: {
    padding: spacing.xl,
    backgroundColor: colors.neutral[100],
    borderRadius: 12,
    alignItems: "center",
  },
  audioPlaceholderText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  audioPlaceholderSubtext: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginBottom: spacing.lg,
  },
  playButton: {
    marginTop: spacing.md,
  },
  articleContent: {
    padding: spacing.lg,
  },
  articleText: {
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  readButton: {
    marginTop: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
});

