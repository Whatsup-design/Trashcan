// components/tokens/coupon/CouponList.tsx
"use client";

import { useState } from "react";
import type { Coupon, CouponFormData } from "../../../../lib/mockData/admin/Coupon";
import { useCouponSearch } from "./useCouponSearch";
import CouponCard        from "./CouponCard";
import CouponAddPanel    from "./CouponAddPanel";
import CouponEditOverlay from "./CouponEditOverlay";
import styles from "./CouponList.module.css";
import { INITIAL_COUPONS } from "@/lib/mockData/admin/Coupon";


export default function CouponList() {
  const [coupons,    setCoupons]    = useState<Coupon[]>(INITIAL_COUPONS);
  const [showAdd,    setShowAdd]    = useState(false);
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);

  const { query, setQuery, filtered, loading } = useCouponSearch(coupons);

  function handleAdd(data: CouponFormData) {
    setCoupons((prev) => [{ ...data, id: Date.now().toString() }, ...prev]);
    setShowAdd(false);
    
    
  }

  function handleEdit(id: string, data: CouponFormData) {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    setEditCoupon(null);
  }

  function handleDelete(id: string) {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className={styles.wrap}>

      {/* Header */}
      <div className={styles.header}>
        <p className={styles.title}>Coupon Management</p>
        <div className={styles.headerRight}>
          <div className={styles.searchWrap}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={styles.searchIcon}>
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
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
          <button className={styles.addBtn} onClick={() => {setShowAdd(true); console.log(showAdd); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Coupon
          </button>
        </div>
      </div>

      {/* Count */}
      <p className={styles.count}>
        {filtered.length} coupon{filtered.length !== 1 ? "s" : ""}
        {query && ` for "${query}"`}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className={styles.empty}><p>No coupons found</p></div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((coupon) => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              onDelete={handleDelete}
              onEdit={(c) => setEditCoupon(c)}
            />
          ))}
        </div>
      )}

      {/* Add panel */}
      {showAdd && (
        <CouponAddPanel
          onSubmit={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      )}

      {/* Edit overlay */}
      {editCoupon && (
        <CouponEditOverlay
          coupon={editCoupon}
          onSubmit={handleEdit}
          onClose={() => setEditCoupon(null)}
        />
      )}

            
   

    </div>
  );
}