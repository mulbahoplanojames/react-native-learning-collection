import React from "react";
import { Text, View } from "react-native";

export default function PopularActorsCard() {
  return (
    <View className="w-32">
      <View className="h-32 w-full bg-blue-500 rounded-xl overflow-hidden"></View>
      <Text className="text-white text-lg text-center pt-3">
        Robert L. Momo
      </Text>
    </View>
  );
}
