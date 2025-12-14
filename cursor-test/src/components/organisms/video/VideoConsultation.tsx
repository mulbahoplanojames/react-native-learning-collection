/**
 * Video Consultation Component
 * Video call interface for consultations
 * 
 * NOTE: This is a placeholder structure for video integration.
 * For production, integrate with WebRTC, Agora, or Twilio Video.
 */

import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Button } from "../../atoms";
import { colors, spacing } from "../../../design-system";

interface VideoConsultationProps {
  appointmentId: string;
  meetingLink?: string;
  onEndCall?: () => void;
  isProvider?: boolean;
}

export function VideoConsultation({
  appointmentId,
  meetingLink,
  onEndCall,
  isProvider = false,
}: VideoConsultationProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    // TODO: Initialize video call connection
    // This would connect to WebRTC/Agora/Twilio
    setIsConnected(true);

    return () => {
      // Cleanup on unmount
      setIsConnected(false);
    };
  }, [appointmentId]);

  const handleEndCall = () => {
    Alert.alert(
      "End Call",
      "Are you sure you want to end this consultation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End Call",
          style: "destructive",
          onPress: () => {
            setIsConnected(false);
            onEndCall?.();
          },
        },
      ]
    );
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    // TODO: Toggle audio in video call
  };

  const handleToggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    // TODO: Toggle video in video call
  };

  return (
    <View style={styles.container}>
      {/* Video View Placeholder */}
      <View style={styles.videoContainer}>
        <View style={styles.videoPlaceholder}>
          <Text style={styles.videoPlaceholderText}>
            {isConnected ? "Video Call Active" : "Connecting..."}
          </Text>
          {meetingLink && (
            <Text style={styles.meetingLink}>{meetingLink}</Text>
          )}
        </View>

        {/* Remote video view would go here */}
        <View style={styles.remoteVideo}>
          <Text style={styles.remoteVideoText}>Remote Video</Text>
        </View>

        {/* Local video view (picture-in-picture) */}
        <View style={styles.localVideo}>
          <Text style={styles.localVideoText}>You</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, isMuted && styles.controlButtonActive]}
          onPress={handleToggleMute}
        >
          <Text style={styles.controlIcon}>{isMuted ? "🔇" : "🎤"}</Text>
          <Text style={styles.controlLabel}>
            {isMuted ? "Unmute" : "Mute"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, isVideoOff && styles.controlButtonActive]}
          onPress={handleToggleVideo}
        >
          <Text style={styles.controlIcon}>
            {isVideoOff ? "📷" : "📹"}
          </Text>
          <Text style={styles.controlLabel}>
            {isVideoOff ? "Turn On" : "Turn Off"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.endCallButton]}
          onPress={handleEndCall}
        >
          <Text style={styles.controlIcon}>📞</Text>
          <Text style={[styles.controlLabel, styles.endCallLabel]}>
            End Call
          </Text>
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.infoText}>
          {isProvider
            ? "You are the provider in this consultation"
            : "You are the patient in this consultation"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[900],
  },
  videoContainer: {
    flex: 1,
    position: "relative",
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.neutral[800],
  },
  videoPlaceholderText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.inverse,
    marginBottom: spacing.sm,
  },
  meetingLink: {
    fontSize: 14,
    color: colors.text.inverse,
    opacity: 0.7,
  },
  remoteVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.neutral[700],
    justifyContent: "center",
    alignItems: "center",
  },
  remoteVideoText: {
    fontSize: 16,
    color: colors.text.inverse,
    opacity: 0.5,
  },
  localVideo: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    width: 120,
    height: 160,
    backgroundColor: colors.neutral[600],
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.primary[500],
  },
  localVideoText: {
    fontSize: 12,
    color: colors.text.inverse,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    padding: spacing.lg,
    backgroundColor: colors.neutral[900],
    gap: spacing.md,
  },
  controlButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.neutral[700],
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.neutral[600],
  },
  controlButtonActive: {
    backgroundColor: colors.error[600],
    borderColor: colors.error[500],
  },
  endCallButton: {
    backgroundColor: colors.error[600],
    borderColor: colors.error[500],
  },
  controlIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  controlLabel: {
    fontSize: 10,
    color: colors.text.inverse,
    textAlign: "center",
  },
  endCallLabel: {
    fontWeight: "600",
  },
  info: {
    padding: spacing.md,
    backgroundColor: colors.neutral[800],
    alignItems: "center",
  },
  infoText: {
    fontSize: 12,
    color: colors.text.inverse,
    opacity: 0.7,
  },
});

