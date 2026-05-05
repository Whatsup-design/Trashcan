"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";
import { logDevError } from "@/lib/devLog";
import styles from "./AnnouncementPanel.module.css";

type AnnouncementItem = {
  id: string;
  title: string;
  description: string;
  time: string;
};

type AnnouncementKind = "system" | "normal";

const initialSystemAnnouncements: AnnouncementItem[] = [
  {
    id: "system-1",
    title: "Maintenance window",
    description: "Smart trashcan service will be monitored today.",
    time: "Today",
  },
  {
    id: "system-2",
    title: "Token policy reminder",
    description: "Token rewards are calculated by backend service.",
    time: "Active",
  },
];

const initialNormalAnnouncements: AnnouncementItem[] = [
  {
    id: "normal-1",
    title: "Recycling campaign",
    description: "Encourage students to recycle bottles during lunch break.",
    time: "This week",
  },
  {
    id: "normal-2",
    title: "Market update",
    description: "New rewards can be prepared from the admin market page.",
    time: "Draft",
  },
];

function AnnouncementCard({
  title,
  subtitle,
  items,
  onAdd,
}: {
  title: string;
  subtitle: string;
  items: AnnouncementItem[];
  onAdd: () => void;
}) {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div>
          <p className={styles.title}>{title}</p>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        <button type="button" className={styles.addButton} onClick={onAdd}>
          <span className={styles.addIcon}>+</span>
          Add
        </button>
      </div>

      <div className={styles.list}>
        {items.map((item) => (
          <article key={item.id} className={styles.item}>
            <div className={styles.itemTop}>
              <h3 className={styles.itemTitle}>{item.title}</h3>
              <span className={styles.itemTime}>{item.time}</span>
            </div>
            <p className={styles.itemDescription}>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function AnnouncementPanel() {
  const [systemAnnouncements, setSystemAnnouncements] = useState(initialSystemAnnouncements);
  const [normalAnnouncements, setNormalAnnouncements] = useState(initialNormalAnnouncements);
  const [activeKind, setActiveKind] = useState<AnnouncementKind | null>(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const activeLabel = activeKind === "system" ? "System Announcement" : "Normal Announcement";

  function openPanel(kind: AnnouncementKind) {
    setActiveKind(kind);
    setTitle("");
    setMessage("");
    setError("");
  }

  function closePanel() {
    if (submitting) return;
    setActiveKind(null);
    setTitle("");
    setMessage("");
    setError("");
  }

  async function handleConfirm() {
    const normalizedTitle = title.trim();
    const normalizedMessage = message.trim();

    if (!activeKind) return;

    if (!normalizedTitle || !normalizedMessage) {
      setError("Please enter title and message.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      if (activeKind === "system") {
        await apiPost("/admin/Notification/System", {
          title: normalizedTitle,
          message: normalizedMessage,
        });

        setSystemAnnouncements((current) => [
          {
            id: `system-${Date.now()}`,
            title: normalizedTitle,
            description: normalizedMessage,
            time: "Just now",
          },
          ...current,
        ]);
      } else {
        setNormalAnnouncements((current) => [
          {
            id: `normal-${Date.now()}`,
            title: normalizedTitle,
            description: normalizedMessage,
            time: "Just now",
          },
          ...current,
        ]);
      }

      closePanel();
    } catch (err) {
      logDevError("admin-announcement-create", err);
      setError("Failed to create announcement. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className={styles.grid}>
        <AnnouncementCard
          title="System Announcement"
          subtitle="Broadcast message for all users"
          items={systemAnnouncements}
          onAdd={() => openPanel("system")}
        />
        <AnnouncementCard
          title="Normal Announcement"
          subtitle="General school or campaign updates"
          items={normalAnnouncements}
          onAdd={() => openPanel("normal")}
        />
      </div>

      {activeKind ? (
        <div className={styles.overlay} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div>
                <p className={styles.modalEyebrow}>Create</p>
                <h2 className={styles.modalTitle}>{activeLabel}</h2>
              </div>
              <button
                type="button"
                className={styles.closeButton}
                onClick={closePanel}
                aria-label="Close announcement popup"
              >
                x
              </button>
            </div>

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
                placeholder="Write the message users should see"
                rows={5}
              />
            </label>

            {error ? <p className={styles.errorText}>{error}</p> : null}

            <div className={styles.actions}>
              <button type="button" className={styles.cancelButton} onClick={closePanel}>
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
