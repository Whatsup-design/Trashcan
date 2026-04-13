// app/user/dashboard/page.tsx
// Server Component — fetch ข้อมูลครั้งเดียว

import StatBlocks      from "@/components/RouterUser/dashboard/StatBlocks";
import AnnouncementList from "@/components/RouterUser/dashboard/AnnouncementList";
import styles from "./page.module.css";

import DashboardData from "@/lib/mockData/user/Dashboard"

const {mockUserData, mockAnnouncements} = DashboardData

// ── Mockup data ───────────────────────────────────────────


export default function UserDashboardPage() {
  return (
    <div className={styles.page}>

      {/* ── Greeting ─────────────────────────────────── */}
      <div className={styles.greeting}>
        <h1 className={styles.title}>Welcome back! 👋</h1>
        <p className={styles.sub}>Here is your activity overview</p>
      </div>

      {/* ── Stat blocks ──────────────────────────────── */}
      <StatBlocks data={mockUserData} />

      {/* ── Announcements ────────────────────────────── */}
      <AnnouncementList data={mockAnnouncements} />

    </div>
  );
}
