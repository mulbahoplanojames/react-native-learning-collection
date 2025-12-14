/**
 * Tabs Layout
 * Main navigation tabs for authenticated users
 */

import { Tabs } from "expo-router";
import { Platform, View } from "react-native";
import { useAuthStore } from "../../src/store/authStore";
import { UserRole } from "../../src/types/enums";

// Simple placeholder icon component
function TabIcon({ color }: { color: string }) {
  return (
    <View
      style={{
        width: 24,
        height: 24,
        backgroundColor: color,
        borderRadius: 4,
        opacity: 0.6,
      }}
    />
  );
}

export default function TabsLayout() {
  const { user } = useAuthStore();

  // Determine which tabs to show based on user role
  const isProvider =
    user?.role &&
    [
      UserRole.DOCTOR,
      UserRole.THERAPIST,
      UserRole.COACH,
      UserRole.HOLISTIC_PRACTITIONER,
    ].includes(user.role as UserRole);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#14b8a6",
        tabBarInactiveTintColor: "#6b7280",
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
          paddingTop: Platform.OS === "ios" ? 8 : 4,
          paddingBottom: Platform.OS === "ios" ? 24 : 8,
          height: Platform.OS === "ios" ? 88 : 64,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: "Appointments",
          tabBarIcon: ({ color }) => <TabIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color }) => <TabIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="health-profile"
        options={{
          title: "Health",
          tabBarIcon: ({ color }) => <TabIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: ({ color }) => <TabIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="wellness-hub"
        options={{
          title: "Wellness",
          tabBarIcon: ({ color }) => <TabIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <TabIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
