/**
 * Export Utilities
 * Functions for exporting health profile data
 */

import { HealthProfile, HealthRecord } from "../types";
import { format } from "date-fns";

export interface ExportData {
  profile: HealthProfile;
  records: HealthRecord[];
  exportedAt: string;
}

/**
 * Export health profile as JSON
 */
export function exportHealthProfileAsJSON(
  profile: HealthProfile,
  records: HealthRecord[]
): string {
  const exportData: ExportData = {
    profile,
    records,
    exportedAt: new Date().toISOString(),
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Export health profile as text
 */
export function exportHealthProfileAsText(
  profile: HealthProfile,
  records: HealthRecord[]
): string {
  let text = "KOLOHEALTH - HEALTH PROFILE EXPORT\n";
  text += "=" .repeat(50) + "\n\n";
  text += `Exported: ${format(new Date(), "PPpp")}\n\n`;

  // Basic Information
  text += "BASIC INFORMATION\n";
  text += "-".repeat(50) + "\n";
  text += `Blood Type: ${profile.bloodType || "Not set"}\n`;
  text += `Allergies: ${profile.allergies.length > 0 ? profile.allergies.join(", ") : "None"}\n\n`;

  // Emergency Contact
  if (profile.emergencyContact) {
    text += "EMERGENCY CONTACT\n";
    text += "-".repeat(50) + "\n";
    text += `Name: ${profile.emergencyContact.name}\n`;
    text += `Relationship: ${profile.emergencyContact.relationship}\n`;
    text += `Phone: ${profile.emergencyContact.phone}\n`;
    if (profile.emergencyContact.email) {
      text += `Email: ${profile.emergencyContact.email}\n`;
    }
    text += "\n";
  }

  // Medications
  if (profile.currentMedications.length > 0) {
    text += "CURRENT MEDICATIONS\n";
    text += "-".repeat(50) + "\n";
    profile.currentMedications.forEach((med, index) => {
      text += `${index + 1}. ${med.name}\n`;
      text += `   Dosage: ${med.dosage}\n`;
      text += `   Frequency: ${med.frequency}\n`;
    });
    text += "\n";
  }

  // Health Records
  if (records.length > 0) {
    text += "HEALTH RECORDS\n";
    text += "-".repeat(50) + "\n";
    records.forEach((record, index) => {
      text += `${index + 1}. ${record.title}\n`;
      text += `   Type: ${record.recordType}\n`;
      text += `   Date: ${format(new Date(record.createdAt), "PP")}\n`;
    });
  }

  return text;
}

/**
 * Download file (for web/React Native)
 */
export async function downloadFile(
  content: string,
  filename: string,
  mimeType: string = "text/plain"
): Promise<void> {
  // For React Native, you would use a library like react-native-fs
  // or expo-file-system to save the file
  // This is a placeholder implementation

  if (typeof window !== "undefined") {
    // Web implementation
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    // React Native - would need expo-file-system or similar
    console.log("Download functionality requires file system access");
  }
}

