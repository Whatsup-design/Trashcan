// app/page.tsx
// ─────────────────────────────────────────────────────────
// "/" — เช็ค session + setTimeout 5 วิ แล้ว redirect
// แสดง LoadingScreen gif ระหว่างรอ
// ─────────────────────────────────────────────────────────
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, getRedirectPath } from "@/lib/auth";
import LoadingScreen from "@/components/Loadingscreen";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // รอ 5 วิ แล้วค่อยเช็ค session และ redirect
    const timer = setTimeout(() => {
      const session = getSession();

      if (session) {
        router.replace(getRedirectPath(session.role));
      } else {
        router.replace("/login");
      }
    }, 3500); // ← 5 วินาที

    return () => clearTimeout(timer); // cleanup ถ้า unmount ก่อน
  }, [router]);

  // แสดง gif ระหว่างรอ 5 วิ
  return <LoadingScreen src="/LoadingDefault.gif" />;
}