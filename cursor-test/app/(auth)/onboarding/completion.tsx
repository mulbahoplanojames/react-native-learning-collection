/**
 * Onboarding Completion Screen
 */

import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Button } from "../../../src/components/atoms";
import { useAuth } from "../../../src/hooks/auth";
import { colors } from "../../../src/design-system";

export default function OnboardingCompletionScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Auto-navigate after 3 seconds if authenticated
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        router.replace("/(tabs)");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, router]);

  const handleContinue = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>✓</Text>
        </View>

        <Text style={styles.title}>Welcome to KoloHealth!</Text>
        <Text style={styles.subtitle}>
          {user?.firstName
            ? `Hi ${user.firstName}, your account is all set up.`
            : "Your account is all set up."}
        </Text>
        <Text style={styles.description}>
          You're ready to start your holistic health journey. Let's get started!
        </Text>

        <Button
          title="Get Started"
          onPress={handleContinue}
          fullWidth
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.success[100],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  icon: {
    fontSize: 64,
    color: colors.success[600],
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text.secondary,
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: colors.text.tertiary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 48,
    paddingHorizontal: 16,
  },
  button: {
    maxWidth: 300,
  },
});

