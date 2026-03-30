// app/admin/data/page.tsx
// Server Component — mockup data อยู่ที่นี่
// ตอน connect Supabase แก้แค่ mockData array ด้านล่างครับ
"use client";
import DataTable from "@/components/RouterAdmin/Data/DataTable";
import styles from "./page.module.css";

import { apiFetch } from "@/lib/api";
import { type DataRow } from "@/lib/mockData/admin/Data";
import { useEffect, useState } from "react";



export default function DataPage() {
  const [data, setData] = useState<DataRow[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/admin/Data")
      .then((res: DataRow[]) => setData(res))
      .catch((err) => {
        console.error(err);
        setError("Failed to load data");
      });

  }, [])
  
  
  ;
  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Data</h1>
        <p className={styles.sub}>RFID & Student records — {data.length} total</p>
      </div>

      {/* ส่ง data ลงไปให้ DataTable จัดการ search/sort/filter/pagination */}
      <DataTable data={data} />
    </div>
  );
}