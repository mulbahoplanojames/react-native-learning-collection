/**
 * Messages Screen
 * Main messaging hub with chat list
 */

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useChats } from "../../src/hooks/data/useChats";
import { useAuth } from "../../src/hooks/auth";
import { colors, spacing } from "../../src/design-system";
import { format } from "date-fns";
import { Chat } from "../../src/types";

export default function MessagesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { chats, isLoading, refetch } = useChats();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getChatTitle = (chat: Chat): string => {
    if (chat.isGroup) {
      return chat.groupName || "Group Chat";
    }
    // For one-on-one, would need to fetch other participant's name
    return "Chat";
  };

  const getLastMessagePreview = (chat: Chat): string => {
    // TODO: Fetch last message for preview
    return "Tap to view messages";
  };

  const renderChatItem = ({ item }: { item: Chat }) => {
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => {
          if (item.isGroup) {
            router.push(`/(stack)/group-chat/${item.id}`);
          } else {
            router.push(`/(stack)/chat/${item.id}`);
          }
        }}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.isGroup ? "G" : getChatTitle(item)[0]?.toUpperCase() || "C"}
            </Text>
          </View>
        </View>

        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle}>{getChatTitle(item)}</Text>
            {item.lastMessageAt && (
              <Text style={styles.chatTime}>
                {format(new Date(item.lastMessageAt), "h:mm a")}
              </Text>
            )}
          </View>
          <Text style={styles.chatPreview} numberOfLines={1}>
            {getLastMessagePreview(item)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity
          onPress={() => router.push("/(stack)/new-chat")}
          style={styles.newChatButton}
        >
          <Text style={styles.newChatIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading chats...</Text>
        </View>
      ) : chats && chats.length > 0 ? (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No messages yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Start a conversation with a provider or peer
          </Text>
          <TouchableOpacity
            style={styles.newChatButtonLarge}
            onPress={() => router.push("/(stack)/new-chat")}
          >
            <Text style={styles.newChatButtonText}>Start New Chat</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  newChatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[600],
    alignItems: "center",
    justifyContent: "center",
  },
  newChatIcon: {
    color: colors.text.inverse,
    fontSize: 24,
    fontWeight: "bold",
  },
  listContent: {
    padding: spacing.sm,
  },
  chatItem: {
    flexDirection: "row",
    padding: spacing.md,
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  avatarContainer: {
    marginRight: spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary[500],
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.text.inverse,
    fontSize: 20,
    fontWeight: "600",
  },
  chatContent: {
    flex: 1,
    justifyContent: "center",
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    flex: 1,
  },
  chatTime: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  chatPreview: {
    fontSize: 14,
    color: colors.text.secondary,
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
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  newChatButtonLarge: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.primary[600],
  },
  newChatButtonText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: "600",
  },
});
