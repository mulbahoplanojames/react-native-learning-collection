/**
 * useRole Hook
 * Provides role-based utilities and checks
 */

import { useAuth } from "./useAuth";
import { UserRole } from "../../types/enums";
import { PROVIDER_ROLES, SEEKER_ROLES } from "../../utils/constants";

export function useRole() {
  const { user } = useAuth();

  const role = user?.role as UserRole | undefined;

  const isProvider = role && PROVIDER_ROLES.includes(role as UserRole);
  const isSeeker = role && SEEKER_ROLES.includes(role as UserRole);
  const isAdmin = role === UserRole.ADMIN;
  const isModerator = role === UserRole.MODERATOR;

  const hasRole = (requiredRole: UserRole) => role === requiredRole;
  const hasAnyRole = (requiredRoles: UserRole[]) =>
    role ? requiredRoles.includes(role) : false;

  return {
    role,
    isProvider,
    isSeeker,
    isAdmin,
    isModerator,
    hasRole,
    hasAnyRole,
  };
}

