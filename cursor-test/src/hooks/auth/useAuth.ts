/**
 * useAuth Hook
 * Main authentication hook with React Query integration
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  authService,
  SignInData,
  SignUpData,
} from "../../services/supabase/auth";
import { usersService } from "../../services/api/users.service";
import { useAuthStore } from "../../store/authStore";
import { queryKeys } from "../../queries/query-keys";
import { User } from "../../types";
import { supabase } from "../../services/supabase/client";

export function useAuth() {
  const queryClient = useQueryClient();
  const {
    setUser,
    setSession,
    setLoading,
    logout: logoutStore,
    isLoading: isStoreLoading,
    session,
  } = useAuthStore();

  // Fetch current user profile
  const {
    data: user,
    isLoading: isLoadingUser,
    refetch: refetchUser,
  } = useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: async () => {
      const profile = await usersService.getCurrentUserProfile();
      if (profile) {
        setUser(profile);
      }
      return profile;
    },
    enabled: false, // We'll enable it manually after session check
    retry: false,
  });

  // Sign up mutation
  const signUpMutation = useMutation({
    mutationFn: (data: SignUpData) => authService.signUp(data),
    onSuccess: async (response) => {
      if (response.user && response.session) {
        setSession(response.session);
        // Fetch user profile
        await refetchUser();
      }
    },
    onError: (error) => {
      console.error("Sign up error:", error);
    },
  });

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: (data: SignInData) => authService.signIn(data),
    onSuccess: async (response) => {
      if (response.user && response.session) {
        setSession(response.session);
        // Fetch user profile
        await refetchUser();
      }
    },
    onError: (error) => {
      console.error("Sign in error:", error);
    },
  });

  // Sign out mutation
  const signOutMutation = useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
    },
    onError: (error) => {
      console.error("Sign out error:", error);
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (email: string) => authService.resetPassword(email),
  });

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setLoading(true);

        // Check for existing session with timeout
        const sessionPromise = authService.getSession();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Session check timeout")), 5000)
        );

        const session = (await Promise.race([
          sessionPromise,
          timeoutPromise,
        ]).catch((error) => {
          console.warn("Session check failed or timed out:", error);
          return null;
        })) as Awaited<ReturnType<typeof authService.getSession>>;

        if (session && mounted) {
          setSession(session);
          // Fetch user profile with timeout
          try {
            const refetchPromise = refetchUser();
            const refetchTimeout = new Promise((_, reject) =>
              setTimeout(() => reject(new Error("User fetch timeout")), 5000)
            );
            await Promise.race([refetchPromise, refetchTimeout]);
          } catch (error) {
            console.error("Error fetching user profile:", error);
            // Even if refetch fails, we should clear loading
            setUser(null);
          }
        } else if (mounted) {
          // No session - ensure user is cleared
          setUser(null);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      setSession(session);

      if (session) {
        await refetchUser();
      } else {
        logoutStore();
        queryClient.clear();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setSession, setLoading, logoutStore, refetchUser, queryClient]);

  // Combine loading states
  // For initial load, we only care about isStoreLoading
  // After initial load, isLoadingUser will be false for disabled queries
  const isLoading = isStoreLoading;

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signUp: (
      data: SignUpData,
      options?: { onSuccess?: () => void; onError?: (error: any) => void }
    ) => {
      signUpMutation.mutate(data, {
        onSuccess: async (response) => {
          if (response.user && response.session && options?.onSuccess) {
            options.onSuccess();
          }
        },
        onError: (error) => {
          if (options?.onError) {
            options.onError(error);
          }
        },
      });
    },
    signIn: (
      data: SignInData,
      options?: { onSuccess?: () => void; onError?: (error: any) => void }
    ) => {
      signInMutation.mutate(data, {
        onSuccess: async (response) => {
          if (response.user && response.session && options?.onSuccess) {
            options.onSuccess();
          }
        },
        onError: (error) => {
          if (options?.onError) {
            options.onError(error);
          }
        },
      });
    },
    signOut: signOutMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    isSigningUp: signUpMutation.isPending,
    isSigningIn: signInMutation.isPending,
    isSigningOut: signOutMutation.isPending,
    signUpError: signUpMutation.error,
    signInError: signInMutation.error,
    resetPasswordError: resetPasswordMutation.error,
  };
}
