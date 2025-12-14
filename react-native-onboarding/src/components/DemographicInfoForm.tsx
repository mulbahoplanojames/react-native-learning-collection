import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useOnboarding } from "../contexts/OnboardingContext";
import { formStyles } from "../styles/formStyles";

export default function DemographicInfoForm() {
  const { data, updateDemographic } = useOnboarding();
  const formData = data.demographic;

  const ageRanges = [
    "18 - 24",
    "25 - 34",
    "35 - 44",
    "45 - 54",
    "55 - 64",
    "65+",
  ];

  const genderOptions = [
    { label: "Female", icon: "female-outline" },
    { label: "Male", icon: "male-outline" },
    { label: "Non-binary", icon: "people-outline" },
    { label: "Prefer not to say", icon: "remove-circle-outline" },
  ];

  const updateField = (field: "ageRange" | "gender", value: string) => {
    updateDemographic({ [field]: value });
  };

  return (
    <View style={formStyles.wrapper}>
      <View>
        {/* Title Section */}
        <View style={formStyles.titleSection}>
          <Text style={formStyles.title}>Tell us about you</Text>
          <Text style={formStyles.subtitle}>
            This helps us personalize your care experience.
          </Text>
        </View>

        {/* Age Range Section */}
        <View style={formStyles.formGroup}>
          <Text style={formStyles.label}>
            Age range <Text style={formStyles.required}>*</Text>
          </Text>
          <View style={styles.ageRangeGrid}>
            {ageRanges.map((range) => (
              <TouchableOpacity
                key={range}
                style={[
                  styles.ageRangeButton,
                  formData.ageRange === range && styles.ageRangeButtonSelected,
                ]}
                onPress={() => updateField("ageRange", range)}
              >
                <Text
                  style={[
                    styles.ageRangeText,
                    formData.ageRange === range && styles.ageRangeTextSelected,
                  ]}
                >
                  {range}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Gender Section */}
        <View style={formStyles.formGroup}>
          <Text style={formStyles.label}>
            Gender <Text style={formStyles.optional}>(Optional)</Text>
          </Text>
          <View style={styles.genderList}>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option.label}
                style={[
                  styles.genderOption,
                  formData.gender === option.label &&
                    styles.genderOptionSelected,
                ]}
                onPress={() => updateField("gender", option.label)}
              >
                <View style={styles.genderOptionContent}>
                  <Ionicons
                    name={option.icon as any}
                    size={24}
                    color={
                      formData.gender === option.label ? "#0a7ea4" : "#687076"
                    }
                  />
                  <Text
                    style={[
                      styles.genderText,
                      formData.gender === option.label &&
                        styles.genderTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </View>
                <View
                  style={[
                    styles.radioButton,
                    formData.gender === option.label &&
                      styles.radioButtonSelected,
                  ]}
                >
                  {formData.gender === option.label && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ageRangeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  ageRangeButton: {
    width: "30%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E1E8ED",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  ageRangeButtonSelected: {
    backgroundColor: "#E6F4FE",
    borderColor: "#0a7ea4",
  },
  ageRangeText: {
    fontSize: 14,
    color: "#11181C",
    fontWeight: "500",
  },
  ageRangeTextSelected: {
    color: "#0a7ea4",
    fontWeight: "600",
  },
  genderList: {
    gap: 12,
  },
  genderOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E1E8ED",
    backgroundColor: "#fff",
  },
  genderOptionSelected: {
    borderColor: "#0a7ea4",
    backgroundColor: "#F5F9FF",
  },
  genderOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  genderText: {
    fontSize: 16,
    color: "#11181C",
  },
  genderTextSelected: {
    color: "#0a7ea4",
    fontWeight: "600",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E1E8ED",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    borderColor: "#0a7ea4",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0a7ea4",
  },
});
