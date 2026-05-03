"use client";

import { useEffect, useState } from "react";
import LeaderboardList from "@/components/RouterUser/Leaderboard/Leaderboard";
import { apiFetch, ApiError } from "@/lib/api";
import { logDevError } from "@/lib/devLog";
import type { LeaderboardResponse } from "@/lib/types/user/Leaderboard";
import styles from "./page.module.css";

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/user/Leaderboard")
      .then((res: LeaderboardResponse) => {
        setData(res);
        setError("");
      })
      .catch((err) => {
        logDevError("user-leaderboard", err);
        if (err instanceof ApiError) {
          setError(err.message);
          return;
        }

        setError("Failed to load leaderboard data");
      });
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Leaderboard</h1>
        <p className={styles.sub}>Monthly ranking - sorted by tokens</p>
      </div>

      {error ? <p>{error}</p> : null}
      {!data && !error ? <p>Loading...</p> : null}
      {data ? <LeaderboardList data={data} /> : null}
    </div>
  );
}
