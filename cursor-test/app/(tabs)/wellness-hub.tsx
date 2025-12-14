/**
 * Wellness Hub Screen
 * Main screen for wellness content and resources
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
import { useWellness } from "../../src/hooks/data/useWellness";
import { useUserPreferences } from "../../src/hooks/data/useUserPreferences";
import { ContentCard, DailyTipCard } from "../../src/components/molecules";
import { Input } from "../../src/components/atoms";
import { colors, spacing } from "../../src/design-system";
import { WellnessCategory, ContentType } from "../../src/types/enums";
import { getPersonalizedRecommendations } from "../../src/utils/recommendations";

const CATEGORIES: { id: WellnessCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: WellnessCategory.MENTAL_HEALTH, label: "Mental Health" },
  { id: WellnessCategory.NUTRITION, label: "Nutrition" },
  { id: WellnessCategory.FITNESS, label: "Fitness" },
  { id: WellnessCategory.MINDFULNESS, label: "Mindfulness" },
  { id: WellnessCategory.SLEEP, label: "Sleep" },
  { id: WellnessCategory.STRESS_MANAGEMENT, label: "Stress" },
  { id: WellnessCategory.CHRONIC_DISEASE, label: "Chronic Disease" },
  { id: WellnessCategory.GENERAL, label: "General" },
];

const CONTENT_TYPES: { id: ContentType | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: ContentType.ARTICLE, label: "Articles" },
  { id: ContentType.VIDEO, label: "Videos" },
  { id: ContentType.AUDIO, label: "Audio" },
  { id: ContentType.PROGRAM, label: "Programs" },
  { id: ContentType.GUIDE, label: "Guides" },
];

// Daily tips (in production, fetch from API)
const DAILY_TIPS = [
  {
    tip: "Start your day with 5 minutes of deep breathing to reduce stress and improve focus.",
    category: "mindfulness",
  },
  {
    tip: "Stay hydrated! Aim for 8 glasses of water daily to support overall health.",
    category: "nutrition",
  },
  {
    tip: "Take a 10-minute walk after meals to aid digestion and boost energy.",
    category: "fitness",
  },
];

export default function WellnessHubScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<
    WellnessCategory | "all"
  >("all");
  const [selectedContentType, setSelectedContentType] = useState<
    ContentType | "all"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const { preferences } = useUserPreferences();
  const { getWellnessContent, recommendedContent, isLoadingRecommended } =
    useWellness();

  const filters = {
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    contentType:
      selectedContentType !== "all" ? selectedContentType : undefined,
    searchQuery: searchQuery || undefined,
  };

  const { data: content, isLoading, refetch } = getWellnessContent(filters);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const displayContent = content || [];
  const dailyTip = DAILY_TIPS[new Date().getDate() % DAILY_TIPS.length];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Wellness Hub</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Daily Tip */}
        <View style={styles.section}>
          <DailyTipCard
            tip={dailyTip.tip}
            category={dailyTip.category}
            onPress={() => {
              // Navigate to tip details or related content
            }}
          />
        </View>

        {/* Search */}
        <View style={styles.searchSection}>
          <Input
            placeholder="Search wellness content..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            containerStyle={styles.searchInput}
          />
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
                    selectedCategory === category.id &&
                      styles.filterTextActive,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content Type Filters */}
        <View style={styles.filtersSection}>
          <Text style={styles.sectionTitle}>Content Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CONTENT_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.filterChip,
                  selectedContentType === type.id && styles.filterChipActive,
                ]}
                onPress={() => setSelectedContentType(type.id)}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedContentType === type.id &&
                      styles.filterTextActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recommended Content */}
        {recommendedContent && recommendedContent.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recommended for You</Text>
            </View>
            <FlatList
              data={recommendedContent.slice(0, 5)}
              renderItem={({ item }) => (
                <ContentCard
                  content={item}
                  onPress={() =>
                    router.push(`/(stack)/wellness-content/${item.id}`)
                  }
                />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        )}

        {/* All Content */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory !== "all"
                ? CATEGORIES.find((c) => c.id === selectedCategory)?.label
                : "All Content"}
            </Text>
            <Text style={styles.contentCount}>
              {displayContent.length} items
            </Text>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading content...</Text>
            </View>
          ) : displayContent.length > 0 ? (
            displayContent.map((item) => (
              <ContentCard
                key={item.id}
                content={item}
                onPress={() =>
                  router.push(`/(stack)/wellness-content/${item.id}`)
                }
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No content found</Text>
              <Text style={styles.emptyStateSubtext}>
                Try adjusting your filters or search query
              </Text>
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
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  scrollView: {
    flex: 1,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  contentCount: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  searchSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  searchInput: {
    marginBottom: 0,
  },
  filtersSection: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
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
  horizontalList: {
    paddingRight: spacing.lg,
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
  },
});
