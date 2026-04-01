"use client";

import { useEffect, useState } from "react";
import ActivityLogTable from "@/components/RouterAdmin/ActivityLog/ActivityLogTable";
import DataState from "@/components/Ui/DataState";
import styles from "./page.module.css";
import { apiFetch } from "@/lib/api";
import type { ActivityLog } from "@/lib/mockData/admin/ActivityLog";

const TODAY = new Date().toISOString().split("T")[0];

export default function ActivityLogPage() {
  const [data, setData] = useState<ActivityLog[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/admin/ActivityLog")
      .then((res: ActivityLog[]) => setData(res))
      .catch((err) => {
        console.error(err);
        setError("Failed to load activity log data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.page}>
      <DataState loading={loading} error={error} isEmpty={!data || data.length === 0} emptyText="No activity log found">
        {data && (
          <>
            <div className={styles.heading}>
              <h1 className={styles.title}>Activity Log</h1>
              <p className={styles.sub}>Daily records - resets every midnight</p>
            </div>

            <ActivityLogTable data={data} date={TODAY} />
          </>
        )}
      </DataState>
    </div>
  );
}
