// components/tokens/coupon/useCouponSearch.ts
// ─────────────────────────────────────────────────────────
// Custom hook จัดการ search coupon ด้วย useEffect
// debounce 300ms ป้องกัน filter ทุก keystroke
// ─────────────────────────────────────────────────────────
"use client";

import { useState, useEffect } from "react";
import type { Coupon } from "../../../../lib/mockData/admin/Coupon";

export function useCouponSearch(coupons: Coupon[]) {
  const [query,    setQuery]    = useState("");           // ค่าใน input
  const [filtered, setFiltered] = useState(coupons);     // ผลลัพธ์หลัง filter
  const [loading,  setLoading]  = useState(false);       // debounce loading state

  // ── useEffect + debounce 300ms ─────────────────────────
  // ทุกครั้งที่ query หรือ coupons เปลี่ยน → รอ 300ms แล้วค่อย filter
  // ป้องกัน re-render ทุก keystroke
  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      const q = query.trim().toLowerCase();

      if (!q) {
        // ไม่มี query → แสดงทั้งหมด
        setFiltered(coupons);
      } else {
        setFiltered(
          coupons.filter(
            (c) =>
              c.name.toLowerCase().includes(q) ||
              c.description.toLowerCase().includes(q) ||
              c.status.toLowerCase().includes(q)
          )
        );
      }

      setLoading(false);
    }, 300); // debounce 300ms

    // cleanup — cancel timer ถ้า query เปลี่ยนก่อน 300ms
    return () => clearTimeout(timer);
  }, [query, coupons]);

  return { query, setQuery, filtered, loading };
}