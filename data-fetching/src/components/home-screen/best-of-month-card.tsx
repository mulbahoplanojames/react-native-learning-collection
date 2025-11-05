import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Text, View } from "react-native";

export default function BestOfTheMonthCard() {
  return (
    <View className="w-full h-52 p-5 bg-gray-400/20 rounded-3xl mt-10 flex-row items-center gap-5">
      <View className="w-[30%] bg-blue-500 h-full rounded-xl overflow-hidden"></View>
      <View className="bg-pink-5 flex-1 h-full">
        <Text className="text-3xl text-white pb-2">Most Trending</Text>
        <Text className="text-xl pb-2 text-white">Spider Man 2</Text>
        <View className="flex-row gap-4">
          <Text className="text-white text-lg">*Action</Text>
          <Text className="text-white text-lg">*Trending</Text>
          <Text className="text-white text-lg">*Amazing</Text>
        </View>

        <View className="flex-row justify-between items-center mt-5">
          <View className="w-8 h-8 bg-primary rounded-full justify-center items-center">
            <Ionicons name="play" color="white" size={20} />
          </View>
          <View className="flex-row gap-1">
            <Ionicons name="star-sharp" size={20} color={"gold"} />
            <Text className="text-white text-lg">4.5</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
