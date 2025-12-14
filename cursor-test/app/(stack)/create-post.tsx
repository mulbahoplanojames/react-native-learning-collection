/**
 * Create Post Screen
 */

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCirclePosts } from "../../src/hooks/data/useCirclePosts";
import { useAuth } from "../../src/hooks/auth";
import { Input, Button } from "../../src/components/atoms";
import { colors, spacing } from "../../src/design-system";
import { Visibility } from "../../src/types/enums";

export default function CreatePostScreen() {
  const { circleId } = useLocalSearchParams<{ circleId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { create, isCreating } = useCirclePosts();

  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<Visibility>(Visibility.PUBLIC);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleCreate = () => {
    if (!content.trim()) {
      Alert.alert("Error", "Please enter post content");
      return;
    }

    if (!user || !circleId) {
      Alert.alert("Error", "Missing required information");
      return;
    }

    create(
      {
        circleId,
        authorId: user.id,
        content: content.trim(),
        visibility,
        isAnonymous,
      },
      {
        onSuccess: (post) => {
          if (post) {
            router.back();
          }
        },
        onError: (error) => {
          Alert.alert("Error", "Failed to create post. Please try again.");
          console.error("Create post error:", error);
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={styles.title}>Create Post</Text>
            <Text style={styles.subtitle}>
              Share your thoughts with the circle
            </Text>

            <Input
              label="Post Content *"
              value={content}
              onChangeText={setContent}
              placeholder="What's on your mind?"
              multiline
              numberOfLines={8}
              containerStyle={styles.input}
            />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Visibility</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setVisibility(Visibility.PUBLIC)}
                >
                  <View
                    style={[
                      styles.radio,
                      visibility === Visibility.PUBLIC && styles.radioActive,
                    ]}
                  />
                  <View style={styles.radioInfo}>
                    <Text style={styles.radioLabel}>Public</Text>
                    <Text style={styles.radioDescription}>
                      Visible to all circle members
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setVisibility(Visibility.PRIVATE)}
                >
                  <View
                    style={[
                      styles.radio,
                      visibility === Visibility.PRIVATE && styles.radioActive,
                    ]}
                  />
                  <View style={styles.radioInfo}>
                    <Text style={styles.radioLabel}>Private</Text>
                    <Text style={styles.radioDescription}>
                      Only visible to you
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <TouchableOpacity
                style={styles.toggleRow}
                onPress={() => setIsAnonymous(!isAnonymous)}
              >
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleLabel}>Post Anonymously</Text>
                  <Text style={styles.toggleDescription}>
                    Your name will be hidden
                  </Text>
                </View>
                <View
                  style={[
                    styles.toggleSwitch,
                    isAnonymous && styles.toggleSwitchActive,
                  ]}
                >
                  <View
                    style={[
                      styles.toggleThumb,
                      isAnonymous && styles.toggleThumbActive,
                    ]}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <Button
              title="Create Post"
              onPress={handleCreate}
              disabled={!content.trim() || isCreating}
              fullWidth
              style={styles.createButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import { TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  input: {
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  radioGroup: {
    gap: spacing.md,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.neutral[400],
    marginRight: spacing.md,
  },
  radioActive: {
    borderColor: colors.primary[600],
    backgroundColor: colors.primary[600],
  },
  radioInfo: {
    flex: 1,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  radioDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  toggleInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  toggleDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  toggleSwitch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.neutral[300],
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  toggleSwitchActive: {
    backgroundColor: colors.primary[600],
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.background.primary,
    alignSelf: "flex-start",
  },
  toggleThumbActive: {
    alignSelf: "flex-end",
  },
  createButton: {
    marginTop: spacing.lg,
  },
});

