// components/tokens/TokenChart.tsx
// ─────────────────────────────────────────────────────────
// ฝั่งขวา — Line chart แสดง acquired vs redeemed
// sync filter กับ TokenSummary ผ่าน page.tsx
// "use client" เพราะใช้ recharts
// ─────────────────────────────────────────────────────────
"use client";

import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import styles from "./Tokenchart.module.css";

import {type TokenChartData} from "@/lib/mockData/admin/Tokens"

type Props = {
  data: TokenChartData;
  filter: "week" | "month" | "all";
};

export default function TokenChart({ data, filter }: Props) {
  const chartData = data[filter];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <p className={styles.title}>Token Trends</p>
          <p className={styles.sub}>
            {filter === "week" ? "Last 7 days" : filter === "month" ? "Last 30 days" : "All time"}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "#fff", border: "1px solid #e8edf3", borderRadius: "10px", fontSize: "12px" }}
          />
          <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />

          {/* Acquired — สีน้ำเงิน */}
          <Line
            type="monotone" dataKey="acquired" name="Acquired"
            stroke="#1177FE" strokeWidth={2.5}
            dot={false} activeDot={{ r: 4 }}
          />

          {/* Redeemed — สีฟ้าอ่อน */}
          <Line
            type="monotone" dataKey="redeemed" name="Redeemed"
            stroke="#48B7FF" strokeWidth={2.5}
            dot={false} activeDot={{ r: 4 }}
            strokeDasharray="5 3"  // เส้นประ เพื่อแยกออกจาก acquired
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}