/**
 * Recommendation Engine
 * Basic content recommendation algorithm
 */

import { WellnessContent, WellnessCategory } from "../types";
import { UserPreferences } from "../services/api/user-preferences.service";

/**
 * Get personalized recommendations based on user preferences
 */
export function getPersonalizedRecommendations(
  allContent: WellnessContent[],
  preferences: UserPreferences | null,
  limit: number = 10
): WellnessContent[] {
  if (!preferences || preferences.preferredCategories.length === 0) {
    // Return popular content if no preferences
    return allContent
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, limit);
  }

  // Score content based on preferences
  const scoredContent = allContent.map((content) => {
    let score = 0;

    // Category match
    if (preferences.preferredCategories.includes(content.category)) {
      score += 10;
    }

    // Content type match
    if (
      preferences.preferredContentTypes.includes(content.contentType)
    ) {
      score += 5;
    }

    // Tag/interest match
    if (preferences.interests.length > 0) {
      const matchingTags = content.tags.filter((tag) =>
        preferences.interests.some((interest) =>
          interest.toLowerCase().includes(tag.toLowerCase())
        )
      );
      score += matchingTags.length * 3;
    }

    // Popularity boost
    score += Math.log(content.viewCount + 1);

    return { content, score };
  });

  // Sort by score and return top results
  return scoredContent
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.content);
}

/**
 * Get content for a specific category
 */
export function getContentForCategory(
  allContent: WellnessContent[],
  category: WellnessCategory
): WellnessContent[] {
  return allContent.filter((content) => content.category === category);
}

/**
 * Get trending content (most viewed in last period)
 */
export function getTrendingContent(
  allContent: WellnessContent[],
  limit: number = 10
): WellnessContent[] {
  // Filter content published in last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return allContent
    .filter((content) => {
      if (!content.publishedAt) return false;
      return new Date(content.publishedAt) >= thirtyDaysAgo;
    })
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, limit);
}

