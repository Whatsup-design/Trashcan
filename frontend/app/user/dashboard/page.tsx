"use client";


import { useEffect, useState } from "react";

import StatBlocks from "@/components/RouterUser/dashboard/StatBlocks";
import AnnouncementList, {
  type UserAnnouncement,
} from "@/components/RouterUser/dashboard/AnnouncementList";
import DataState from "@/components/Ui/DataState";

import { apiFetch } from "@/lib/api";
import { logDevError } from "@/lib/devLog";
import type { UserDashboardData } from "@/lib/mockData/user/Dashboard";

import styles from "./page.module.css";

type UserDashboardResponse = UserDashboardData & {
  studentId: number;
  studentNicknameE: string;
};

type UserAnnouncementResponse = {
  Announcement_ID: number;
  Announcement_Title: string;
  Announcement_Message: string;
  Announcement_HeaderType: "ANNOUNCEMENT" | "WARNING" | "NEW_REWARD";
  created_at: string;
};

function normalizeDashboardResponse(input: unknown): UserDashboardResponse {
  const source = (input ?? {}) as Partial<UserDashboardResponse>;
  const hasDashboardFields =
    source.studentId !== undefined &&
    source.studentNicknameE !== undefined &&
    source.bottlesThrown !== undefined &&
    source.weightGram !== undefined &&
    source.tokensBalance !== undefined &&
    source.currentRank !== undefined;

  if (!hasDashboardFields) {
    throw new Error("Invalid dashboard response");
  }

  return {
    studentId: Number(source.studentId ?? 0),
    studentNicknameE: String(source.studentNicknameE ?? ""),
    bottlesThrown: Number(source.bottlesThrown ?? 0),
    weightGram: Number(source.weightGram ?? 0),
    tokensBalance: Number(source.tokensBalance ?? 0),
    currentRank: Number(source.currentRank ?? 0),
  };
}

function formatAnnouncementTime(value: string) {
  const createdAt = new Date(value).getTime();

  if (!Number.isFinite(createdAt)) {
    return "";
  }

  const diffMinutes = Math.max(Math.floor((Date.now() - createdAt) / 60000), 0);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function mapAnnouncement(input: UserAnnouncementResponse): UserAnnouncement {
  return {
    id: String(input.Announcement_ID),
    title: input.Announcement_Title,
    message: input.Announcement_Message,
    time: formatAnnouncementTime(input.created_at),
    type: input.Announcement_HeaderType,
  };
}

export default function UserDashboardPage() {
  const [data, setData] = useState<UserDashboardResponse | null>(null);
  const [announcements, setAnnouncements] = useState<UserAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([apiFetch("/user/Dashboard"), apiFetch("/user/Announcement")])
      .then(([dashboardRes, announcementRes]: [unknown, UserAnnouncementResponse[]]) => {
        setData(normalizeDashboardResponse(dashboardRes));
        setAnnouncements((announcementRes ?? []).map(mapAnnouncement));
      })
      .catch((err) => {
        logDevError("user-dashboard", err);
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
              <h1 className={styles.title}>
                Welcome back{data.studentNicknameE ? `, ${data.studentNicknameE}` : ""}!
              </h1>
              <p className={styles.sub}>
                Here is your activity overview for Student ID {data.studentId}
              </p>
            </div>

            <StatBlocks data={data} />
            <AnnouncementList data={announcements} />
          </>
        ) : null}
      </DataState>
    </div>
  );
}
