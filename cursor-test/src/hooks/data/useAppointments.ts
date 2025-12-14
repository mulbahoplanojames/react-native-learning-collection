/**
 * useAppointments Hook
 * React Query hook for appointment operations
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  appointmentsService,
  CreateAppointmentData,
  UpdateAppointmentData,
} from "../../services/api/appointments.service";
import { queryKeys } from "../../queries/query-keys";
import { Appointment, AppointmentStatus } from "../../types";
import { useAuth } from "../auth/useAuth";

export function useAppointments() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;

  // Get all appointments
  const {
    data: appointments,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.appointments.all,
    queryFn: () => appointmentsService.getAppointments(userId || ""),
    enabled: !!userId,
  });

  // Get upcoming appointments
  const {
    data: upcomingAppointments,
    isLoading: isLoadingUpcoming,
  } = useQuery({
    queryKey: queryKeys.appointments.upcoming,
    queryFn: () => appointmentsService.getUpcomingAppointments(userId || ""),
    enabled: !!userId,
  });

  // Get appointments by status
  const getAppointmentsByStatus = (status: AppointmentStatus) => {
    return useQuery({
      queryKey: [...queryKeys.appointments.all, status],
      queryFn: () =>
        appointmentsService.getAppointmentsByStatus(userId || "", status),
      enabled: !!userId,
    });
  };

  // Get appointments by date range
  const getAppointmentsByDateRange = (startDate: string, endDate: string) => {
    return useQuery({
      queryKey: [...queryKeys.appointments.all, startDate, endDate],
      queryFn: () =>
        appointmentsService.getAppointmentsByDateRange(
          userId || "",
          startDate,
          endDate
        ),
      enabled: !!userId,
    });
  };

  // Create appointment mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateAppointmentData) =>
      appointmentsService.createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.upcoming,
      });
    },
  });

  // Update appointment mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateAppointmentData;
    }) => appointmentsService.updateAppointment(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.upcoming,
      });
    },
  });

  // Cancel appointment mutation
  const cancelMutation = useMutation({
    mutationFn: (id: string) => appointmentsService.cancelAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.upcoming,
      });
    },
  });

  // Confirm appointment mutation
  const confirmMutation = useMutation({
    mutationFn: (id: string) => appointmentsService.confirmAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.upcoming,
      });
    },
  });

  return {
    appointments,
    upcomingAppointments,
    isLoading,
    isLoadingUpcoming,
    error,
    refetch,
    getAppointmentsByStatus,
    getAppointmentsByDateRange,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    cancel: cancelMutation.mutate,
    confirm: confirmMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isCancelling: cancelMutation.isPending,
    isConfirming: confirmMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    cancelError: cancelMutation.error,
    confirmError: confirmMutation.error,
  };
}

