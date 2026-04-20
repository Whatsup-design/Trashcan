
import { create } from "zustand";
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
    const secureFlag =
      typeof window !== "undefined" && window.location.protocol === "https:"
        ? "; Secure"
        : "";

    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      document.cookie = `auth_token=${encodeURIComponent(token)}; Path=/; Max-Age=604800; SameSite=Lax${secureFlag}`;
      document.cookie = `auth_role=${encodeURIComponent(normalizedUser.role)}; Path=/; Max-Age=604800; SameSite=Lax${secureFlag}`;
    }

    set({ user: normalizedUser, token, isLoaded: true });
  },

  loadAuth: () => {
    if (typeof window === "undefined") return;

    try {
      const token = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      const user = storedUser
        ? { ...storedUser, role: normalizeRole(storedUser.role) }
        : null;

      if (token && user) {
        const secureFlag = window.location.protocol === "https:" ? "; Secure" : "";
        document.cookie = `auth_token=${encodeURIComponent(token)}; Path=/; Max-Age=604800; SameSite=Lax${secureFlag}`;
        document.cookie = `auth_role=${encodeURIComponent(user.role)}; Path=/; Max-Age=604800; SameSite=Lax${secureFlag}`;
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
      document.cookie = "auth_token=; Path=/; Max-Age=0; SameSite=Lax";
      document.cookie = "auth_role=; Path=/; Max-Age=0; SameSite=Lax";
    }

    set({ user: null, token: null, isLoaded: true });

  },
}));
