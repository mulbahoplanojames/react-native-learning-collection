/**
 * Users Service
 * Handles user profile operations
 */

import { supabase } from "../supabase/client";
import { User } from "../../types";

class UsersService {
  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    return this.mapToUser(data);
  }

  /**
   * Get current user profile
   */
  async getCurrentUserProfile(): Promise<User | null> {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return null;
    }

    return this.getUserProfile(authUser.id);
  }

  /**
   * Update user profile
   */
  async updateUserProfile(
    userId: string,
    updates: Partial<User>
  ): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .update({
        first_name: updates.firstName,
        last_name: updates.lastName,
        phone: updates.phone,
        avatar_url: updates.avatarUrl,
        bio: updates.bio,
        date_of_birth: updates.dateOfBirth,
        gender: updates.gender,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating user profile:", error);
      return null;
    }

    return this.mapToUser(data);
  }

  /**
   * Map database row to User model
   */
  private mapToUser(data: any): User {
    return {
      id: data.id,
      email: data.email,
      phone: data.phone,
      role: data.role,
      firstName: data.first_name,
      lastName: data.last_name,
      avatarUrl: data.avatar_url,
      bio: data.bio,
      dateOfBirth: data.date_of_birth,
      gender: data.gender,
      isActive: data.is_active,
      emailVerified: data.email_verified,
      phoneVerified: data.phone_verified,
      lastLoginAt: data.last_login_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

export const usersService = new UsersService();
