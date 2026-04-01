"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import CouponForm from "./CouponForm";
import type { CouponFormData } from "../../../../lib/mockData/admin/Coupon";
import styles from "./CouponSlidePanel.module.css";

type Props = {
  onSubmit: (data: CouponFormData) => Promise<void> | void;
  onClose: () => void;
};

export default function CouponAddPanel({ onSubmit, onClose }: Props) {
  const [mounted,  setMounted]  = useState(false);
  const [animateIn, setAnimateIn] = useState(false); // ← ควบคุม animation

  // ── Step 1: mount component ────────────────────────────
  useEffect(() => { setMounted(true); }, []);

  // ── Step 2: หลัง mount → trigger slide animation ──────
  // delay 10ms ให้ browser render frame แรกก่อน
  // แล้วค่อยใส่ panelOpen → CSS transition จะ animate
  useEffect(() => {
    if (!mounted) return;
    const timer = setTimeout(() => setAnimateIn(true), 10);
    return () => clearTimeout(timer);
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop — fade in พร้อม panel */}
      <div
        className={`${styles.backdrop} ${animateIn ? styles.backdropOpen : ""}`}
        onClick={onClose}
      />

      {/* Panel — slide in จากขวา */}
      <div className={`${styles.panel} ${animateIn ? styles.panelOpen : ""}`}>
        <div className={styles.panelHeader}>
          <p className={styles.panelTitle}>Add Coupon</p>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
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
