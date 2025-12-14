/**
 * Core Domain Models for KoloHealth
 */

import {
  UserRole,
  Gender,
  AppointmentType,
  AppointmentStatus,
  RecordType,
  Visibility,
  MessageType,
} from "./enums";

export interface User {
  id: string;
  email: string;
  phone?: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: Gender;
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthProfile {
  id: string;
  userId: string;
  bloodType?: string;
  allergies: string[];
  medicalHistory: Record<string, unknown>;
  currentMedications: Array<{
    name: string;
    dosage: string;
    frequency: string;
  }>;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  fitnessMetrics: Record<string, unknown>;
  lifestyleHabits: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  specialization: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  qualifications: string[];
  bio?: string;
  consultationFee: number;
  currency: string;
  availabilitySchedule: Record<string, unknown>;
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  languages: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  appointmentType: AppointmentType;
  scheduledAt: string;
  durationMinutes: number;
  status: AppointmentStatus;
  notes?: string;
  meetingLink?: string;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
  // Relations
  patient?: User;
  provider?: User;
}

export interface AppointmentSharing {
  id: string;
  appointmentId: string;
  sharedById: string;
  sharedWithId: string;
  permissions: string[];
  createdAt: string;
}

export interface Chat {
  id: string;
  participant1Id: string;
  participant2Id?: string;
  isGroup: boolean;
  groupName?: string;
  groupDescription?: string;
  groupAvatarUrl?: string;
  createdById?: string;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatParticipant {
  id: string;
  chatId: string;
  userId: string;
  role: string;
  joinedAt: string;
  lastReadAt?: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  contentEncrypted: string;
  contentType: MessageType;
  attachmentUrl?: string;
  isRead: boolean;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  // Relations
  sender?: User;
}

export interface HealthRecord {
  id: string;
  userId: string;
  providerId?: string;
  recordType: RecordType;
  title: string;
  dataEncrypted: Record<string, unknown>;
  fileUrl?: string;
  visibility: Visibility;
  sharedWith: string[];
  createdAt: string;
  updatedAt: string;
  // Relations
  provider?: User;
}

// Form data types for health profile
export interface MedicalHistoryFormData {
  conditions: Array<{
    name: string;
    diagnosedDate?: string;
    status: "active" | "resolved" | "chronic";
    notes?: string;
  }>;
  surgeries: Array<{
    name: string;
    date?: string;
    notes?: string;
  }>;
  familyHistory: Array<{
    condition: string;
    relation: string;
    notes?: string;
  }>;
}

export interface MedicationFormData {
  name: string;
  dosage: string;
  frequency: string;
  startDate?: string;
  endDate?: string;
  prescribedBy?: string;
  notes?: string;
}

export interface EmergencyContactFormData {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface CommunityCircle {
  id: string;
  name: string;
  description?: string;
  category: string;
  createdById: string;
  isPrivate: boolean;
  isAnonymous: boolean;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CircleMember {
  id: string;
  circleId: string;
  userId: string;
  role: string;
  joinedAt: string;
}

export interface WellnessContent {
  id: string;
  title: string;
  description?: string;
  contentType: string;
  category: string;
  contentUrl?: string;
  thumbnailUrl?: string;
  durationMinutes?: number;
  authorId?: string;
  tags: string[];
  viewCount: number;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}
