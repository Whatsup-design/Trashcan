// components/dashboard/FeedbackCard.tsx
// ─────────────────────────────────────────────────────────
// แสดง feedback จาก user พร้อม star rating
// Server Component — ไม่ต้องการ state
// ─────────────────────────────────────────────────────────

import type { FeedbackItem } from "@/lib/DashboardData";
import styles from "./FeedbackCard.module.css";

type FeedbackCardProps = {
  data: FeedbackItem[];
  avgRating: number; // คะแนนเฉลี่ยทั้งหมด
};

// แปลง rating เป็น ★ string เช่น rating=4 → "★★★★☆"
function StarRating({ rating }: { rating: number }) {
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? styles.starFilled : styles.starEmpty}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function FeedbackCard({ data, avgRating }: FeedbackCardProps) {
  return (
    <div className={styles.card}>
      {/* Header — แสดงคะแนนเฉลี่ย */}
      <div className={styles.header}>
        <p className={styles.title}>Device Feedback</p>
        <div className={styles.avgWrap}>
          <span className={styles.avgScore}>{avgRating}</span>
          <span className={styles.avgStar}>★</span>
          <span className={styles.avgLabel}>avg</span>
        </div>
      </div>

      {/* รายการ feedback */}
      <div className={styles.list}>
        {data.map((item) => (
          <div key={item.id} className={styles.item}>
            <div className={styles.itemTop}>
              <span className={styles.device}>{item.device}</span>
              <StarRating rating={item.rating} />
            </div>
            <p className={styles.comment}>{item.comment}</p>
            <p className={styles.meta}>
              {item.user} · {item.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}