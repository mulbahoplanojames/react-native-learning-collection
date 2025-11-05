import { Link } from "expo-router";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MoviesScreen() {
  return (
    <SafeAreaView className="px-2 bg-black flex-1">
      <Text>MoviesScreen</Text>
      <Link href="/" className="text-3xl text-blue-500 pt-20">
        Back home
      </Link>
    </SafeAreaView>
  );
}
