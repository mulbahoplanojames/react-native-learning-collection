/**
 * Role-Based Onboarding Screen
 * Dynamic onboarding based on selected role
 */

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, Input } from "../../../src/components/atoms";
import { UserRole, PROVIDER_ROLES } from "../../../src/utils/constants";
import { onboardingSchema, OnboardingFormData } from "../../../src/utils/validation";
import { colors } from "../../../src/design-system";
import { usersService } from "../../../src/services/api/users.service";
import { useAuth } from "../../../src/hooks/auth";

export default function RoleOnboardingScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role: string }>();
  const { user, refetchUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof OnboardingFormData, string>>>({});

  const userRole = role as UserRole;
  const isProvider = PROVIDER_ROLES.includes(userRole as UserRole);

  const [formData, setFormData] = useState<OnboardingFormData>({
    dateOfBirth: "",
    gender: undefined,
    specialization: "",
    licenseNumber: "",
    bio: "",
  });

  const handleChange = (field: keyof OnboardingFormData, value: string | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate form
      onboardingSchema.parse(formData);
      setErrors({});
      setIsSubmitting(true);

      if (!user) {
        console.error("User not found");
        return;
      }

      // Update user profile
      await usersService.updateUserProfile(user.id, {
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
      });

      // If provider, create provider profile
      if (isProvider && user) {
        // TODO: Create provider profile
        // await providersService.createProviderProfile(user.id, {
        //   specialization: formData.specialization,
        //   licenseNumber: formData.licenseNumber,
        //   bio: formData.bio,
        // });
      }

      // Refresh user data
      await refetchUser();

      // Navigate to completion screen
      router.replace("/(auth)/onboarding/completion");
    } catch (error: any) {
      if (error.errors) {
        const validationErrors: Partial<Record<keyof OnboardingFormData, string>> = {};
        error.errors.forEach((err: any) => {
          if (err.path) {
            validationErrors[err.path[0] as keyof OnboardingFormData] = err.message;
          }
        });
        setErrors(validationErrors);
      }
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Complete Your Profile</Text>
              <Text style={styles.subtitle}>
                Help us personalize your KoloHealth experience
              </Text>
            </View>

            <View style={styles.form}>
              <Input
                label="Date of Birth (Optional)"
                placeholder="YYYY-MM-DD"
                value={formData.dateOfBirth}
                onChangeText={(value) => handleChange("dateOfBirth", value)}
                error={errors.dateOfBirth}
              />

              {isProvider && (
                <>
                  <Input
                    label="Specialization"
                    placeholder="e.g., Cardiology, Pediatrics, etc."
                    value={formData.specialization}
                    onChangeText={(value) => handleChange("specialization", value)}
                    error={errors.specialization}
                  />

                  <Input
                    label="License Number (Optional)"
                    placeholder="Enter your license number"
                    value={formData.licenseNumber}
                    onChangeText={(value) => handleChange("licenseNumber", value)}
                    error={errors.licenseNumber}
                  />

                  <Input
                    label="Bio (Optional)"
                    placeholder="Tell us about yourself"
                    value={formData.bio}
                    onChangeText={(value) => handleChange("bio", value)}
                    error={errors.bio}
                    multiline
                    numberOfLines={4}
                  />
                </>
              )}

              <Button
                title="Complete Setup"
                onPress={handleSubmit}
                loading={isSubmitting}
                fullWidth
                style={styles.submitButton}
              />

              <Button
                title="Skip for Now"
                onPress={() => router.replace("/(auth)/onboarding/completion")}
                variant="ghost"
                fullWidth
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  keyboardView: {
    flex: 1,
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
  },
  form: {
    width: "100%",
  },
  submitButton: {
    marginBottom: 16,
  },
});

