/**
 * Message Form Component
 * Input form for sending messages
 */

import { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Keyboard, Text } from "react-native";
import { Input, Button } from "../../atoms";
import { colors, spacing } from "../../../design-system";
import { MessageType } from "../../../types/enums";

interface MessageFormProps {
  onSend: (content: string, type?: MessageType) => void;
  onAttachmentPress?: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function MessageForm({
  onSend,
  onAttachmentPress,
  isLoading,
  placeholder = "Type a message...",
}: MessageFormProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim(), MessageType.TEXT);
      setMessage("");
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      {onAttachmentPress && (
        <TouchableOpacity
          style={styles.attachmentButton}
          onPress={onAttachmentPress}
        >
          <Text style={styles.attachmentIcon}>📎</Text>
        </TouchableOpacity>
      )}

      <Input
        value={message}
        onChangeText={setMessage}
        placeholder={placeholder}
        multiline
        style={styles.input}
        containerStyle={styles.inputContainer}
        onSubmitEditing={handleSend}
      />

      <TouchableOpacity
        style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
        onPress={handleSend}
        disabled={!message.trim() || isLoading}
      >
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: spacing.md,
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    gap: spacing.sm,
  },
  attachmentButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  attachmentIcon: {
    fontSize: 20,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  input: {
    maxHeight: 100,
    minHeight: 40,
  },
  sendButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.primary[600],
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: "600",
  },
});

