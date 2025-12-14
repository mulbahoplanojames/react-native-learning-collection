import SearchSection from "@/src/components/search-section";
import CategoriesSection from "@/src/components/categories-section";
import { Colors } from "@/src/constant/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack } from "expo-router";
import React from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  View,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerStyle: {
            height: Platform.OS === "ios" ? 100 : 120,
          },
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity className="ml-3">
              <Image
                source={{
                  uri: "https://xsgames.co/randomusers/avatar.php?g=female",
                }}
                alt="Profile avatar"
                className="w-14 h-14 rounded-lg"
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity className="mr-3 bg-[#F87B1B] p-2 rounded-xl">
              <Ionicons name="notifications" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView className="flex-1 px-3">
        <SearchSection />
        <CategoriesSection />
      </ScrollView>
    </>
  );
}
