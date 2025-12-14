/**
 * Health Profile Form Component
 * Main form for editing health profile
 */

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Input, Button } from "../../atoms";
import { colors, spacing } from "../../../design-system";
import { HealthProfile } from "../../../types";

interface HealthProfileFormProps {
  initialData?: Partial<HealthProfile>;
  onSubmit: (data: Partial<HealthProfile>) => void;
  isLoading?: boolean;
}

export function HealthProfileForm({
  initialData,
  onSubmit,
  isLoading,
}: HealthProfileFormProps) {
  const [formData, setFormData] = useState({
    bloodType: initialData?.bloodType || "",
    allergies: initialData?.allergies?.join(", ") || "",
    emergencyContact: {
      name: initialData?.emergencyContact?.name || "",
      relationship: initialData?.emergencyContact?.relationship || "",
      phone: initialData?.emergencyContact?.phone || "",
      email: initialData?.emergencyContact?.email || "",
    },
  });

  const handleSubmit = () => {
    const allergiesArray = formData.allergies
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    onSubmit({
      bloodType: formData.bloodType || undefined,
      allergies: allergiesArray,
      emergencyContact: formData.emergencyContact.name
        ? {
            name: formData.emergencyContact.name,
            relationship: formData.emergencyContact.relationship,
            phone: formData.emergencyContact.phone,
            email: formData.emergencyContact.email || undefined,
          }
        : undefined,
    });
  };

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.bloodTypeContainer}>
            <Text style={styles.label}>Blood Type</Text>
            <View style={styles.bloodTypeGrid}>
              {bloodTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.bloodTypeButton,
                    formData.bloodType === type &&
                      styles.bloodTypeButtonSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, bloodType: type })}
                >
                  <Text
                    style={[
                      styles.bloodTypeText,
                      formData.bloodType === type &&
                        styles.bloodTypeTextSelected,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Input
            label="Allergies"
            placeholder="Enter allergies separated by commas (e.g., Peanuts, Penicillin)"
            value={formData.allergies}
            onChangeText={(value) =>
              setFormData({ ...formData, allergies: value })
            }
            helperText="Separate multiple allergies with commas"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>

          <Input
            label="Name"
            placeholder="Emergency contact name"
            value={formData.emergencyContact.name}
            onChangeText={(value) =>
              setFormData({
                ...formData,
                emergencyContact: { ...formData.emergencyContact, name: value },
              })
            }
          />

          <Input
            label="Relationship"
            placeholder="e.g., Spouse, Parent, Sibling"
            value={formData.emergencyContact.relationship}
            onChangeText={(value) =>
              setFormData({
                ...formData,
                emergencyContact: {
                  ...formData.emergencyContact,
                  relationship: value,
                },
              })
            }
          />

          <Input
            label="Phone"
            placeholder="Emergency contact phone"
            value={formData.emergencyContact.phone}
            onChangeText={(value) =>
              setFormData({
                ...formData,
                emergencyContact: {
                  ...formData.emergencyContact,
                  phone: value,
                },
              })
            }
            keyboardType="phone-pad"
          />

          <Input
            label="Email (Optional)"
            placeholder="Emergency contact email"
            value={formData.emergencyContact.email}
            onChangeText={(value) =>
              setFormData({
                ...formData,
                emergencyContact: {
                  ...formData.emergencyContact,
                  email: value,
                },
              })
            }
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Button
          title="Save Changes"
          onPress={handleSubmit}
          loading={isLoading}
          fullWidth
          style={styles.submitButton}
        />
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
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  bloodTypeContainer: {
    marginBottom: spacing.lg,
  },
  bloodTypeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  bloodTypeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    backgroundColor: colors.background.primary,
    minWidth: 60,
    alignItems: "center",
  },
  bloodTypeButtonSelected: {
    borderColor: colors.primary[600],
    backgroundColor: colors.primary[50],
  },
  bloodTypeText: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: "500",
  },
  bloodTypeTextSelected: {
    color: colors.primary[700],
    fontWeight: "600",
  },
  submitButton: {
    marginTop: spacing.lg,
  },
});
