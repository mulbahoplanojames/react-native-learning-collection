/**
 * User Preferences Service
 * Handles user preferences for content recommendations
 */

import { supabase } from "../supabase/client";
import { WellnessCategory } from "../../types";

export interface UserPreferences {
  userId: string;
  preferredCategories: WellnessCategory[];
  preferredContentTypes: string[];
  interests: string[];
  updatedAt: string;
}

class UserPreferencesService {
  /**
   * Get user preferences
   */
  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    const { data, error } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No preferences found, return default
        return this.getDefaultPreferences(userId);
      }
      console.error("Error fetching user preferences:", error);
      return null;
    }

    return this.mapToUserPreferences(data);
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(
    userId: string,
    preferences: Partial<UserPreferences>
  ): Promise<UserPreferences | null> {
    const existing = await this.getUserPreferences(userId);

    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from("user_preferences")
        .update({
          preferred_categories: preferences.preferredCategories || existing.preferredCategories,
          preferred_content_types: preferences.preferredContentTypes || existing.preferredContentTypes,
          interests: preferences.interests || existing.interests,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        console.error("Error updating user preferences:", error);
        return null;
      }

      return this.mapToUserPreferences(data);
    } else {
      // Create new
      const { data, error } = await supabase
        .from("user_preferences")
        .insert({
          user_id: userId,
          preferred_categories: preferences.preferredCategories || [],
          preferred_content_types: preferences.preferredContentTypes || [],
          interests: preferences.interests || [],
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating user preferences:", error);
        return null;
      }

      return this.mapToUserPreferences(data);
    }
  }

  /**
   * Get default preferences
   */
  private getDefaultPreferences(userId: string): UserPreferences {
    return {
      userId,
      preferredCategories: [],
      preferredContentTypes: [],
      interests: [],
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Map database row to UserPreferences model
   */
  private mapToUserPreferences(data: any): UserPreferences {
    return {
      userId: data.user_id,
      preferredCategories: data.preferred_categories || [],
      preferredContentTypes: data.preferred_content_types || [],
      interests: data.interests || [],
      updatedAt: data.updated_at,
    };
  }
}

export const userPreferencesService = new UserPreferencesService();

