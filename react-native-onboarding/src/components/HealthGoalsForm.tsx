import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useOnboarding } from "../contexts/OnboardingContext";
import { formStyles } from "../styles/formStyles";

interface HealthGoal {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

export default function HealthGoalsForm() {
  const { data, updateHealthGoals } = useOnboarding();
  const selectedGoals = data.healthGoals;

  const healthGoals: HealthGoal[] = [
    {
      id: "physical",
      title: "Physical Health",
      subtitle: "Medical care & checkups",
      icon: "medical-outline",
    },
    {
      id: "mental",
      title: "Mental Wellness",
      subtitle: "Emotional support & therapy",
      icon: "brain-outline",
    },
    {
      id: "fitness",
      title: "Fitness & Lifestyle",
      subtitle: "Exercise & nutrition plans",
      icon: "barbell-outline",
    },
    {
      id: "holistic",
      title: "Holistic Practices",
      subtitle: "Mindfulness & meditation",
      icon: "leaf-outline",
    },
    {
      id: "community",
      title: "Community Support",
      subtitle: "Peer groups & events",
      icon: "people-outline",
    },
  ];

  const toggleGoal = (goalId: string) => {
    const newGoals = selectedGoals.includes(goalId)
      ? selectedGoals.filter((id) => id !== goalId)
      : [...selectedGoals, goalId];
    updateHealthGoals(newGoals);
  };

  return (
    <View style={formStyles.wrapper}>
      <View>
        {/* Title Section */}
        <View style={formStyles.titleSection}>
          <Text style={formStyles.title}>What Are Your Health Goals?</Text>
          <Text style={formStyles.subtitle}>
            Select all that apply to help us personalize your care plan.
          </Text>
        </View>

        {/* Health Goals List */}
        <View style={styles.goalsList}>
          {healthGoals.map((goal) => {
            const isSelected = selectedGoals.includes(goal.id);
            return (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.goalOption,
                  isSelected && styles.goalOptionSelected,
                ]}
                onPress={() => toggleGoal(goal.id)}
              >
                <View style={styles.goalContent}>
                  <View
                    style={[
                      styles.goalIcon,
                      isSelected && styles.goalIconSelected,
                    ]}
                  >
                    <Ionicons name={goal.icon as any} size={24} color="#fff" />
                  </View>
                  <View style={styles.goalTextContainer}>
                    <Text
                      style={[
                        styles.goalTitle,
                        isSelected && styles.goalTitleSelected,
                      ]}
                    >
                      {goal.title}
                    </Text>
                    <Text style={styles.goalSubtitle}>{goal.subtitle}</Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.checkbox,
                    isSelected && styles.checkboxSelected,
                  ]}
                >
                  {isSelected && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0a7ea4",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  goalsList: {
    gap: 12,
  },
  goalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F8F8F8",
    borderWidth: 2,
    borderColor: "transparent",
  },
  goalOptionSelected: {
    backgroundColor: "#fff",
    borderColor: "#0a7ea4",
  },
  goalContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 16,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#0a7ea4",
    alignItems: "center",
    justifyContent: "center",
  },
  goalIconSelected: {
    backgroundColor: "#0a7ea4",
  },
  goalTextContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181C",
    marginBottom: 4,
  },
  goalTitleSelected: {
    color: "#0a7ea4",
  },
  goalSubtitle: {
    fontSize: 14,
    color: "#687076",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E1E8ED",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: "#0a7ea4",
    borderColor: "#0a7ea4",
  },
});
