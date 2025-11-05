import { Colors } from "@/constants/colors";
import "@/global.css";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { StatusBar, useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? "light";
  // console.log(colorScheme);

  return (
    <>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.dark.background,
        }}
      >
        <Tabs.Screen
          name="foods"
          options={{
            title: "Foods",
            tabBarIcon: ({ size, focused, color }) => (
              <Ionicons
                name={focused ? "speedometer" : "speedometer-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="counter"
          options={{
            headerShown: false,
            tabBarIcon: ({ size, color, focused }) => (
              <Ionicons
                name={focused ? "time" : "time-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
