// app/admin/activity-log/page.tsx
// ─────────────────────────────────────────────────────────
// Activity Log — แสดงข้อมูลรายวัน
// ข้อมูลจะถูกล้างทุกวัน (daily reset)
// ตอน connect Supabase แก้แค่ mockData ครับ
// ─────────────────────────────────────────────────────────

import ActivityLogTable from "@/components/RouterAdmin/activity-log/ActivityLogTable";
import styles from "./page.module.css";
import ActivityLogMockData from "@/lib/mockData/admin/ActivityLog"

// ── วันที่วันนี้ ───────────────────────────────────────────
const TODAY = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

// ── Mockup data ───────────────────────────────────────────

export default function ActivityLogPage() {
  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Activity Log</h1>
        <p className={styles.sub}>Daily records — resets every midnight</p>
      </div>

      <ActivityLogTable data={ActivityLogMockData} date={TODAY} />
    </div>
  );
}