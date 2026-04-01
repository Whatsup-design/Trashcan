"use client";

import { useEffect, useState } from "react";
import type { Coupon, CouponFormData } from "../../../../lib/mockData/admin/Coupon";
import { useCouponSearch } from "./useCouponSearch";
import CouponCard from "./CouponCard";
import CouponAddPanel from "./CouponAddPanel";
import CouponEditOverlay from "./CouponEditOverlay";
import styles from "./CouponList.module.css";

type Props = {
  coupons: Coupon[];
  onAdd: (data: CouponFormData) => void;
  onEdit: (id: number, data: CouponFormData) => void;
  onDelete: (id: number) => void;
};

export default function CouponList({ coupons, onAdd, onEdit, onDelete }: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);

  const { query, setQuery, filtered, loading } = useCouponSearch(coupons);

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <p className={styles.title}>Coupon Management</p>
        <div className={styles.headerRight}>
          <div className={styles.searchWrap}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={styles.searchIcon}>
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search coupons..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {loading && <span className={styles.loadingDot} />}
          </div>
          <button className={styles.addBtn} onClick={() => setShowAdd(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Coupon
          </button>
        </div>
      </div>

      <p className={styles.count}>
        {filtered.length} coupon{filtered.length !== 1 ? "s" : ""}
        {query && ` for "${query}"`}
      </p>

      {filtered.length === 0 ? (
        <div className={styles.empty}><p>No coupons found</p></div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((coupon) => (
            <CouponCard
              key={coupon.Product_ID}
              coupon={coupon}
              onDelete={onDelete}
              onEdit={(currentCoupon) => setEditCoupon(currentCoupon)}
            />
          ))}
        </div>
      )}

      {showAdd && (
        <CouponAddPanel
          onSubmit={(data) => {
            onAdd(data);
            setTimeout(() => {
              setShowAdd(false);
            }, 1000);
          }}
          onClose={() => setShowAdd(false)}
        />
      )}

      {editCoupon && (
        <CouponEditOverlay
          coupon={editCoupon}
          onSubmit={(id, data) => {
            onEdit(id, data);
            setTimeout(() => {
              setEditCoupon(null);
            }, 1100);
          }}
          onClose={() => setEditCoupon(null)}
        />
      )}
    </div>
  );
}
