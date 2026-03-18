// app/login/page.tsx
// ─────────────────────────────────────────────────────────
// Login page — Tab สลับระหว่าง Login และ Register
// เช็ค session ตอนโหลด ถ้ามีแล้ว redirect ทันที
// "use client" เพราะมี tab state + เช็ค session
// ─────────────────────────────────────────────────────────
"use client";

import { useState, useEffect } from "react";
import LoginForm    from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import GoogleButton from "@/components/auth/GoogleButton";
import styles from "./page.module.css";

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "register">("login");

  return (
    <div className={styles.page}>

      {/* ── Card กลางหน้าจอ ──────────────────────────── */}
      <div className={styles.card}>

        {/* ── Logo ────────────────────────────────────── */}
        <div className={styles.logoWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/IconLogo.jpg" alt="Trashcan Smart" className={styles.logo} />
          <div>
            <p className={styles.appName}>Trashcan Smart</p>
            <p className={styles.appSub}>Admin & User Portal</p>
          </div>
        </div>

        {/* ── Tab switch: Login / Register ────────────── */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === "login" ? styles.activeTab : ""}`}
            onClick={() => setTab("login")}
            type="button"
          >
            Sign In
          </button>
          <button
            className={`${styles.tab} ${tab === "register" ? styles.activeTab : ""}`}
            onClick={() => setTab("register")}
            type="button"
          >
            Register
          </button>
        </div>

        {/* ── Form ────────────────────────────────────── */}
        {tab === "login" ? <LoginForm /> : <RegisterForm />}

        {/* ── Divider ─────────────────────────────────── */}
        <div className={styles.divider}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerText}>or</span>
          <span className={styles.dividerLine} />
        </div>

        {/* ── Google button ───────────────────────────── */}
        <GoogleButton />

        {/* ── Hint สำหรับ mockup ──────────────────────── */}
        <div className={styles.hint}>
          <p>Demo: <code>admin / 1234</code> or <code>user / 1234</code></p>
        </div>

      </div>
    </div>
  );
}