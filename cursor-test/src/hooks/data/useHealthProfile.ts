/**
 * useHealthProfile Hook
 * React Query hook for health profile operations
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { healthProfileService } from "../../services/api/health-profile.service";
import { queryKeys } from "../../queries/query-keys";
import { HealthProfile } from "../../types";
import { useAuth } from "../auth/useAuth";

export function useHealthProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;

  // Get health profile
  const {
    data: healthProfile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.healthProfile.detail(userId || ""),
    queryFn: () => healthProfileService.getHealthProfile(userId || ""),
    enabled: !!userId,
  });

  // Update health profile mutation
  const updateMutation = useMutation({
    mutationFn: (updates: Partial<HealthProfile>) =>
      healthProfileService.upsertHealthProfile(userId || "", updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.healthProfile.detail(userId || ""),
      });
    },
  });

  return {
    healthProfile,
    isLoading,
    error,
    refetch,
    update: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
}
