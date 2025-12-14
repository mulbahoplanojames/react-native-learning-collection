/**
 * Add Medication Screen
 */

import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MedicationForm } from "../../src/components/organisms/forms";
import { useHealthProfile } from "../../src/hooks/data/useHealthProfile";
import { colors } from "../../src/design-system";

export default function AddMedicationScreen() {
  const router = useRouter();
  const { healthProfile, update, isUpdating } = useHealthProfile();

  const handleSubmit = (medicationData: any) => {
    const currentMedications = healthProfile?.currentMedications || [];
    const updatedMedications = [...currentMedications, medicationData];

    update(
      { currentMedications: updatedMedications },
      {
        onSuccess: () => {
          router.back();
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Medication</Text>
      </View>
      <MedicationForm
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        isLoading={isUpdating}
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text.primary,
  },
});

