/**
 * useUserPreferences Hook
 * React Query hook for user preferences
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  userPreferencesService,
  UserPreferences,
} from "../../services/api/user-preferences.service";
import { useAuth } from "../auth/useAuth";

export function useUserPreferences() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;

  // Get user preferences
  const {
    data: preferences,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user-preferences", userId],
    queryFn: () => userPreferencesService.getUserPreferences(userId || ""),
    enabled: !!userId,
  });

  // Update preferences mutation
  const updateMutation = useMutation({
    mutationFn: (updates: Partial<UserPreferences>) =>
      userPreferencesService.updateUserPreferences(userId || "", updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-preferences", userId],
      });
    },
  });

  return {
    preferences,
    isLoading,
    error,
    refetch,
    update: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
}

