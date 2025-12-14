/**
 * Appointment Sharing Service
 * Handles appointment sharing across health network
 */

import { supabase } from "../supabase/client";
import { AppointmentSharing, SharingPermission } from "../../types";

export interface CreateSharingData {
  appointmentId: string;
  sharedById: string;
  sharedWithId: string;
  permissions: SharingPermission[];
}

class AppointmentSharingService {
  /**
   * Share appointment with another user
   */
  async shareAppointment(
    data: CreateSharingData
  ): Promise<AppointmentSharing | null> {
    const { data: sharing, error } = await supabase
      .from("appointment_sharing")
      .insert({
        appointment_id: data.appointmentId,
        shared_by_id: data.sharedById,
        shared_with_id: data.sharedWithId,
        permissions: data.permissions,
      })
      .select()
      .single();

    if (error) {
      console.error("Error sharing appointment:", error);
      return null;
    }

    return this.mapToAppointmentSharing(sharing);
  }

  /**
   * Get shared appointments for a user
   */
  async getSharedAppointments(userId: string): Promise<AppointmentSharing[]> {
    const { data, error } = await supabase
      .from("appointment_sharing")
      .select("*")
      .eq("shared_with_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching shared appointments:", error);
      return [];
    }

    return data.map((sharing) => this.mapToAppointmentSharing(sharing));
  }

  /**
   * Get sharing records for an appointment
   */
  async getAppointmentSharing(
    appointmentId: string
  ): Promise<AppointmentSharing[]> {
    const { data, error } = await supabase
      .from("appointment_sharing")
      .select("*")
      .eq("appointment_id", appointmentId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching appointment sharing:", error);
      return [];
    }

    return data.map((sharing) => this.mapToAppointmentSharing(sharing));
  }

  /**
   * Update sharing permissions
   */
  async updateSharingPermissions(
    sharingId: string,
    permissions: SharingPermission[]
  ): Promise<AppointmentSharing | null> {
    const { data, error } = await supabase
      .from("appointment_sharing")
      .update({ permissions })
      .eq("id", sharingId)
      .select()
      .single();

    if (error) {
      console.error("Error updating sharing permissions:", error);
      return null;
    }

    return this.mapToAppointmentSharing(data);
  }

  /**
   * Remove sharing (unshare)
   */
  async unshareAppointment(sharingId: string): Promise<boolean> {
    const { error } = await supabase
      .from("appointment_sharing")
      .delete()
      .eq("id", sharingId);

    if (error) {
      console.error("Error unsharing appointment:", error);
      return false;
    }

    return true;
  }

  /**
   * Map database row to AppointmentSharing model
   */
  private mapToAppointmentSharing(data: any): AppointmentSharing {
    return {
      id: data.id,
      appointmentId: data.appointment_id,
      sharedById: data.shared_by_id,
      sharedWithId: data.shared_with_id,
      permissions: data.permissions || [],
      createdAt: data.created_at,
    };
  }
}

export const appointmentSharingService = new AppointmentSharingService();
