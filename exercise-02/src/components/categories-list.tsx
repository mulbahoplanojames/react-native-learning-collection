import { FlatList, View } from "react-native";
import categoriesList from "@/src/data/categories-list.json";
import { CategoryList } from "../type/type";
import LocationCard from "./location-card";

export default function CategoriesList() {
  return (
    <View className="my-6">
      <FlatList
        data={categoriesList}
        renderItem={({ item }: { item: CategoryList }) => (
          <LocationCard item={item} />
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        contentContainerStyle={{ gap: 13 }}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
