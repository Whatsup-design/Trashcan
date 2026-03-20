// components/tokens/coupon/CouponList.tsx
// ─────────────────────────────────────────────────────────
// รวมทุกอย่าง — searchbar + flex grid cards + add/edit/delete
// เป็น "orchestrator" ที่จัดการ state ทั้งหมดของ coupon
// ─────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import type { Coupon, CouponFormData } from "./type";
import { useCouponSearch } from "./useCouponSearch";
import CouponCard       from "./CouponCard";
import CouponAddPanel   from "./CouponSlidePanel";
import CouponEditOverlay from "./CouponEditOverlay";
import styles from "./CouponList.module.css";

// ── Mockup initial data ───────────────────────────────────
const INITIAL_COUPONS: Coupon[] = [
  {
    id: "1",
    picture: "",
    name: "Free Coffee",
    description: "Redeem for 1 free coffee at the school canteen",
    status: "permanent",
    claimPerMonth: 2,
    price: 20,
  },
  {
    id: "2",
    picture: "",
    name: "Sports Day Pass",
    description: "Free entry to the annual sports day event",
    status: "temporary",
    dateFrom: "2025-03-01",
    dateTo: "2025-03-31",
    claimPerMonth: 1,
    price: 50,
  },
  {
    id: "3",
    picture: "",
    name: "Stationery Set",
    description: "1 set of school stationery (pen, pencil, ruler)",
    status: "permanent",
    claimPerMonth: 1,
    price: 30,
  },
];

export default function CouponList() {
  const [coupons,     setCoupons]     = useState<Coupon[]>(INITIAL_COUPONS);
  const [showAdd,     setShowAdd]     = useState(false);
  const [editCoupon,  setEditCoupon]  = useState<Coupon | null>(null);

  // ── Search hook ────────────────────────────────────────
  const { query, setQuery, filtered, loading } = useCouponSearch(coupons);

  // ── Add coupon ─────────────────────────────────────────
  function handleAdd(data: CouponFormData) {
    const newCoupon: Coupon = {
      ...data,
      id: Date.now().toString(), // generate id ชั่วคราว (ตอน connect DB ใช้ UUID)
    };
    setCoupons((prev) => [newCoupon, ...prev]); // เพิ่มไว้หัว list
    setShowAdd(false);
  }

  // ── Edit coupon ────────────────────────────────────────
  function handleEdit(id: string, data: CouponFormData) {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
    setEditCoupon(null);
  }

  // ── Delete coupon ──────────────────────────────────────
  function handleDelete(id: string) {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className={styles.wrap}>

      {/* ── Header: title + searchbar + add button ─────── */}
      <div className={styles.header}>
        <p className={styles.title}>Coupon Management</p>

        <div className={styles.headerRight}>
          {/* Search input — reuse style จาก SearchBar */}
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
            {/* แสดง loading dot ตอน debounce */}
            {loading && <span className={styles.loadingDot} />}
          </div>

          {/* Add button */}
          <button className={styles.addBtn} onClick={() => setShowAdd(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Coupon
          </button>
        </div>
      </div>

      {/* ── Result count ───────────────────────────────── */}
      <p className={styles.count}>
        {filtered.length} coupon{filtered.length !== 1 ? "s" : ""}
        {query && ` for "${query}"`}
      </p>

      {/* ── Flex grid ──────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p>No coupons found</p>
        </div>
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

      {/* ── Add panel (slide-in) ────────────────────────── */}
      {showAdd && (
        <CouponAddPanel
          onSubmit={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      )}

      {/* ── Edit overlay ────────────────────────────────── */}
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