import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TextInput, TouchableOpacity, View } from "react-native";
import { Colors } from "../constant/colors";

export default function SearchSection() {
  return (
    <View className="my-6 flex-row items-center gap-4">
      <View className="bg-white flex-1 rounded-xl overflow-hidden flex-row items-center gap-1 pl-2">
        <Ionicons name="search" size={24} />
        <TextInput
          placeholder="Search Place"
          className="h-14 bg-red-dksjdsjd00 pl-3 flex-1"
        />
      </View>
      <TouchableOpacity
        className={`w-12 h-12 rounded-lg bg-[${Colors.primary}] items-center justify-center`}
      >
        <MaterialIcons name="list-alt" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}
