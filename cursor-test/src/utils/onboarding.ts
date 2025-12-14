/**
 * Onboarding Utilities
 * Helper functions for onboarding flow
 */

import { User } from "../types/models";

/**
 * Check if user has completed onboarding
 * Onboarding is considered complete if user has dateOfBirth and gender set
 */
export function hasCompletedOnboarding(user: User | null | undefined): boolean {
  if (!user) {
    return false;
  }

  // Onboarding is complete if user has dateOfBirth and gender
  return !!(user.dateOfBirth && user.gender);
}
