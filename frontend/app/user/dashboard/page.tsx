"use client";


import { useEffect, useState } from "react";

import StatBlocks from "@/components/RouterUser/dashboard/StatBlocks";
import AnnouncementList from "@/components/RouterUser/dashboard/AnnouncementList";
import DataState from "@/components/Ui/DataState";

import { apiFetch } from "@/lib/api";

import DashboardData, {
  type Announcement,
  type UserDashboardData,
} from "@/lib/mockData/user/Dashboard";

import styles from "./page.module.css";

type UserDashboardResponse = UserDashboardData & {
  studentId: number;
};

function normalizeDashboardResponse(input: unknown): UserDashboardResponse {
  const source = (input ?? {}) as Partial<UserDashboardResponse>;
  const hasDashboardFields =
    source.studentId !== undefined &&
    source.bottlesThrown !== undefined &&
    source.weightGram !== undefined &&
    source.tokensBalance !== undefined &&
    source.currentRank !== undefined;

  if (!hasDashboardFields) {
    throw new Error("Invalid dashboard response");
  }

  return {
    studentId: Number(source.studentId ?? 0),
    bottlesThrown: Number(source.bottlesThrown ?? 0),
    weightGram: Number(source.weightGram ?? 0),
    tokensBalance: Number(source.tokensBalance ?? 0),
    currentRank: Number(source.currentRank ?? 0),
  };
}

const { mockAnnouncements } = DashboardData as {
  mockAnnouncements: Announcement[];
};

export default function UserDashboardPage() {
  const [data, setData] = useState<UserDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/user/Dashboard")
      .then((res: unknown) => setData(normalizeDashboardResponse(res)))
      .catch((err) => {
        console.error(err);
        setError("Failed to load dashboard data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.page}>
      <DataState
        loading={loading}
        error={error}
        isEmpty={!data}
        emptyText="No dashboard data"
      >
        {data ? (
          <>
            <div className={styles.greeting}>
              <h1 className={styles.title}>Welcome back!</h1>
              <p className={styles.sub}>
                Here is your activity overview for Student ID {data.studentId}
              </p>
            </div>

            <StatBlocks data={data} />
            <AnnouncementList data={mockAnnouncements} />
          </>
        ) : null}
      </DataState>
    </div>
  );
}
