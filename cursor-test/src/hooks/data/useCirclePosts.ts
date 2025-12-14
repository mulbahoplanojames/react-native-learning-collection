/**
 * useCirclePosts Hook
 * React Query hook for circle posts
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  circlePostsService,
  CreatePostData,
} from "../../services/api/circle-posts.service";
import { queryKeys } from "../../queries/query-keys";
import { Visibility } from "../../types";
import { useAuth } from "../auth/useAuth";

export function useCirclePosts() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;

  // Get posts for a circle
  const getCirclePosts = (circleId: string) => {
    return useQuery({
      queryKey: queryKeys.community.posts(circleId),
      queryFn: () => circlePostsService.getCirclePosts(circleId),
      enabled: !!circleId,
    });
  };

  // Get post by ID
  const getPost = (id: string) => {
    return useQuery({
      queryKey: queryKeys.community.post(id),
      queryFn: () => circlePostsService.getPost(id),
      enabled: !!id,
    });
  };

  // Check if user liked post
  const isLiked = (postId: string) => {
    return useQuery({
      queryKey: ["post-liked", postId, userId],
      queryFn: () => circlePostsService.isLiked(postId, userId || ""),
      enabled: !!postId && !!userId,
    });
  };

  // Create post mutation
  const createMutation = useMutation({
    mutationFn: (data: CreatePostData) => circlePostsService.createPost(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.community.posts(variables.circleId),
      });
    },
  });

  // Update post mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: { content?: string; visibility?: Visibility };
    }) => circlePostsService.updatePost(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.community.post(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.community.posts(variables.id), // Will need circleId
      });
    },
  });

  // Delete post mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => circlePostsService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.community.posts,
      });
    },
  });

  // Like post mutation
  const likeMutation = useMutation({
    mutationFn: (postId: string) =>
      circlePostsService.likePost(postId, userId || ""),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.community.post(postId),
      });
      queryClient.invalidateQueries({
        queryKey: ["post-liked", postId, userId],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.community.posts,
      });
    },
  });

  return {
    getCirclePosts,
    getPost,
    isLiked,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    like: likeMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isLiking: likeMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
}
