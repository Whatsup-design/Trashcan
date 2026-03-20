// app/admin/tokens/page.tsx
"use client";

import { useState } from "react";
import TokenSummary, { type TokenSummaryData } from "@/components/RouterAdmin/Tokens/Tokensummary";
import TokenChart,   { type TokenChartData   } from "@/components/RouterAdmin/Tokens/Tokenchart";
import CouponList                              from "@/components/RouterAdmin/Tokens/Coupon/CouponList";
import styles from "./page.module.css";

// ── Mockup Summary ────────────────────────────────────────
const summaryData: TokenSummaryData = {
  totalAcquired:     24960,
  totalRedeemed:     18720,
  thisWeekAcquired:  1684,
  thisWeekRedeemed:  1260,
  thisMonthAcquired: 6420,
  thisMonthRedeemed: 4815,
};

// ── Mockup Chart ──────────────────────────────────────────
const chartData: TokenChartData = {
  week: [
    { date: "Mon", acquired: 196,  redeemed: 147 },
    { date: "Tue", acquired: 284,  redeemed: 213 },
    { date: "Wed", acquired: 230,  redeemed: 172 },
    { date: "Thu", acquired: 320,  redeemed: 240 },
    { date: "Fri", acquired: 260,  redeemed: 195 },
    { date: "Sat", acquired: 370,  redeemed: 277 },
    { date: "Sun", acquired: 316,  redeemed: 237 },
  ],
  month: Array.from({ length: 30 }, (_, i) => ({
    date: `${i + 1}`,
    acquired: 160 + Math.floor(Math.random() * 240),
    redeemed: 120 + Math.floor(Math.random() * 180),
  })),
  all: [
    { date: "Jan", acquired: 4200,  redeemed: 3150 },
    { date: "Feb", acquired: 3700,  redeemed: 2775 },
    { date: "Mar", acquired: 4800,  redeemed: 3600 },
    { date: "Apr", acquired: 4400,  redeemed: 3300 },
    { date: "May", acquired: 5300,  redeemed: 3975 },
    { date: "Jun", acquired: 5800,  redeemed: 4350 },
    { date: "Jul", acquired: 6200,  redeemed: 4650 },
    { date: "Aug", acquired: 5600,  redeemed: 4200 },
    { date: "Sep", acquired: 6400,  redeemed: 4800 },
    { date: "Oct", acquired: 5900,  redeemed: 4425 },
    { date: "Nov", acquired: 6800,  redeemed: 5100 },
    { date: "Dec", acquired: 7200,  redeemed: 5400 },
  ],
};

export default function TokensPage() {
  const [filter, setFilter] = useState<"week" | "month" | "all">("week");

  return (
    <div className={styles.page}>

      {/* ── Heading ──────────────────────────────────── */}
      <div className={styles.heading}>
        <h1 className={styles.title}>Tokens</h1>
        <p className={styles.sub}>Acquisition & redemption overview</p>
      </div>

      {/* ── Summary + Chart ──────────────────────────── */}
      <div className={styles.layout}>
        <div className={styles.left}>
          <TokenSummary data={summaryData} filter={filter} onFilter={setFilter} />
        </div>
        <div className={styles.right}>
          <TokenChart data={chartData} filter={filter} />
        </div>
      </div>

      {/* ── Coupon Management ────────────────────────── */}
      <CouponList />

    </div>
  );
}