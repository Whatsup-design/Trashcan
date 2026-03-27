// components/tokens/TokenSummary.tsx
// ─────────────────────────────────────────────────────────
// ฝั่งซ้าย — แสดงตัวเลขรวม token + filter week/month/all
// ─────────────────────────────────────────────────────────

import styles from "./Tokensummary.module.css";

import { type TokenSummaryData } from "@/lib/mockData/admin/Tokens";

type Props = {
  data: TokenSummaryData;
  filter: "week" | "month" | "all";
  onFilter: (f: "week" | "month" | "all") => void;
};

export default function TokenSummary({ data, filter, onFilter }: Props) {
  // เลือกตัวเลขตาม filter
  const acquired =
    filter === "week"  ? data.thisWeekAcquired  :
    filter === "month" ? data.thisMonthAcquired : data.totalAcquired;

  const redeemed =
    filter === "week"  ? data.thisWeekRedeemed  :
    filter === "month" ? data.thisMonthRedeemed : data.totalRedeemed;

  // คำนวณ % redeemed
  const redeemRate = acquired > 0
    ? Math.round((redeemed / acquired) * 100)
    : 0;

  return (
    <div className={styles.card}>
      <p className={styles.title}>Token Overview</p>

      {/* ── Filter buttons ──────────────────────────── */}
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

      <div className={styles.divider} />

      {/* ── Acquired ────────────────────────────────── */}
      <div className={styles.statBlock}>
        <div className={styles.statDot} style={{ background: "#1177FE" }} />
        <div>
          <p className={styles.statLabel}>Acquired</p>
          <p className={styles.statValue}>{acquired.toLocaleString()}</p>
        </div>
      </div>

      {/* ── Redeemed ────────────────────────────────── */}
      <div className={styles.statBlock}>
        <div className={styles.statDot} style={{ background: "#48B7FF" }} />
        <div>
          <p className={styles.statLabel}>Redeemed</p>
          <p className={styles.statValue}>{redeemed.toLocaleString()}</p>
        </div>
      </div>

      <div className={styles.divider} />

      {/* ── Redeem rate progress bar ─────────────────── */}
      <div className={styles.rateWrap}>
        <div className={styles.rateHeader}>
          <p className={styles.rateLabel}>Redeem Rate</p>
          <p className={styles.rateValue}>{redeemRate}%</p>
        </div>
        <div className={styles.progressBg}>
          <div
            className={styles.progressFill}
            style={{ width: `${redeemRate}%` }}
          />
        </div>
      </div>

    </div>
  );
}