import { categories } from "@/src/data/categories";
import { featuredItems } from "@/src/data/feature-items";
import { CategoriesType, FeaturedItemsType } from "@/src/type/type";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack } from "expo-router";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <>
              <TouchableOpacity className="mr-4">
                <Ionicons name="cart-outline" size={30} color={"white"} />
              </TouchableOpacity>
            </>
          ),
          title: "Wilwatch",
        }}
      />
      <ScrollView className=" px-3 bg-bgColor">
        <View className="mt-7">
          <View className="w-full bg-[#382E29] h-14 rounded-xl pl-2 overflow-hidden flax gap-2 flex-row items-center ">
            <Ionicons name="search" size={26} color={"white"} />
            <TextInput
              className="flex-1 bg-re-400 h-full text-white"
              placeholder="Search  for snacks & drinks"
              placeholderTextColor="white"
            />
          </View>
          <Text className="text-white font-black text-2xl mt-6">
            Rewards & Offers
          </Text>
          <View className="mt-6">
            <TouchableOpacity className="w-full h-64 rounded-3xl overflow-hidden">
              <Image
                source={require("../../assets/images/offer1.png")}
                className="w-full h-full object-cover"
              />
            </TouchableOpacity>
            <TouchableOpacity className="w-full h-64 rounded-3xl mt-6 overflow-hidden">
              <Image
                source={require("../../assets/images/offer.png")}
                className="w-full h-full object-cover"
              />
            </TouchableOpacity>
          </View>

          <Text className="text-white font-bold text-2xl mt-10 pb-6">
            Categories
          </Text>
          <View>
            <FlatList
              data={categories}
              renderItem={({ item }: { item: CategoriesType }) => (
                <View className="flex-col gap-2 items-center">
                  <TouchableOpacity className="w-24 h-24 border-2 border-primary rounded-3xl overflow-hidden">
                    <Image
                      source={item.image as ImageSourcePropType}
                      className="w-full h-full object-cover "
                    />
                  </TouchableOpacity>
                  <Text className="text-white">{item.name}</Text>
                </View>
              )}
              horizontal
              contentContainerStyle={{
                gap: 15,
              }}
              keyExtractor={(item) => item.name}
            />
          </View>

          <Text className="text-white font-bold text-2xl mt-10 pb-6">
            Featured Items
          </Text>
          <View>
            <FlatList
              data={featuredItems}
              renderItem={({ item }: { item: FeaturedItemsType }) => (
                <View className="flex-col gap-2 ">
                  <TouchableOpacity className="w-64 h-60 rounded-3xl overflow-hidden">
                    <Image
                      source={item.image as ImageSourcePropType}
                      className="w-full h-full object-cover"
                    />
                  </TouchableOpacity>
                  <View>
                    <Text className="text-white font-bold text-xl pb-1">
                      {item.name}
                    </Text>
                    <Text className="text-white">{item.description}</Text>
                  </View>
                </View>
              )}
              horizontal
              contentContainerStyle={{
                gap: 15,
              }}
              keyExtractor={(item) => item.name}
            />
          </View>

          <Text className="text-white font-bold text-2xl mt-10 pb-6">
            Promotions
          </Text>

          <View className="mb-6 flex flex-row">
            <View>
              <Text className="text-white text-lg pb-2">Limited Time</Text>
              <Text className="text-white text-3xl font-bold pb-2">
                20% Off Combos
              </Text>
              <Text className="text-white text-lg">
                Get a discount on popcorn and drink combos
              </Text>
              <TouchableOpacity>
                <Text className="text-white">Order Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
