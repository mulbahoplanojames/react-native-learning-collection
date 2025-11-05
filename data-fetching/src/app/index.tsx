import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-primary px-6 ">
      <View className=" justify-center items-center flex-1 ">
        <Text className="text-white text-7xl text-center">Mogavia</Text>
      </View>

      <Link href="/(tabs)/games" asChild>
        <TouchableOpacity className="bg-white w-full rounded-3xl py-5 px-8 text-center flex justify-center items-center mb-20">
          <Text className="text-primary text-lg font-bold">Start for free</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
