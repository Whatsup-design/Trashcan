// components/auth/LoginForm.tsx
// ─────────────────────────────────────────────────────────
// Login form — Username/Email + Password + Remember me
// "use client" เพราะมี state และ form submission
// ─────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginApi } from "@/lib/api";
import { saveSession, getRedirectPath } from "@/lib/auth";
import styles from "./LoginForm.module.css";

export default function LoginForm() {
  const router = useRouter();

  // ── Form state ────────────────────────────────────────
  const [username,   setUsername]   = useState("");
  const [password,   setPassword]   = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [showPass,   setShowPass]   = useState(false); // toggle show password

  // ── Submit ────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginApi({ username, password, rememberMe });

      if (res.success && res.role) {
        // บันทึก session
        saveSession(
          { role: res.role, token: res.token ?? "", username },
          rememberMe
        );
        // redirect ตาม role
        router.push(getRedirectPath(res.role));
      } else {
        setError(res.message ?? "Login failed");
      }
    } catch {
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>

      {/* ── Username ──────────────────────────────────── */}
      <div className={styles.field}>
        <label className={styles.label}>Username</label>
        <input
          className={styles.input}
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
        />
      </div>

      {/* ── Password ──────────────────────────────────── */}
      <div className={styles.field}>
        <label className={styles.label}>Password</label>
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
          {/* Toggle show/hide password */}
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

      {/* ── Remember me ───────────────────────────────── */}
      <label className={styles.rememberRow}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <span className={styles.rememberLabel}>Remember me</span>
      </label>

      {/* ── Error message ─────────────────────────────── */}
      {error && <p className={styles.error}>{error}</p>}

      {/* ── Submit button ─────────────────────────────── */}
      <button
        className={styles.submitBtn}
        type="submit"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

    </form>
  );
}