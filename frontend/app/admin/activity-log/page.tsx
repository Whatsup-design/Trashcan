"use client";

import { useEffect, useState } from "react";
import ActivityLogTable from "@/components/RouterAdmin/ActivityLog/ActivityLogTable";
import DataState from "@/components/Ui/DataState";
import styles from "./page.module.css";
import { ApiError, apiFetch } from "@/lib/api";
import { logDevError } from "@/lib/devLog";
import type { ActivityLog } from "@/lib/mockData/admin/ActivityLog";

const TODAY = new Date().toISOString().split("T")[0];

export default function ActivityLogPage() {
  const [data, setData] = useState<ActivityLog[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function getErrorMessage(err: unknown) {
    if (err instanceof ApiError && err.status === 0) {
      return "Request timed out or network error. Please try again.";
    }
    return "Failed to load activity log data. Please try again.";
  }

  function loadActivityLog() {
    setLoading(true);
    setError("");
    apiFetch("/admin/ActivityLog")
      .then((res: ActivityLog[]) => setData(res))
      .catch((err) => {
        logDevError("admin-activity-log", err);
        setError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    loadActivityLog();
  }, []);

  return (
    <div className={styles.page}>
      <DataState loading={loading} error={error} onRetry={loadActivityLog} isEmpty={!data || data.length === 0} emptyText="No activity log found">
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
