/**
 * Book Appointment Screen
 */

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Input, Button } from "../../src/components/atoms";
import { CalendarView, AvailabilityPicker } from "../../src/components/organisms/calendar";
import { useAppointments } from "../../src/hooks/data/useAppointments";
import { useProviders } from "../../src/hooks/data/useProviders";
import { useAuth } from "../../src/hooks/auth";
import { AppointmentType } from "../../src/types/enums";
import { colors, spacing } from "../../src/design-system";
import { DEFAULT_APPOINTMENT_DURATION } from "../../src/utils/constants";

export default function BookAppointmentScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { providers } = useProviders();
  const { create, isCreating } = useAppointments();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedProviderId, setSelectedProviderId] = useState<string>("");
  const [appointmentType, setAppointmentType] = useState<AppointmentType>(
    AppointmentType.CONSULTATION
  );
  const [notes, setNotes] = useState("");

  const { data: availableSlots } = useProviders().getAvailableTimeSlots(
    selectedProviderId,
    selectedDate
  );

  const handleSubmit = () => {
    if (!user || !selectedProviderId || !selectedTime) return;

    const [hours, minutes] = selectedTime.split(":").map(Number);
    const scheduledAt = new Date(selectedDate);
    scheduledAt.setHours(hours, minutes, 0, 0);

    create(
      {
        patientId: user.id,
        providerId: selectedProviderId,
        appointmentType,
        scheduledAt: scheduledAt.toISOString(),
        durationMinutes: DEFAULT_APPOINTMENT_DURATION,
        notes: notes || undefined,
      },
      {
        onSuccess: () => {
          router.back();
        },
      }
    );
  };

  const appointmentTypes = Object.values(AppointmentType);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Book Appointment</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Provider</Text>
              {providers?.map((provider) => (
                <TouchableOpacity
                  key={provider.id}
                  style={[
                    styles.providerCard,
                    selectedProviderId === provider.id &&
                      styles.providerCardSelected,
                  ]}
                  onPress={() => setSelectedProviderId(provider.id)}
                >
                  <Text style={styles.providerName}>
                    {provider.firstName} {provider.lastName}
                  </Text>
                  <Text style={styles.providerRole}>{provider.role}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedProviderId && (
              <>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Appointment Type</Text>
                  <View style={styles.typeGrid}>
                    {appointmentTypes.map((type) => (
                      <Button
                        key={type}
                        title={type.replace("_", " ")}
                        onPress={() => setAppointmentType(type)}
                        variant={
                          appointmentType === type ? "primary" : "outline"
                        }
                        size="sm"
                        style={styles.typeButton}
                      />
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Select Date</Text>
                  <CalendarView
                    appointments={[]}
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                  />
                </View>

                {selectedDate && (
                  <View style={styles.section}>
                    <AvailabilityPicker
                      availableSlots={availableSlots || []}
                      selectedTime={selectedTime}
                      onTimeSelect={setSelectedTime}
                      duration={DEFAULT_APPOINTMENT_DURATION}
                    />
                  </View>
                )}

                <View style={styles.section}>
                  <Input
                    label="Notes (Optional)"
                    placeholder="Any additional notes or concerns"
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={4}
                  />
                </View>

                <Button
                  title="Book Appointment"
                  onPress={handleSubmit}
                  loading={isCreating}
                  disabled={!selectedProviderId || !selectedTime}
                  fullWidth
                  style={styles.submitButton}
                />
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import { TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  providerCard: {
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    backgroundColor: colors.background.primary,
    marginBottom: spacing.sm,
  },
  providerCardSelected: {
    borderColor: colors.primary[600],
    backgroundColor: colors.primary[50],
  },
  providerName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  providerRole: {
    fontSize: 14,
    color: colors.text.secondary,
    textTransform: "capitalize",
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  typeButton: {
    minWidth: 120,
  },
  submitButton: {
    marginTop: spacing.lg,
  },
});
