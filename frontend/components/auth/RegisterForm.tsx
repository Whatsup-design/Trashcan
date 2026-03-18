// components/auth/RegisterForm.tsx
// ─────────────────────────────────────────────────────────
// Register form — Username + Email + Password + Confirm
// "use client" เพราะมี state
// ─────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerApi } from "@/lib/api";
import { saveSession, getRedirectPath } from "@/lib/auth";
import styles from "./RegisterForm.module.css";

export default function RegisterForm() {
  const router = useRouter();

  // ── Form state ────────────────────────────────────────
  const [username,  setUsername]  = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [showPass,  setShowPass]  = useState(false);

  // ── Submit ────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // เช็ค password ตรงกันไหม
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    // เช็ค password ยาวพอไหม
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await registerApi({ username, email, password });

      if (res.success && res.role) {
        saveSession(
          { role: res.role, token: res.token ?? "", username },
          false // register ไม่ remember me
        );
        router.push(getRedirectPath(res.role));
      } else {
        setError(res.message ?? "Registration failed");
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
          placeholder="Choose a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      {/* ── Email ─────────────────────────────────────── */}
      <div className={styles.field}>
        <label className={styles.label}>Email</label>
        <input
          className={styles.input}
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* ── Password ──────────────────────────────────── */}
      <div className={styles.field}>
        <label className={styles.label}>Password</label>
        <div className={styles.passwordWrap}>
          <input
            className={styles.input}
            type={showPass ? "text" : "password"}
            placeholder="Min 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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

      {/* ── Confirm password ──────────────────────────── */}
      <div className={styles.field}>
        <label className={styles.label}>Confirm Password</label>
        <input
          className={`${styles.input} ${confirm && confirm !== password ? styles.inputError : ""}`}
          type={showPass ? "text" : "password"}
          placeholder="Repeat password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
      </div>

      {/* ── Error ─────────────────────────────────────── */}
      {error && <p className={styles.error}>{error}</p>}

      {/* ── Submit ────────────────────────────────────── */}
      <button
        className={styles.submitBtn}
        type="submit"
        disabled={loading}
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>

    </form>
  );
}