// app/page.tsx
// ─────────────────────────────────────────────────────────
// "/" — เช็ค session แล้ว redirect เลย
// ไม่มี UI ใดๆ แค่ redirect
// "use client" เพราะต้องอ่าน localStorage
// ─────────────────────────────────────────────────────────
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, getRedirectPath } from "@/lib/auth";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();

    if (session) {
      // มี session → redirect ไป dashboard ตาม role
      router.replace(getRedirectPath(session.role));
    } else {
      // ไม่มี session → ไป login
      router.replace("/login");
    }
  }, [router]);

  // แสดง loading ระหว่างเช็ค
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f8fafc",
    }}>
      <div style={{
        width: 32,
        height: 32,
        border: "3px solid #e8edf3",
        borderTop: "3px solid #1177FE",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}