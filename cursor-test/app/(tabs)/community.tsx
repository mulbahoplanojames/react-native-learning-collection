/**
 * Community Screen
 * Main screen for community circles
 */

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useCommunityCircles } from "../../src/hooks/data/useCommunityCircles";
import { useAuth } from "../../src/hooks/auth";
import { CircleCard } from "../../src/components/molecules";
import { Input } from "../../src/components/atoms";
import { colors, spacing } from "../../src/design-system";
import { CircleCategory } from "../../src/types/enums";

const CATEGORIES: { id: CircleCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: CircleCategory.MENTAL_HEALTH, label: "Mental Health" },
  { id: CircleCategory.CHRONIC_ILLNESS, label: "Chronic Illness" },
  { id: CircleCategory.NUTRITION, label: "Nutrition" },
  { id: CircleCategory.FITNESS, label: "Fitness" },
  { id: CircleCategory.WELLNESS, label: "Wellness" },
  { id: CircleCategory.SUPPORT_GROUP, label: "Support Group" },
  { id: CircleCategory.GENERAL, label: "General" },
];

export default function CommunityScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<
    CircleCategory | "all"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [showMyCircles, setShowMyCircles] = useState(false);

  const { getCircles, userCircles, join, isJoining } = useCommunityCircles();

  const filters = {
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    searchQuery: searchQuery || undefined,
  };

  const { data: circles, isLoading, refetch } = getCircles(filters);
  const displayCircles = showMyCircles ? userCircles || [] : circles || [];

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleJoinCircle = (circleId: string) => {
    join(circleId, {
      onSuccess: () => {
        // Successfully joined
      },
      onError: (error) => {
        console.error("Error joining circle:", error);
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
        <TouchableOpacity
          onPress={() => router.push("/create-circle" as any)}
          style={styles.createButton}
        >
          <Text style={styles.createButtonText}>+ Create</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Search */}
        <View style={styles.searchSection}>
          <Input
            placeholder="Search circles..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            containerStyle={styles.searchInput}
          />
        </View>

        {/* Toggle My Circles */}
        <View style={styles.toggleSection}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              !showMyCircles && styles.toggleButtonActive,
            ]}
            onPress={() => setShowMyCircles(false)}
          >
            <Text
              style={[
                styles.toggleText,
                !showMyCircles && styles.toggleTextActive,
              ]}
            >
              All Circles
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              showMyCircles && styles.toggleButtonActive,
            ]}
            onPress={() => setShowMyCircles(true)}
          >
            <Text
              style={[
                styles.toggleText,
                showMyCircles && styles.toggleTextActive,
              ]}
            >
              My Circles
            </Text>
          </TouchableOpacity>
        </View>

        {/* Category Filters */}
        <View style={styles.filtersSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.filterChip,
                  selectedCategory === category.id && styles.filterChipActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedCategory === category.id && styles.filterTextActive,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Circles List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {showMyCircles ? "My Circles" : "All Circles"}
            </Text>
            <Text style={styles.circleCount}>
              {displayCircles.length} circles
            </Text>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading circles...</Text>
            </View>
          ) : displayCircles.length > 0 ? (
            displayCircles.map((circle) => (
              <CircleCard
                key={circle.id}
                circle={circle}
                onPress={() =>
                  router.push(`/circle-detail/${circle.id}` as any)
                }
                showJoinButton={!showMyCircles}
                isMember={showMyCircles}
                onJoin={() => handleJoinCircle(circle.id)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {showMyCircles
                  ? "You haven't joined any circles yet"
                  : "No circles found"}
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {showMyCircles
                  ? "Explore and join circles to connect with others"
                  : "Try adjusting your filters or search query"}
              </Text>
              {!showMyCircles && (
                <TouchableOpacity
                  style={styles.createCircleButton}
                  onPress={() => router.push("/create-circle" as any)}
                >
                  <Text style={styles.createCircleButtonText}>
                    Create Circle
                  </Text>
                </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  createButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.primary[600],
  },
  createButtonText: {
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  searchSection: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  searchInput: {
    marginBottom: 0,
  },
  toggleSection: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.secondary,
  },
  toggleTextActive: {
    color: colors.text.inverse,
    fontWeight: "600",
  },
  filtersSection: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[300],
  },
  filterChipActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.secondary,
  },
  filterTextActive: {
    color: colors.text.inverse,
    fontWeight: "600",
  },
  section: {
    padding: spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  circleCount: {
    fontSize: 14,
    color: colors.text.secondary,
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
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  createCircleButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.primary[600],
  },
  createCircleButtonText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: "600",
  },
});
