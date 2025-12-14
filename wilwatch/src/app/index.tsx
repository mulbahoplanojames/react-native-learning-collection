import { Link, Stack } from "expo-router";
import {
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function WelcomeScreen() {
  const colorScheme = useColorScheme();
  return (
    <>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "light-content"}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="bg-bgColor flex-1">
        <View className="w-full h-[25rem] overflow-hidden">
          <Image
            source={require("../assets/images/turbo-01.jpg")}
            className="w-full h-full object-cover"
          />
        </View>
        <View className="justify-center items-center text-center px-4 pt-20">
          <Text className="text-white text-4xl font-bold pb-6">
            Welcome to CoolMovie
          </Text>
          <Text className="text-white text-lg text-center">
            Order snacks and drinks from your seat or while you wait, ensuring a
            smooth, uninterrupted movie experience.
          </Text>
        </View>
        <View className="flex-1 justify-end pb-10 px-6">
          <Link href="/login" asChild>
            <TouchableOpacity className="bg-primary mb-4  flex justify-center items-center py-3 px-4 rounded-2xl">
              <Text className="text-white text-lg">Login</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/register" asChild>
            <TouchableOpacity className="bg-secondary  flex justify-center items-center py-3 px-4 rounded-2xl">
              <Text className="text-white text-lg">Register</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </>
  );
}
