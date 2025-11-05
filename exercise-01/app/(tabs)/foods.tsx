import { ThemedView } from "@/components/themed-view";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discouniPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  thumbnail: string;
}

const fetchProducts = async (): Promise<Product[]> => {
  try {
    const res = await axios.get("https://dummyjson.com/products");
    // The API returns { products: [...] }
    return res.data.products as Product[];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default function FoodsScreen() {
  const { data: products, isPending } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  console.log(products);

  return (
    <SafeAreaView className="flex-1 bg-[#78350f] px-3">
      {isPending && <Text>Loaing Products</Text>}
      <View className="flex-row items-center justify-between mt-4 mb-8">
        <View className="w-20 h-20 bg-white rounded-full"></View>
      </View>
      <FlatList
        data={products ?? []}
        keyExtractor={(item: Product) => item.id.toString()}
        renderItem={({ item }: { item: Product }) => (
          <ThemedView className="p-6 my-2 bg-white rounded-2xl">
            <View className="w-full overflow-hidden bg-red-20 h-52 rounded-xl">
              <Image
                source={{ uri: item.thumbnail }}
                className="object-contain object-center w-full h-full"
              />
            </View>
            <Text className="py-4 text-2xl">{item.title}</Text>
            <Text className="pb-4 text-lg">{item.description}</Text>
            <Text className="py-4 text-2xl text-orange-600">${item.price}</Text>
          </ThemedView>
        )}
      />
    </SafeAreaView>
  );
}
