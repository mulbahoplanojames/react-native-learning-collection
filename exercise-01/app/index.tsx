import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/colors";
import { Link } from "expo-router";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      className="px-4"
    >
      <ThemedView className="items-center justify-center flex-1 w-full bg-red-60">
        <View className="absolute overflow-hidden rounded-full -right-16 top-12 size-60 ">
          <Image
            source={require("@/public/food1.jpg")}
            className="object-center w-full h-full"
          />
        </View>
        <View className="absolute overflow-hidden rounded-full -left-16 top-24 size-60 ">
          <Image
            source={require("@/public/food2.jpg")}
            className="object-center w-full h-full"
          />
        </View>
        <ThemedText className="my-12 text-black dark:text-white text-7xl">
          Appetit
        </ThemedText>
      </ThemedView>
      <Link href="/login" className="underline" asChild>
        <TouchableOpacity className="flex items-center justify-center w-full py-4 mb-20 bg-white rounded-lg">
          <ThemedText className="text-xl">Continue</ThemedText>
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
  },
  authSpace: {
    paddingTop: 20,
    color: "blue",
    fontSize: 20,
  },
});
