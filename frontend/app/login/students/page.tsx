"use client";

import { useState } from "react";
import Link from "next/link";
import { apiPost } from "@/lib/api";
import styles from "./page.module.css";

import { type PayloadLogin } from "@/lib/mockData/auth/login/login";
export default function StudentLoginPage() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  
  const [rememberMe, setRememberMe] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!studentId) {
      setError("กรุณากรอก Student ID");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        Student_ID: Number(studentId),
        password,
        rememberMe,
      } as PayloadLogin;

      const res = await apiPost("/auth/login", payload);
      console.log("login response:", res);
    } catch (error) {
      console.error(error);
      setError("Invalid Student ID or password.");
    } finally {
      // เพิ่ม delay เพื่อให้ loading เห็นนานขึ้น (ปรับเป็นมิลลิวินาทีตามต้องการ)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLoading(false);
    }

  }


  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link href="/login" className={styles.back}>
          ← Back
        </Link>

        <div className={styles.header}>
          <img
            src="/kajonkietschool_Logo (1).png"
            alt="Student"
            width={24}
            style={{ margin: "4.5px" }}
            className={styles.headerIcon}
          />
          <div>
            <h1 className={styles.title}>Student & Staff</h1>
            <p className={styles.sub}>Sign in with your Student ID</p>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
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

          <label className={styles.rememberRow}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className={styles.rememberLabel}>Remember me</span>
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className={styles.divider}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerText}>or</span>
          <span className={styles.dividerLine} />
        </div>

        <div className={styles.hint}>
          <p>Authentication is not enabled in this version.</p>
        </div>
      </div>
    </div>
  );
}
