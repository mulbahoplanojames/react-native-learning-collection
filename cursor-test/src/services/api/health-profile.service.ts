/**
 * Health Profile Service
 * Handles health profile CRUD operations
 */

import { supabase } from "../supabase/client";
import { HealthProfile } from "../../types";

class HealthProfileService {
  /**
   * Get health profile by user ID
   */
  async getHealthProfile(userId: string): Promise<HealthProfile | null> {
    const { data, error } = await supabase
      .from("health_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No profile found, return null
        return null;
      }
      console.error("Error fetching health profile:", error);
      return null;
    }

    return this.mapToHealthProfile(data);
  }

  /**
   * Create health profile
   */
  async createHealthProfile(
    userId: string,
    data: Partial<HealthProfile>
  ): Promise<HealthProfile | null> {
    const { data: profileData, error } = await supabase
      .from("health_profiles")
      .insert({
        user_id: userId,
        blood_type: data.bloodType,
        allergies: data.allergies || [],
        medical_history: data.medicalHistory || {},
        current_medications: data.currentMedications || [],
        emergency_contact: data.emergencyContact,
        fitness_metrics: data.fitnessMetrics || {},
        lifestyle_habits: data.lifestyleHabits || {},
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating health profile:", error);
      return null;
    }

    return this.mapToHealthProfile(profileData);
  }

  /**
   * Update health profile
   */
  async updateHealthProfile(
    userId: string,
    updates: Partial<HealthProfile>
  ): Promise<HealthProfile | null> {
    const { data, error } = await supabase
      .from("health_profiles")
      .update({
        blood_type: updates.bloodType,
        allergies: updates.allergies,
        medical_history: updates.medicalHistory,
        current_medications: updates.currentMedications,
        emergency_contact: updates.emergencyContact,
        fitness_metrics: updates.fitnessMetrics,
        lifestyle_habits: updates.lifestyleHabits,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating health profile:", error);
      return null;
    }

    return this.mapToHealthProfile(data);
  }

  /**
   * Upsert health profile (create or update)
   */
  async upsertHealthProfile(
    userId: string,
    data: Partial<HealthProfile>
  ): Promise<HealthProfile | null> {
    const existing = await this.getHealthProfile(userId);

    if (existing) {
      return this.updateHealthProfile(userId, data);
    } else {
      return this.createHealthProfile(userId, data);
    }
  }

  /**
   * Map database row to HealthProfile model
   */
  private mapToHealthProfile(data: any): HealthProfile {
    return {
      id: data.id,
      userId: data.user_id,
      bloodType: data.blood_type,
      allergies: data.allergies || [],
      medicalHistory: data.medical_history || {},
      currentMedications: data.current_medications || [],
      emergencyContact: data.emergency_contact,
      fitnessMetrics: data.fitness_metrics || {},
      lifestyleHabits: data.lifestyle_habits || {},
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

export const healthProfileService = new HealthProfileService();
