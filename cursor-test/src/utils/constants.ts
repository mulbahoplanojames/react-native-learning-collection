/**
 * App Constants
 */

import { UserRole } from "../types/enums";

// App Info
export const APP_NAME = "KoloHealth";
export const APP_VERSION = "1.0.0";

// API Configuration
export const API_TIMEOUT = 30000; // 30 seconds

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// User Roles
export const PROVIDER_ROLES = [
  UserRole.DOCTOR,
  UserRole.THERAPIST,
  UserRole.COACH,
  UserRole.HOLISTIC_PRACTITIONER,
] as const;

export const SEEKER_ROLES = [UserRole.PATIENT] as const;

// Role display names
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  [UserRole.PATIENT]: "Patient",
  [UserRole.DOCTOR]: "Doctor",
  [UserRole.THERAPIST]: "Therapist",
  [UserRole.COACH]: "Coach",
  [UserRole.HOLISTIC_PRACTITIONER]: "Holistic Practitioner",
  [UserRole.MODERATOR]: "Moderator",
  [UserRole.ADMIN]: "Administrator",
};

// Role descriptions
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  [UserRole.PATIENT]:
    "Access your health records, book appointments, and connect with providers",
  [UserRole.DOCTOR]:
    "Manage patient appointments, update health records, and provide consultations",
  [UserRole.THERAPIST]:
    "Conduct therapy sessions, maintain session notes, and support patient wellness",
  [UserRole.COACH]: "Guide patients through fitness and wellness programs",
  [UserRole.HOLISTIC_PRACTITIONER]:
    "Provide alternative and complementary health services",
  [UserRole.MODERATOR]: "Moderate community discussions and content",
  [UserRole.ADMIN]: "Manage platform settings and user accounts",
};

// Appointment defaults
export const DEFAULT_APPOINTMENT_DURATION = 30; // minutes
export const APPOINTMENT_REMINDER_HOURS = 24; // hours before appointment

// File upload limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

// Date formats
export const DATE_FORMAT = "YYYY-MM-DD";
export const DATETIME_FORMAT = "YYYY-MM-DD HH:mm:ss";
export const DISPLAY_DATE_FORMAT = "MMM DD, YYYY";
export const DISPLAY_DATETIME_FORMAT = "MMM DD, YYYY h:mm A";

// Cache durations (in milliseconds)
export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 15 * 60 * 1000, // 15 minutes
  LONG: 60 * 60 * 1000, // 1 hour
} as const;
