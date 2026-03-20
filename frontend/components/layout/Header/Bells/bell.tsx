// components/layout/Bell.tsx
// ─────────────────────────────────────────────────────────
// Bell notification button + dropdown panel
// คลิก bell → dropdown โผล่
// คลิก bell อีกครั้ง หรือ คลิกนอก → ปิด
// ใช้ createPortal เหมือน Logout เพื่อให้ dropdown ไม่ติด header
// "use client" เพราะมี state + event + document
// ─────────────────────────────────────────────────────────
"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./bell.module.css";

// ── Type ──────────────────────────────────────────────────
type Notification = {
  id: string;
  title: string;       // หัวข้อ
  message: string;     // รายละเอียด
  time: string;        // เวลา
  read: boolean;       // อ่านแล้วหรือยัง
};

// ── Mockup notifications ──────────────────────────────────
// ตอน connect Supabase แก้ตรงนี้เลย
const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "1", title: "Bottle collected",    message: "Device A-01 collected 3 bottles", time: "2m ago",  read: false },
  { id: "2", title: "Token redeemed",      message: "User 64010001 redeemed 10 tokens", time: "5m ago",  read: false },
  { id: "3", title: "Low storage warning", message: "Device A-02 is almost full",       time: "12m ago", read: false },
  { id: "4", title: "Device offline",      message: "Device C-01 is not responding",    time: "1h ago",  read: true  },
  { id: "5", title: "New registration",    message: "Student 65010011 just registered", time: "2h ago",  read: true  },
];

export default function Bell() {
  const [open, setOpen]                     = useState(false);
  const [notifications, setNotifications]   = useState(MOCK_NOTIFICATIONS);
  const [dropdownPos, setDropdownPos]       = useState({ top: 0, right: 0 });
  const btnRef                              = useRef<HTMLButtonElement>(null);

  // จำนวน unread
  const unreadCount = notifications.filter((n) => !n.read).length;

  // ── คำนวณตำแหน่ง dropdown ตาม bell button ─────────────
  // ทำให้ dropdown อยู่ใต้ bell พอดีทุก screen size
  function handleOpen() {
    if (open) {
      setOpen(false);
      return;
    }
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropdownPos({
        top:   rect.bottom + 8,                        // ใต้ button + gap
        right: window.innerWidth - rect.right,         // ชิดขวาตาม button
      });
    }
    setOpen(true);
  }

  // ── ปิดเมื่อคลิกนอก dropdown ─────────────────────────
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      // ถ้าคลิกที่ button → handleOpen จัดการเอง
      if (btnRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    // delay นิดนึงป้องกัน close ทันทีตอน open
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handler);
    }, 50);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handler);
    };
  }, [open]);

  // ── Mark all as read ──────────────────────────────────
  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  // ── Mark single as read ───────────────────────────────
  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  return (
    <>
      {/* ── Bell button ───────────────────────────────── */}
      <button
        ref={btnRef}
        className={styles.iconBtn}
        aria-label="Notifications"
        onClick={handleOpen}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {/* Unread badge — แสดงเฉพาะมี unread */}
        {unreadCount > 0 && (
          <span className={styles.badge}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* ── Dropdown — render ตรง body ผ่าน portal ────── */}
      {open && createPortal(
        <>
          {/* Backdrop transparent — คลิกนอกเพื่อปิด */}
          <div
            className={styles.backdrop}
            onClick={() => setOpen(false)}
          />

          {/* Dropdown panel */}
          <div
            className={styles.dropdown}
            style={{
              top:   dropdownPos.top,
              right: dropdownPos.right,
            }}
          >
            {/* Header */}
            <div className={styles.dropHeader}>
              <p className={styles.dropTitle}>Notifications</p>
              {unreadCount > 0 && (
                <button
                  className={styles.markAllBtn}
                  onClick={markAllRead}
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification list */}
            <div className={styles.list}>
              {notifications.length === 0 ? (
                <p className={styles.empty}>No notifications</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`${styles.item} ${!n.read ? styles.unread : ""}`}
                    onClick={() => markRead(n.id)}
                  >
                    {/* Unread dot */}
                    <div className={styles.dotWrap}>
                      <span className={`${styles.dot} ${!n.read ? styles.dotActive : ""}`} />
                    </div>

                    {/* Content */}
                    <div className={styles.itemContent}>
                      <p className={styles.itemTitle}>{n.title}</p>
                      <p className={styles.itemMsg}>{n.message}</p>
                      <p className={styles.itemTime}>{n.time}</p>
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