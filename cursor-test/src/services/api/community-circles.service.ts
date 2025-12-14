/**
 * Community Circles Service
 * Handles community circle operations
 */

import { supabase } from "../supabase/client";
import { CommunityCircle, CircleCategory } from "../../types";

export interface CreateCircleData {
  name: string;
  description?: string;
  category: CircleCategory;
  isPrivate: boolean;
  isAnonymous: boolean;
  createdById: string;
}

export interface CircleFilters {
  category?: CircleCategory;
  isPrivate?: boolean;
  searchQuery?: string;
}

class CommunityCirclesService {
  /**
   * Get all circles
   */
  async getCircles(filters?: CircleFilters): Promise<CommunityCircle[]> {
    let query = supabase
      .from("community_circles")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    if (filters?.isPrivate !== undefined) {
      query = query.eq("is_private", filters.isPrivate);
    }

    if (filters?.searchQuery) {
      query = query.or(
        `name.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching circles:", error);
      return [];
    }

    return data.map((circle) => this.mapToCommunityCircle(circle));
  }

  /**
   * Get circle by ID
   */
  async getCircle(id: string): Promise<CommunityCircle | null> {
    const { data, error } = await supabase
      .from("community_circles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching circle:", error);
      return null;
    }

    return this.mapToCommunityCircle(data);
  }

  /**
   * Get circles user is a member of
   */
  async getUserCircles(userId: string): Promise<CommunityCircle[]> {
    const { data, error } = await supabase
      .from("circle_members")
      .select(
        `
        circle:community_circles(*)
      `
      )
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user circles:", error);
      return [];
    }

    return (
      data
        ?.map((member) => this.mapToCommunityCircle(member.circle))
        .filter(Boolean) || []
    );
  }

  /**
   * Create a new circle
   */
  async createCircle(data: CreateCircleData): Promise<CommunityCircle | null> {
    const { data: circle, error } = await supabase
      .from("community_circles")
      .insert({
        name: data.name,
        description: data.description,
        category: data.category,
        is_private: data.isPrivate,
        is_anonymous: data.isAnonymous,
        created_by_id: data.createdById,
        member_count: 1, // Creator is first member
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating circle:", error);
      return null;
    }

    // Add creator as admin member
    await supabase.from("circle_members").insert({
      circle_id: circle.id,
      user_id: data.createdById,
      role: "admin",
    });

    return this.mapToCommunityCircle(circle);
  }

  /**
   * Update circle
   */
  async updateCircle(
    id: string,
    updates: Partial<CreateCircleData>
  ): Promise<boolean> {
    const updateData: any = {};

    if (updates.name) updateData.name = updates.name;
    if (updates.description !== undefined)
      updateData.description = updates.description;
    if (updates.category) updateData.category = updates.category;
    if (updates.isPrivate !== undefined)
      updateData.is_private = updates.isPrivate;
    if (updates.isAnonymous !== undefined)
      updateData.is_anonymous = updates.isAnonymous;

    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from("community_circles")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Error updating circle:", error);
      return false;
    }

    return true;
  }

  /**
   * Delete circle
   */
  async deleteCircle(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("community_circles")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting circle:", error);
      return false;
    }

    return true;
  }

  /**
   * Join circle
   */
  async joinCircle(circleId: string, userId: string): Promise<boolean> {
    // Check if already a member
    const { data: existing } = await supabase
      .from("circle_members")
      .select("id")
      .eq("circle_id", circleId)
      .eq("user_id", userId)
      .single();

    if (existing) {
      return true; // Already a member
    }

    // Add member
    const { error: memberError } = await supabase
      .from("circle_members")
      .insert({
        circle_id: circleId,
        user_id: userId,
        role: "member",
      });

    if (memberError) {
      console.error("Error joining circle:", memberError);
      return false;
    }

    // Increment member count
    const { data: circle } = await supabase
      .from("community_circles")
      .select("member_count")
      .eq("id", circleId)
      .single();

    if (circle) {
      await supabase
        .from("community_circles")
        .update({ member_count: (circle.member_count || 0) + 1 })
        .eq("id", circleId);
    }

    return true;
  }

  /**
   * Leave circle
   */
  async leaveCircle(circleId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from("circle_members")
      .delete()
      .eq("circle_id", circleId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error leaving circle:", error);
      return false;
    }

    // Decrement member count
    const { data: circle } = await supabase
      .from("community_circles")
      .select("member_count")
      .eq("id", circleId)
      .single();

    if (circle && circle.member_count > 0) {
      await supabase
        .from("community_circles")
        .update({ member_count: circle.member_count - 1 })
        .eq("id", circleId);
    }

    return true;
  }

  /**
   * Check if user is a member
   */
  async isMember(circleId: string, userId: string): Promise<boolean> {
    const { data } = await supabase
      .from("circle_members")
      .select("id")
      .eq("circle_id", circleId)
      .eq("user_id", userId)
      .single();

    return !!data;
  }

  /**
   * Map database row to CommunityCircle model
   */
  private mapToCommunityCircle(data: any): CommunityCircle {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      category: data.category,
      createdById: data.created_by_id,
      isPrivate: data.is_private,
      isAnonymous: data.is_anonymous,
      memberCount: data.member_count || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

export const communityCirclesService = new CommunityCirclesService();
