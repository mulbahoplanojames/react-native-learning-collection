/**
 * Providers Service
 * Handles provider availability and profile operations
 */

import { supabase } from "../supabase/client";
import { ProviderProfile, User } from "../../types";

export interface AvailabilitySlot {
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isAvailable: boolean;
}

export interface ProviderAvailability {
  providerId: string;
  slots: AvailabilitySlot[];
  timezone?: string;
}

class ProvidersService {
  /**
   * Get provider profile
   */
  async getProviderProfile(providerId: string): Promise<ProviderProfile | null> {
    const { data, error } = await supabase
      .from("provider_profiles")
      .select("*")
      .eq("user_id", providerId)
      .single();

    if (error) {
      console.error("Error fetching provider profile:", error);
      return null;
    }

    return this.mapToProviderProfile(data);
  }

  /**
   * Get all providers
   */
  async getProviders(filters?: {
    specialization?: string;
    isVerified?: boolean;
  }): Promise<User[]> {
    let query = supabase
      .from("users")
      .select("*")
      .in("role", ["doctor", "therapist", "coach", "holistic_practitioner"]);

    if (filters?.isVerified !== undefined) {
      // Join with provider_profiles to filter by verification
      query = query.eq("provider_profiles.is_verified", filters.isVerified);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching providers:", error);
      return [];
    }

    return data.map((user) => this.mapToUser(user));
  }

  /**
   * Get provider availability
   */
  async getProviderAvailability(
    providerId: string
  ): Promise<ProviderAvailability | null> {
    const profile = await this.getProviderProfile(providerId);
    if (!profile) return null;

    // Parse availability schedule from JSONB
    const schedule = profile.availabilitySchedule as any;
    const slots: AvailabilitySlot[] = [];

    if (schedule && schedule.slots) {
      slots.push(...schedule.slots);
    }

    return {
      providerId,
      slots,
      timezone: schedule?.timezone || "UTC",
    };
  }

  /**
   * Update provider availability
   */
  async updateProviderAvailability(
    providerId: string,
    availability: ProviderAvailability
  ): Promise<boolean> {
    const { error } = await supabase
      .from("provider_profiles")
      .update({
        availability_schedule: {
          slots: availability.slots,
          timezone: availability.timezone,
        },
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", providerId);

    if (error) {
      console.error("Error updating provider availability:", error);
      return false;
    }

    return true;
  }

  /**
   * Check if provider is available at a specific time
   */
  async isProviderAvailable(
    providerId: string,
    date: Date
  ): Promise<boolean> {
    const availability = await this.getProviderAvailability(providerId);
    if (!availability) return false;

    const dayOfWeek = date.getDay();
    const time = `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const slot = availability.slots.find(
      (s) => s.dayOfWeek === dayOfWeek && s.isAvailable
    );

    if (!slot) return false;

    return time >= slot.startTime && time <= slot.endTime;
  }

  /**
   * Get available time slots for a provider on a specific date
   */
  async getAvailableTimeSlots(
    providerId: string,
    date: Date
  ): Promise<string[]> {
    const availability = await this.getProviderAvailability(providerId);
    if (!availability) return [];

    const dayOfWeek = date.getDay();
    const slot = availability.slots.find(
      (s) => s.dayOfWeek === dayOfWeek && s.isAvailable
    );

    if (!slot) return [];

    // Generate 30-minute slots
    const slots: string[] = [];
    const [startHour, startMin] = slot.startTime.split(":").map(Number);
    const [endHour, endMin] = slot.endTime.split(":").map(Number);

    let currentHour = startHour;
    let currentMin = startMin;

    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMin < endMin)
    ) {
      slots.push(
        `${currentHour.toString().padStart(2, "0")}:${currentMin
          .toString()
          .padStart(2, "0")}`
      );

      currentMin += 30;
      if (currentMin >= 60) {
        currentMin = 0;
        currentHour += 1;
      }
    }

    return slots;
  }

  /**
   * Map database row to ProviderProfile model
   */
  private mapToProviderProfile(data: any): ProviderProfile {
    return {
      id: data.id,
      userId: data.user_id,
      specialization: data.specialization,
      licenseNumber: data.license_number,
      licenseExpiry: data.license_expiry,
      qualifications: data.qualifications || [],
      bio: data.bio,
      consultationFee: data.consultation_fee,
      currency: data.currency,
      availabilitySchedule: data.availability_schedule || {},
      rating: data.rating,
      totalReviews: data.total_reviews,
      isVerified: data.is_verified,
      languages: data.languages || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
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

export const providersService = new ProvidersService();

