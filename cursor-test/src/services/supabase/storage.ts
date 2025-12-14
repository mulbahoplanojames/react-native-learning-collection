/**
 * Storage Service
 * Handles file uploads to Supabase Storage
 */

import { supabase } from "./client";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "../../utils/constants";

export interface UploadFileOptions {
  bucket: string;
  path: string;
  file: File | Blob;
  contentType?: string;
}

class StorageService {
  /**
   * Upload file to Supabase Storage
   */
  async uploadFile(options: UploadFileOptions): Promise<string | null> {
    try {
      // Validate file size
      if (options.file.size > MAX_FILE_SIZE) {
        throw new Error(
          `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`
        );
      }

      // Validate file type
      if (
        options.contentType &&
        !ALLOWED_FILE_TYPES.includes(options.contentType)
      ) {
        throw new Error("File type not allowed");
      }

      const { data, error } = await supabase.storage
        .from(options.bucket)
        .upload(options.path, options.file, {
          contentType: options.contentType,
          upsert: false,
        });

      if (error) {
        console.error("Error uploading file:", error);
        return null;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(options.bucket)
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error: any) {
      console.error("Error in uploadFile:", error);
      return null;
    }
  }

  /**
   * Delete file from Supabase Storage
   */
  async deleteFile(bucket: string, path: string): Promise<boolean> {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error("Error deleting file:", error);
      return false;
    }

    return true;
  }

  /**
   * Get file URL
   */
  getFileUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  /**
   * Get signed URL (for private files)
   */
  async getSignedUrl(
    bucket: string,
    path: string,
    expiresIn: number = 3600
  ): Promise<string | null> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      console.error("Error creating signed URL:", error);
      return null;
    }

    return data.signedUrl;
  }
}

export const storageService = new StorageService();
