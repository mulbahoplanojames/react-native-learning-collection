/**
 * Wellness Content Service
 * Handles wellness content operations
 */

import { supabase } from "../supabase/client";
import { WellnessContent, ContentType, WellnessCategory } from "../../types";

export interface CreateWellnessContentData {
  title: string;
  description?: string;
  contentType: ContentType;
  category: WellnessCategory;
  contentUrl?: string;
  thumbnailUrl?: string;
  durationMinutes?: number;
  authorId?: string;
  tags?: string[];
}

export interface WellnessContentFilters {
  category?: WellnessCategory;
  contentType?: ContentType;
  isPublished?: boolean;
  tags?: string[];
  searchQuery?: string;
}

class WellnessService {
  /**
   * Get all wellness content
   */
  async getWellnessContent(
    filters?: WellnessContentFilters
  ): Promise<WellnessContent[]> {
    let query = supabase
      .from("wellness_content")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    if (filters?.contentType) {
      query = query.eq("content_type", filters.contentType);
    }

    if (filters?.tags && filters.tags.length > 0) {
      query = query.contains("tags", filters.tags);
    }

    if (filters?.searchQuery) {
      query = query.or(
        `title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching wellness content:", error);
      return [];
    }

    return data.map((content) => this.mapToWellnessContent(content));
  }

  /**
   * Get wellness content by ID
   */
  async getWellnessContentById(id: string): Promise<WellnessContent | null> {
    const { data, error } = await supabase
      .from("wellness_content")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching wellness content:", error);
      return null;
    }

    return this.mapToWellnessContent(data);
  }

  /**
   * Get recommended content for a user
   */
  async getRecommendedContent(
    userId: string,
    limit: number = 10
  ): Promise<WellnessContent[]> {
    // TODO: Implement recommendation algorithm
    // For now, return popular content
    const { data, error } = await supabase
      .from("wellness_content")
      .select("*")
      .eq("is_published", true)
      .order("view_count", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching recommended content:", error);
      return [];
    }

    return data.map((content) => this.mapToWellnessContent(content));
  }

  /**
   * Get content by category
   */
  async getContentByCategory(
    category: WellnessCategory,
    limit?: number
  ): Promise<WellnessContent[]> {
    let query = supabase
      .from("wellness_content")
      .select("*")
      .eq("category", category)
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching content by category:", error);
      return [];
    }

    return data.map((content) => this.mapToWellnessContent(content));
  }

  /**
   * Increment view count
   */
  async incrementViewCount(id: string): Promise<boolean> {
    const { error } = await supabase.rpc("increment_wellness_view_count", {
      content_id: id,
    });

    if (error) {
      // Fallback: manual update
      const { data } = await supabase
        .from("wellness_content")
        .select("view_count")
        .eq("id", id)
        .single();

      if (data) {
        await supabase
          .from("wellness_content")
          .update({ view_count: (data.view_count || 0) + 1 })
          .eq("id", id);
      }
    }

    return true;
  }

  /**
   * Create wellness content (admin/author only)
   */
  async createWellnessContent(
    data: CreateWellnessContentData
  ): Promise<WellnessContent | null> {
    const { data: content, error } = await supabase
      .from("wellness_content")
      .insert({
        title: data.title,
        description: data.description,
        content_type: data.contentType,
        category: data.category,
        content_url: data.contentUrl,
        thumbnail_url: data.thumbnailUrl,
        duration_minutes: data.durationMinutes,
        author_id: data.authorId,
        tags: data.tags || [],
        is_published: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating wellness content:", error);
      return null;
    }

    return this.mapToWellnessContent(content);
  }

  /**
   * Map database row to WellnessContent model
   */
  private mapToWellnessContent(data: any): WellnessContent {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      contentType: data.content_type,
      category: data.category,
      contentUrl: data.content_url,
      thumbnailUrl: data.thumbnail_url,
      durationMinutes: data.duration_minutes,
      authorId: data.author_id,
      tags: data.tags || [],
      viewCount: data.view_count || 0,
      isPublished: data.is_published,
      publishedAt: data.published_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

export const wellnessService = new WellnessService();

