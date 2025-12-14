/**
 * Appointments Screen
 * Main screen for viewing and managing appointments
 */

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAppointments } from "../../src/hooks/data/useAppointments";
import { CalendarView } from "../../src/components/organisms/calendar";
import { AppointmentCard } from "../../src/components/molecules";
import { Button } from "../../src/components/atoms";
import { colors, spacing } from "../../src/design-system";
import { AppointmentStatus } from "../../src/types/enums";

type FilterType = "all" | "upcoming" | "pending" | "confirmed" | "past";

export default function AppointmentsScreen() {
  const router = useRouter();
  const {
    appointments,
    upcomingAppointments,
    isLoading,
    refetch,
  } = useAppointments();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filter, setFilter] = useState<FilterType>("all");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getFilteredAppointments = () => {
    if (!appointments) return [];

    const now = new Date();

    switch (filter) {
      case "upcoming":
        return upcomingAppointments || [];
      case "pending":
        return appointments.filter((apt) => apt.status === AppointmentStatus.PENDING);
      case "confirmed":
        return appointments.filter((apt) => apt.status === AppointmentStatus.CONFIRMED);
      case "past":
        return appointments.filter((apt) => new Date(apt.scheduledAt) < now);
      default:
        return appointments;
    }
  };

  const filteredAppointments = getFilteredAppointments();

  const filters: { id: FilterType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "upcoming", label: "Upcoming" },
    { id: "pending", label: "Pending" },
    { id: "confirmed", label: "Confirmed" },
    { id: "past", label: "Past" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Appointments</Text>
        <Button
          title="Book"
          onPress={() => router.push("/(stack)/book-appointment")}
          size="sm"
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.calendarSection}>
          <CalendarView
            appointments={appointments || []}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </View>

        <View style={styles.filtersSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filters.map((filterOption) => (
              <TouchableOpacity
                key={filterOption.id}
                style={[
                  styles.filterChip,
                  filter === filterOption.id && styles.filterChipActive,
                ]}
                onPress={() => setFilter(filterOption.id)}
              >
                <Text
                  style={[
                    styles.filterText,
                    filter === filterOption.id && styles.filterTextActive,
                  ]}
                >
                  {filterOption.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.appointmentsSection}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading appointments...</Text>
            </View>
          ) : filteredAppointments.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No appointments found</Text>
              <Text style={styles.emptyStateSubtext}>
                {filter === "all"
                  ? "Book your first appointment to get started"
                  : `No ${filter} appointments`}
              </Text>
              <Button
                title="Book Appointment"
                onPress={() => router.push("/(stack)/book-appointment")}
                style={styles.emptyStateButton}
              />
            </View>
          ) : (
            filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onPress={() =>
                  router.push(`/(stack)/appointment-details/${appointment.id}`)
                }
                showProvider={true}
              />
            ))
          )}
        </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  calendarSection: {
    padding: spacing.md,
  },
  filtersSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[300],
  },
  filterChipActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.secondary,
  },
  filterTextActive: {
    color: colors.text.inverse,
    fontWeight: "600",
  },
  appointmentsSection: {
    padding: spacing.lg,
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  emptyState: {
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  emptyStateButton: {
    marginTop: spacing.md,
  },
});
