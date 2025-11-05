import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ThemedText>RegisterScreen</ThemedText>
      <Link href="/" style={styles.authSpace}>
        Back
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authSpace: {
    paddingTop: 20,
    color: "blue",
    fontSize: 20,
  },
});
