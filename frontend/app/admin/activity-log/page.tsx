// app/admin/activity-log/page.tsx
// ─────────────────────────────────────────────────────────
// Activity Log — แสดงข้อมูลรายวัน
// ข้อมูลจะถูกล้างทุกวัน (daily reset)
// ตอน connect Supabase แก้แค่ mockData ครับ
// ─────────────────────────────────────────────────────────
"use client";
import ActivityLogTable from "@/components/RouterAdmin/activity-log/ActivityLogTable";
import styles from "./page.module.css";
import { apiFetch } from "@/lib/api";
import {useState, useEffect} from "react";
import {type ActivityLog, type ActivityAction } from "@/lib/mockData/admin/ActivityLog";
// ── วันที่วันนี้ ───────────────────────────────────────────
const TODAY = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

// ── Mockup data ───────────────────────────────────────────

export default function ActivityLogPage() {
    const [data, setData] = useState<ActivityLog[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/admin/ActivityLog")
      .then((res: ActivityLog[]) => setData(res))
      .catch((err) => {
        console.error(err);
        setError("Failed to load activity log data");
      });
  }, []);

  if (error) {
    return <div className={styles.page}>{error}</div>;
  }

  if (!data) {
    return <div className={styles.page}>Loading...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Activity Log</h1>
        <p className={styles.sub}>Daily records — resets every midnight</p>
      </div>

      <ActivityLogTable data={data} date={TODAY} />
    </div>
  );
}