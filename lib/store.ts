import { create } from "zustand";

interface User {
  username: string;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

interface NotificationStore {
  message: string | null;
  type: "success" | "error" | "info" | null;
  showNotification: (message: string, type: "success" | "error" | "info") => void;
  clearNotification: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null }),
}));

export const useNotificationStore = create<NotificationStore>((set) => ({
  message: null,
  type: null,
  showNotification: (message, type) => set({ message, type }),
  clearNotification: () => set({ message: null, type: null }),
}));
