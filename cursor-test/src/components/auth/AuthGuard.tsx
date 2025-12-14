/**
 * Auth Guard Component
 * Handles route protection and navigation based on auth state
 */

import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "../../hooks/auth";
import { useAuthStore } from "../../store/authStore";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "../../design-system";
import { hasCompletedOnboarding } from "../../utils/onboarding";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const segments = useSegments();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { isLoading: isStoreLoading } = useAuthStore();

  useEffect(() => {
    if (isStoreLoading || isLoading) {
      return; // Wait for auth to initialize
    }

    // Get segments for navigation logic
    const firstSegment = segments[0];
    const secondSegment = segments[1] as string | undefined;
    const inAuthGroup = firstSegment === "(auth)";
    const inOnboardingGroup =
      firstSegment === "(auth)" && secondSegment === "onboarding";
    const inTabsGroup = firstSegment === "(tabs)";
    const inStackGroup = firstSegment === "(stack)";

    // Determine target route based on auth and onboarding status
    let targetRoute: string | null = null;

    if (!isAuthenticated) {
      // Not authenticated - should be on login (or signup/forgot-password)
      if (
        !firstSegment || // No segments yet (initial load)
        !inAuthGroup ||
        (inAuthGroup &&
          secondSegment !== "login" &&
          secondSegment !== "signup" &&
          secondSegment !== "forgot-password")
      ) {
        targetRoute = "/(auth)/login";
      }
    } else {
      // Authenticated - check onboarding status
      const onboardingComplete = hasCompletedOnboarding(user);

      if (!onboardingComplete) {
        // User hasn't completed onboarding - should be on onboarding
        if (!firstSegment || !inOnboardingGroup) {
          targetRoute = "/(auth)/onboarding/role-selection";
        }
      } else {
        // User has completed onboarding - should be on home
        if (!firstSegment || (inAuthGroup && !inOnboardingGroup)) {
          targetRoute = "/(tabs)";
        }
      }
    }

    // Navigate if we have a target route
    if (targetRoute) {
      const timeoutId = setTimeout(() => {
        router.replace(targetRoute as any);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [isAuthenticated, isLoading, isStoreLoading, segments, router, user]);

  // Show loading screen while checking auth
  if (isStoreLoading || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.primary,
  },
});
