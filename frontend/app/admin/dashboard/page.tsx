"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/RouterAdmin/dashboard/StatCard";
import ActivityTable from "@/components/RouterAdmin/dashboard/ActivityTable";
import FeedbackCard from "@/components/RouterAdmin/dashboard/FeedbackCard";
import MobileCarousel from "@/components/RouterAdmin/dashboard/MobileCarousel";
import DataState from "@/components/Ui/DataState";
import styles from "./page.module.css";
import { apiFetch } from "@/lib/api";
import { dashboardData, type Test } from "@/lib/mockData/admin/Dashboard";

export default function DashboardPage() {
  const [data, setData] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/admin/Dashboard")
      .then((res: Test) => setData(res))
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
      <DataState loading={loading} error={error} isEmpty={!data} emptyText="No dashboard data">
        {data && (
          <>
            <div className={styles.heading}>
              <h1 className={styles.title}>Dashboard</h1>
              <p className={styles.sub}>Welcome back, Admin</p>
            </div>

            <div className={styles.statsGrid}>
              <StatCard title="Total Users" value={data.totalUsers} subtitle="Registered" accent="blue" />
              <StatCard title="Total Bottles" value={data.totalBottles} subtitle="Collected" accent="sky" />
              <StatCard title="Total Weight" value={data.totalWeight} subtitle="Gram" accent="green" />
              <StatCard title="Total Tokens" value={data.totalTokens} subtitle="All users" accent="orange" />
              <StatCard title="System Uptime" value={dashboardData.systemUptime} subtitle="Last 30 days" accent="blue" />
              <StatCard title="Avg Rating" value={`${dashboardData.avgRating} ★`} subtitle="From users" accent="sky" />
            </div>

            <div className={styles.mobileOnly}>
              <MobileCarousel data={dashboardData} />
            </div>

            <div className={styles.bottomRow}>
              <div className={styles.wide}>
                <ActivityTable data={dashboardData.recentActivity} />
              </div>
              <div className={styles.narrow}>
                <FeedbackCard data={dashboardData.recentFeedback} avgRating={dashboardData.avgRating} />
              </div>
            </div>
          </>
        )}
      </DataState>
    </div>
  );
}
