/**
 * Availability Picker Component
 * Time slot picker for appointment booking
 */

import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { colors, spacing } from "../../../design-system";

interface AvailabilityPickerProps {
  availableSlots: string[];
  selectedTime?: string;
  onTimeSelect: (time: string) => void;
  duration?: number; // Duration in minutes
}

export function AvailabilityPicker({
  availableSlots,
  selectedTime,
  onTimeSelect,
  duration = 30,
}: AvailabilityPickerProps) {
  if (availableSlots.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No available time slots</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Time</Text>
      <Text style={styles.subtitle}>Duration: {duration} minutes</Text>
      <ScrollView style={styles.scrollView}>
        <View style={styles.slotsGrid}>
          {availableSlots.map((slot) => {
            const isSelected = selectedTime === slot;
            return (
              <TouchableOpacity
                key={slot}
                style={[
                  styles.slotButton,
                  isSelected && styles.slotButtonSelected,
                ]}
                onPress={() => onTimeSelect(slot)}
              >
                <Text
                  style={[
                    styles.slotText,
                    isSelected && styles.slotTextSelected,
                  ]}
                >
                  {slot}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  scrollView: {
    maxHeight: 300,
  },
  slotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  slotButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    backgroundColor: colors.background.primary,
    minWidth: 100,
    alignItems: "center",
  },
  slotButtonSelected: {
    borderColor: colors.primary[600],
    backgroundColor: colors.primary[50],
  },
  slotText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.primary,
  },
  slotTextSelected: {
    color: colors.primary[700],
    fontWeight: "600",
  },
  emptyContainer: {
    padding: spacing.lg,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});

