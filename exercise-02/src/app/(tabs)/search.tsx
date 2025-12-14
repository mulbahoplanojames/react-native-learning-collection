import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
  return (
    <SafeAreaView className="flex-1 px-2 bg-black">
      <View>
        <Text className="text-white">Search Screen</Text>
      </View>
    </SafeAreaView>
  );
}
