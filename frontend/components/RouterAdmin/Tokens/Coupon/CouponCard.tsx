// components/tokens/coupon/CouponCard.tsx
"use client";

import { useState } from "react";
import type { Coupon } from "../../../../lib/mockData/admin/Coupon";
import DeleteConfirm from "./DeleteConfirm";
import styles from "./CouponCard.module.css";

type Props = {
  coupon: Coupon;
  onDelete: (id: string) => void;
  onEdit: (coupon: Coupon) => void;
};

export default function CouponCard({ coupon, onDelete, onEdit }: Props) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <div className={styles.card}>

        {/* Picture */}
        <div className={styles.imgWrap}>
          {coupon.picture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coupon.picture} alt={coupon.name} className={styles.img} />
          ) : (
            <div className={styles.imgPlaceholder}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
          )}
          <span className={`${styles.statusBadge} ${coupon.status === "permanent" ? styles.permanent : styles.temporary}`}>
            {coupon.status === "permanent" ? "Permanent" : "Temporary"}
          </span>
        </div>

        {/* Info */}
        <div className={styles.info}>
          <p className={styles.name}>{coupon.name}</p>
          <p className={styles.desc}>{coupon.description}</p>
          {coupon.status === "temporary" && coupon.dateFrom && coupon.dateTo && (
            <p className={styles.dateRange}>📅 {coupon.dateFrom} → {coupon.dateTo}</p>
          )}
          <div className={styles.bottomRow}>
            <span className={styles.claim}>{coupon.claimPerMonth}x / month</span>
            <span className={styles.price}>{coupon.price} tokens</span>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={() => onEdit(coupon)} aria-label="Edit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => setShowDelete(true)} aria-label="Delete">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>

      </div>

      {/* Delete confirm */}
      {showDelete && (
        <DeleteConfirm
          coupon={coupon}
          onConfirm={(id) => { onDelete(id); setShowDelete(false); }}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </>
  );
}