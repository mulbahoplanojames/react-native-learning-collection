/**
 * useHealthRecords Hook
 * React Query hook for health records operations
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  healthRecordsService,
  CreateHealthRecordData,
} from "../../services/api/health-records.service";
import { queryKeys } from "../../queries/query-keys";
import { HealthRecord, RecordType } from "../../types";
import { useAuth } from "../auth/useAuth";

export function useHealthRecords() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;

  // Get all health records
  const {
    data: healthRecords,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.healthRecords.list(userId || ""),
    queryFn: () => healthRecordsService.getHealthRecords(userId || ""),
    enabled: !!userId,
  });

  // Get health records by type
  const getRecordsByType = (recordType: RecordType) => {
    return useQuery({
      queryKey: [...queryKeys.healthRecords.list(userId || ""), recordType],
      queryFn: () =>
        healthRecordsService.getHealthRecordsByType(userId || "", recordType),
      enabled: !!userId,
    });
  };

  // Create health record mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateHealthRecordData) =>
      healthRecordsService.createHealthRecord(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.healthRecords.list(userId || ""),
      });
    },
  });

  // Update health record mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<CreateHealthRecordData>;
    }) => healthRecordsService.updateHealthRecord(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.healthRecords.list(userId || ""),
      });
    },
  });

  // Delete health record mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => healthRecordsService.deleteHealthRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.healthRecords.list(userId || ""),
      });
    },
  });

  return {
    healthRecords,
    isLoading,
    error,
    refetch,
    getRecordsByType,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
}
