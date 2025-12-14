/**
 * Push Notifications Service
 * Handles appointment reminders and notifications
 */

import * as Notifications from "expo-notifications";
import { APPOINTMENT_REMINDER_HOURS } from "../../utils/constants";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class PushNotificationService {
  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  }

  /**
   * Schedule appointment reminder
   */
  async scheduleAppointmentReminder(
    appointmentId: string,
    scheduledAt: Date,
    title: string,
    body: string
  ): Promise<string | null> {
    try {
      // Calculate reminder time (24 hours before appointment)
      const reminderTime = new Date(scheduledAt);
      reminderTime.setHours(
        reminderTime.getHours() - APPOINTMENT_REMINDER_HOURS
      );

      // Don't schedule if reminder time is in the past
      if (reminderTime < new Date()) {
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `Appointment Reminder: ${title}`,
          body: body,
          sound: true,
          data: { appointmentId, type: "appointment_reminder" },
        },
        trigger: reminderTime,
      });

      return notificationId;
    } catch (error) {
      console.error("Error scheduling appointment reminder:", error);
      return null;
    }
  }

  /**
   * Cancel scheduled notification
   */
  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  /**
   * Cancel all notifications
   */
  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Get all scheduled notifications
   */
  async getScheduledNotifications(): Promise<
    Notifications.NotificationRequest[]
  > {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  /**
   * Send immediate notification
   */
  async sendNotification(
    title: string,
    body: string,
    data?: Record<string, unknown>
  ): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        data,
      },
      trigger: null, // Send immediately
    });
  }
}

export const pushNotificationService = new PushNotificationService();

