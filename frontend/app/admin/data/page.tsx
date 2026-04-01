"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/RouterAdmin/Data/DataTable";
import DataState from "@/components/Ui/DataState";
import styles from "./page.module.css";
import { apiFetch } from "@/lib/api";
import type { DataRow } from "@/lib/mockData/admin/Data";

export default function DataPage() {
  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/admin/Data")
      .then((res: DataRow[]) => setData(res))
      .catch((err) => {
        console.error(err);
        setError("Failed to load data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.page}>
      <DataState loading={loading} error={error} isEmpty={data.length === 0} emptyText="No student data found">
        <>
          <div className={styles.heading}>
            <h1 className={styles.title}>Data</h1>
            <p className={styles.sub}>RFID & Student records - {data.length} total</p>
          </div>

          <DataTable data={data} />
        </>
      </DataState>
    </div>
  );
}
