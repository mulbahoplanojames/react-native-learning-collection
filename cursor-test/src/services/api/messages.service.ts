/**
 * Messages Service
 * Handles messaging operations with Supabase Realtime
 */

import { supabase } from "../supabase/client";
import { Message, MessageType } from "../../types";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface CreateMessageData {
  chatId: string;
  senderId: string;
  content: string;
  contentType: MessageType;
  attachmentUrl?: string;
}

class MessagesService {
  /**
   * Get messages for a chat
   */
  async getMessages(chatId: string, limit: number = 50): Promise<Message[]> {
    const { data, error } = await supabase
      .from("messages")
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, first_name, last_name, avatar_url)
      `)
      .eq("chat_id", chatId)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching messages:", error);
      return [];
    }

    return data.map((message) => this.mapToMessage(message)).reverse();
  }

  /**
   * Send a message
   */
  async sendMessage(data: CreateMessageData): Promise<Message | null> {
    // TODO: Encrypt message content before storing
    const encryptedContent = data.content; // Placeholder - implement E2E encryption

    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        chat_id: data.chatId,
        sender_id: data.senderId,
        content_encrypted: encryptedContent,
        content_type: data.contentType,
        attachment_url: data.attachmentUrl,
        is_read: false,
      })
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, first_name, last_name, avatar_url)
      `)
      .single();

    if (error) {
      console.error("Error sending message:", error);
      return null;
    }

    // Update chat's last_message_at
    await supabase
      .from("chats")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", data.chatId);

    return this.mapToMessage(message);
  }

  /**
   * Mark messages as read
   */
  async markAsRead(chatId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("chat_id", chatId)
      .neq("sender_id", userId)
      .eq("is_read", false);

    if (error) {
      console.error("Error marking messages as read:", error);
      return false;
    }

    return true;
  }

  /**
   * Edit a message
   */
  async editMessage(messageId: string, newContent: string): Promise<boolean> {
    // TODO: Encrypt new content
    const encryptedContent = newContent;

    const { error } = await supabase
      .from("messages")
      .update({
        content_encrypted: encryptedContent,
        is_edited: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", messageId);

    if (error) {
      console.error("Error editing message:", error);
      return false;
    }

    return true;
  }

  /**
   * Delete a message (soft delete)
   */
  async deleteMessage(messageId: string): Promise<boolean> {
    const { error } = await supabase
      .from("messages")
      .update({
        is_deleted: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", messageId);

    if (error) {
      console.error("Error deleting message:", error);
      return false;
    }

    return true;
  }

  /**
   * Subscribe to real-time messages for a chat
   */
  subscribeToMessages(
    chatId: string,
    callback: (message: Message) => void
  ): RealtimeChannel {
    const channel = supabase
      .channel(`chat:${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        async (payload) => {
          // Fetch the full message with sender info
          const { data } = await supabase
            .from("messages")
            .select(`
              *,
              sender:users!messages_sender_id_fkey(id, first_name, last_name, avatar_url)
            `)
            .eq("id", payload.new.id)
            .single();

          if (data) {
            callback(this.mapToMessage(data));
          }
        }
      )
      .subscribe();

    return channel;
  }

  /**
   * Unsubscribe from messages
   */
  unsubscribeFromMessages(channel: RealtimeChannel): void {
    supabase.removeChannel(channel);
  }

  /**
   * Map database row to Message model
   */
  private mapToMessage(data: any): Message {
    return {
      id: data.id,
      chatId: data.chat_id,
      senderId: data.sender_id,
      contentEncrypted: data.content_encrypted,
      contentType: data.content_type,
      attachmentUrl: data.attachment_url,
      isRead: data.is_read,
      isEdited: data.is_edited,
      isDeleted: data.is_deleted,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      sender: data.sender
        ? {
            id: data.sender.id,
            firstName: data.sender.first_name,
            lastName: data.sender.last_name,
            avatarUrl: data.sender.avatar_url,
          }
        : undefined,
    };
  }
}

export const messagesService = new MessagesService();

