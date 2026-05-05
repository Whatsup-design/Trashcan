"use client";

import { useEffect, useState } from "react";
import { apiFetch, apiPost } from "@/lib/api";
import { logDevError } from "@/lib/devLog";
import styles from "./SystemNotificationPanel.module.css";

type SystemNotificationRow = {
  Notification_ID: number;
  Notification_Title: string;
  Notification_Message: string;
  created_at: string;
};

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

export default function SystemNotificationPanel() {
  const [notifications, setNotifications] = useState<SystemNotificationRow[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function loadSystemNotifications() {
    setLoading(true);
    apiFetch("/admin/Notification/System")
      .then((rows: SystemNotificationRow[]) => {
        setNotifications(rows);
      })
      .catch((err) => {
        logDevError("admin-system-notifications", err);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadSystemNotifications();
  }, []);

  function closeModal() {
    if (submitting) return;
    setModalOpen(false);
    setTitle("");
    setMessage("");
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
      const created = await apiPost("/admin/Notification/System", {
        title: nextTitle,
        message: nextMessage,
      });

      setNotifications((current) => [created as SystemNotificationRow, ...current].slice(0, 10));
      window.dispatchEvent(new Event("notifications:refresh"));
      closeModal();
    } catch (err) {
      logDevError("admin-system-notification-create", err);
      setError("Failed to create system notification.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className={styles.card}>
        <div className={styles.header}>
          <div>
            <p className={styles.title}>System Notification</p>
            <p className={styles.subtitle}>Broadcast notification for all users</p>
          </div>
          <button type="button" className={styles.addButton} onClick={() => setModalOpen(true)}>
            + Add
          </button>
        </div>

        <div className={styles.list}>
          {loading ? (
            <p className={styles.empty}>Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <p className={styles.empty}>No system notifications</p>
          ) : (
            notifications.map((notification) => (
              <article key={notification.Notification_ID} className={styles.item}>
                <div className={styles.itemTop}>
                  <h3>{notification.Notification_Title}</h3>
                  <span>{formatRelativeTime(notification.created_at)}</span>
                </div>
                <p>{notification.Notification_Message}</p>
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
                <h2>System Notification</h2>
              </div>
              <button type="button" className={styles.closeButton} onClick={closeModal}>
                x
              </button>
            </div>

            <label className={styles.field}>
              <span>Title</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter notification title"
              />
            </label>

            <label className={styles.field}>
              <span>Message</span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write message for all users"
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
