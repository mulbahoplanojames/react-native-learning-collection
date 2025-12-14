/**
 * Medication Form Component
 * Form for adding/editing medications
 */

import { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Input, Button } from "../../atoms";
import { colors, spacing } from "../../../design-system";
import { MedicationFormData } from "../../../types";

interface MedicationFormProps {
  initialData?: MedicationFormData;
  onSubmit: (data: MedicationFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function MedicationForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: MedicationFormProps) {
  const [formData, setFormData] = useState<MedicationFormData>({
    name: initialData?.name || "",
    dosage: initialData?.dosage || "",
    frequency: initialData?.frequency || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    prescribedBy: initialData?.prescribedBy || "",
    notes: initialData?.notes || "",
  });

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        <Input
          label="Medication Name *"
          placeholder="e.g., Aspirin, Metformin"
          value={formData.name}
          onChangeText={(value) => setFormData({ ...formData, name: value })}
        />

        <Input
          label="Dosage *"
          placeholder="e.g., 100mg, 2 tablets"
          value={formData.dosage}
          onChangeText={(value) => setFormData({ ...formData, dosage: value })}
        />

        <Input
          label="Frequency *"
          placeholder="e.g., Once daily, Twice daily, As needed"
          value={formData.frequency}
          onChangeText={(value) =>
            setFormData({ ...formData, frequency: value })
          }
        />

        <Input
          label="Start Date (Optional)"
          placeholder="YYYY-MM-DD"
          value={formData.startDate}
          onChangeText={(value) =>
            setFormData({ ...formData, startDate: value })
          }
        />

        <Input
          label="End Date (Optional)"
          placeholder="YYYY-MM-DD"
          value={formData.endDate}
          onChangeText={(value) => setFormData({ ...formData, endDate: value })}
        />

        <Input
          label="Prescribed By (Optional)"
          placeholder="Doctor or provider name"
          value={formData.prescribedBy}
          onChangeText={(value) =>
            setFormData({ ...formData, prescribedBy: value })
          }
        />

        <Input
          label="Notes (Optional)"
          placeholder="Additional notes about this medication"
          value={formData.notes}
          onChangeText={(value) => setFormData({ ...formData, notes: value })}
          multiline
          numberOfLines={4}
        />

        <View style={styles.buttonRow}>
          {onCancel && (
            <Button
              title="Cancel"
              onPress={onCancel}
              variant="outline"
              style={styles.cancelButton}
            />
          )}
          <Button
            title="Save Medication"
            onPress={handleSubmit}
            loading={isLoading}
            style={styles.submitButton}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: spacing.lg,
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
});
