"use client";

import { createPortal } from "react-dom";
import type { Coupon } from "../../../../lib/mockData/admin/Coupon";
import styles from "./DeleteConfirm.module.css";

type Props = {
  coupon: Coupon;
  onConfirm: (id: number) => void;
  onCancel: () => void;
};

export default function DeleteConfirm({ coupon, onConfirm, onCancel }: Props) {
  return createPortal(
    <>
      <div className={styles.backdrop} onClick={onCancel} />

      <div className={styles.dialog}>
        <div className={styles.icon}>Delete</div>
        <p className={styles.title}>Delete coupon?</p>
        <p className={styles.sub}>
          <strong>"{coupon.Product_name}"</strong> will be permanently removed.
        </p>
        <div className={styles.btns}>
          <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
          <button className={styles.confirmBtn} onClick={() => onConfirm(coupon.Product_ID)}>Delete</button>
        </div>
      </div>
    </>,
    document.body
  );
}
