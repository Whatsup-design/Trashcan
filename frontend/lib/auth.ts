// lib/auth.ts
// ─────────────────────────────────────────────────────────
// Helper จัดการ cookie และ session
// ตอนนี้ใช้ localStorage mock — ตอน connect จริงใช้ cookie จาก express
// ─────────────────────────────────────────────────────────

export type UserSession = {
  role: "admin" | "user";
  token: string;
  username: string;
};

// ── Save session หลัง login สำเร็จ ───────────────────────
export function saveSession(session: UserSession, rememberMe: boolean) {
  const storage = rememberMe ? localStorage : sessionStorage;
  // rememberMe = true  → localStorage  (ยังอยู่แม้ปิด browser)
  // rememberMe = false → sessionStorage (หายเมื่อปิด tab)
  storage.setItem("session", JSON.stringify(session));
}

// ── Get session ───────────────────────────────────────────
export function getSession(): UserSession | null {
  // เช็คทั้ง localStorage และ sessionStorage
  const data =
    localStorage.getItem("session") ??
    sessionStorage.getItem("session");

  if (!data) return null;

  try {
    return JSON.parse(data) as UserSession;
  } catch {
    return null;
  }
}

// ── Clear session (logout) ────────────────────────────────
export function clearSession() {
  localStorage.removeItem("session");
  sessionStorage.removeItem("session");
}

// ── Get redirect path ตาม role ────────────────────────────
export function getRedirectPath(role: "admin" | "user"): string {
  return role === "admin" ? "/admin/dashboard" : "/user/dashboard";
}