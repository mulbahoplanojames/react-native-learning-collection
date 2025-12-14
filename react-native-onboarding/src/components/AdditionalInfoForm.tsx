import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useOnboarding } from "../contexts/OnboardingContext";
import { formStyles } from "../styles/formStyles";

export default function AdditionalInfoForm() {
  const { data, updateAdditionalInfo } = useOnboarding();
  const { topics, notes } = data.additionalInfo;

  const commonTopics = [
    "Stress",
    "Sleep",
    "Mobility",
    "Nutrition",
    "Chronic Pain",
    "Anxiety",
  ];

  const toggleTopic = (topic: string) => {
    const newTopics = topics.includes(topic)
      ? topics.filter((t) => t !== topic)
      : [...topics, topic];
    updateAdditionalInfo({ topics: newTopics });
  };

  return (
    <View style={[formStyles.wrapper, { backgroundColor: "#F8F8F8" }]}>
      <View>
        {/* Title Section */}
        <View style={[formStyles.titleSection, { alignItems: "center" }]}>
          <Text style={[formStyles.title, { textAlign: "center" }]}>
            Anything you&apos;d like us to know?
          </Text>
          <Text style={[formStyles.subtitle, { textAlign: "center" }]}>
            Share optional health considerations to help us tailor content and
            recommendations. You can skip this step.
          </Text>
        </View>

        {/* Common Topics Section */}
        <View style={formStyles.formGroup}>
          <Text style={formStyles.label}>Common Topics</Text>
          <View style={styles.topicsContainer}>
            {commonTopics.map((topic) => {
              const isSelected = topics.includes(topic);
              return (
                <TouchableOpacity
                  key={topic}
                  style={[
                    styles.topicPill,
                    isSelected && styles.topicPillSelected,
                  ]}
                  onPress={() => toggleTopic(topic)}
                >
                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color="#fff"
                      style={styles.checkmarkIcon}
                    />
                  )}
                  <Text
                    style={[
                      styles.topicText,
                      isSelected && styles.topicTextSelected,
                    ]}
                  >
                    {topic}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Additional Notes Section */}
        <View style={formStyles.formGroup}>
          <Text style={formStyles.label}>Additional Notes</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., I prefer plant-based diets and have a knee injury..."
              placeholderTextColor="#687076"
              value={notes}
              onChangeText={(value) => updateAdditionalInfo({ notes: value })}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <View style={styles.textInputIcon}>
              <Ionicons name="create-outline" size={20} color="#687076" />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topicsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  topicPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E1E8ED",
    backgroundColor: "#fff",
  },
  topicPillSelected: {
    backgroundColor: "#0a7ea4",
    borderColor: "#0a7ea4",
  },
  checkmarkIcon: {
    marginRight: 6,
  },
  topicText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#11181C",
  },
  topicTextSelected: {
    color: "#fff",
  },
  textInputContainer: {
    position: "relative",
  },
  textInput: {
    minHeight: 120,
    padding: 16,
    paddingRight: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E1E8ED",
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#11181C",
    textAlignVertical: "top",
  },
  textInputIcon: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
});
