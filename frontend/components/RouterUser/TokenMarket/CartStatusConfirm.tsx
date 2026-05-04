"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import type { UserCartItem } from "./CartItem";
import styles from "./CartStatusConfirm.module.css";

type CartStatusAction = "USED" | "CANCELLED";

type Props = {
  item: UserCartItem;
  action: CartStatusAction;
  onConfirm: (id: string, status: CartStatusAction) => Promise<void>;
  onClose: () => void;
};

const actionCopy: Record<
  CartStatusAction,
  { title: string; message: string; confirmLabel: string; tone: "use" | "cancel" }
> = {
  USED: {
    title: "Use this reward?",
    message: "This will mark the reward as used. You should only confirm after receiving it.",
    confirmLabel: "Mark as Used",
    tone: "use",
  },
  CANCELLED: {
    title: "Cancel this reward?",
    message: "This will mark the reward as cancelled. You can keep the record, but it will no longer be pending.",
    confirmLabel: "Cancel Reward",
    tone: "cancel",
  },
};

export default function CartStatusConfirm({
  item,
  action,
  onConfirm,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const copy = actionCopy[action];

  async function handleConfirm() {
    setError("");
    setLoading(true);

    try {
      await onConfirm(item.id, action);
      onClose();
    } catch {
      setError("Could not update this reward. Please try again.");
      setLoading(false);
    }
  }

  return createPortal(
    <>
      <div className={styles.backdrop} onClick={loading ? undefined : onClose} />
      <div className={styles.dialog} role="dialog" aria-modal="true">
        <p className={`${styles.pill} ${styles[copy.tone]}`}>
          {action === "USED" ? "Confirmation" : "Warning"}
        </p>
        <h2 className={styles.title}>{copy.title}</h2>
        <p className={styles.rewardName}>{item.name}</p>
        <p className={styles.message}>{copy.message}</p>

        {error ? <p className={styles.error}>{error}</p> : null}

        <div className={styles.actions}>
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={onClose}
            disabled={loading}
          >
            Back
          </button>
          <button
            className={`${styles.primaryButton} ${styles[copy.tone]}`}
            type="button"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Saving..." : copy.confirmLabel}
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
