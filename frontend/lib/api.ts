// lib/api.ts
// ─────────────────────────────────────────────────────────
// ทุก fetch ไป backend อยู่ที่นี่
// ตอนนี้เป็น mockup — ตอน connect express แก้แค่ตรงนี้เลย
// ─────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// ── Types ─────────────────────────────────────────────────
export async function apiFetch(path: string) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();

}