// lib/api.ts
// ─────────────────────────────────────────────────────────
// ทุก fetch ไป backend อยู่ที่นี่
// ตอนนี้เป็น mockup — ตอน connect express แก้แค่ตรงนี้เลย
// ─────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// ── Types ─────────────────────────────────────────────────
export type LoginPayload = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export type AuthResponse = {
  success: boolean;
  role: "admin" | "user" | null;
  token?: string;
  message?: string;
};

// ── Mock users — ลบออกตอน connect จริง ───────────────────
const MOCK_USERS = [
  { username: "admin", password: "1234", role: "admin" as const },
  { username: "user",  password: "1234", role: "user"  as const },
];

// ── Login ─────────────────────────────────────────────────
export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {

  // ── MOCKUP (ลบออกตอน connect express) ────────────────
  const found = MOCK_USERS.find(
    (u) => u.username === payload.username && u.password === payload.password
  );
  if (found) {
    return { success: true, role: found.role, token: "mock-token-123" };
  }
  return { success: false, role: null, message: "Invalid username or password" };
  // ─────────────────────────────────────────────────────

  // ── REAL (uncomment ตอน connect express) ─────────────
  // const res = await fetch(`${BASE_URL}/auth/login`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload),
  //   credentials: "include",   // ส่ง cookie ไปด้วย
  // });
  // return res.json();
}

// ── Register ──────────────────────────────────────────────
export async function registerApi(payload: {
  username: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {

  // ── MOCKUP ────────────────────────────────────────────
  return { success: true, role: "user", token: "mock-token-456" };
  // ─────────────────────────────────────────────────────

  // ── REAL ──────────────────────────────────────────────
  // const res = await fetch(`${BASE_URL}/auth/register`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload),
  // });
  // return res.json();
}

// ── Google Login ──────────────────────────────────────────
export async function googleLoginApi(): Promise<void> {
  // ── MOCKUP — จำลอง redirect ───────────────────────────
  window.location.href = "/admin/dashboard"; // mock admin
  // ─────────────────────────────────────────────────────

  // ── REAL ──────────────────────────────────────────────
  // window.location.href = `${BASE_URL}/auth/google`;
}