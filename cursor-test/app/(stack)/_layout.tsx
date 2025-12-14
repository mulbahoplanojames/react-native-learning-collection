/**
 * Stack Layout
 * Modal and detail screens
 */

import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#ffffff",
        },
        headerTintColor: "#111827",
        headerTitleStyle: {
          fontWeight: "600",
        },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="appointment-details/[id]"
        options={{ title: "Appointment Details" }}
      />
      <Stack.Screen
        name="book-appointment"
        options={{ title: "Book Appointment" }}
      />
      <Stack.Screen name="chat/[id]" options={{ title: "Chat" }} />
      <Stack.Screen name="group-chat/[id]" options={{ title: "Group Chat" }} />
      <Stack.Screen name="new-chat" options={{ title: "New Chat" }} />
      <Stack.Screen
        name="provider-profile/[id]"
        options={{ title: "Provider Profile" }}
      />
      <Stack.Screen
        name="health-record/[id]"
        options={{ title: "Health Record" }}
      />
      <Stack.Screen
        name="video-consultation/[id]"
        options={{ title: "Video Consultation" }}
      />
      <Stack.Screen
        name="wellness-content/[id]"
        options={{ title: "Wellness Content" }}
      />
      <Stack.Screen
        name="circle-detail/[id]"
        options={{ title: "Circle" }}
      />
      <Stack.Screen
        name="create-circle"
        options={{ title: "Create Circle" }}
      />
      <Stack.Screen
        name="create-post"
        options={{ title: "Create Post" }}
      />
      <Stack.Screen
        name="post-detail/[id]"
        options={{ title: "Post" }}
      />
      <Stack.Screen name="+not-found" options={{ title: "Not Found" }} />
    </Stack>
  );
}
