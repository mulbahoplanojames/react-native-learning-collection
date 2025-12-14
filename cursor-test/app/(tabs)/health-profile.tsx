/**
 * Health Profile Screen
 * Main screen for viewing and managing health profile
 */

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useHealthProfile } from "../../src/hooks/data/useHealthProfile";
import { useHealthRecords } from "../../src/hooks/data/useHealthRecords";
import { HealthProfileForm } from "../../src/components/organisms/forms";
import { Button } from "../../src/components/atoms";
import { colors, spacing } from "../../src/design-system";
import { RecordType } from "../../src/types/enums";

type TabType = "overview" | "profile" | "medications" | "records";

export default function HealthProfileScreen() {
  const router = useRouter();
  const { healthProfile, isLoading, refetch, update, isUpdating } = useHealthProfile();
  const { healthRecords, isLoading: isLoadingRecords } = useHealthRecords();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleSave = (data: any) => {
    update(data, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "profile", label: "Profile" },
    { id: "medications", label: "Medications" },
    { id: "records", label: "Records" },
  ];

  const renderOverview = () => {
    if (!healthProfile) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No health profile found</Text>
          <Text style={styles.emptyStateSubtext}>
            Complete your profile to get started
          </Text>
          <Button
            title="Create Profile"
            onPress={() => setIsEditing(true)}
            style={styles.emptyStateButton}
          />
        </View>
      );
    }

    return (
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Blood Type:</Text>
            <Text style={styles.infoValue}>
              {healthProfile.bloodType || "Not set"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Allergies:</Text>
            <Text style={styles.infoValue}>
              {healthProfile.allergies.length > 0
                ? healthProfile.allergies.join(", ")
                : "None recorded"}
            </Text>
          </View>
        </View>

        {healthProfile.emergencyContact && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Emergency Contact</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>
                {healthProfile.emergencyContact.name}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Relationship:</Text>
              <Text style={styles.infoValue}>
                {healthProfile.emergencyContact.relationship}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>
                {healthProfile.emergencyContact.phone}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medications</Text>
          <Text style={styles.infoValue}>
            {healthProfile.currentMedications.length} medication(s) recorded
          </Text>
          <Button
            title="View Medications"
            onPress={() => setActiveTab("medications")}
            variant="outline"
            style={styles.sectionButton}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Records</Text>
          <Text style={styles.infoValue}>
            {healthRecords?.length || 0} record(s) available
          </Text>
          <Button
            title="View Records"
            onPress={() => setActiveTab("records")}
            variant="outline"
            style={styles.sectionButton}
          />
        </View>
      </ScrollView>
    );
  };

  const renderProfile = () => {
    if (isEditing) {
      return (
        <HealthProfileForm
          initialData={healthProfile}
          onSubmit={handleSave}
          isLoading={isUpdating}
        />
      );
    }

    return (
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Health Profile</Text>
            <Button
              title="Edit"
              onPress={() => setIsEditing(true)}
              variant="outline"
              size="sm"
            />
          </View>
          {renderOverview()}
        </View>
      </ScrollView>
    );
  };

  const renderMedications = () => {
    const medications = healthProfile?.currentMedications || [];

    return (
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Current Medications</Text>
            <Button
              title="Add"
              onPress={() => router.push("/(stack)/add-medication")}
              size="sm"
            />
          </View>

          {medications.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No medications recorded</Text>
              <Button
                title="Add Medication"
                onPress={() => router.push("/(stack)/add-medication")}
                style={styles.emptyStateButton}
              />
            </View>
          ) : (
            medications.map((med, index) => (
              <View key={index} style={styles.medicationCard}>
                <Text style={styles.medicationName}>{med.name}</Text>
                <Text style={styles.medicationDetails}>
                  {med.dosage} - {med.frequency}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    );
  };

  const renderRecords = () => {
    const records = healthRecords || [];

    return (
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Health Records</Text>
            <Button
              title="Add Record"
              onPress={() => router.push("/(stack)/add-health-record")}
              size="sm"
            />
          </View>

          {records.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No health records</Text>
              <Button
                title="Add Record"
                onPress={() => router.push("/(stack)/add-health-record")}
                style={styles.emptyStateButton}
              />
            </View>
          ) : (
            records.map((record) => (
              <TouchableOpacity
                key={record.id}
                style={styles.recordCard}
                onPress={() =>
                  router.push(`/(stack)/health-record/${record.id}`)
                }
              >
                <Text style={styles.recordTitle}>{record.title}</Text>
                <Text style={styles.recordType}>{record.recordType}</Text>
                <Text style={styles.recordDate}>
                  {new Date(record.createdAt).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "profile":
        return renderProfile();
      case "medications":
        return renderMedications();
      case "records":
        return renderRecords();
      default:
        return renderOverview();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Profile</Text>
      </View>

      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.tabActive,
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          renderContent()
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
    paddingHorizontal: spacing.md,
  },
  tab: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: colors.primary[600],
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.secondary,
  },
  tabTextActive: {
    color: colors.primary[600],
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: spacing.sm,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.secondary,
    width: 120,
  },
  infoValue: {
    fontSize: 14,
    color: colors.text.primary,
    flex: 1,
  },
  sectionButton: {
    marginTop: spacing.md,
  },
  medicationCard: {
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  medicationDetails: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  recordCard: {
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  recordType: {
    fontSize: 12,
    color: colors.text.tertiary,
    textTransform: "capitalize",
    marginBottom: spacing.xs,
  },
  recordDate: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  emptyState: {
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  emptyStateButton: {
    marginTop: spacing.md,
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
});
