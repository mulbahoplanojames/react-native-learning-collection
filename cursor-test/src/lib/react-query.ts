/**
 * React Query Configuration
 */

import { QueryClient } from '@tanstack/react-query';
import { CACHE_DURATION } from '../utils/constants';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_DURATION.MEDIUM,
      gcTime: CACHE_DURATION.LONG, // Previously cacheTime
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

