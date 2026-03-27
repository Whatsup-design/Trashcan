// app/admin/tokens/page.tsx
"use client";

import { useState } from "react";
import TokenSummary from "@/components/RouterAdmin/Tokens/Tokensummary";
import TokenChart from "@/components/RouterAdmin/Tokens/Tokenchart";
import CouponList from "@/components/RouterAdmin/Tokens/Coupon/CouponList";
import styles from "./page.module.css";




import { summaryData } from "@/lib/mockData/admin/Tokens";
import { chartData } from "@/lib/mockData/admin/Tokens";

// ── Mockup Summary ────────────────────────────────────────


// ── Mockup Chart ──────────────────────────────────────────


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