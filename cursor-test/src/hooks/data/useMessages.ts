/**
 * useMessages Hook
 * React Query hook for messaging operations with real-time subscriptions
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import {
  messagesService,
  CreateMessageData,
} from "../../services/api/messages.service";
import { queryKeys } from "../../queries/query-keys";
import { Message } from "../../types";
import { RealtimeChannel } from "@supabase/supabase-js";

export function useMessages(chatId: string) {
  const queryClient = useQueryClient();
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Get messages
  const {
    data: messages,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.messages.chat(chatId),
    queryFn: () => messagesService.getMessages(chatId),
    enabled: !!chatId,
  });

  // Subscribe to real-time messages
  useEffect(() => {
    if (!chatId) return;

    const channel = messagesService.subscribeToMessages(chatId, (newMessage) => {
      // Update cache with new message
      queryClient.setQueryData<Message[]>(
        queryKeys.messages.chat(chatId),
        (oldMessages = []) => {
          // Check if message already exists
          if (oldMessages.some((msg) => msg.id === newMessage.id)) {
            return oldMessages;
          }
          return [...oldMessages, newMessage];
        }
      );
    });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        messagesService.unsubscribeFromMessages(channelRef.current);
      }
    };
  }, [chatId, queryClient]);

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: (data: CreateMessageData) => messagesService.sendMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.chat(chatId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.chats,
      });
    },
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (userId: string) =>
      messagesService.markAsRead(chatId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.chat(chatId),
      });
    },
  });

  // Edit message mutation
  const editMutation = useMutation({
    mutationFn: ({
      messageId,
      newContent,
    }: {
      messageId: string;
      newContent: string;
    }) => messagesService.editMessage(messageId, newContent),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.chat(chatId),
      });
    },
  });

  // Delete message mutation
  const deleteMutation = useMutation({
    mutationFn: (messageId: string) => messagesService.deleteMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.chat(chatId),
      });
    },
  });

  return {
    messages,
    isLoading,
    error,
    refetch,
    send: sendMutation.mutate,
    markAsRead: markAsReadMutation.mutate,
    edit: editMutation.mutate,
    delete: deleteMutation.mutate,
    isSending: sendMutation.isPending,
    isMarkingAsRead: markAsReadMutation.isPending,
    isEditing: editMutation.isPending,
    isDeleting: deleteMutation.isPending,
    sendError: sendMutation.error,
    editError: editMutation.error,
    deleteError: deleteMutation.error,
  };
}

