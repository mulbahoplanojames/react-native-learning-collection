/**
 * useProviders Hook
 * React Query hook for provider operations
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  providersService,
  ProviderAvailability,
  AvailabilitySlot,
} from "../../services/api/providers.service";
import { queryKeys } from "../../queries/query-keys";
import { ProviderProfile, User } from "../../types";

export function useProviders() {
  const queryClient = useQueryClient();

  // Get all providers
  const {
    data: providers,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.providers.all,
    queryFn: () => providersService.getProviders(),
  });

  // Get provider profile
  const getProviderProfile = (providerId: string) => {
    return useQuery({
      queryKey: queryKeys.providers.profile(providerId),
      queryFn: () => providersService.getProviderProfile(providerId),
      enabled: !!providerId,
    });
  };

  // Get provider availability
  const getProviderAvailability = (providerId: string) => {
    return useQuery({
      queryKey: ["provider-availability", providerId],
      queryFn: () => providersService.getProviderAvailability(providerId),
      enabled: !!providerId,
    });
  };

  // Get available time slots
  const getAvailableTimeSlots = (providerId: string, date: Date) => {
    return useQuery({
      queryKey: ["provider-time-slots", providerId, date.toISOString()],
      queryFn: () => providersService.getAvailableTimeSlots(providerId, date),
      enabled: !!providerId,
    });
  };

  // Update availability mutation
  const updateAvailabilityMutation = useMutation({
    mutationFn: ({
      providerId,
      availability,
    }: {
      providerId: string;
      availability: ProviderAvailability;
    }) => providersService.updateProviderAvailability(providerId, availability),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["provider-availability", variables.providerId],
      });
    },
  });

  return {
    providers,
    isLoading,
    error,
    refetch,
    getProviderProfile,
    getProviderAvailability,
    getAvailableTimeSlots,
    updateAvailability: updateAvailabilityMutation.mutate,
    isUpdatingAvailability: updateAvailabilityMutation.isPending,
    updateAvailabilityError: updateAvailabilityMutation.error,
  };
}

