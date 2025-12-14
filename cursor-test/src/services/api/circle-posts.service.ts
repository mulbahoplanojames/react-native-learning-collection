/**
 * Circle Posts Service
 * Handles community circle posts and discussions
 */

import { supabase } from "../supabase/client";
import { CirclePost, Visibility } from "../../types";

export interface CreatePostData {
  circleId: string;
  authorId: string;
  content: string;
  visibility: Visibility;
  isAnonymous?: boolean;
  attachmentUrl?: string;
}

class CirclePostsService {
  /**
   * Get posts for a circle
   */
  async getCirclePosts(
    circleId: string,
    limit: number = 50
  ): Promise<CirclePost[]> {
    const { data, error } = await supabase
      .from("circle_posts")
      .select(
        `
        *,
        author:users!circle_posts_author_id_fkey(id, first_name, last_name, avatar_url)
      `
      )
      .eq("circle_id", circleId)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching circle posts:", error);
      return [];
    }

    return data.map((post) => this.mapToCirclePost(post));
  }

  /**
   * Get post by ID
   */
  async getPost(id: string): Promise<CirclePost | null> {
    const { data, error } = await supabase
      .from("circle_posts")
      .select(
        `
        *,
        author:users!circle_posts_author_id_fkey(id, first_name, last_name, avatar_url)
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching post:", error);
      return null;
    }

    return this.mapToCirclePost(data);
  }

  /**
   * Create a new post
   */
  async createPost(data: CreatePostData): Promise<CirclePost | null> {
    const { data: post, error } = await supabase
      .from("circle_posts")
      .insert({
        circle_id: data.circleId,
        author_id: data.authorId,
        content: data.content,
        visibility: data.visibility,
        is_anonymous: data.isAnonymous || false,
        attachment_url: data.attachmentUrl,
        like_count: 0,
        comment_count: 0,
      })
      .select(
        `
        *,
        author:users!circle_posts_author_id_fkey(id, first_name, last_name, avatar_url)
      `
      )
      .single();

    if (error) {
      console.error("Error creating post:", error);
      return null;
    }

    return this.mapToCirclePost(post);
  }

  /**
   * Update post
   */
  async updatePost(
    id: string,
    updates: { content?: string; visibility?: Visibility }
  ): Promise<boolean> {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (updates.content) updateData.content = updates.content;
    if (updates.visibility) updateData.visibility = updates.visibility;

    const { error } = await supabase
      .from("circle_posts")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Error updating post:", error);
      return false;
    }

    return true;
  }

  /**
   * Delete post (soft delete)
   */
  async deletePost(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("circle_posts")
      .update({
        is_deleted: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Error deleting post:", error);
      return false;
    }

    return true;
  }

  /**
   * Like post
   */
  async likePost(postId: string, userId: string): Promise<boolean> {
    // Check if already liked
    const { data: existing } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .single();

    if (existing) {
      // Unlike
      await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", userId);

      // Decrement like count
      const { data: post } = await supabase
        .from("circle_posts")
        .select("like_count")
        .eq("id", postId)
        .single();

      if (post) {
        await supabase
          .from("circle_posts")
          .update({ like_count: Math.max(0, (post.like_count || 0) - 1) })
          .eq("id", postId);
      }

      return true;
    }

    // Like
    const { error } = await supabase.from("post_likes").insert({
      post_id: postId,
      user_id: userId,
    });

    if (error) {
      console.error("Error liking post:", error);
      return false;
    }

    // Increment like count
    const { data: post } = await supabase
      .from("circle_posts")
      .select("like_count")
      .eq("id", postId)
      .single();

    if (post) {
      await supabase
        .from("circle_posts")
        .update({ like_count: (post.like_count || 0) + 1 })
        .eq("id", postId);
    }

    return true;
  }

  /**
   * Check if user liked post
   */
  async isLiked(postId: string, userId: string): Promise<boolean> {
    const { data } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .single();

    return !!data;
  }

  /**
   * Map database row to CirclePost model
   */
  private mapToCirclePost(data: any): CirclePost {
    return {
      id: data.id,
      circleId: data.circle_id,
      authorId: data.author_id,
      content: data.content,
      visibility: data.visibility,
      isAnonymous: data.is_anonymous,
      attachmentUrl: data.attachment_url,
      likeCount: data.like_count || 0,
      commentCount: data.comment_count || 0,
      isDeleted: data.is_deleted,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      author: data.author
        ? {
            id: data.author.id,
            firstName: data.author.first_name,
            lastName: data.author.last_name,
            avatarUrl: data.author.avatar_url,
          }
        : undefined,
    };
  }
}

export const circlePostsService = new CirclePostsService();
