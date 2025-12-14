/**
 * New Chat Screen
 * Start a new conversation
 */

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Input } from "../../src/components/atoms";
import { useProviders } from "../../src/hooks/data/useProviders";
import { useChats } from "../../src/hooks/data/useChats";
import { useAuth } from "../../src/hooks/auth";
import { colors, spacing } from "../../src/design-system";

export default function NewChatScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { providers } = useProviders();
  const { getOrCreateChat } = useChats();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProviders = providers?.filter((provider) => {
    if (!searchQuery) return true;
    const fullName = `${provider.firstName} ${provider.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const handleSelectProvider = (providerId: string) => {
    getOrCreateChat(providerId, {
      onSuccess: (chat) => {
        if (chat) {
          router.replace(`/(stack)/chat/${chat.id}`);
        }
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.title}>New Chat</Text>
      </View>

      <View style={styles.searchSection}>
        <Input
          placeholder="Search providers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredProviders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.providerItem}
            onPress={() => handleSelectProvider(item.id)}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.firstName?.[0] || "P"}
              </Text>
            </View>
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>
                {item.firstName} {item.lastName}
              </Text>
              <Text style={styles.providerRole}>{item.role}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No providers found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  searchSection: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  searchInput: {
    marginBottom: 0,
  },
  providerItem: {
    flexDirection: "row",
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary[500],
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  avatarText: {
    color: colors.text.inverse,
    fontSize: 20,
    fontWeight: "600",
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  providerRole: {
    fontSize: 14,
    color: colors.text.secondary,
    textTransform: "capitalize",
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
});

