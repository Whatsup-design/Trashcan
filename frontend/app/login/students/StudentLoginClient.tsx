"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/useAuthStore";
import { getRedirectPath } from "@/lib/auth/getRedirectPath";
import { normalizeRole } from "@/lib/auth/normalizeRole";
import { ApiError, apiPost } from "@/lib/api";
import { logDevError } from "@/lib/devLog";
import type { PayloadLogin } from "@/lib/mockData/auth/login/login";
import styles from "./page.module.css";

function toUserLoginError(message: string) {
  if (
    message.includes("User not found") ||
    message.includes("Incorrect password") ||
    message.includes("Invalid credentials") ||
    message.includes("Student ID or password is incorrect")
  ) {
    return "Student ID or password is incorrect";
  }

  return message;
}

export default function StudentLoginClient() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isSubmittingRef = useRef(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (isSubmittingRef.current) return;

    if (!studentId.trim()) {
      setError("Please enter your Student ID");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);

    try {
      const payload: PayloadLogin = {
        student_id: Number(studentId),
        password,
        remember_me: rememberMe,
      };

      const res = await apiPost("/auth/login", payload, {
        redirectOnError: false,
      });

      const { user, token } = res as {
        user?: { id: number; student_id: number; role: string };
        token?: string;
      };

      if (!user || !token) {
        throw new Error("Login response is missing user or token");
      }

      const normalizedUser = {
        ...user,
        role: normalizeRole(user.role),
      };
      const redirectPath = getRedirectPath(normalizedUser.role);

      setAuth(normalizedUser, token);

      if (redirectPath) {
        navigate.replace(redirectPath);
        return;
      }

      navigate.replace("/user/dashboard");
    } catch (err: unknown) {
      logout();
      logDevError("student-login", err);

      if (err instanceof ApiError) {
        setError(toUserLoginError(err.message));
      } else if (err instanceof Error) {
        setError(toUserLoginError(err.message));
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.visualPanel}>
          <Link href="/login" className={styles.back}>
            <span className={styles.backIcon} aria-hidden="true">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.backIconSvg}
              >
                <path
                  d="M11.667 5L6.667 10L11.667 15"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            Back
          </Link>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Student_Login_Post.png"
            alt="Student login poster"
            className={styles.visualImage}
          />
          <div className={styles.visualOverlay} />
        </aside>

        <div className={styles.card}>
          <div className={styles.header}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/kajonkietschool_Logo (1).png"
              alt="Student"
              width={36}
              style={{ margin: "2px" }}
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
    </div>
  );
}
