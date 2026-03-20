// components/bottles/BottleChart.tsx
// ─────────────────────────────────────────────────────────
// ฝั่งขวา — Line chart แสดงขวดตามวัน + ตามประเภท
// "use client" จำเป็นเพราะมี state filter + recharts
// ─────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import styles from "./BottleChart.module.css";

// ── Types ─────────────────────────────────────────────────
export type BottleChartPoint = {
  date: string;       // วันที่ เช่น "Mon", "Jan 1"
  total: number;      // รวมทุกประเภท
  plastic: number;    // พลาสติก
  glass: number;      // แก้ว
  aluminum: number;   // อลูมิเนียม
};

export type BottleChartData = {
  week:  BottleChartPoint[];  // ข้อมูล 7 วัน
  month: BottleChartPoint[];  // ข้อมูล 30 วัน
  all:   BottleChartPoint[];  // ข้อมูลทั้งหมด
};

type Props = {
  data: BottleChartData;
  filter: "week" | "month" | "all";  // sync กับ BottleSummary
};

// ── Chart mode: by day total หรือ by type
type ChartMode = "total" | "byType";

export default function BottleChart({ data, filter }: Props) {
  const [mode, setMode] = useState<ChartMode>("total"); // แสดงแบบไหน

  // เลือก dataset ตาม filter
  const chartData = data[filter];

  return (
    <div className={styles.card}>
      {/* ── Header ─────────────────────────────────────── */}
      <div className={styles.header}>
        <div>
          <p className={styles.title}>Bottle Trends</p>
          <p className={styles.sub}>
            {filter === "week" ? "Last 7 days" : filter === "month" ? "Last 30 days" : "All time"}
          </p>
        </div>

        {/* ── Mode toggle: Total vs By Type ──────────────── */}
        <div className={styles.modeGroup}>
          <button
            className={`${styles.modeBtn} ${mode === "total" ? styles.active : ""}`}
            onClick={() => setMode("total")}
          >
            Total
          </button>
          <button
            className={`${styles.modeBtn} ${mode === "byType" ? styles.active : ""}`}
            onClick={() => setMode("byType")}
          >
            By Type
          </button>
        </div>
      </div>

      {/* ── Chart ──────────────────────────────────────── */}
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "#fff", border: "1px solid #e8edf3", borderRadius: "10px", fontSize: "12px" }}
          />
          <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />

          {mode === "total" ? (
            // ── แสดงเส้นรวม
            <Line type="monotone" dataKey="total" name="Total" stroke="#1177FE" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
          ) : (
            // ── แสดงแยกตามประเภท
            <>
              <Line type="monotone" dataKey="plastic"  name="Plastic"  stroke="#1177FE" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="glass"    name="Glass"    stroke="#48B7FF" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="aluminum" name="Aluminum" stroke="#22c55e" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}