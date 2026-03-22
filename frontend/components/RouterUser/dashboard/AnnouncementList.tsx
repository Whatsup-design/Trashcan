// components/user/dashboard/AnnouncementList.tsx
// ─────────────────────────────────────────────────────────
// แสดง announcement จาก admin
// Server Component — ไม่มี state
// ─────────────────────────────────────────────────────────

import type { Announcement } from "./types";
import styles from "./AnnouncementList.module.css";

type Props = { data: Announcement[] };

// icon ตาม type
const typeIcon = {
  info:    "📢",
  warning: "⚠️",
  success: "✅",
};

// color ตาม type
const typeClass = {
  info:    "info",
  warning: "warning",
  success: "success",
};

export default function AnnouncementList({ data }: Props) {
  return (
    <div className={styles.wrap}>
      <p className={styles.title}>Announcements</p>

      {data.length === 0 ? (
        <p className={styles.empty}>No announcements</p>
      ) : (
        <div className={styles.list}>
          {data.map((item) => (
            <div key={item.id} className={`${styles.item} ${styles[typeClass[item.type]]}`}>
              <span className={styles.icon}>{typeIcon[item.type]}</span>
              <div className={styles.content}>
                <p className={styles.itemTitle}>{item.title}</p>
                <p className={styles.itemMsg}>{item.message}</p>
                <p className={styles.itemDate}>{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}