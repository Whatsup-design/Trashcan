// app/admin/bottles/page.tsx
// ─────────────────────────────────────────────────────────
// "use client" จำเป็นเพราะต้องแชร์ filter state
// ระหว่าง BottleSummary (ซ้าย) และ BottleChart (ขวา)
// ─────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import BottleSummary, { type BottleSummaryData } from "@/components/Bottle/BottleSummary";
import BottleChart,   { type BottleChartData   } from "@/components/Bottle/BottleChart";
import styles from "./page.module.css";

// ── Mockup Summary Data ───────────────────────────────────
const summaryData: BottleSummaryData = {
  total:     12480,
  thisWeek:  842,
  thisMonth: 3210,
  plastic:   7200,
  glass:     3100,
  aluminum:  2180,
};

// ── Mockup Chart Data ─────────────────────────────────────
const chartData: BottleChartData = {
  // ข้อมูล 7 วัน
  week: [
    { date: "Mon", total: 98,  plastic: 55, glass: 25, aluminum: 18 },
    { date: "Tue", total: 142, plastic: 80, glass: 38, aluminum: 24 },
    { date: "Wed", total: 115, plastic: 65, glass: 30, aluminum: 20 },
    { date: "Thu", total: 160, plastic: 90, glass: 42, aluminum: 28 },
    { date: "Fri", total: 130, plastic: 75, glass: 35, aluminum: 20 },
    { date: "Sat", total: 185, plastic: 105,glass: 48, aluminum: 32 },
    { date: "Sun", total: 158, plastic: 88, glass: 42, aluminum: 28 },
  ],
  // ข้อมูล 30 วัน (ย่อ)
  month: Array.from({ length: 30 }, (_, i) => ({
    date: `${i + 1}`,
    total:    80 + Math.floor(Math.random() * 120),
    plastic:  40 + Math.floor(Math.random() * 70),
    glass:    20 + Math.floor(Math.random() * 35),
    aluminum: 15 + Math.floor(Math.random() * 25),
  })),
  // ข้อมูลทั้งหมด 12 เดือน
  all: [
    { date: "Jan", total: 2100, plastic: 1200, glass: 550,  aluminum: 350 },
    { date: "Feb", total: 1850, plastic: 1050, glass: 490,  aluminum: 310 },
    { date: "Mar", total: 2400, plastic: 1380, glass: 630,  aluminum: 390 },
    { date: "Apr", total: 2200, plastic: 1260, glass: 580,  aluminum: 360 },
    { date: "May", total: 2650, plastic: 1520, glass: 700,  aluminum: 430 },
    { date: "Jun", total: 2900, plastic: 1660, glass: 760,  aluminum: 480 },
    { date: "Jul", total: 3100, plastic: 1780, glass: 820,  aluminum: 500 },
    { date: "Aug", total: 2800, plastic: 1600, glass: 740,  aluminum: 460 },
    { date: "Sep", total: 3200, plastic: 1840, glass: 850,  aluminum: 510 },
    { date: "Oct", total: 2950, plastic: 1690, glass: 780,  aluminum: 480 },
    { date: "Nov", total: 3400, plastic: 1950, glass: 900,  aluminum: 550 },
    { date: "Dec", total: 3600, plastic: 2060, glass: 950,  aluminum: 590 },
  ],
};

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