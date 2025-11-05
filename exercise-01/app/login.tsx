import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  return (
    <SafeAreaView
      style={{ backgroundColor: theme.background }}
      className="flex-1 px-5 pt-4 "
    >
      <View className="flex flex-row items-center justify-between mb-36">
        <Link href="/" asChild>
          <TouchableOpacity className="flex items-center justify-center bg-white rounded-full size-10">
            <Ionicons name="arrow-back" color={"#78350f"} size={25} />
          </TouchableOpacity>
        </Link>
        <Link href="/register" asChild>
          <ThemedText className="text-lg font-semibold text-white">
            Register
          </ThemedText>
        </Link>
      </View>
      <ThemedText className="pb-10 text-6xl font-bold text-white ">
        Login
      </ThemedText>
      <ThemedText className="text-white ">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum, sed!
      </ThemedText>
      <Link href="/" style={styles.authSpace} className="mb-20">
        Back
      </Link>

      <Link href="/(tabs)/foods" className="underline" asChild>
        <TouchableOpacity className="flex items-center justify-center w-full py-4 mb-20 bg-white rounded-lg">
          <ThemedText className="text-xl">Login</ThemedText>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  authSpace: {
    paddingTop: 20,
    color: "blue",
    fontSize: 20,
  },
});
