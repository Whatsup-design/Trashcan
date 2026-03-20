"use client";

import { useState } from "react";
import { createPortal } from "react-dom";  // ← เพิ่ม
import { useRouter } from "next/navigation";
import { clearSession } from "@/lib/auth";
import styles from "./Logout.module.css";

export default function Logout() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function handleConfirm() {
    clearSession();
    router.push("/login");
  }

  return (
    <>
      {/* ── Logout button ─────────────────────────── */}
      <button
        className={styles.iconBtn}
        aria-label="Logout"
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>

      {/* ── Portal — render ตรง document.body แทน ── */}
      {/* ทำให้ backdrop อยู่นอก Header's stacking context */}
      {open && createPortal(
        <>
          <div
            className={styles.backdrop}
            onClick={() => setOpen(false)}
          />
          <div className={styles.dialog}>
            <div className={styles.dialogIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>
            <p className={styles.dialogTitle}>Sign out?</p>
            <p className={styles.dialogSub}>Are you sure you want to sign out?</p>
            <div className={styles.dialogBtns}>
              <button className={styles.cancelBtn} onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button className={styles.confirmBtn} onClick={handleConfirm}>
                Sign out
              </button>
            </div>
          </div>
        </>,
        document.body  // ← render ตรง body เลย ไม่ติด Header
      )}
    </>
  );
}