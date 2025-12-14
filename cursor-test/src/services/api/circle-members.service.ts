/**
 * Circle Members Service
 * Handles circle member management
 */

import { supabase } from "../supabase/client";
import { CircleMember, ParticipantRole } from "../../types";

class CircleMembersService {
  /**
   * Get circle members
   */
  async getCircleMembers(circleId: string): Promise<CircleMember[]> {
    const { data, error } = await supabase
      .from("circle_members")
      .select(
        `
        *,
        user:users!circle_members_user_id_fkey(id, first_name, last_name, avatar_url)
      `
      )
      .eq("circle_id", circleId)
      .order("joined_at", { ascending: true });

    if (error) {
      console.error("Error fetching circle members:", error);
      return [];
    }

    return data.map((member) => this.mapToCircleMember(member));
  }

  /**
   * Get user's role in circle
   */
  async getUserRole(
    circleId: string,
    userId: string
  ): Promise<ParticipantRole | null> {
    const { data, error } = await supabase
      .from("circle_members")
      .select("role")
      .eq("circle_id", circleId)
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      return null;
    }

    return data.role as ParticipantRole;
  }

  /**
   * Update member role
   */
  async updateMemberRole(
    circleId: string,
    userId: string,
    role: ParticipantRole
  ): Promise<boolean> {
    const { error } = await supabase
      .from("circle_members")
      .update({ role })
      .eq("circle_id", circleId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error updating member role:", error);
      return false;
    }

    return true;
  }

  /**
   * Remove member from circle
   */
  async removeMember(circleId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from("circle_members")
      .delete()
      .eq("circle_id", circleId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error removing member:", error);
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
   * Map database row to CircleMember model
   */
  private mapToCircleMember(data: any): CircleMember {
    return {
      id: data.id,
      circleId: data.circle_id,
      userId: data.user_id,
      role: data.role,
      joinedAt: data.joined_at,
      user: data.user
        ? {
            id: data.user.id,
            firstName: data.user.first_name,
            lastName: data.user.last_name,
            avatarUrl: data.user.avatar_url,
          }
        : undefined,
    };
  }
}

export const circleMembersService = new CircleMembersService();
