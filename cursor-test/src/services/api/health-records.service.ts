/**
 * Health Records Service
 * Handles health records CRUD operations
 */

import { supabase } from "../supabase/client";
import { HealthRecord, RecordType, Visibility } from "../../types";

export interface CreateHealthRecordData {
  userId: string;
  providerId?: string;
  recordType: RecordType;
  title: string;
  data: Record<string, unknown>;
  fileUrl?: string;
  visibility: Visibility;
  sharedWith?: string[];
}

class HealthRecordsService {
  /**
   * Get health records for a user
   */
  async getHealthRecords(userId: string): Promise<HealthRecord[]> {
    const { data, error } = await supabase
      .from("health_records")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching health records:", error);
      return [];
    }

    return data.map((record) => this.mapToHealthRecord(record));
  }

  /**
   * Get health record by ID
   */
  async getHealthRecord(recordId: string): Promise<HealthRecord | null> {
    const { data, error } = await supabase
      .from("health_records")
      .select("*")
      .eq("id", recordId)
      .single();

    if (error) {
      console.error("Error fetching health record:", error);
      return null;
    }

    return this.mapToHealthRecord(data);
  }

  /**
   * Create health record
   */
  async createHealthRecord(
    recordData: CreateHealthRecordData
  ): Promise<HealthRecord | null> {
    // TODO: Encrypt sensitive data before storing
    const encryptedData = recordData.data; // Placeholder - implement encryption

    const { data, error } = await supabase
      .from("health_records")
      .insert({
        user_id: recordData.userId,
        provider_id: recordData.providerId,
        record_type: recordData.recordType,
        title: recordData.title,
        data_encrypted: encryptedData,
        file_url: recordData.fileUrl,
        visibility: recordData.visibility,
        shared_with: recordData.sharedWith || [],
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating health record:", error);
      return null;
    }

    return this.mapToHealthRecord(data);
  }

  /**
   * Update health record
   */
  async updateHealthRecord(
    recordId: string,
    updates: Partial<CreateHealthRecordData>
  ): Promise<HealthRecord | null> {
    const updateData: any = {};

    if (updates.title) updateData.title = updates.title;
    if (updates.data) {
      // TODO: Encrypt before storing
      updateData.data_encrypted = updates.data;
    }
    if (updates.fileUrl) updateData.file_url = updates.fileUrl;
    if (updates.visibility) updateData.visibility = updates.visibility;
    if (updates.sharedWith) updateData.shared_with = updates.sharedWith;

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("health_records")
      .update(updateData)
      .eq("id", recordId)
      .select()
      .single();

    if (error) {
      console.error("Error updating health record:", error);
      return null;
    }

    return this.mapToHealthRecord(data);
  }

  /**
   * Delete health record
   */
  async deleteHealthRecord(recordId: string): Promise<boolean> {
    const { error } = await supabase
      .from("health_records")
      .delete()
      .eq("id", recordId);

    if (error) {
      console.error("Error deleting health record:", error);
      return false;
    }

    return true;
  }

  /**
   * Get health records by type
   */
  async getHealthRecordsByType(
    userId: string,
    recordType: RecordType
  ): Promise<HealthRecord[]> {
    const { data, error } = await supabase
      .from("health_records")
      .select("*")
      .eq("user_id", userId)
      .eq("record_type", recordType)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching health records by type:", error);
      return [];
    }

    return data.map((record) => this.mapToHealthRecord(record));
  }

  /**
   * Map database row to HealthRecord model
   */
  private mapToHealthRecord(data: any): HealthRecord {
    return {
      id: data.id,
      userId: data.user_id,
      providerId: data.provider_id,
      recordType: data.record_type,
      title: data.title,
      dataEncrypted: data.data_encrypted || {},
      fileUrl: data.file_url,
      visibility: data.visibility,
      sharedWith: data.shared_with || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      provider: data.provider,
    };
  }
}

export const healthRecordsService = new HealthRecordsService();
