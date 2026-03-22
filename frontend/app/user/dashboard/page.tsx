// app/user/dashboard/page.tsx
// Server Component — fetch ข้อมูลครั้งเดียว

import StatBlocks      from "@/components/RouterUser/dashboard/StatBlocks";
import AnnouncementList from "@/components/RouterUser/dashboard/AnnouncementList";
import type { UserDashboardData, Announcement } from "@/components/RouterUser/dashboard/types";
import styles from "./page.module.css";

// ── Mockup data ───────────────────────────────────────────
const mockUserData: UserDashboardData = {
  bottlesThrown:   142,
  weightGram:      5840,
  tokensBalance:   284,
  leaderboardRank: 3,
  totalUsers:      120,
};

const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "New reward available!",
    message: "Free coffee coupon is now available in Token & Market.",
    date: "Mar 22, 2025",
    type: "success",
  },
  {
    id: "2",
    title: "Maintenance notice",
    message: "Device B-03 will be offline for maintenance on Mar 25.",
    date: "Mar 21, 2025",
    type: "warning",
  },
  {
    id: "3",
    title: "Token bonus week",
    message: "Earn double tokens every bottle thrown this week!",
    date: "Mar 20, 2025",
    type: "info",
  },
];

export default function UserDashboardPage() {
  return (
    <div className={styles.page}>

      {/* ── Greeting ─────────────────────────────────── */}
      <div className={styles.greeting}>
        <h1 className={styles.title}>Welcome back! 👋</h1>
        <p className={styles.sub}>Here's your activity overview</p>
      </div>

      {/* ── Stat blocks ──────────────────────────────── */}
      <StatBlocks data={mockUserData} />

      {/* ── Announcements ────────────────────────────── */}
      <AnnouncementList data={mockAnnouncements} />

    </div>
  );
}