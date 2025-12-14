/**
 * Role Selection Screen (if needed as a separate step)
 * This is typically handled in signup, but kept for flexibility
 */

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { UserRole } from "../../../src/types/enums";
import {
  ROLE_DISPLAY_NAMES,
  ROLE_DESCRIPTIONS,
  PROVIDER_ROLES,
} from "../../../src/utils/constants";
import { colors } from "../../../src/design-system";
import { Button } from "../../../src/components/atoms";

const AVAILABLE_ROLES = [
  UserRole.PATIENT,
  UserRole.DOCTOR,
  UserRole.THERAPIST,
  UserRole.COACH,
  UserRole.HOLISTIC_PRACTITIONER,
];

export default function RoleSelectionScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      router.push(`/(auth)/onboarding/${selectedRole}`);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Choose Your Role</Text>
            <Text style={styles.subtitle}>
              Select the role that best describes you to get started
            </Text>
          </View>

          <View style={styles.rolesContainer}>
            {AVAILABLE_ROLES.map((role) => {
              const isProvider = PROVIDER_ROLES.includes(role as UserRole);
              const isSelected = selectedRole === role;

              return (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleCard,
                    isSelected && styles.roleCardSelected,
                    isProvider && styles.roleCardProvider,
                  ]}
                  onPress={() => setSelectedRole(role)}
                >
                  <Text
                    style={[
                      styles.roleTitle,
                      isSelected && styles.roleTitleSelected,
                    ]}
                  >
                    {ROLE_DISPLAY_NAMES[role]}
                  </Text>
                  <Text style={styles.roleDescription}>
                    {ROLE_DESCRIPTIONS[role]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={!selectedRole}
            fullWidth
            style={styles.continueButton}
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
  },
  rolesContainer: {
    gap: 16,
    marginBottom: 32,
  },
  roleCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral[300],
    backgroundColor: colors.background.primary,
  },
  roleCardSelected: {
    borderColor: colors.primary[600],
    backgroundColor: colors.primary[50],
  },
  roleCardProvider: {
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary[500],
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 8,
  },
  roleTitleSelected: {
    color: colors.primary[700],
  },
  roleDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  continueButton: {
    marginTop: "auto",
  },
});
