import { Text, TouchableOpacity } from "react-native";

export default function Button({ text }: { text: string }) {
  return (
    <TouchableOpacity className="bg-primary mb-4  flex justify-center items-center py-3 px-4 rounded-2xl">
      <Text className="text-white text-lg">{text}</Text>
    </TouchableOpacity>
  );
}
