/**
 * Appointments Service
 * Handles appointment CRUD operations
 */

import { supabase } from "../supabase/client";
import { Appointment, AppointmentType, AppointmentStatus } from "../../types";

export interface CreateAppointmentData {
  patientId: string;
  providerId: string;
  appointmentType: AppointmentType;
  scheduledAt: string;
  durationMinutes: number;
  notes?: string;
}

export interface UpdateAppointmentData {
  scheduledAt?: string;
  durationMinutes?: number;
  status?: AppointmentStatus;
  notes?: string;
  meetingLink?: string;
}

class AppointmentsService {
  /**
   * Get appointments for a user (as patient or provider)
   */
  async getAppointments(userId: string): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        patient:users!appointments_patient_id_fkey(id, first_name, last_name, avatar_url),
        provider:users!appointments_provider_id_fkey(id, first_name, last_name, avatar_url)
      `)
      .or(`patient_id.eq.${userId},provider_id.eq.${userId}`)
      .order("scheduled_at", { ascending: true });

    if (error) {
      console.error("Error fetching appointments:", error);
      return [];
    }

    return data.map((appointment) => this.mapToAppointment(appointment));
  }

  /**
   * Get appointments by status
   */
  async getAppointmentsByStatus(
    userId: string,
    status: AppointmentStatus
  ): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        patient:users!appointments_patient_id_fkey(id, first_name, last_name, avatar_url),
        provider:users!appointments_provider_id_fkey(id, first_name, last_name, avatar_url)
      `)
      .or(`patient_id.eq.${userId},provider_id.eq.${userId}`)
      .eq("status", status)
      .order("scheduled_at", { ascending: true });

    if (error) {
      console.error("Error fetching appointments by status:", error);
      return [];
    }

    return data.map((appointment) => this.mapToAppointment(appointment));
  }

  /**
   * Get upcoming appointments
   */
  async getUpcomingAppointments(userId: string): Promise<Appointment[]> {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        patient:users!appointments_patient_id_fkey(id, first_name, last_name, avatar_url),
        provider:users!appointments_provider_id_fkey(id, first_name, last_name, avatar_url)
      `)
      .or(`patient_id.eq.${userId},provider_id.eq.${userId}`)
      .gte("scheduled_at", now)
      .in("status", ["pending", "confirmed"])
      .order("scheduled_at", { ascending: true })
      .limit(10);

    if (error) {
      console.error("Error fetching upcoming appointments:", error);
      return [];
    }

    return data.map((appointment) => this.mapToAppointment(appointment));
  }

  /**
   * Get appointment by ID
   */
  async getAppointment(appointmentId: string): Promise<Appointment | null> {
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        patient:users!appointments_patient_id_fkey(id, first_name, last_name, avatar_url),
        provider:users!appointments_provider_id_fkey(id, first_name, last_name, avatar_url)
      `)
      .eq("id", appointmentId)
      .single();

    if (error) {
      console.error("Error fetching appointment:", error);
      return null;
    }

    return this.mapToAppointment(data);
  }

  /**
   * Create appointment
   */
  async createAppointment(
    data: CreateAppointmentData
  ): Promise<Appointment | null> {
    const { data: appointment, error } = await supabase
      .from("appointments")
      .insert({
        patient_id: data.patientId,
        provider_id: data.providerId,
        appointment_type: data.appointmentType,
        scheduled_at: data.scheduledAt,
        duration_minutes: data.durationMinutes,
        notes: data.notes,
        status: "pending",
      })
      .select(`
        *,
        patient:users!appointments_patient_id_fkey(id, first_name, last_name, avatar_url),
        provider:users!appointments_provider_id_fkey(id, first_name, last_name, avatar_url)
      `)
      .single();

    if (error) {
      console.error("Error creating appointment:", error);
      return null;
    }

    return this.mapToAppointment(appointment);
  }

  /**
   * Update appointment
   */
  async updateAppointment(
    appointmentId: string,
    updates: UpdateAppointmentData
  ): Promise<Appointment | null> {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (updates.scheduledAt) updateData.scheduled_at = updates.scheduledAt;
    if (updates.durationMinutes)
      updateData.duration_minutes = updates.durationMinutes;
    if (updates.status) updateData.status = updates.status;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    if (updates.meetingLink) updateData.meeting_link = updates.meetingLink;

    const { data, error } = await supabase
      .from("appointments")
      .update(updateData)
      .eq("id", appointmentId)
      .select(`
        *,
        patient:users!appointments_patient_id_fkey(id, first_name, last_name, avatar_url),
        provider:users!appointments_provider_id_fkey(id, first_name, last_name, avatar_url)
      `)
      .single();

    if (error) {
      console.error("Error updating appointment:", error);
      return null;
    }

    return this.mapToAppointment(data);
  }

  /**
   * Cancel appointment
   */
  async cancelAppointment(appointmentId: string): Promise<boolean> {
    const { error } = await supabase
      .from("appointments")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", appointmentId);

    if (error) {
      console.error("Error cancelling appointment:", error);
      return false;
    }

    return true;
  }

  /**
   * Confirm appointment (provider action)
   */
  async confirmAppointment(appointmentId: string): Promise<boolean> {
    const { error } = await supabase
      .from("appointments")
      .update({
        status: "confirmed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", appointmentId);

    if (error) {
      console.error("Error confirming appointment:", error);
      return false;
    }

    return true;
  }

  /**
   * Get appointments for a date range
   */
  async getAppointmentsByDateRange(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        patient:users!appointments_patient_id_fkey(id, first_name, last_name, avatar_url),
        provider:users!appointments_provider_id_fkey(id, first_name, last_name, avatar_url)
      `)
      .or(`patient_id.eq.${userId},provider_id.eq.${userId}`)
      .gte("scheduled_at", startDate)
      .lte("scheduled_at", endDate)
      .order("scheduled_at", { ascending: true });

    if (error) {
      console.error("Error fetching appointments by date range:", error);
      return [];
    }

    return data.map((appointment) => this.mapToAppointment(appointment));
  }

  /**
   * Map database row to Appointment model
   */
  private mapToAppointment(data: any): Appointment {
    return {
      id: data.id,
      patientId: data.patient_id,
      providerId: data.provider_id,
      appointmentType: data.appointment_type,
      scheduledAt: data.scheduled_at,
      durationMinutes: data.duration_minutes,
      status: data.status,
      notes: data.notes,
      meetingLink: data.meeting_link,
      reminderSent: data.reminder_sent,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      patient: data.patient
        ? {
            id: data.patient.id,
            firstName: data.patient.first_name,
            lastName: data.patient.last_name,
            avatarUrl: data.patient.avatar_url,
          }
        : undefined,
      provider: data.provider
        ? {
            id: data.provider.id,
            firstName: data.provider.first_name,
            lastName: data.provider.last_name,
            avatarUrl: data.provider.avatar_url,
          }
        : undefined,
    };
  }
}

export const appointmentsService = new AppointmentsService();

