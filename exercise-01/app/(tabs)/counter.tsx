import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CounterScreen() {
  const [counter, setCounter] = useState(0);
  return (
    <SafeAreaView className="flex-1 bg-[#78350f] text-white">
      <Text className="pt-4 pb-20 text-4xl text-center text-white ">
        Simple Counter
      </Text>

      <View className="flex items-center justify-center mx-auto bg-white rounded-full size-72">
        <Text className="text-6xl font-bold">{counter}</Text>
      </View>

      <View className="flex flex-row items-center justify-center gap-16 mt-16">
        <TouchableOpacity
          className="px-4 py-2 bg-white rounded-2xl"
          onPress={() => setCounter((pre) => pre - 1)}
        >
          <Text className="text-2xl">-</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="px-4 py-2 bg-white rounded-2xl"
          onPress={() => setCounter(0)}
        >
          <Text className="text-2xl">Reset Counter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="px-4 py-2 bg-white rounded-2xl"
          onPress={() => setCounter((pre) => pre + 1)}
        >
          <Text className="text-2xl">+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
