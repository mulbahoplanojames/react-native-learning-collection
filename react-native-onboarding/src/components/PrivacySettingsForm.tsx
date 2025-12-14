import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useOnboarding } from "../contexts/OnboardingContext";
import { formStyles } from "../styles/formStyles";

export default function PrivacySettingsForm() {
  const { data, updatePrivacySettings } = useOnboarding();
  const settings = data.privacySettings;

  const privacyOptions = [
    {
      id: "heartRate" as const,
      title: "Heart Rate",
      status: "Sharing Enabled",
      icon: "heart",
      iconColor: "#FF3B30",
      iconBgColor: "#FFE5E5",
      encrypted: false,
    },
    {
      id: "sleep" as const,
      title: "Sleep Patterns",
      status: "Private",
      icon: "moon-outline",
      iconColor: "#007AFF",
      iconBgColor: "#E5F0FF",
      encrypted: false,
    },
    {
      id: "location" as const,
      title: "Location",
      status: "Private",
      icon: "location",
      iconColor: "#34C759",
      iconBgColor: "#E5F8ED",
      encrypted: true,
    },
  ];

  const toggleSetting = (id: "heartRate" | "sleep" | "location") => {
    updatePrivacySettings({ [id]: !settings[id] });
  };

  return (
    <View style={[formStyles.wrapper, { backgroundColor: "#F8F8F8" }]}>
      <View style={formStyles.container}>
        {/* Privacy Settings Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>PRIVACY SETTINGS</Text>
            <Ionicons name="lock-closed" size={20} color="#11181C" />
          </View>

          <View style={styles.settingsList}>
            {privacyOptions.map((option) => {
              const isEnabled = settings[option.id];
              return (
                <View key={option.id} style={styles.settingItem}>
                  <View style={styles.settingContent}>
                    <View
                      style={[
                        styles.settingIcon,
                        { backgroundColor: option.iconBgColor },
                      ]}
                    >
                      <Ionicons
                        name={option.icon as any}
                        size={20}
                        color={option.iconColor}
                      />
                    </View>
                    <View style={styles.settingTextContainer}>
                      <Text style={styles.settingTitle}>{option.title}</Text>
                      {option.encrypted && isEnabled ? (
                        <View style={styles.encryptedBadge}>
                          <Ionicons
                            name="checkmark-circle"
                            size={14}
                            color="#fff"
                          />
                          <Text style={styles.encryptedText}>
                            End-to-End Encrypted
                          </Text>
                        </View>
                      ) : (
                        <Text style={styles.settingStatus}>
                          {isEnabled ? "Sharing Enabled" : option.status}
                        </Text>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[styles.toggle, isEnabled && styles.toggleActive]}
                    onPress={() => toggleSetting(option.id)}
                  >
                    <View
                      style={[
                        styles.toggleThumb,
                        isEnabled && styles.toggleThumbActive,
                      ]}
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        {/* Bottom Text */}
        <View style={styles.bottomSection}>
          <Text style={styles.bottomTitle}>You&apos;re in Control</Text>
          <Text style={styles.bottomDescription}>
            You decide what health data is shared, with whom, and when. Your
            privacy always comes first.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#11181C",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  settingsList: {
    gap: 20,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181C",
    marginBottom: 4,
  },
  settingStatus: {
    fontSize: 14,
    color: "#687076",
  },
  encryptedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#34C759",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  encryptedText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E1E8ED",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: "#0a7ea4",
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#fff",
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
  bottomSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  bottomTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#11181C",
    marginBottom: 12,
    textAlign: "center",
  },
  bottomDescription: {
    fontSize: 16,
    color: "#687076",
    textAlign: "center",
    lineHeight: 24,
  },
});
