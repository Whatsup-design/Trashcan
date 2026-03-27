// app/(admin)/dashboard/page.tsx
import { dashboardData } from "@/lib/mockData/admin/Dashboard";
import StatCard       from "@/components/RouterAdmin/dashboard/StatCard";
import ActivityTable  from "@/components/RouterAdmin/dashboard/ActivityTable";
import FeedbackCard   from "@/components/RouterAdmin/dashboard/FeedbackCard";
import MobileCarousel from "@/components/RouterAdmin/dashboard/MobileCarousel";
import styles         from "./page.module.css";

// ← เพิ่ม export default function
export default function DashboardPage() {
  // ← เปลี่ยนจาก getDashboardData เป็น dashboardData (ไม่ต้องเรียก)
  const data = dashboardData;

  return (
    <div className={styles.page}>

      <div className={styles.heading}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.sub}>Welcome back, Admin</p>
      </div>

      <div className={styles.statsGrid}>
        <StatCard title="Total Devices" value={data.totalDevices} subtitle="Registered"   accent="blue"   />
        <StatCard title="Bottles Today" value={data.bottlesToday} subtitle="Collected"    accent="sky"    />
        <StatCard title="Active Tokens" value={data.activeTokens} subtitle="In use"       accent="green"  />
        <StatCard title="Total Records" value={data.totalRecords} subtitle="All time"     accent="orange" />
        <StatCard title="System Uptime" value={data.systemUptime} subtitle="Last 30 days" accent="blue"   />
        <StatCard title="Avg Rating"    value={`${data.avgRating} ★`} subtitle="From users" accent="sky" />
      </div>

      <div className={styles.mobileOnly}>
        <MobileCarousel data={data} />
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.wide}>
          <ActivityTable data={data.recentActivity} />
        </div>
        <div className={styles.narrow}>
          <FeedbackCard data={data.recentFeedback} avgRating={data.avgRating} />
        </div>
      </div>

    </div>
  );
}