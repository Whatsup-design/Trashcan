"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import type { Coupon } from "../../../../lib/mockData/admin/Coupon";
import styles from "./DeleteConfirm.module.css";

type Props = {
  coupon: Coupon;
  onConfirm: (id: number) => Promise<void> | void;
  onCancel: () => void;
};

export default function DeleteConfirm({ coupon, onConfirm, onCancel }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  function handleConfirm() {
    setIsDeleting(true);
    onConfirm(coupon.Product_ID);
    setTimeout(() => {
      setIsDeleting(false);
    }, 1500);
  }

  return createPortal(
    <>
      <div className={styles.backdrop} onClick={isDeleting ? undefined : onCancel} />

      <div className={styles.dialog}>
        <div className={styles.icon}>Delete</div>
        <p className={styles.title}>Delete coupon?</p>
        <p className={styles.sub}>
          <strong>"{coupon.Product_name}"</strong> will be permanently removed.
        </p>
        <div className={styles.btns}>
          <button className={styles.cancelBtn} onClick={onCancel} disabled={isDeleting}>Cancel</button>
          <button className={styles.confirmBtn} onClick={handleConfirm} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
