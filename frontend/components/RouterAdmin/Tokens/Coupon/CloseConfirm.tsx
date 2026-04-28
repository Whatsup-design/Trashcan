"use client";

import { createPortal } from "react-dom";
import styles from "./CloseConfirm.module.css";

type Props = {
  formId: string;
  onDiscard: () => void;
  onClose: () => void;
};

export default function CloseConfirm({ formId, onDiscard, onClose }: Props) {
  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <>
      <div className={styles.backdrop} onClick={onClose} />

      <div className={styles.dialog}>
        <div className={styles.header}>
          <p className={styles.title}>Do you want to close?</p>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className={styles.sub}>
          You have changes in this panel. Save them before leaving, or discard them.
        </p>

        <div className={styles.btns}>
          <button className={styles.discardBtn} onClick={onDiscard}>
            Discard
          </button>
          <button className={styles.saveBtn} type="submit" form={formId} onClick={onClose}>
            Save
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
