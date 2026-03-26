// components/bottles/BottleSummary.tsx
// ─────────────────────────────────────────────────────────
// ฝั่งซ้าย — แสดงตัวเลขรวมขวด + filter this week/month/all
// Server Component ไม่มี state
// ─────────────────────────────────────────────────────────

import styles from "./BottleSummary.module.css";
import { type BottleSummaryData } from "@/types/AdminTypes";

type Props = {
  data: BottleSummaryData;
  filter: "week" | "month" | "all";  // filter ปัจจุบัน
  onFilter: (f: "week" | "month" | "all") => void;
};

export default function BottleSummary({ data, filter, onFilter }: Props) {
  // ตัวเลขที่แสดงตาม filter
  const displayValue =
    filter === "week"  ? data.thisWeek  :
    filter === "month" ? data.thisMonth : data.total;

  const displayLabel =
    filter === "week"  ? "This Week"  :
    filter === "month" ? "This Month" : "All Time";

  return (
    <div className={styles.card}>
      {/* ── Header ─────────────────────────────────────── */}
      <p className={styles.title}>Total Bottles</p>

      {/* ── Big number ─────────────────────────────────── */}
      <div className={styles.bigNum}>
        <span className={styles.value}>{displayValue.toLocaleString()}</span>
        <span className={styles.label}>{displayLabel}</span>
      </div>

      {/* ── Filter buttons ─────────────────────────────── */}
      <div className={styles.filterGroup}>
        {(["week", "month", "all"] as const).map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.active : ""}`}
            onClick={() => onFilter(f)}
          >
            {f === "week" ? "Week" : f === "month" ? "Month" : "All"}
          </button>
        ))}
      </div>

      {/* ── Divider ────────────────────────────────────── */}
      <div className={styles.divider} />

      {/* ── Breakdown by type ──────────────────────────── */}
      <p className={styles.subTitle}>By Type</p>
      <div className={styles.typeList}>
        {[
          { label: "Plastic",   value: data.plastic,   color: "#1177FE" },
          { label: "Glass",     value: data.glass,     color: "#48B7FF" },
          { label: "Aluminum",  value: data.aluminum,  color: "#22c55e" },
        ].map((item) => (
          <div key={item.label} className={styles.typeRow}>
            <div className={styles.typeLeft}>
              <span className={styles.dot} style={{ background: item.color }} />
              <span className={styles.typeLabel}>{item.label}</span>
            </div>
            <span className={styles.typeValue}>{item.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}