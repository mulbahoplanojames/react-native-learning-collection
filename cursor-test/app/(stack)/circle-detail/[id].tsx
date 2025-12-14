/**
 * Circle Detail Screen
 * View circle details, posts, and members
 */

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCommunityCircles } from "../../../src/hooks/data/useCommunityCircles";
import { useCirclePosts } from "../../../src/hooks/data/useCirclePosts";
import { useAuth } from "../../../src/hooks/auth";
import { PostCard } from "../../../src/components/molecules";
import { Button } from "../../../src/components/atoms";
import { colors, spacing } from "../../../src/design-system";

export default function CircleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const { getCircle, join, leave, isMember, isJoining, isLeaving } =
    useCommunityCircles();
  const { getCirclePosts, like, isLiked } = useCirclePosts();

  const { data: circle, isLoading: isLoadingCircle } = getCircle(id);

  const { data: memberStatus } = isMember(id);

  const {
    data: posts,
    isLoading: isLoadingPosts,
    refetch: refetchPosts,
  } = getCirclePosts(id);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchPosts();
    setRefreshing(false);
  };

  const handleJoin = () => {
    join(id, {
      onSuccess: () => {
        // Successfully joined
      },
    });
  };

  const handleLeave = () => {
    leave(id, {
      onSuccess: () => {
        router.back();
      },
    });
  };

  const handleCreatePost = () => {
    router.push(`/create-post?circleId=${id}` as any);
  };

  if (isLoadingCircle) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading circle...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!circle) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Circle not found</Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const isUserMember = memberStatus === true;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Circle Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.name}>{circle.name}</Text>
            {circle.description && (
              <Text style={styles.description}>{circle.description}</Text>
            )}
            <View style={styles.meta}>
              <Text style={styles.metaText}>
                👥 {circle.memberCount} members
              </Text>
              <Text style={styles.metaText}>
                {circle.category.replace("_", " ")}
              </Text>
            </View>
          </View>

          {/* Join/Leave Button */}
          {isUserMember ? (
            <View style={styles.actions}>
              <Button
                title="Create Post"
                onPress={handleCreatePost}
                style={styles.createPostButton}
              />
              <Button
                title="Leave Circle"
                onPress={handleLeave}
                variant="outline"
                style={styles.leaveButton}
                disabled={isLeaving}
              />
            </View>
          ) : (
            <Button
              title="Join Circle"
              onPress={handleJoin}
              style={styles.joinButton}
              disabled={isJoining}
            />
          )}
        </View>

        {/* Posts Section */}
        {isUserMember ? (
          <View style={styles.postsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Posts</Text>
            </View>

            {isLoadingPosts ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading posts...</Text>
              </View>
            ) : posts && posts.length > 0 ? (
              posts.map((post) => {
                const { data: liked } = isLiked(post.id);
                return (
                  <PostCard
                    key={post.id}
                    post={post}
                    isLiked={liked === true}
                    onLike={() => like(post.id)}
                    onPress={() =>
                      router.push(`/post-detail/${post.id}` as any)
                    }
                  />
                );
              })
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No posts yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Be the first to share something with this circle
                </Text>
                <Button
                  title="Create First Post"
                  onPress={handleCreatePost}
                  style={styles.createPostButton}
                />
              </View>
            )}
          </View>
        ) : (
          <View style={styles.joinPrompt}>
            <Text style={styles.joinPromptText}>
              Join this circle to view and create posts
            </Text>
          </View>
        )}
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
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  headerContent: {
    marginBottom: spacing.md,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  meta: {
    flexDirection: "row",
    gap: spacing.md,
  },
  metaText: {
    fontSize: 14,
    color: colors.text.tertiary,
    textTransform: "capitalize",
  },
  actions: {
    gap: spacing.sm,
  },
  joinButton: {
    marginTop: spacing.md,
  },
  createPostButton: {
    marginBottom: spacing.sm,
  },
  leaveButton: {
    marginTop: spacing.sm,
  },
  postsSection: {
    padding: spacing.lg,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text.primary,
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  emptyState: {
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  joinPrompt: {
    padding: spacing.xl,
    alignItems: "center",
  },
  joinPromptText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: "center",
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
