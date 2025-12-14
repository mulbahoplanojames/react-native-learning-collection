/**
 * useChats Hook
 * React Query hook for chat/conversation operations
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  chatsService,
  CreateChatData,
} from "../../services/api/chats.service";
import { queryKeys } from "../../queries/query-keys";
import { useAuth } from "../auth/useAuth";

export function useChats() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;

  // Get all chats
  const {
    data: chats,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.messages.chats,
    queryFn: () => chatsService.getChats(userId || ""),
    enabled: !!userId,
  });

  // Get or create one-on-one chat
  const getOrCreateChatMutation = useMutation({
    mutationFn: (otherUserId: string) =>
      chatsService.getOrCreateOneOnOneChat(userId || "", otherUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.chats,
      });
    },
  });

  // Create chat mutation
  const createChatMutation = useMutation({
    mutationFn: (data: CreateChatData) => chatsService.createChat(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.chats,
      });
    },
  });

  // Get chat participants
  const getChatParticipants = (chatId: string) => {
    return useQuery({
      queryKey: ["chat-participants", chatId],
      queryFn: () => chatsService.getChatParticipants(chatId),
      enabled: !!chatId,
    });
  };

  // Add participant mutation
  const addParticipantMutation = useMutation({
    mutationFn: ({
      chatId,
      userId,
      role,
    }: {
      chatId: string;
      userId: string;
      role?: string;
    }) => chatsService.addParticipant(chatId, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.chats,
      });
    },
  });

  // Remove participant mutation
  const removeParticipantMutation = useMutation({
    mutationFn: ({ chatId, userId }: { chatId: string; userId: string }) =>
      chatsService.removeParticipant(chatId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.chats,
      });
    },
  });

  // Update last read mutation
  const updateLastReadMutation = useMutation({
    mutationFn: (chatId: string) =>
      chatsService.updateLastRead(chatId, userId || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.chats,
      });
    },
  });

  return {
    chats,
    isLoading,
    error,
    refetch,
    getOrCreateChat: getOrCreateChatMutation.mutate,
    createChat: createChatMutation.mutate,
    getChatParticipants,
    addParticipant: addParticipantMutation.mutate,
    removeParticipant: removeParticipantMutation.mutate,
    updateLastRead: updateLastReadMutation.mutate,
    isCreatingChat: createChatMutation.isPending,
    isAddingParticipant: addParticipantMutation.isPending,
    isRemovingParticipant: removeParticipantMutation.isPending,
    createChatError: createChatMutation.error,
  };
}

