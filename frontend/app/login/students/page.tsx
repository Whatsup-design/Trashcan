"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { apiPost } from "@/lib/api";
import styles from "./page.module.css";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useRouter } from "next/navigation";
import { type PayloadLogin } from "@/lib/mockData/auth/login/login";


export default function StudentLoginPage() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  
  const [rememberMe, setRememberMe] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isSubmittingRef = useRef(false);
  
  const setAuth = useAuthStore((state) => state.setAuth);

  const navigate = useRouter();

  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault();
    setError("");

    if (isSubmittingRef.current) return; // guard: already submitting

    if (!studentId) {
      setError("กรุณากรอก Student ID");
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);

    try {
      const payload = {
        Student_ID: Number(studentId),
        password,
        rememberMe,
      } as PayloadLogin;
      const res = await apiPost("/auth/login", payload);
      // // Assuming the response structure is
      // const { user, token } = res.data;
      // //Set auth (Localstorage + Zustand)
      // setAuth(user, token);
      // //redirect to dashboard
      // navigate.push("/user/dashboard");

      console.log("Login response:", res);

    } catch (error) {
      alert("Login failed. Please check your credentials and try again."); 
      setError("Invalid Student ID or password.");


    } finally {
      // เพิ่ม delay เพื่อให้ loading เห็นนานขึ้น (ปรับเป็นมิลลิวินาทีตามต้องการ)
      await new Promise((resolve) => setTimeout(resolve, 300));
      setLoading(false);
      isSubmittingRef.current = false;
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
            <h1 className={styles.title}>Internal Personnel</h1>
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
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {/* use raw image path directly */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={showPass ? "/LoginIcon/Unseen.png" : "/LoginIcon/Seen.png"}
                  
                  alt={showPass ? "Hide password" : "Show password"}
                  width={15}
                  style={{ display: "block" }}
                  height={15}
                  className={styles.eyeIcon}
                  draggable={false}
                  aria-hidden="true"
                />
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
