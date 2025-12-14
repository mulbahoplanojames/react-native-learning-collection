/**
 * useAppointmentSharing Hook
 * React Query hook for appointment sharing operations
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  appointmentSharingService,
  CreateSharingData,
} from "../../services/api/appointment-sharing.service";
import { AppointmentSharing, SharingPermission } from "../../types";
import { useAuth } from "../auth/useAuth";

export function useAppointmentSharing() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;

  // Get shared appointments
  const {
    data: sharedAppointments,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["appointment-sharing", userId],
    queryFn: () => appointmentSharingService.getSharedAppointments(userId || ""),
    enabled: !!userId,
  });

  // Get sharing for a specific appointment
  const getAppointmentSharing = (appointmentId: string) => {
    return useQuery({
      queryKey: ["appointment-sharing", appointmentId],
      queryFn: () =>
        appointmentSharingService.getAppointmentSharing(appointmentId),
      enabled: !!appointmentId,
    });
  };

  // Share appointment mutation
  const shareMutation = useMutation({
    mutationFn: (data: CreateSharingData) =>
      appointmentSharingService.shareAppointment(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["appointment-sharing", userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["appointment-sharing", variables.appointmentId],
      });
    },
  });

  // Update sharing permissions mutation
  const updatePermissionsMutation = useMutation({
    mutationFn: ({
      sharingId,
      permissions,
    }: {
      sharingId: string;
      permissions: SharingPermission[];
    }) =>
      appointmentSharingService.updateSharingPermissions(sharingId, permissions),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["appointment-sharing", userId],
      });
    },
  });

  // Unshare appointment mutation
  const unshareMutation = useMutation({
    mutationFn: (sharingId: string) =>
      appointmentSharingService.unshareAppointment(sharingId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["appointment-sharing", userId],
      });
    },
  });

  return {
    sharedAppointments,
    isLoading,
    error,
    refetch,
    getAppointmentSharing,
    share: shareMutation.mutate,
    updatePermissions: updatePermissionsMutation.mutate,
    unshare: unshareMutation.mutate,
    isSharing: shareMutation.isPending,
    isUpdatingPermissions: updatePermissionsMutation.isPending,
    isUnsharing: unshareMutation.isPending,
    shareError: shareMutation.error,
    updatePermissionsError: updatePermissionsMutation.error,
    unshareError: unshareMutation.error,
  };
}

