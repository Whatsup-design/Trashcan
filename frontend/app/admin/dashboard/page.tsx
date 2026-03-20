// app/(admin)/dashboard/page.tsx
// Server Component — fetch ข้อมูลครั้งเดียว แล้วส่ง props ลงไป

import { getDashboardData } from "@/lib/DashboardData";
import StatCard       from "@/components/RouterAdmin/dashboard/StatCard";
import ActivityTable  from "@/components/RouterAdmin/dashboard/ActivityTable";
import FeedbackCard   from "@/components/RouterAdmin/dashboard/FeedbackCard";
import MobileCarousel from "@/components/RouterAdmin/dashboard/MobileCarousel";
import styles         from "./page.module.css";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className={styles.page}>

      {/* ── Heading ──────────────────────────────────────── */}
      <div className={styles.heading}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.sub}>Welcome back, Admin</p>
      </div>

      {/* ── Stat Cards — Desktop ─────────────────────────── */}
      <div className={styles.statsGrid}>
        <StatCard title="Total Devices"  value={data.totalDevices} subtitle="Registered"   accent="blue"   />
        <StatCard title="Bottles Today"  value={data.bottlesToday} subtitle="Collected"    accent="sky"    />
        <StatCard title="Active Tokens"  value={data.activeTokens} subtitle="In use"       accent="green"  />
        <StatCard title="Total Records"  value={data.totalRecords} subtitle="All time"     accent="orange" />
        <StatCard title="System Uptime"  value={data.systemUptime} subtitle="Last 30 days" accent="blue"   />
        <StatCard title="Avg Rating"     value={`${data.avgRating} ★`} subtitle="From users" accent="sky" />
      </div>

      {/* ── Mobile Carousel ──────────────────────────────── */}
      <div className={styles.mobileOnly}>
        <MobileCarousel data={data} />
      </div>

      {/* ── Bottom row — Activity + Feedback ─────────────── */}
      <div className={styles.bottomRow}>
        {/* Activity table กว้างกว่า */}
        <div className={styles.wide}>
          <ActivityTable data={data.recentActivity} />
        </div>

        {/* Feedback แคบกว่า */}
        <div className={styles.narrow}>
          <FeedbackCard data={data.recentFeedback} avgRating={data.avgRating} />
        </div>
      </div>

    </div>
  );
}