/**
 * Chats Service
 * Handles chat/conversation management
 */

import { supabase } from "../supabase/client";
import { Chat, ChatParticipant } from "../../types";

export interface CreateChatData {
  participant1Id: string;
  participant2Id?: string;
  isGroup?: boolean;
  groupName?: string;
  groupDescription?: string;
  createdById?: string;
}

class ChatsService {
  /**
   * Get all chats for a user
   */
  async getChats(userId: string): Promise<Chat[]> {
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .or(`participant_1_id.eq.${userId},participant_2_id.eq.${userId}`)
      .order("last_message_at", { ascending: false });

    if (error) {
      console.error("Error fetching chats:", error);
      return [];
    }

    // Also get group chats where user is a participant
    const { data: groupChats } = await supabase
      .from("chat_participants")
      .select(`
        chat:chats(*)
      `)
      .eq("user_id", userId);

    const allChats = [
      ...data.map((chat) => this.mapToChat(chat)),
      ...(groupChats?.map((p) => this.mapToChat(p.chat)).filter(Boolean) || []),
    ];

    // Remove duplicates
    const uniqueChats = Array.from(
      new Map(allChats.map((chat) => [chat.id, chat])).values()
    );

    return uniqueChats;
  }

  /**
   * Get chat by ID
   */
  async getChat(chatId: string): Promise<Chat | null> {
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("id", chatId)
      .single();

    if (error) {
      console.error("Error fetching chat:", error);
      return null;
    }

    return this.mapToChat(data);
  }

  /**
   * Get or create one-on-one chat
   */
  async getOrCreateOneOnOneChat(
    userId1: string,
    userId2: string
  ): Promise<Chat | null> {
    // Check if chat already exists
    const { data: existingChat } = await supabase
      .from("chats")
      .select("*")
      .eq("is_group", false)
      .or(
        `and(participant_1_id.eq.${userId1},participant_2_id.eq.${userId2}),and(participant_1_id.eq.${userId2},participant_2_id.eq.${userId1})`
      )
      .single();

    if (existingChat) {
      return this.mapToChat(existingChat);
    }

    // Create new chat
    return this.createChat({
      participant1Id: userId1,
      participant2Id: userId2,
      isGroup: false,
    });
  }

  /**
   * Create a new chat
   */
  async createChat(data: CreateChatData): Promise<Chat | null> {
    const { data: chat, error } = await supabase
      .from("chats")
      .insert({
        participant_1_id: data.participant1Id,
        participant_2_id: data.participant2Id,
        is_group: data.isGroup || false,
        group_name: data.groupName,
        group_description: data.groupDescription,
        created_by_id: data.createdById || data.participant1Id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating chat:", error);
      return null;
    }

    // If group chat, add creator as participant
    if (data.isGroup && chat) {
      await this.addParticipant(chat.id, data.participant1Id, "admin");
    }

    return this.mapToChat(chat);
  }

  /**
   * Get chat participants
   */
  async getChatParticipants(chatId: string): Promise<ChatParticipant[]> {
    const { data, error } = await supabase
      .from("chat_participants")
      .select("*")
      .eq("chat_id", chatId)
      .order("joined_at", { ascending: true });

    if (error) {
      console.error("Error fetching chat participants:", error);
      return [];
    }

    return data.map((p) => this.mapToChatParticipant(p));
  }

  /**
   * Add participant to chat
   */
  async addParticipant(
    chatId: string,
    userId: string,
    role: string = "member"
  ): Promise<boolean> {
    const { error } = await supabase.from("chat_participants").insert({
      chat_id: chatId,
      user_id: userId,
      role,
    });

    if (error) {
      console.error("Error adding participant:", error);
      return false;
    }

    // Update member count for group chats
    const participants = await this.getChatParticipants(chatId);
    await supabase
      .from("chats")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", chatId);

    return true;
  }

  /**
   * Remove participant from chat
   */
  async removeParticipant(chatId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from("chat_participants")
      .delete()
      .eq("chat_id", chatId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error removing participant:", error);
      return false;
    }

    return true;
  }

  /**
   * Update last read timestamp
   */
  async updateLastRead(chatId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from("chat_participants")
      .update({ last_read_at: new Date().toISOString() })
      .eq("chat_id", chatId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error updating last read:", error);
      return false;
    }

    return true;
  }

  /**
   * Map database row to Chat model
   */
  private mapToChat(data: any): Chat {
    return {
      id: data.id,
      participant1Id: data.participant_1_id,
      participant2Id: data.participant_2_id,
      isGroup: data.is_group,
      groupName: data.group_name,
      groupDescription: data.group_description,
      groupAvatarUrl: data.group_avatar_url,
      createdById: data.created_by_id,
      lastMessageAt: data.last_message_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  /**
   * Map database row to ChatParticipant model
   */
  private mapToChatParticipant(data: any): ChatParticipant {
    return {
      id: data.id,
      chatId: data.chat_id,
      userId: data.user_id,
      role: data.role,
      joinedAt: data.joined_at,
      lastReadAt: data.last_read_at,
    };
  }
}

export const chatsService = new ChatsService();

