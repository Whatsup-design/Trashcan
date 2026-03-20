// components/layout/AppHeader.tsx
// ─────────────────────────────────────────────────────────
// Header ใช้ร่วมกันทั้ง admin และ user layout
// Logout แยกเป็น component ต่างหาก
// "use client" ไม่จำเป็น — Logout component จัดการ client เอง
// ─────────────────────────────────────────────────────────

import Logout from "./Logout/Logout";
import styles from "./AppHeader.module.css";
import Bell from "./Bells/bell";
import Searchbar from "./Search/Searchbar";

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
        <Searchbar />
        {/* Bell */}
        <Bell />
        {/* Logout — แยกเป็น component มี confirm dialog */}
        <Logout />

      </div>
    </header>
  );
}