/**
 * Appointment Card Component
 * Displays appointment information in a card format
 */

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Appointment, AppointmentStatus } from "../../types";
import { colors, spacing } from "../../design-system";
import { format } from "date-fns";

interface AppointmentCardProps {
  appointment: Appointment;
  onPress?: () => void;
  showProvider?: boolean;
  showPatient?: boolean;
}

export function AppointmentCard({
  appointment,
  onPress,
  showProvider = true,
  showPatient = false,
}: AppointmentCardProps) {
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case "confirmed":
        return colors.success[600];
      case "pending":
        return colors.warning[600];
      case "cancelled":
        return colors.error[600];
      case "completed":
        return colors.neutral[600];
      default:
        return colors.neutral[600];
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: format(date, "MMM dd, yyyy"),
      time: format(date, "h:mm a"),
    };
  };

  const { date, time } = formatDateTime(appointment.scheduledAt);
  const statusColor = getStatusColor(appointment.status);

  const CardContent = (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{appointment.appointmentType}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.status, { color: statusColor }]}>
              {appointment.status}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{date}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Time:</Text>
          <Text style={styles.value}>{time}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Duration:</Text>
          <Text style={styles.value}>{appointment.durationMinutes} minutes</Text>
        </View>

        {showProvider && appointment.provider && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Provider:</Text>
            <Text style={styles.value}>
              {appointment.provider.firstName} {appointment.provider.lastName}
            </Text>
          </View>
        )}

        {showPatient && appointment.patient && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Patient:</Text>
            <Text style={styles.value}>
              {appointment.patient.firstName} {appointment.patient.lastName}
            </Text>
          </View>
        )}

        {appointment.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notes}>{appointment.notes}</Text>
          </View>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.xs,
    textTransform: "capitalize",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  status: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  body: {
    gap: spacing.xs,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.secondary,
    width: 80,
  },
  value: {
    fontSize: 14,
    color: colors.text.primary,
    flex: 1,
  },
  notesContainer: {
    marginTop: spacing.xs,
    padding: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
  },
  notes: {
    fontSize: 14,
    color: colors.text.secondary,
    fontStyle: "italic",
  },
});

