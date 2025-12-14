/**
 * Signup Screen
 */

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { Button, Input } from "../../src/components/atoms";
import { useAuth } from "../../src/hooks/auth";
import { signUpSchema, SignUpFormData } from "../../src/utils/validation";
import { UserRole } from "../../src/types/enums";
import { ROLE_DISPLAY_NAMES, ROLE_DESCRIPTIONS } from "../../src/utils/constants";
import { colors } from "../../src/design-system";

const AVAILABLE_ROLES = [
  UserRole.PATIENT,
  UserRole.DOCTOR,
  UserRole.THERAPIST,
  UserRole.COACH,
  UserRole.HOLISTIC_PRACTITIONER,
];

export default function SignupScreen() {
  const router = useRouter();
  const { signUp, isSigningUp, signUpError } = useAuth();
  const [formData, setFormData] = useState<SignUpFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: UserRole.PATIENT,
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpFormData, string>>>({});

  const handleChange = (field: keyof SignUpFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate form
      signUpSchema.parse(formData);
      setErrors({});

      // Sign up
      signUp(
        {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || undefined,
          role: formData.role,
        },
        {
          onSuccess: () => {
            // Navigate to role-based onboarding
            router.push(`/(auth)/onboarding/${formData.role}`);
          },
          onError: (error) => {
            console.error("Sign up error:", error);
          },
        }
      );
    } catch (error: any) {
      if (error.errors) {
        const validationErrors: Partial<Record<keyof SignUpFormData, string>> = {};
        error.errors.forEach((err: any) => {
          if (err.path) {
            validationErrors[err.path[0] as keyof SignUpFormData] = err.message;
          }
        });
        setErrors(validationErrors);
      }
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
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join KoloHealth to get started</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.nameRow}>
                <View style={[styles.nameField, { marginRight: 8 }]}>
                  <Input
                    label="First Name"
                    placeholder="John"
                    value={formData.firstName}
                    onChangeText={(value) => handleChange("firstName", value)}
                    error={errors.firstName}
                    autoCapitalize="words"
                  />
                </View>
                <View style={[styles.nameField, { marginLeft: 8 }]}>
                  <Input
                    label="Last Name"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChangeText={(value) => handleChange("lastName", value)}
                    error={errors.lastName}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <Input
                label="Email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChangeText={(value) => handleChange("email", value)}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <Input
                label="Phone (Optional)"
                placeholder="+1234567890"
                value={formData.phone}
                onChangeText={(value) => handleChange("phone", value)}
                error={errors.phone}
                keyboardType="phone-pad"
                autoComplete="tel"
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChangeText={(value) => handleChange("password", value)}
                error={errors.password}
                secureTextEntry
                autoCapitalize="none"
                helperText="At least 8 characters with uppercase, lowercase, and number"
              />

              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChangeText={(value) => handleChange("confirmPassword", value)}
                error={errors.confirmPassword}
                secureTextEntry
                autoCapitalize="none"
              />

              <View style={styles.roleSection}>
                <Text style={styles.roleLabel}>I am a:</Text>
                <View style={styles.roleGrid}>
                  {AVAILABLE_ROLES.map((role) => (
                    <TouchableOpacity
                      key={role}
                      style={[
                        styles.roleCard,
                        formData.role === role && styles.roleCardSelected,
                      ]}
                      onPress={() => handleChange("role", role)}
                    >
                      <Text
                        style={[
                          styles.roleCardText,
                          formData.role === role && styles.roleCardTextSelected,
                        ]}
                      >
                        {ROLE_DISPLAY_NAMES[role]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}
              </View>

              <TouchableOpacity
                style={styles.termsContainer}
                onPress={() => handleChange("acceptTerms", !formData.acceptTerms)}
              >
                <View
                  style={[
                    styles.checkbox,
                    formData.acceptTerms && styles.checkboxChecked,
                  ]}
                >
                  {formData.acceptTerms && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.termsText}>
                  I agree to the Terms of Service and Privacy Policy
                </Text>
              </TouchableOpacity>
              {errors.acceptTerms && (
                <Text style={styles.errorText}>{errors.acceptTerms}</Text>
              )}

              {signUpError && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>
                    {signUpError.message || "An error occurred during sign up"}
                  </Text>
                </View>
              )}

              <Button
                title="Create Account"
                onPress={handleSubmit}
                loading={isSigningUp}
                fullWidth
                style={styles.submitButton}
              />

              <View style={styles.loginLink}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <Link href="/(auth)/login" asChild>
                  <Text style={styles.loginLinkText}>Sign In</Text>
                </Link>
              </View>
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
  nameRow: {
    flexDirection: "row",
    marginBottom: 0,
  },
  nameField: {
    flex: 1,
  },
  roleSection: {
    marginBottom: 16,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 12,
  },
  roleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  roleCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    backgroundColor: colors.background.primary,
    minWidth: "30%",
  },
  roleCardSelected: {
    borderColor: colors.primary[600],
    backgroundColor: colors.primary[50],
  },
  roleCardText: {
    fontSize: 14,
    color: colors.text.primary,
    textAlign: "center",
    fontWeight: "500",
  },
  roleCardTextSelected: {
    color: colors.primary[700],
    fontWeight: "600",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.neutral[400],
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    borderColor: colors.primary[600],
    backgroundColor: colors.primary[600],
  },
  checkmark: {
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: "bold",
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  errorContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: colors.error[50],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error[200],
  },
  errorText: {
    fontSize: 12,
    color: colors.error[700],
  },
  submitButton: {
    marginBottom: 24,
  },
  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  loginLinkText: {
    fontSize: 14,
    color: colors.primary[600],
    fontWeight: "600",
  },
});
