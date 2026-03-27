// app/admin/data/page.tsx
// Server Component — mockup data อยู่ที่นี่
// ตอน connect Supabase แก้แค่ mockData array ด้านล่างครับ

import DataTable from "@/components/RouterAdmin/Data/DataTable";
import styles from "./page.module.css";

import { mockData } from "@/lib/mockData/admin/Data";



export default function DataPage() {
  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Data</h1>
        <p className={styles.sub}>RFID & Student records — {mockData.length} total</p>
      </div>

      {/* ส่ง data ลงไปให้ DataTable จัดการ search/sort/filter/pagination */}
      <DataTable data={mockData} />
    </div>
  );
}