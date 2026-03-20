// components/tokens/coupon/DeleteConfirm.tsx
// ─────────────────────────────────────────────────────────
// Confirm dialog ก่อนลบ — ใช้ createPortal เหมือน Logout
// ─────────────────────────────────────────────────────────
"use client";

import { createPortal } from "react-dom";
import type { Coupon } from "./type";
import styles from "./DeleteConfirm.module.css";

type Props = {
  coupon: Coupon;
  onConfirm: (id: string) => void;
  onCancel:  () => void;
};

export default function DeleteConfirm({ coupon, onConfirm, onCancel }: Props) {
  return createPortal(
    <>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={onCancel} />

      {/* Dialog */}
      <div className={styles.dialog}>
        <div className={styles.icon}>🗑️</div>
        <p className={styles.title}>Delete coupon?</p>
        <p className={styles.sub}>
          <strong>"{coupon.name}"</strong> will be permanently removed.
        </p>
        <div className={styles.btns}>
          <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
          <button className={styles.confirmBtn} onClick={() => onConfirm(coupon.id)}>Delete</button>
        </div>
      </div>
    </>,
    document.body
  );
}