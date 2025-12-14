import { StyleSheet } from "react-native";

export const formStyles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    padding: 20,
    overflow: "visible",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#11181C",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#687076",
    lineHeight: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181C",
    marginBottom: 16,
  },
  required: {
    color: "#0a7ea4",
  },
  optional: {
    fontSize: 14,
    fontWeight: "400",
    color: "#687076",
  },
});
