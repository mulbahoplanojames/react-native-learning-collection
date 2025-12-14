/**
 * Create Circle Screen
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
import { useRouter } from "expo-router";
import { useCommunityCircles } from "../../src/hooks/data/useCommunityCircles";
import { useAuth } from "../../src/hooks/auth";
import { Input, Button } from "../../src/components/atoms";
import { colors, spacing } from "../../src/design-system";
import { CircleCategory } from "../../src/types/enums";

const CATEGORIES: { id: CircleCategory; label: string }[] = [
  { id: CircleCategory.MENTAL_HEALTH, label: "Mental Health" },
  { id: CircleCategory.CHRONIC_ILLNESS, label: "Chronic Illness" },
  { id: CircleCategory.NUTRITION, label: "Nutrition" },
  { id: CircleCategory.FITNESS, label: "Fitness" },
  { id: CircleCategory.WELLNESS, label: "Wellness" },
  { id: CircleCategory.SUPPORT_GROUP, label: "Support Group" },
  { id: CircleCategory.GENERAL, label: "General" },
];

export default function CreateCircleScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { create, isCreating } = useCommunityCircles();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CircleCategory>(
    CircleCategory.GENERAL
  );
  const [isPrivate, setIsPrivate] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a circle name");
      return;
    }

    if (!user) {
      Alert.alert("Error", "You must be logged in to create a circle");
      return;
    }

    create(
      {
        name: name.trim(),
        description: description.trim() || undefined,
        category,
        isPrivate,
        isAnonymous,
        createdById: user.id,
      },
      {
        onSuccess: (circle) => {
          if (circle) {
            router.replace(`/circle-detail/${circle.id}` as any);
          }
        },
        onError: (error) => {
          Alert.alert("Error", "Failed to create circle. Please try again.");
          console.error("Create circle error:", error);
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
            <Text style={styles.title}>Create Circle</Text>
            <Text style={styles.subtitle}>
              Start a new community circle to connect with others
            </Text>

            <Input
              label="Circle Name *"
              value={name}
              onChangeText={setName}
              placeholder="Enter circle name"
              containerStyle={styles.input}
            />

            <Input
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your circle (optional)"
              multiline
              numberOfLines={4}
              containerStyle={styles.input}
            />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category</Text>
              <View style={styles.categoryGrid}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryChip,
                      category === cat.id && styles.categoryChipActive,
                    ]}
                    onPress={() => setCategory(cat.id)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        category === cat.id && styles.categoryTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Privacy Settings</Text>
              <TouchableOpacity
                style={styles.toggleRow}
                onPress={() => setIsPrivate(!isPrivate)}
              >
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleLabel}>Private Circle</Text>
                  <Text style={styles.toggleDescription}>
                    Only members can see posts
                  </Text>
                </View>
                <View
                  style={[
                    styles.toggleSwitch,
                    isPrivate && styles.toggleSwitchActive,
                  ]}
                >
                  <View
                    style={[
                      styles.toggleThumb,
                      isPrivate && styles.toggleThumbActive,
                    ]}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.toggleRow}
                onPress={() => setIsAnonymous(!isAnonymous)}
              >
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleLabel}>Anonymous Posting</Text>
                  <Text style={styles.toggleDescription}>
                    Allow members to post anonymously
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
              title="Create Circle"
              onPress={handleCreate}
              disabled={!name.trim() || isCreating}
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
    marginBottom: spacing.md,
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
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.neutral[300],
  },
  categoryChipActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.secondary,
  },
  categoryTextActive: {
    color: colors.text.inverse,
    fontWeight: "600",
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

