
import { create } from "zustand";
import {
  clearClientSession,
  persistClientSession,
  readStoredSession,
} from "@/lib/auth/clientSession";
import { logDevError } from "@/lib/devLog";
import { normalizeRole } from "@/lib/auth/normalizeRole";

type User = {
  id: number;
  student_id: number;
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
    const normalizedUser = {
      ...user,
      role: normalizeRole(user.role),
    };
    persistClientSession(normalizedUser, token);

    set({ user: normalizedUser, token, isLoaded: true });
  },

  loadAuth: () => {
    if (typeof window === "undefined") return;

    try {
      const { token, user } = readStoredSession();

      if (token && user) {
        set({ user, token, isLoaded: true });
      } else {
        set({ user: null, token: null, isLoaded: true });
      }
    } catch (err) {
      logDevError("auth-store-load", err);
      set({ isLoaded: true });
    }
  },

  logout: () => {
    clearClientSession();

    set({ user: null, token: null, isLoaded: true });

  },
}));
