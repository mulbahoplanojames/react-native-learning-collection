/**
 * Forgot Password Screen
 */

import { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { Button, Input } from "../../src/components/atoms";
import { useAuth } from "../../src/hooks/auth";
import { resetPasswordSchema, ResetPasswordFormData } from "../../src/utils/validation";
import { colors } from "../../src/design-system";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword, resetPasswordError } = useAuth();
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    email: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ResetPasswordFormData, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (field: keyof ResetPasswordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    try {
      resetPasswordSchema.parse(formData);
      setErrors({});

      resetPassword(formData.email, {
        onSuccess: () => {
          setIsSubmitted(true);
        },
        onError: (error) => {
          console.error("Reset password error:", error);
        },
      });
    } catch (error: any) {
      if (error.errors) {
        const validationErrors: Partial<Record<keyof ResetPasswordFormData, string>> = {};
        error.errors.forEach((err: any) => {
          if (err.path) {
            validationErrors[err.path[0] as keyof ResetPasswordFormData] = err.message;
          }
        });
        setErrors(validationErrors);
      }
    }
  };

  if (isSubmitted) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.content}>
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successText}>
              We've sent a password reset link to {formData.email}
            </Text>
            <Button
              title="Back to Sign In"
              onPress={() => router.replace("/(auth)/login")}
              fullWidth
              style={styles.button}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you a link to reset your password
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => handleChange("email", value)}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            {resetPasswordError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  {resetPasswordError.message || "An error occurred"}
                </Text>
              </View>
            )}

            <Button
              title="Send Reset Link"
              onPress={handleSubmit}
              fullWidth
              style={styles.submitButton}
            />

            <Link href="/(auth)/login" asChild>
              <Text style={styles.backLink}>Back to Sign In</Text>
            </Link>
          </View>
        </View>
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
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
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
  form: {
    width: "100%",
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
    fontSize: 14,
    color: colors.error[700],
  },
  submitButton: {
    marginBottom: 16,
  },
  backLink: {
    fontSize: 14,
    color: colors.primary[600],
    textAlign: "center",
    fontWeight: "500",
  },
  successContainer: {
    alignItems: "center",
  },
  successIcon: {
    fontSize: 64,
    color: colors.success[600],
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 12,
  },
  successText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    marginTop: 16,
  },
});

