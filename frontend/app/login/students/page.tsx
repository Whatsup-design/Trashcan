// app/login/student/page.tsx
// ─────────────────────────────────────────────────────────
// Student / Staff / Admin login
// Login ด้วย Student ID + Password
// "use client" เพราะมี state + form
// ─────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginApi } from "@/lib/api";
import { saveSession, getRedirectPath } from "@/lib/auth";
import styles from "./page.module.css";

export default function StudentLoginPage() {
  const router = useRouter();

  // ── Form state ────────────────────────────────────────
  const [studentId,  setStudentId]  = useState("");
  const [password,   setPassword]   = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPass,   setShowPass]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");

  // ── Submit ────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginApi({
        username: studentId,  // ใช้ studentId เป็น username
        password,
        rememberMe,
      });

      if (res.success && res.role) {
        saveSession(
          { role: res.role, token: res.token ?? "", username: studentId },
          rememberMe
        );
        router.push(getRedirectPath(res.role));
      } else {
        setError(res.message ?? "Invalid Student ID or Password");
      }
    } catch {
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* ── Back button ───────────────────────────── */}
        <Link href="/login" className={styles.back}>
          ← Back
        </Link>

        {/* ── Header ────────────────────────────────── */}
        <div className={styles.header}>
          <img src="/kajonkietschool_Logo (1).png" alt="Student" width={24} style={{ margin : '4.5px' }} className={styles.headerIcon} />
          <div>
            <h1 className={styles.title}>Student & Staff</h1>
            <p className={styles.sub}>Sign in with your Student ID</p>
          </div>
        </div>

        {/* ── Form ──────────────────────────────────── */}
        <form className={styles.form} onSubmit={handleSubmit}>

          {/* Student ID */}
          <div className={styles.field}>
            <label className={styles.label}>Student ID / Staff ID</label>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. 16000"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          {/* Password */}
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <p className={styles.passwordHint}>
              Default: <code>@{studentId || "StudentID"}[FirstName]</code>
            </p>
            <div className={styles.passwordWrap}>
              <input
                className={styles.input}
                type={showPass ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPass((s) => !s)}
                tabIndex={-1}
              >
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <label className={styles.rememberRow}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className={styles.rememberLabel}>Remember me</span>
          </label>

          {/* Error */}
          {error && <p className={styles.error}>{error}</p>}

          {/* Submit */}
          <button
            className={styles.submitBtn}
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        {/* ── Divider ───────────────────────────────── */}
        <div className={styles.divider}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerText}>or</span>
          <span className={styles.dividerLine} />
        </div>

    

        {/* ── Demo hint ─────────────────────────────── */}
        <div className={styles.hint}>
          <p>Demo: <code>admin / 1234</code> or <code>user / 1234</code></p>
        </div>

      </div>
    </div>
  );
}