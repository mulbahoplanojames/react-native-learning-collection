/**
 * Calendar View Component
 * Monthly calendar view with appointment indicators
 */

import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { colors, spacing } from "../../../design-system";
import { Appointment } from "../../../types";

interface CalendarViewProps {
  appointments: Appointment[];
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
  viewMode?: "month" | "week" | "day";
}

export function CalendarView({
  appointments,
  onDateSelect,
  selectedDate,
  viewMode = "month",
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getAppointmentsForDate = (date: Date | null): Appointment[] => {
    if (!date) return [];
    const dateStr = date.toISOString().split("T")[0];
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.scheduledAt).toISOString().split("T")[0];
      return aptDate === dateStr;
    });
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const isSelectedDate = (date: Date | null): boolean => {
    if (!date || !selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigateMonth("prev")}>
          <Text style={styles.navButton}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthYear}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Text>
        <TouchableOpacity onPress={() => navigateMonth("next")}>
          <Text style={styles.navButton}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dayNames}>
        {dayNames.map((day) => (
          <View key={day} style={styles.dayNameCell}>
            <Text style={styles.dayNameText}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.calendarGrid}>
        {days.map((day, index) => {
          const dayAppointments = getAppointmentsForDate(day);
          const hasAppointments = dayAppointments.length > 0;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                isToday(day) && styles.todayCell,
                isSelectedDate(day) && styles.selectedCell,
                !day && styles.emptyCell,
              ]}
              onPress={() => day && onDateSelect?.(day)}
              disabled={!day}
            >
              {day && (
                <>
                  <Text
                    style={[
                      styles.dayNumber,
                      isToday(day) && styles.todayText,
                      isSelectedDate(day) && styles.selectedText,
                    ]}
                  >
                    {day.getDate()}
                  </Text>
                  {hasAppointments && (
                    <View style={styles.appointmentIndicator}>
                      <View style={styles.appointmentDot} />
                    </View>
                  )}
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  navButton: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary[600],
    paddingHorizontal: spacing.md,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
  },
  dayNames: {
    flexDirection: "row",
    marginBottom: spacing.xs,
  },
  dayNameCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  dayNameText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.secondary,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    margin: 2,
    position: "relative",
  },
  emptyCell: {
    opacity: 0,
  },
  todayCell: {
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[300],
  },
  selectedCell: {
    backgroundColor: colors.primary[600],
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.primary,
  },
  todayText: {
    color: colors.primary[700],
    fontWeight: "600",
  },
  selectedText: {
    color: colors.text.inverse,
    fontWeight: "600",
  },
  appointmentIndicator: {
    position: "absolute",
    bottom: 4,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  appointmentDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary[600],
  },
});

