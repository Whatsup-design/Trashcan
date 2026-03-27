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

import bottleData from "@/lib/mockData/admin/Bottles"

const { summaryData, chartData } = bottleData


// ── Mockup Summary Data ───────────────────────────────────


export default function BottlesPage() {
  // filter state แชร์ระหว่างซ้ายและขวา
  const [filter, setFilter] = useState<"week" | "month" | "all">("week");

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
            data={summaryData}
            filter={filter}
            onFilter={setFilter}   // ← เมื่อกด filter ซ้าย → เปลี่ยน chart ขวาด้วย
          />
        </div>

        {/* ขวา — chart */}
        <div className={styles.right}>
          <BottleChart
            data={chartData}
            filter={filter}         // ← รับ filter เดียวกันจากซ้าย
          />
        </div>
      </div>
    </div>
  );
}