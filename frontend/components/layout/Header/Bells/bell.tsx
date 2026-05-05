"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { apiFetch } from "@/lib/api";
import { logDevError } from "@/lib/devLog";
import type { UserNotificationResponse } from "@/lib/types/user/Notification";
import styles from "./bell.module.css";

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

function formatNotificationTime(value: string) {
  const createdAt = new Date(value).getTime();

  if (!Number.isFinite(createdAt)) {
    return "";
  }

  const diffMs = Date.now() - createdAt;
  const diffMinutes = Math.max(Math.floor(diffMs / 60000), 0);

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

function mapNotification(row: UserNotificationResponse): Notification {
  return {
    id: String(row.Notification_ID),
    title: row.Notification_Title,
    message: row.Notification_Message,
    time: formatNotificationTime(row.created_at),
    read: row.Notification_IsRead,
  };
}

export default function Bell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  function loadNotifications() {
    setLoading(true);
    setError("");

    apiFetch("/user/Notifications")
      .then((rows: UserNotificationResponse[]) => {
        const nextNotifications = rows.map(mapNotification);
        setNotifications(nextNotifications);
        setUnreadCount(nextNotifications.filter((notification) => !notification.read).length);
      })
      .catch((err) => {
        logDevError("user-notifications", err);
        setError("Failed to load notifications");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadNotifications();
    window.addEventListener("notifications:refresh", loadNotifications);

    return () => {
      window.removeEventListener("notifications:refresh", loadNotifications);
    };
  }, []);

  function handleOpen() {
    if (open) {
      setOpen(false);
      return;
    }

    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }

    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;

    const handler = (event: MouseEvent) => {
      if (btnRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };

    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handler);
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handler);
    };
  }, [open]);

  function markAllRead() {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
    setUnreadCount(0);
  }

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    setUnreadCount((current) => Math.max(current - 1, 0));
  }

  return (
    <>
      <button
        ref={btnRef}
        className={styles.iconBtn}
        aria-label="Notifications"
        onClick={handleOpen}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {unreadCount > 0 ? (
          <span className={styles.badge}>{unreadCount > 9 ? "9+" : unreadCount}</span>
        ) : null}
      </button>

      {open && createPortal(
        <>
          <div className={styles.backdrop} onClick={() => setOpen(false)} />

          <div
            className={styles.dropdown}
            style={{
              top: dropdownPos.top,
              right: dropdownPos.right,
            }}
          >
            <div className={styles.dropHeader}>
              <p className={styles.dropTitle}>Notifications</p>
              {unreadCount > 0 ? (
                <button className={styles.markAllBtn} onClick={markAllRead}>
                  Mark all read
                </button>
              ) : null}
            </div>

            <div className={styles.list}>
              {loading ? (
                <div className={styles.loadingState}>
                  <span className={styles.spinner} aria-hidden="true" />
                  <p>Loading notifications...</p>
                </div>
              ) : error ? (
                <p className={styles.empty}>{error}</p>
              ) : notifications.length === 0 ? (
                <p className={styles.empty}>No notifications</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`${styles.item} ${!notification.read ? styles.unread : ""}`}
                    onClick={() => markRead(notification.id)}
                  >
                    <div className={styles.dotWrap}>
                      <span
                        className={`${styles.dot} ${
                          !notification.read ? styles.dotActive : ""
                        }`}
                      />
                    </div>

                    <div className={styles.itemContent}>
                      <p className={styles.itemTitle}>{notification.title}</p>
                      <p className={styles.itemMsg}>{notification.message}</p>
                      <p className={styles.itemTime}>{notification.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
