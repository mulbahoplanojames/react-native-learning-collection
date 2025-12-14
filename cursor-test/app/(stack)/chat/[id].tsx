/**
 * Chat Screen
 * One-on-one or group chat conversation
 */

import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { chatsService } from "../../../src/services/api/chats.service";
import { MessageList, MessageForm } from "../../../src/components/organisms/lists";
import { useMessages } from "../../../src/hooks/data/useMessages";
import { useAuth } from "../../../src/hooks/auth";
import { useChats } from "../../../src/hooks/data/useChats";
import { colors, spacing } from "../../../src/design-system";
import { MessageType } from "../../../src/types/enums";
import { storageService } from "../../../src/services/supabase/storage";
import * as ImagePicker from "expo-image-picker";

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { updateLastRead } = useChats();
  const {
    messages,
    isLoading,
    send,
    markAsRead,
    isSending,
  } = useMessages(id);

  const {
    data: chat,
    isLoading: isLoadingChat,
  } = useQuery({
    queryKey: ["chat", id],
    queryFn: () => chatsService.getChat(id),
    enabled: !!id,
  });

  const {
    data: participants,
  } = useChats().getChatParticipants(id);

  // Mark messages as read when screen is focused
  useEffect(() => {
    if (user && messages && messages.length > 0) {
      markAsRead(user.id, {
        onSuccess: () => {
          updateLastRead(id, {
            onSuccess: () => {
              // Update last read timestamp
            },
          });
        },
      });
    }
  }, [messages?.length, user, id, markAsRead, updateLastRead]);

  const handleSend = async (content: string, type: MessageType = MessageType.TEXT) => {
    if (!user || !chat) return;

    send(
      {
        chatId: id,
        senderId: user.id,
        content,
        contentType: type,
      },
      {
        onError: (error) => {
          Alert.alert("Error", "Failed to send message. Please try again.");
          console.error("Send message error:", error);
        },
      }
    );
  };

  const handleAttachment = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Please grant access to your photos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Convert to blob for upload
        const response = await fetch(asset.uri);
        const blob = await response.blob();

        // Upload to Supabase Storage
        const filePath = `chat-attachments/${id}/${Date.now()}-${asset.fileName || "image.jpg"}`;
        const fileUrl = await storageService.uploadFile({
          bucket: "chat-attachments",
          path: filePath,
          file: blob,
          contentType: asset.type || "image/jpeg",
        });

        if (fileUrl) {
          handleSend(fileUrl, MessageType.IMAGE);
        } else {
          Alert.alert("Error", "Failed to upload attachment.");
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image.");
    }
  };

  const getChatTitle = () => {
    if (!chat) return "Chat";
    if (chat.isGroup) return chat.groupName || "Group Chat";
    
    // For one-on-one, show other participant's name
    if (participants && participants.length > 0) {
      const otherParticipant = participants.find((p) => p.userId !== user?.id);
      // TODO: Fetch user details for other participant
      return "Chat";
    }
    
    return "Chat";
  };

  if (isLoadingChat) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading chat...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{getChatTitle()}</Text>
        </View>

        <View style={styles.messagesContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading messages...</Text>
            </View>
          ) : messages && messages.length > 0 ? (
            <MessageList messages={messages} />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No messages yet</Text>
              <Text style={styles.emptySubtext}>
                Start the conversation by sending a message
              </Text>
            </View>
          )}
        </View>

        <MessageForm
          onSend={handleSend}
          onAttachmentPress={handleAttachment}
          isLoading={isSending}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
    backgroundColor: colors.background.primary,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text.primary,
  },
  messagesContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
  },
});
