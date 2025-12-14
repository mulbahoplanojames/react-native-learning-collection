/**
 * UI Store (Zustand)
 * Global UI state (theme, modals, loading states)
 */

import { create } from 'zustand';

interface UIState {
  // Theme
  isDark: boolean;
  
  // Modals
  activeModal: string | null;
  
  // Loading states
  globalLoading: boolean;
  
  // Actions
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  setGlobalLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isDark: false,
  activeModal: null,
  globalLoading: false,
  
  toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
  setTheme: (isDark) => set({ isDark }),
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
}));

