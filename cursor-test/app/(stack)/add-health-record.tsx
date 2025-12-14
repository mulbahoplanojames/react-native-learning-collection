/**
 * Add Health Record Screen
 */

import { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Input, Button } from "../../src/components/atoms";
import { useHealthRecords } from "../../src/hooks/data/useHealthRecords";
import { useAuth } from "../../src/hooks/auth";
import { RecordType, Visibility } from "../../src/types/enums";
import { colors, spacing } from "../../src/design-system";

export default function AddHealthRecordScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { create, isCreating } = useHealthRecords();
  const [formData, setFormData] = useState({
    title: "",
    recordType: RecordType.LAB_TEST,
    notes: "",
  });

  const handleSubmit = () => {
    if (!user) return;

    create(
      {
        userId: user.id,
        recordType: formData.recordType,
        title: formData.title,
        data: { notes: formData.notes },
        visibility: Visibility.PRIVATE,
      },
      {
        onSuccess: () => {
          router.back();
        },
      }
    );
  };

  const recordTypes = Object.values(RecordType);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Health Record</Text>
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <Input
            label="Title *"
            placeholder="e.g., Blood Test Results, X-Ray Report"
            value={formData.title}
            onChangeText={(value) => setFormData({ ...formData, title: value })}
          />

          <View style={styles.section}>
            <Text style={styles.label}>Record Type *</Text>
            <View style={styles.typeGrid}>
              {recordTypes.map((type) => (
                <Button
                  key={type}
                  title={type.replace("_", " ")}
                  onPress={() => setFormData({ ...formData, recordType: type })}
                  variant={formData.recordType === type ? "primary" : "outline"}
                  size="sm"
                  style={styles.typeButton}
                />
              ))}
            </View>
          </View>

          <Input
            label="Notes"
            placeholder="Additional notes about this record"
            value={formData.notes}
            onChangeText={(value) => setFormData({ ...formData, notes: value })}
            multiline
            numberOfLines={6}
          />

          <Button
            title="Save Record"
            onPress={handleSubmit}
            loading={isCreating}
            disabled={!formData.title}
            fullWidth
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
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
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  typeButton: {
    minWidth: 100,
  },
  submitButton: {
    marginTop: spacing.lg,
  },
});

