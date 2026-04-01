// app/admin/bottles/page.tsx
// ─────────────────────────────────────────────────────────
// "use client" จำเป็นเพราะต้องแชร์ filter state
// ระหว่าง BottleSummary (ซ้าย) และ BottleChart (ขวา)
// ─────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import BottleSummary from "@/components/RouterAdmin/Bottle/BottleSummary";
import BottleChart from "@/components/RouterAdmin/Bottle/BottleChart";
import styles from "./page.module.css";

import TokenSummary from "@/components/RouterAdmin/Tokens/Tokensummary";
import TokenChart from "@/components/RouterAdmin/Tokens/Tokenchart";

import bottleData from "@/lib/mockData/admin/Bottles"

import { summaryData } from "@/lib/mockData/admin/Tokens";
import { chartData } from "@/lib/mockData/admin/Tokens";

const { summaryDataBottle, chartDataBottle } = bottleData


// ── Mockup Summary Data ───────────────────────────────────


export default function BottlesPage() {
  // filter state แชร์ระหว่างซ้ายและขวา
  const [filterBottle, setFilterBottle] = useState<"week" | "month" | "all">("week");
  const [filterTokens, setFilterTokens] = useState<"week" | "month" | "all">("week");

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Bottles</h1>
        <p className={styles.sub}>Collection overview & trends</p>
      </div>

      {/* ── Main layout: ซ้าย + ขวา ────────────────────── */}
      <div className={styles.layout}>
        {/* ซ้าย — summary + filter */}
        <div className={styles.left}>
          <BottleSummary
            data={summaryDataBottle}
            filter={filterBottle}
            onFilter={setFilterBottle}   // ← เมื่อกด filter ซ้าย → เปลี่ยน chart ขวาด้วย
          />
        </div>

        {/* ขวา — chart */}
        <div className={styles.right}>
          <BottleChart
            data={chartDataBottle}
            filter={filterBottle}         // ← รับ filter เดียวกันจากซ้าย
          />
        </div>
      </div>


      {/* ── Token acquisition + redemption ────────────────────── */}
        <div className={styles.heading}>
        <h1 className={styles.title}>Tokens</h1>
        <p className={styles.sub}>Acquisition & redemption overview</p>
      </div>

      {/* ── Summary + Chart ──────────────────────────── */}
      <div className={styles.layout}>
        <div className={styles.left}>
          <TokenSummary data={summaryData} filter={filterTokens} onFilter={setFilterTokens} />
        </div>
        <div className={styles.right}>
          <TokenChart data={chartData} filter={filterTokens} />
        </div>
      </div>
    </div>
  );
}