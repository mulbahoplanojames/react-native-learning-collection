/**
 * Core Enums for KoloHealth
 */

export enum UserRole {
  PATIENT = "patient",
  DOCTOR = "doctor",
  THERAPIST = "therapist",
  COACH = "coach",
  HOLISTIC_PRACTITIONER = "holistic_practitioner",
  MODERATOR = "moderator",
  ADMIN = "admin",
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
  PREFER_NOT_TO_SAY = "prefer_not_to_say",
}

export enum AppointmentType {
  CONSULTATION = "consultation",
  THERAPY_SESSION = "therapy_session",
  COACHING_SESSION = "coaching_session",
  FOLLOW_UP = "follow_up",
  EMERGENCY = "emergency",
}

export enum AppointmentStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show",
}

export enum RecordType {
  LAB_TEST = "lab_test",
  PRESCRIPTION = "prescription",
  THERAPY_NOTE = "therapy_note",
  DIAGNOSIS = "diagnosis",
  VACCINATION = "vaccination",
  IMAGING = "imaging",
  VITAL_SIGNS = "vital_signs",
  FITNESS_LOG = "fitness_log",
  NUTRITION_LOG = "nutrition_log",
}

export enum Visibility {
  PRIVATE = "private",
  SHARED = "shared",
  PROVIDER_ONLY = "provider_only",
}

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
  PRESCRIPTION = "prescription",
  REPORT = "report",
}

export enum ContentType {
  ARTICLE = "article",
  VIDEO = "video",
  AUDIO = "audio",
  PROGRAM = "program",
  GUIDE = "guide",
}

export enum WellnessCategory {
  MENTAL_HEALTH = "mental_health",
  NUTRITION = "nutrition",
  FITNESS = "fitness",
  MINDFULNESS = "mindfulness",
  SLEEP = "sleep",
  STRESS_MANAGEMENT = "stress_management",
  CHRONIC_DISEASE = "chronic_disease",
  GENERAL = "general",
}

export enum CircleCategory {
  MENTAL_HEALTH = "mental_health",
  CHRONIC_ILLNESS = "chronic_illness",
  FITNESS = "fitness",
  NUTRITION = "nutrition",
  WELLNESS = "wellness",
  SUPPORT_GROUP = "support_group",
  GENERAL = "general",
}

export enum ParticipantRole {
  MEMBER = "member",
  MODERATOR = "moderator",
  ADMIN = "admin",
}

export enum NotificationType {
  APPOINTMENT_REMINDER = "appointment_reminder",
  APPOINTMENT_CONFIRMED = "appointment_confirmed",
  APPOINTMENT_CANCELLED = "appointment_cancelled",
  NEW_MESSAGE = "new_message",
  NEW_COMMENT = "new_comment",
  HEALTH_RECORD_ADDED = "health_record_added",
  COMMUNITY_POST = "community_post",
  WELLNESS_TIP = "wellness_tip",
  SYSTEM = "system",
}

export enum SharingPermission {
  VIEW = "view",
  EDIT = "edit",
  COMMENT = "comment",
}
