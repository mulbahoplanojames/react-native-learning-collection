import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import React from "react";
import { StatusBar } from "react-native";

export default function TabsLayout() {
  return (
    <>
      <StatusBar animated={true} barStyle="light-content" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "#f2f2f2",
          tabBarStyle: {
            backgroundColor: "#ef233c",
          },
        }}
      >
        <Tabs.Screen
          name="games"
          options={{
            title: "Games",
            headerShown: false,
            tabBarIcon: ({ focused, size = 30, color }) => (
              <Ionicons
                color={color}
                size={size}
                name={
                  focused ? "game-controller-sharp" : "game-controller-outline"
                }
              />
            ),
          }}
        />
        <Tabs.Screen
          name="movies"
          options={{
            title: "Movies",
            headerShown: false,
            tabBarIcon: ({ focused, size = 30, color }) => (
              <Ionicons
                color={color}
                size={size}
                name={focused ? "play-sharp" : "play-outline"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="products"
          options={{
            title: "Products",
            headerShown: false,
            tabBarIcon: ({ focused, size = 30, color }) => (
              <Ionicons
                color={color}
                size={size}
                name={focused ? "cart-sharp" : "cart-outline"}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
