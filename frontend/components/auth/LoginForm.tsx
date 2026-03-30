"use client";

import { useState } from "react";

import styles from "./LoginForm.module.css";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    setLoading(false);
    setError("Login is disabled for now.");
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
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
  );
}
