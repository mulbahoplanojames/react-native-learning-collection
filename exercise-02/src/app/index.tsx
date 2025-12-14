import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      className="bg-black"
    >
      <Text className="text-2xl text-red-500">Welcome back legend</Text>
      <Link
        href={"/(tabs)/home"}
        style={{ fontSize: 30, color: "blue", marginTop: 10 }}
      >
        Login
      </Link>
    </View>
  );
}
