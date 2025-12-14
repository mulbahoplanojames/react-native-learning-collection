/**
 * Login Screen
 */

import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { Button, Input } from "../../src/components/atoms";
import { useAuth } from "../../src/hooks/auth";
import { signInSchema, SignInFormData } from "../../src/utils/validation";
import { colors } from "../../src/design-system";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, isSigningIn, signInError } = useAuth();
  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SignInFormData, string>>>({});

  const handleChange = (field: keyof SignInFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate form
      signInSchema.parse(formData);
      setErrors({});

      // Sign in
      signIn(formData, {
        onSuccess: () => {
          router.replace("/(tabs)");
        },
        onError: (error) => {
          console.error("Sign in error:", error);
        },
      });
    } catch (error: any) {
      if (error.errors) {
        const validationErrors: Partial<Record<keyof SignInFormData, string>> = {};
        error.errors.forEach((err: any) => {
          if (err.path) {
            validationErrors[err.path[0] as keyof SignInFormData] = err.message;
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
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue to KoloHealth</Text>
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

              <Input
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChangeText={(value) => handleChange("password", value)}
                error={errors.password}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
              />

              {signInError && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>
                    {signInError.message || "Invalid email or password"}
                  </Text>
                </View>
              )}

              <Link href="/(auth)/forgot-password" asChild>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </Link>

              <Button
                title="Sign In"
                onPress={handleSubmit}
                loading={isSigningIn}
                fullWidth
                style={styles.submitButton}
              />

              <View style={styles.signupLink}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <Link href="/(auth)/signup" asChild>
                  <Text style={styles.signupLinkText}>Sign Up</Text>
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
  forgotPassword: {
    fontSize: 14,
    color: colors.primary[600],
    textAlign: "right",
    marginBottom: 24,
    fontWeight: "500",
  },
  submitButton: {
    marginBottom: 24,
  },
  signupLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  signupLinkText: {
    fontSize: 14,
    color: colors.primary[600],
    fontWeight: "600",
  },
});
