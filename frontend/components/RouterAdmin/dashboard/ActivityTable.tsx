// components/dashboard/ActivityTable.tsx
// ─────────────────────────────────────────────────────────
// ตาราง Recent Activity — แสดง 5 รายการล่าสุด
// Server Component — ไม่มี state หรือ event ใดๆ
// ─────────────────────────────────────────────────────────


import styles from "./ActivityTable.module.css";
import { type ActivityItem } from "@/types/AdminTypes";

type ActivityTableProps = {
  data: ActivityItem[];
};

// map status → CSS class สำหรับ badge สี
const statusClass = {
  success: styles.success,
  warning: styles.warning,
  error:   styles.error,
};

export default function ActivityTable({ data }: ActivityTableProps) {
  return (
    <div className={styles.card}>
      <p className={styles.title}>Recent Activity</p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Device</th>
              <th>Action</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td className={styles.device}>{item.device}</td>
                <td>{item.action}</td>
                <td>
                  {/* Badge สีตาม status */}
                  <span className={`${styles.badge} ${statusClass[item.status]}`}>
                    {item.status}
                  </span>
                </td>
                <td className={styles.time}>{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
