import { ThemedText } from "@/components/themed-text";
import React from "react";
import { Alert, Image, TouchableOpacity, View } from "react-native";

export default function PracticeCard() {
  const name = "Richard Mulbah";
  return (
    <View className="w-full px-5 py-10 bg-white shadow shadow-slate-300 rounded-2xl">
      <View className="relative mx-auto overflow-hidden rounded-full size-32">
        <Image
          source={require("@/public/profile.jpeg")}
          className="object-cover w-full h-full"
        />
      </View>

      <ThemedText className="py-4 text-2xl font-semibold text-center">
        {name}
      </ThemedText>
      <ThemedText className="pb-4 text-center">
        I am a Liberian by nationality but i am currently basing in Rwanda for
        studies. I love building software to that help people solve real world
        problems
      </ThemedText>
      <TouchableOpacity
        onPress={() => Alert.alert("I am happy to see you again")}
        className="flex items-center justify-center px-5 py-3 text-white bg-black rounded-3xl"
      >
        <ThemedText className="text-white">View More</ThemedText>
      </TouchableOpacity>
    </View>
  );
}
