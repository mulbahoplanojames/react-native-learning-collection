import { Link, Stack, useRouter } from "expo-router";
import { Text, TextInput, View, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";

export default function LoginScreen() {
  const router = useRouter();
  const [isLoading, setIsloading] = useState(false);

  const handleRegister = () => {
    setIsloading(true);
    setTimeout(() => {
      setIsloading(false);

      router.push("/login");
    }, 3000);
  };
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerStyle: {
            backgroundColor: "#171212",
          },
          headerLeft: () => (
            <Ionicons
              name="arrow-back"
              color="white"
              size={30}
              onPress={() => router.back()}
            />
          ),
        }}
      />
      <View className="flex-1 bg-bgColor justify-center items-center px-5">
        <Text className="text-white text-3xl pb-6">Create your account</Text>
        <View className="w-full">
          <TextInput
            placeholder="Full Name"
            className="text-white bg-secondary w-full  rounded-xl h-14 pl-4 mb-6"
            placeholderTextColor="white"
          />
          <TextInput
            placeholder="Email"
            className="text-white bg-secondary w-full  rounded-xl h-14 pl-4 mb-6"
            placeholderTextColor="white"
          />

          <TextInput
            placeholder="Password"
            className="text-white bg-secondary w-full  rounded-xl h-14 pl-4"
            placeholderTextColor="white"
            secureTextEntry
          />
          <TouchableOpacity
            onPress={handleRegister}
            className="bg-primary mb-4 mt-10  flex justify-center items-center py-3 px-4 rounded-2xl"
          >
            <Text className="text-white text-lg">
              {isLoading ? "Creating account..." : "Create account"}
            </Text>
          </TouchableOpacity>
          <Text className="text-white text-lg text-center pt-12">OR</Text>
          {/*Socials links */}
          <View className="flex-row gap-6 justify-center items-center mt-10">
            <TouchableOpacity className="bg-primary w-12 h-12 flex rounded-xl justify-center items-center">
              <Ionicons name="logo-google" color={"white"} size={30} />
            </TouchableOpacity>
            <TouchableOpacity className="bg-primary w-12 h-12 flex rounded-xl justify-center items-center">
              <Ionicons name="logo-facebook" color={"white"} size={30} />
            </TouchableOpacity>
            <TouchableOpacity className="bg-primary w-12 h-12 flex rounded-xl justify-center items-center">
              <Ionicons name="logo-apple" color={"white"} size={30} />
            </TouchableOpacity>
            <TouchableOpacity className="bg-primary w-12 h-12 flex rounded-xl justify-center items-center">
              <Ionicons name="logo-microsoft" color={"white"} size={30} />
            </TouchableOpacity>
          </View>
          <Text className="text-white text-xl text-center pt-12">
            Already have an account?
            <Link href="/login" className="text-blue-500 underline">
              {" "}
              Login
            </Link>
          </Text>
        </View>
      </View>
    </>
  );
}
