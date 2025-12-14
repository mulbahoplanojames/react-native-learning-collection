/**
 * Onboarding Layout
 */

import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="role-selection" />
      <Stack.Screen name="[role]" />
      <Stack.Screen name="completion" />
    </Stack>
  );
}
