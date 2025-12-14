/**
 * Appointment Details Screen
 */

import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { appointmentsService } from "../../../src/services/api/appointments.service";
import { queryKeys } from "../../../src/queries/query-keys";
import { AppointmentCard } from "../../../src/components/molecules";
import { Button } from "../../../src/components/atoms";
import { useAppointments } from "../../../src/hooks/data/useAppointments";
import { useAppointmentSharing } from "../../../src/hooks/data/useAppointmentSharing";
import { useRole } from "../../../src/hooks/auth";
import { colors, spacing } from "../../../src/design-system";
import { AppointmentStatus } from "../../../src/types/enums";

export default function AppointmentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isProvider } = useRole();
  const { cancel, confirm, isCancelling, isConfirming } = useAppointments();
  const { share, getAppointmentSharing } = useAppointmentSharing();

  const {
    data: appointment,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.appointments.detail(id),
    queryFn: () => appointmentsService.getAppointment(id),
    enabled: !!id,
  });

  const { data: sharing } = getAppointmentSharing(id);

  const handleCancel = () => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => {
            cancel(id, {
              onSuccess: () => {
                router.back();
              },
            });
          },
        },
      ]
    );
  };

  const handleConfirm = () => {
    confirm(id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const handleShare = () => {
    // TODO: Implement share functionality with user selection
    Alert.alert("Share Appointment", "Share functionality coming soon");
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading appointment...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!appointment) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Appointment not found</Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const canCancel =
    appointment.status === AppointmentStatus.PENDING ||
    appointment.status === AppointmentStatus.CONFIRMED;
  const canConfirm =
    isProvider &&
    appointment.status === AppointmentStatus.PENDING &&
    appointment.providerId === appointment.providerId;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <AppointmentCard
            appointment={appointment}
            showProvider={!isProvider}
            showPatient={isProvider}
          />

          {appointment.meetingLink && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Meeting Link</Text>
              <Text style={styles.meetingLink}>{appointment.meetingLink}</Text>
            </View>
          )}

          {sharing && sharing.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Shared With</Text>
              <Text style={styles.sharedText}>
                This appointment is shared with {sharing.length} other user(s)
              </Text>
            </View>
          )}

          <View style={styles.actions}>
            {canConfirm && (
              <Button
                title="Confirm Appointment"
                onPress={handleConfirm}
                loading={isConfirming}
                style={styles.actionButton}
              />
            )}

            {canCancel && (
              <Button
                title="Cancel Appointment"
                onPress={handleCancel}
                loading={isCancelling}
                variant="outline"
                style={styles.actionButton}
              />
            )}

            <Button
              title="Share Appointment"
              onPress={handleShare}
              variant="ghost"
              style={styles.actionButton}
            />
          </View>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  meetingLink: {
    fontSize: 14,
    color: colors.primary[600],
    textDecorationLine: "underline",
  },
  sharedText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  actions: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
});
