import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { categories } from "@/src/data/data.ts";
import { useState } from "react";
import { Colors } from "../constant/colors";
import CategoriesList from "./categories-list";

export default function CategoriesSection() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  return (
    <View>
      <Text className="text-2xl font-bold" style={{ marginBottom: 10 }}>
        Categories
      </Text>

      <ScrollView
        horizontal
        contentContainerStyle={{
          gap: 8,
        }}
        showsHorizontalScrollIndicator={false}
      >
        {categories.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setSelectedCategory(c)}
            className={`rounded-xl px-5 py-2 ${
              selectedCategory === c ? `bg-[${Colors.primary}]` : "bg-white"
            }`}
          >
            <Text
              className={`text-lg font-bold ${
                selectedCategory === c ? "text-white" : "text-gray-800"
              }`}
            >
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <CategoriesList />
    </View>
  );
}
