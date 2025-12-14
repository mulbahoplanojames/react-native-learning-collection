/**
 * useWellness Hook
 * React Query hook for wellness content operations
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  wellnessService,
  WellnessContentFilters,
} from "../../services/api/wellness.service";
import { queryKeys } from "../../queries/query-keys";
import { WellnessContent, WellnessCategory, ContentType } from "../../types";
import { useAuth } from "../auth/useAuth";

export function useWellness() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;

  // Get all wellness content
  const getWellnessContent = (filters?: WellnessContentFilters) => {
    return useQuery({
      queryKey: queryKeys.wellness.contentList(filters || {}),
      queryFn: () => wellnessService.getWellnessContent(filters),
    });
  };

  // Get recommended content
  const {
    data: recommendedContent,
    isLoading: isLoadingRecommended,
  } = useQuery({
    queryKey: queryKeys.wellness.all,
    queryFn: () => wellnessService.getRecommendedContent(userId || ""),
    enabled: !!userId,
  });

  // Get content by category
  const getContentByCategory = (
    category: WellnessCategory,
    limit?: number
  ) => {
    return useQuery({
      queryKey: [...queryKeys.wellness.content, category, limit],
      queryFn: () => wellnessService.getContentByCategory(category, limit),
    });
  };

  // Get content by ID
  const getContentById = (id: string) => {
    return useQuery({
      queryKey: queryKeys.wellness.detail(id),
      queryFn: () => wellnessService.getWellnessContentById(id),
      enabled: !!id,
    });
  };

  // Increment view count mutation
  const incrementViewMutation = useMutation({
    mutationFn: (id: string) => wellnessService.incrementViewCount(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.wellness.detail(id),
      });
    },
  });

  return {
    getWellnessContent,
    recommendedContent,
    isLoadingRecommended,
    getContentByCategory,
    getContentById,
    incrementView: incrementViewMutation.mutate,
    isIncrementingView: incrementViewMutation.isPending,
  };
}

