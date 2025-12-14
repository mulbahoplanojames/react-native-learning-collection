/**
 * Video Consultation Screen
 */

import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { appointmentsService } from "../../../src/services/api/appointments.service";
import { queryKeys } from "../../../src/queries/query-keys";
import { VideoConsultation } from "../../../src/components/organisms/video";
import { useRole } from "../../../src/hooks/auth";
import { colors } from "../../../src/design-system";

export default function VideoConsultationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isProvider } = useRole();

  const {
    data: appointment,
    isLoading,
  } = useQuery({
    queryKey: queryKeys.appointments.detail(id),
    queryFn: () => appointmentsService.getAppointment(id),
    enabled: !!id,
  });

  const handleEndCall = () => {
    router.back();
  };

  if (isLoading || !appointment) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading consultation...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <VideoConsultation
        appointmentId={id}
        meetingLink={appointment.meetingLink}
        onEndCall={handleEndCall}
        isProvider={isProvider}
      />
    </SafeAreaView>
  );
}

import { Text } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[900],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.inverse,
  },
});
