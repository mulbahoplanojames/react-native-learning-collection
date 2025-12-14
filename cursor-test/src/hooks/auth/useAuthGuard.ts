/**
 * useAuthGuard Hook
 * Protects routes based on authentication status
 */

import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "./useAuth";
import { useAuthStore } from "../../store/authStore";

export function useAuthGuard() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isLoading } = useAuth();
  const { isLoading: isStoreLoading } = useAuthStore();

  useEffect(() => {
    if (isStoreLoading || isLoading) {
      return; // Wait for auth to initialize
    }

    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home if authenticated and in auth group
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading, isStoreLoading, segments, router]);
}

