/**
 * Authentication Service
 * Handles all authentication operations with Supabase
 */

import { supabase } from "./client";
import { User, UserRole } from "../../types";
import type { AuthError, Session, User as SupabaseUser } from "@supabase/supabase-js";

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: SupabaseUser | null;
  session: Session | null;
  error: AuthError | null;
}

class AuthService {
  /**
   * Sign up a new user
   */
  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone,
            role: data.role,
          },
        },
      });

      if (error) {
        return { user: null, session: null, error };
      }

      // Create user profile in users table
      if (authData.user) {
        await this.createUserProfile(authData.user.id, {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          role: data.role,
        });
      }

      return {
        user: authData.user,
        session: authData.session,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Sign in an existing user
   */
  async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      return {
        user: authData.user,
        session: authData.session,
        error,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  /**
   * Get current session
   */
  async getSession(): Promise<Session | null> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<SupabaseUser | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "kolohealth://reset-password",
    });
    return { error };
  }

  /**
   * Update password
   */
  async updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { error };
  }

  /**
   * Create user profile in users table
   */
  private async createUserProfile(
    userId: string,
    data: {
      email: string;
      firstName: string;
      lastName: string;
      phone?: string;
      role: UserRole;
    }
  ) {
    const { error } = await supabase.from("users").insert({
      id: userId,
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
      role: data.role,
      is_active: true,
    });

    if (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  }
}

export const authService = new AuthService();

