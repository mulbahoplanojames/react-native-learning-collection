/**
 * useCommunityCircles Hook
 * React Query hook for community circle operations
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  communityCirclesService,
  CreateCircleData,
  CircleFilters,
} from "../../services/api/community-circles.service";
import { queryKeys } from "../../queries/query-keys";
import { useAuth } from "../auth/useAuth";

export function useCommunityCircles() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;

  // Get all circles
  const getCircles = (filters?: CircleFilters) => {
    return useQuery({
      queryKey: queryKeys.community.circles(filters || {}),
      queryFn: () => communityCirclesService.getCircles(filters),
    });
  };

  // Get user's circles
  const { data: userCircles, isLoading: isLoadingUserCircles } = useQuery({
    queryKey: queryKeys.community.userCircles,
    queryFn: () => communityCirclesService.getUserCircles(userId || ""),
    enabled: !!userId,
  });

  // Get circle by ID
  const getCircle = (id: string) => {
    return useQuery({
      queryKey: queryKeys.community.circle(id),
      queryFn: () => communityCirclesService.getCircle(id),
      enabled: !!id,
    });
  };

  // Check if user is member
  const isMember = (circleId: string) => {
    return useQuery({
      queryKey: ["circle-member", circleId, userId],
      queryFn: () => communityCirclesService.isMember(circleId, userId || ""),
      enabled: !!circleId && !!userId,
    });
  };

  // Create circle mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateCircleData) =>
      communityCirclesService.createCircle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.community.circles(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.community.userCircles,
      });
    },
  });

  // Update circle mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<CreateCircleData>;
    }) => communityCirclesService.updateCircle(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.community.circle(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.community.circles(),
      });
    },
  });

  // Delete circle mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => communityCirclesService.deleteCircle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.community.circles(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.community.userCircles,
      });
    },
  });

  // Join circle mutation
  const joinMutation = useMutation({
    mutationFn: (circleId: string) =>
      communityCirclesService.joinCircle(circleId, userId || ""),
    onSuccess: (_, circleId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.community.circle(circleId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.community.userCircles,
      });
      queryClient.invalidateQueries({
        queryKey: ["circle-member", circleId, userId],
      });
    },
  });

  // Leave circle mutation
  const leaveMutation = useMutation({
    mutationFn: (circleId: string) =>
      communityCirclesService.leaveCircle(circleId, userId || ""),
    onSuccess: (_, circleId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.community.circle(circleId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.community.userCircles,
      });
      queryClient.invalidateQueries({
        queryKey: ["circle-member", circleId, userId],
      });
    },
  });

  return {
    getCircles,
    userCircles,
    isLoadingUserCircles,
    getCircle,
    isMember,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    join: joinMutation.mutate,
    leave: leaveMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isJoining: joinMutation.isPending,
    isLeaving: leaveMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
}
