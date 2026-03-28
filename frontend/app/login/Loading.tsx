// app/login/loading.tsx
// ─────────────────────────────────────────────────────────
// Next.js loading.tsx — แสดงอัตโนมัติขณะ login/page.tsx โหลด
// Suspense boundary ถูก Next.js จัดการให้เองเลย
// ─────────────────────────────────────────────────────────
import LoadingScreen from "@/components/Loadingscreen";

export default function LoginLoading() {
  return <LoadingScreen src="/loading.gif" />;
}