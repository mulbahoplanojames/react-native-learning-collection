import { Image, Text, TouchableOpacity, View } from "react-native";
import { CategoryList } from "../type/type";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function LocationCard({ item }: { item: CategoryList }) {
  return (
    <TouchableOpacity className="bg-white p-3 rounded-xl">
      <View className="relative mb-4">
        <View className="w-64 h-64 rounded-lg  overflow-hidden">
          <Image source={{ uri: item.image }} className="w-full h-full" />
        </View>
        <View className="w-12 h-12 bg-primary absolute -bottom-4 right-5 rounded-full z-10 justify-center items-center  ">
          <Ionicons name="bookmark-outline" color="white" size={24} />
        </View>
      </View>
      <Text
        className="font-bold text-xl"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {item.locationName}
      </Text>
      <View className="flex-row items-center justify-between mt-3">
        <View className="flex-row gap-1">
          <Ionicons name="locate" size={20} color={"#F87B1B"} />
          <Text>{item.more.country}</Text>
        </View>

        <View>
          <Text className="text-primary font-bold">${item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
