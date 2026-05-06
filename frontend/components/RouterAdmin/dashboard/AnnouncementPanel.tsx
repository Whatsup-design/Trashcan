"use client";

import { useEffect, useState } from "react";
import { apiFetch, apiPost } from "@/lib/api";
import { logDevError } from "@/lib/devLog";
import styles from "./SystemNotificationPanel.module.css";

type AnnouncementRow = {
  Announcement_ID: number;
  Announcement_Title: string;
  Announcement_Message: string;
  Announcement_HeaderType: AnnouncementHeaderType;
  created_at: string;
};

type AnnouncementHeaderType = "WARNING" | "ANNOUNCEMENT" | "NEW_REWARD";

const HEADER_TYPE_OPTIONS: Array<{
  value: AnnouncementHeaderType;
  label: string;
  emoji: string;
}> = [
  { value: "ANNOUNCEMENT", label: "Announcement", emoji: "📢" },
  { value: "WARNING", label: "Warning", emoji: "⚠️" },
  { value: "NEW_REWARD", label: "New Reward", emoji: "🎁" },
];

function getHeaderMeta(headerType: AnnouncementHeaderType) {
  return (
    HEADER_TYPE_OPTIONS.find((option) => option.value === headerType) ??
    HEADER_TYPE_OPTIONS[0]
  );
}

function formatRelativeTime(value: string) {
  const createdAt = new Date(value).getTime();

  if (!Number.isFinite(createdAt)) {
    return "";
  }

  const diffMinutes = Math.max(Math.floor((Date.now() - createdAt) / 60000), 0);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return `${Math.floor(diffHours / 24)}d ago`;
}

export default function AnnouncementPanel() {
  const [announcements, setAnnouncements] = useState<AnnouncementRow[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [headerType, setHeaderType] = useState<AnnouncementHeaderType>("ANNOUNCEMENT");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function loadAnnouncements() {
    setLoading(true);
    apiFetch("/admin/Announcement")
      .then((rows: AnnouncementRow[]) => {
        setAnnouncements(rows);
      })
      .catch((err) => {
        logDevError("admin-announcements", err);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadAnnouncements();
  }, []);

  function closeModal() {
    if (submitting) return;
    setModalOpen(false);
    setTitle("");
    setMessage("");
    setHeaderType("ANNOUNCEMENT");
    setError("");
  }

  async function handleConfirm() {
    const nextTitle = title.trim();
    const nextMessage = message.trim();

    if (!nextTitle || !nextMessage) {
      setError("Title and message are required.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const created = await apiPost("/admin/Announcement", {
        title: nextTitle,
        message: nextMessage,
        headerType,
      });

      setAnnouncements((current) => [created as AnnouncementRow, ...current].slice(0, 10));
      closeModal();
    } catch (err) {
      logDevError("admin-announcement-create", err);
      setError("Failed to create announcement.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className={styles.card}>
        <div className={styles.header}>
          <div>
            <p className={styles.title}>Announcement</p>
            <p className={styles.subtitle}>Internal notes and planning updates</p>
          </div>
          <button type="button" className={styles.addButton} onClick={() => setModalOpen(true)}>
            + Add
          </button>
        </div>

        <div className={styles.list}>
          {loading ? (
            <p className={styles.empty}>Loading announcements...</p>
          ) : announcements.length === 0 ? (
            <p className={styles.empty}>No announcements</p>
          ) : (
            announcements.map((announcement) => (
              <article key={announcement.Announcement_ID} className={styles.item}>
                <div className={styles.itemTop}>
                  <h3>
                    <span className={styles.inlineIcon}>
                      {getHeaderMeta(announcement.Announcement_HeaderType).emoji}
                    </span>
                    {announcement.Announcement_Title}
                  </h3>
                  <span>{formatRelativeTime(announcement.created_at)}</span>
                </div>
                <p>{announcement.Announcement_Message}</p>
              </article>
            ))
          )}
        </div>
      </section>

      {modalOpen ? (
        <div className={styles.overlay} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div>
                <p className={styles.eyebrow}>Create</p>
                <h2>Announcement</h2>
              </div>
              <button type="button" className={styles.closeButton} onClick={closeModal}>
                x
              </button>
            </div>

            <label className={styles.field}>
              <span>Header</span>
              <select
                value={headerType}
                onChange={(event) => setHeaderType(event.target.value as AnnouncementHeaderType)}
              >
                {HEADER_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.emoji} {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>Title</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter announcement title"
              />
            </label>

            <label className={styles.field}>
              <span>Message</span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write announcement details"
                rows={5}
              />
            </label>

            {error ? <p className={styles.errorText}>{error}</p> : null}

            <div className={styles.actions}>
              <button type="button" className={styles.cancelButton} onClick={closeModal}>
                Cancel
              </button>
              <button
                type="button"
                className={styles.confirmButton}
                onClick={handleConfirm}
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
