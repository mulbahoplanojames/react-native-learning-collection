/**
 * useProgressTracking Hook
 * React Query hook for progress tracking
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  progressTrackingService,
  UserProgress,
} from "../../services/api/progress-tracking.service";
import { useAuth } from "../auth/useAuth";

export function useProgressTracking() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;

  // Get user progress
  const {
    data: progress,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user-progress", userId],
    queryFn: () => progressTrackingService.getUserProgress(userId || ""),
    enabled: !!userId,
  });

  // Get current streak
  const {
    data: currentStreak,
  } = useQuery({
    queryKey: ["user-streak", userId],
    queryFn: () => progressTrackingService.getCurrentStreak(userId || ""),
    enabled: !!userId,
  });

  // Get bookmarked content
  const {
    data: bookmarkedContent,
  } = useQuery({
    queryKey: ["bookmarked-content", userId],
    queryFn: () => progressTrackingService.getBookmarkedContent(userId || ""),
    enabled: !!userId,
  });

  // Record activity mutation
  const recordActivityMutation = useMutation({
    mutationFn: (activity: string) =>
      progressTrackingService.recordActivity(userId || "", activity),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-progress", userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-streak", userId],
      });
    },
  });

  // Bookmark mutation
  const bookmarkMutation = useMutation({
    mutationFn: (contentId: string) =>
      progressTrackingService.bookmarkContent(userId || "", contentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookmarked-content", userId],
      });
    },
  });

  // Unbookmark mutation
  const unbookmarkMutation = useMutation({
    mutationFn: (contentId: string) =>
      progressTrackingService.unbookmarkContent(userId || "", contentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookmarked-content", userId],
      });
    },
  });

  return {
    progress,
    currentStreak,
    bookmarkedContent,
    isLoading,
    error,
    refetch,
    recordActivity: recordActivityMutation.mutate,
    bookmark: bookmarkMutation.mutate,
    unbookmark: unbookmarkMutation.mutate,
    isRecordingActivity: recordActivityMutation.isPending,
    isBookmarking: bookmarkMutation.isPending,
    isUnbookmarking: unbookmarkMutation.isPending,
  };
}

