import popularActors from "@/src/data/popular-actors.json";
import { PopularActors } from "@/src/types/types";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import PopularActorsCard from "./popular-actors-card";

export default function PopularActorSection() {
  return (
    <>
      <View className="mt-12 flex-row justify-between items-center">
        <Text className="text-2xl text-white">Popular Actors</Text>
        <TouchableOpacity>
          <Text className="text-white">View all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={popularActors}
        keyExtractor={(item: PopularActors) => item.name}
        horizontal
        // showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingBottom: 0 }}
        style={{ height: "auto", marginBottom: 0, paddingBottom: 0 }}
        ListFooterComponent={null}
        ListHeaderComponent={null}
        ListHeaderComponentStyle={{ margin: 0, padding: 0 }}
        ListFooterComponentStyle={{ margin: 0, padding: 0 }}
        renderItem={({ item }: { item: PopularActors }) => (
          <PopularActorsCard />
        )}
      />

      <Text className="text-white text-3xl">Hkwkoojan</Text>
    </>
  );
}
