import "@/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar, useColorScheme } from "react-native";
const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? "light";
  // console.log(colorScheme);

  return (
    <>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
      <QueryClientProvider client={queryClient}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" options={{}} />
          <Stack.Screen name="login" options={{}} />
          <Stack.Screen name="register" options={{}} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </QueryClientProvider>
    </>
  );
}
