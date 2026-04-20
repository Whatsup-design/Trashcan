"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/useAuthStore";
import styles from "./Logout.module.css";

export default function Logout() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleConfirm() {
    if (isSubmitting) return;

    setIsSubmitting(true);
    logout();
    setOpen(false);
    router.replace("/login");
    router.refresh();
  }

  return (
    <>
      <button
        className={styles.iconBtn}
        aria-label="Logout"
        onClick={() => setOpen(true)}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>

      {open &&
        createPortal(
          <>
            <div className={styles.backdrop} onClick={() => setOpen(false)} />
            <div className={styles.dialog}>
              <div className={styles.dialogIcon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
              <p className={styles.dialogTitle}>Sign out?</p>
              <p className={styles.dialogSub}>
                Are you sure you want to sign out?
              </p>
              <div className={styles.dialogBtns}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  className={styles.confirmBtn}
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing out..." : "Sign out"}
                </button>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
