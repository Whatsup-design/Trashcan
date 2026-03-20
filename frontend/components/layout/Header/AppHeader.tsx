// components/layout/AppHeader.tsx
// ─────────────────────────────────────────────────────────
// Header ใช้ร่วมกันทั้ง admin และ user layout
// Logout แยกเป็น component ต่างหาก
// "use client" ไม่จำเป็น — Logout component จัดการ client เอง
// ─────────────────────────────────────────────────────────

import Logout from "./Logout/Logout";
import styles from "./AppHeader.module.css";
import Bell from "./Bells/bell";

export default function AppHeader() {
  return (
    <header className={styles.header}>

      {/* ── Left: page title ──────────────────────────── */}
      <div className={styles.headerLeft}>
        <span className={styles.pageTitle}>Admin Dashboard</span>
      </div>

      {/* ── Right: action buttons ─────────────────────── */}
      <div className={styles.headerRight}>

        {/* Search */}
        <button className={styles.iconBtn} aria-label="Search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>

        {/* Bell */}
        <Bell />

        {/* Logout — แยกเป็น component มี confirm dialog */}
        <Logout />

      </div>
    </header>
  );
}