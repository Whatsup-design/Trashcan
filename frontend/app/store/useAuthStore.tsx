import { create } from "zustand";

type User = {
  id: number;
  student_id: string;
  role: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isLoaded: boolean;

  setAuth: (user: User, token: string) => void;
  loadAuth: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoaded: false,

  setAuth: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }

    set({ user, token });
  },

  loadAuth: () => {
    if (typeof window === "undefined") return;

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "null");

      if (token && user) {
        set({ user, token, isLoaded: true });
      } else {
        set({ user: null, token: null, isLoaded: true });
      }
    } catch (err) {
      console.error("loadAuth error:", err);
      set({ isLoaded: true });
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    set({ user: null, token: null });
  },
}));