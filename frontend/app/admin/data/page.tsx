"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/RouterAdmin/Data/DataTable";
import DataState from "@/components/Ui/DataState";
import styles from "./page.module.css";
import { ApiError, apiFetch } from "@/lib/api";
import { logDevError } from "@/lib/devLog";
import type { DataRow } from "@/lib/mockData/admin/Data";

export default function DataPage() {
  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function getErrorMessage(err: unknown) {
    if (err instanceof ApiError && err.status === 0) {
      return "Request timed out or network error. Please try again.";
    }
    return "Failed to load data. Please try again.";
  }

  function loadData() {
    setLoading(true);
    setError("");
    apiFetch("/admin/Data")
      .then((res: DataRow[]) => setData(res))
      .catch((err) => {
        logDevError("admin-data", err);
        setError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className={styles.page}>
      <DataState loading={loading} error={error} onRetry={loadData} isEmpty={data.length === 0} emptyText="No student data found">
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
