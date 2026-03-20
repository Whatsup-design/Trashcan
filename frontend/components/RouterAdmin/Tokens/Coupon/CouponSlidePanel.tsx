// components/tokens/coupon/CouponAddPanel.tsx
// ─────────────────────────────────────────────────────────
// Slide-in panel จากขวา สำหรับ Add coupon
// ใช้ createPortal
// ─────────────────────────────────────────────────────────
"use client";

import { createPortal } from "react-dom";
import CouponForm from "./CouponForm";
import type { CouponFormData } from "./type"; // ← fix: import จาก types
import styles from "./CouponSlidePanel.module.css";

type Props = {
  onSubmit: (data: CouponFormData) => void;
  onClose: () => void;
};

export default function CouponAddPanel({ onSubmit, onClose }: Props) {
  return createPortal(
    <>
      <div className={styles.backdrop} onClick={onClose} />

      <div className={styles.panel}>
        <div className={styles.header}>
          <p className={styles.title}>Add Coupon</p>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          {/* ← fix: onSubmit ตรงกับ CouponForm prop */}
          <CouponForm
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </>,
    document.body
  );
}