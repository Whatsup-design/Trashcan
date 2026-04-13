"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import CouponForm from "./CouponForm";
import type { CouponFormData } from "../../../../lib/mockData/admin/Coupon";
import styles from "./CouponSlidePanel.module.css";

type Props = {
  onSubmit: (data: CouponFormData) => Promise<void> | void;
  onClose: () => void;
};

export default function CouponAddPanel({ onSubmit, onClose }: Props) {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 10);
    return () => clearTimeout(timer);
  }, []);

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      <div
        className={`${styles.backdrop} ${animateIn ? styles.backdropOpen : ""}`}
        onClick={onClose}
      />

      <div className={`${styles.panel} ${animateIn ? styles.panelOpen : ""}`}>
        <div className={styles.panelHeader}>
          <p className={styles.panelTitle}>Add Coupon</p>
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
        <div className={styles.panelBody}>
          <CouponForm onSubmit={onSubmit} onCancel={onClose} />
        </div>
      </div>
    </>,
    document.body
  );
}
