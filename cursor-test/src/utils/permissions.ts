/**
 * Permission Utilities
 * Functions for checking access permissions
 */

import { User, HealthRecord, Visibility } from "../types";
import { UserRole } from "../types/enums";
import { PROVIDER_ROLES } from "./constants";

/**
 * Check if user can view health record
 */
export function canViewHealthRecord(
  user: User,
  record: HealthRecord
): boolean {
  // Owner can always view
  if (record.userId === user.id) {
    return true;
  }

  // Provider can view if they created it or have access
  if (PROVIDER_ROLES.includes(user.role as UserRole)) {
    if (record.providerId === user.id) {
      return true;
    }
    if (record.visibility === Visibility.SHARED && record.sharedWith.includes(user.id)) {
      return true;
    }
  }

  // Shared records
  if (record.visibility === Visibility.SHARED && record.sharedWith.includes(user.id)) {
    return true;
  }

  return false;
}

/**
 * Check if user can edit health record
 */
export function canEditHealthRecord(
  user: User,
  record: HealthRecord
): boolean {
  // Owner can always edit
  if (record.userId === user.id) {
    return true;
  }

  // Provider can edit if they created it
  if (PROVIDER_ROLES.includes(user.role as UserRole) && record.providerId === user.id) {
    return true;
  }

  return false;
}

/**
 * Check if user can view health profile
 */
export function canViewHealthProfile(
  user: User,
  profileUserId: string
): boolean {
  // Owner can always view
  if (user.id === profileUserId) {
    return true;
  }

  // Providers can view their patients' profiles
  if (PROVIDER_ROLES.includes(user.role as UserRole)) {
    // TODO: Check if user is a provider for this patient
    // This would require checking appointments or provider-patient relationships
    return true; // Placeholder
  }

  return false;
}

/**
 * Check if user can edit health profile
 */
export function canEditHealthProfile(
  user: User,
  profileUserId: string
): boolean {
  // Owner can always edit
  if (user.id === profileUserId) {
    return true;
  }

  // Providers can edit with restrictions (only certain fields)
  if (PROVIDER_ROLES.includes(user.role as UserRole)) {
    // TODO: Check provider-patient relationship
    return true; // Placeholder
  }

  return false;
}

