/**
 * Message List Component
 * Displays messages in a chat conversation
 */

import { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Message } from "../../../types";
import { colors, spacing } from "../../../design-system";
import { format } from "date-fns";
import { useAuth } from "../../../hooks/auth/useAuth";

interface MessageListProps {
  messages: Message[];
  onMessagePress?: (message: Message) => void;
}

export function MessageList({ messages, onMessagePress }: MessageListProps) {
  const { user } = useAuth();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage = item.senderId === user?.id;
    const showAvatar = !isMyMessage;

    return (
      <TouchableOpacity
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessage : styles.otherMessage,
        ]}
        onPress={() => onMessagePress?.(item)}
        activeOpacity={0.7}
      >
        {showAvatar && item.sender && (
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.sender.firstName?.[0] || "U"}
              </Text>
            </View>
          </View>
        )}

        <View
          style={[
            styles.messageBubble,
            isMyMessage ? styles.myBubble : styles.otherBubble,
          ]}
        >
          {!isMyMessage && item.sender && (
            <Text style={styles.senderName}>
              {item.sender.firstName} {item.sender.lastName}
            </Text>
          )}

          <Text
            style={[
              styles.messageText,
              isMyMessage ? styles.myMessageText : styles.otherMessageText,
            ]}
          >
            {item.contentEncrypted}
          </Text>

          {item.attachmentUrl && (
            <View style={styles.attachmentContainer}>
              <Text style={styles.attachmentText}>📎 Attachment</Text>
            </View>
          )}

          <View style={styles.messageFooter}>
            <Text style={styles.messageTime}>
              {format(new Date(item.createdAt), "h:mm a")}
            </Text>
            {isMyMessage && (
              <Text style={styles.readStatus}>
                {item.isRead ? "✓✓" : "✓"}
              </Text>
            )}
            {item.isEdited && (
              <Text style={styles.editedLabel}>(edited)</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      renderItem={renderMessage}
      keyExtractor={(item) => item.id}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      inverted={false}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  contentContainer: {
    padding: spacing.md,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: spacing.sm,
    alignItems: "flex-end",
  },
  myMessage: {
    justifyContent: "flex-end",
  },
  otherMessage: {
    justifyContent: "flex-start",
  },
  avatarContainer: {
    marginRight: spacing.sm,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary[500],
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: "600",
  },
  messageBubble: {
    maxWidth: "75%",
    padding: spacing.md,
    borderRadius: 16,
  },
  myBubble: {
    backgroundColor: colors.primary[600],
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: colors.background.primary,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myMessageText: {
    color: colors.text.inverse,
  },
  otherMessageText: {
    color: colors.text.primary,
  },
  attachmentContainer: {
    marginTop: spacing.xs,
    padding: spacing.xs,
    backgroundColor: colors.neutral[100],
    borderRadius: 4,
  },
  attachmentText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  messageTime: {
    fontSize: 11,
    color: colors.text.tertiary,
  },
  readStatus: {
    fontSize: 11,
    color: colors.text.tertiary,
  },
  editedLabel: {
    fontSize: 11,
    fontStyle: "italic",
    color: colors.text.tertiary,
  },
});

