import { normalizeRole } from "@/lib/auth/normalizeRole";
import {
  AUTH_ROLE_COOKIE,
  AUTH_TOKEN_COOKIE,
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
} from "@/lib/auth/sessionConfig";

type StoredUser = {
  id: number;
  student_id: number;
  role: string;
};

function getSecureFlag() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.location.protocol === "https:" ? "; Secure" : "";
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${getSecureFlag()}`;
}

function clearCookie(name: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function persistClientSession(user: StoredUser, token: string) {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedUser = {
    ...user,
    role: normalizeRole(user.role),
  };

  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(normalizedUser));
  setCookie(AUTH_TOKEN_COOKIE, token, 604800);
  setCookie(AUTH_ROLE_COOKIE, normalizedUser.role, 604800);
}

export function readStoredToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function readStoredSession() {
  if (typeof window === "undefined") {
    return { token: null, user: null };
  }

  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  const rawUser = localStorage.getItem(AUTH_USER_STORAGE_KEY);

  if (!token || !rawUser) {
    return { token: null, user: null };
  }

  try {
    const parsedUser = JSON.parse(rawUser) as StoredUser;
    return {
      token,
      user: {
        ...parsedUser,
        role: normalizeRole(parsedUser.role),
      },
    };
  } catch {
    return { token: null, user: null };
  }
}

export function clearClientSession() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(AUTH_USER_STORAGE_KEY);
  clearCookie(AUTH_TOKEN_COOKIE);
  clearCookie(AUTH_ROLE_COOKIE);
}
