"use client";

import { createPortal } from "react-dom";
import CouponForm from "./CouponForm";
import type { Coupon, CouponFormData } from "../../../../lib/mockData/admin/Coupon";
import styles from "./CouponEditOverlay.module.css";

type Props = {
  coupon: Coupon;
  onSubmit: (id: number, data: CouponFormData) => void;
  onClose: () => void;
};

export default function CouponEditOverlay({ coupon, onSubmit, onClose }: Props) {
  return createPortal(
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <p className={styles.title}>Edit Coupon</p>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className={styles.body}>
          <CouponForm
            initialData={coupon}
            onSubmit={(data) => onSubmit(coupon.Product_ID, data)}
            onCancel={onClose}
          />
        </div>
      </div>
    </>,
    document.body
  );
}
