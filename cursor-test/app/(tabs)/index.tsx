/**
 * Home/Dashboard Screen
 * Role-specific dashboard with quick access
 */

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/hooks/auth";
import { useAppointments } from "../../src/hooks/data/useAppointments";
import { useProgressTracking } from "../../src/hooks/data/useProgressTracking";
import { DailyTipCard } from "../../src/components/molecules";
import { Button } from "../../src/components/atoms";
import { colors, spacing } from "../../src/design-system";
import { format } from "date-fns";

// Daily tips
const DAILY_TIPS = [
  {
    tip: "Start your day with 5 minutes of deep breathing to reduce stress and improve focus.",
    category: "mindfulness",
  },
  {
    tip: "Stay hydrated! Aim for 8 glasses of water daily to support overall health.",
    category: "nutrition",
  },
  {
    tip: "Take a 10-minute walk after meals to aid digestion and boost energy.",
    category: "fitness",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { upcomingAppointments } = useAppointments();
  const { currentStreak, progress } = useProgressTracking();

  const dailyTip = DAILY_TIPS[new Date().getDate() % DAILY_TIPS.length];
  const nextAppointment = upcomingAppointments?.[0];

  const quickActions = [
    {
      title: "Book Appointment",
      icon: "📅",
      onPress: () => router.push("/(stack)/book-appointment"),
      color: colors.primary[600],
    },
    {
      title: "View Health Profile",
      icon: "🏥",
      onPress: () => router.push("/(tabs)/health-profile"),
      color: colors.secondary[500],
    },
    {
      title: "Wellness Hub",
      icon: "💚",
      onPress: () => router.push("/(tabs)/wellness-hub"),
      color: colors.accent[500],
    },
    {
      title: "Messages",
      icon: "💬",
      onPress: () => router.push("/(tabs)/messages"),
      color: colors.primary[500],
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.greeting}>
              {getGreeting()}, {user?.firstName || "there"}!
            </Text>
            <Text style={styles.subtitle}>
              Your holistic health journey continues
            </Text>
          </View>

          {/* Streak Card */}
          {currentStreak !== undefined && currentStreak > 0 && (
            <View style={styles.streakCard}>
              <Text style={styles.streakIcon}>🔥</Text>
              <View style={styles.streakContent}>
                <Text style={styles.streakTitle}>Current Streak</Text>
                <Text style={styles.streakValue}>{currentStreak} days</Text>
              </View>
            </View>
          )}

          {/* Daily Tip */}
          <View style={styles.section}>
            <DailyTipCard tip={dailyTip.tip} category={dailyTip.category} />
          </View>

          {/* Next Appointment */}
          {nextAppointment && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Upcoming Appointment</Text>
              <TouchableOpacity
                style={styles.appointmentCard}
                onPress={() =>
                  router.push(
                    `/(stack)/appointment-details/${nextAppointment.id}`
                  )
                }
              >
                <View style={styles.appointmentHeader}>
                  <Text style={styles.appointmentType}>
                    {nextAppointment.appointmentType}
                  </Text>
                  <Text style={styles.appointmentStatus}>
                    {nextAppointment.status}
                  </Text>
                </View>
                <Text style={styles.appointmentDate}>
                  {format(
                    new Date(nextAppointment.scheduledAt),
                    "EEEE, MMM dd, yyyy"
                  )}
                </Text>
                <Text style={styles.appointmentTime}>
                  {format(new Date(nextAppointment.scheduledAt), "h:mm a")}
                </Text>
                {nextAppointment.provider && (
                  <Text style={styles.appointmentProvider}>
                    with {nextAppointment.provider.firstName}{" "}
                    {nextAppointment.provider.lastName}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.quickActionCard,
                    { borderLeftColor: action.color },
                  ]}
                  onPress={action.onPress}
                >
                  <Text style={styles.quickActionIcon}>{action.icon}</Text>
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
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
  welcomeSection: {
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  streakCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.warning[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.warning[200],
    marginBottom: spacing.lg,
  },
  streakIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  streakContent: {
    flex: 1,
  },
  streakTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.warning[700],
    marginBottom: spacing.xs,
  },
  streakValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.warning[800],
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  appointmentCard: {
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  appointmentType: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    textTransform: "capitalize",
  },
  appointmentStatus: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.primary[600],
    textTransform: "capitalize",
  },
  appointmentDate: {
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  appointmentTime: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  appointmentProvider: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  quickActionCard: {
    width: "47%",
    padding: spacing.md,
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderLeftWidth: 4,
    alignItems: "center",
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
    textAlign: "center",
  },
});
