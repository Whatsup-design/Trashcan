"use client";

import { useEffect, useState } from "react";
import type { Coupon } from "../../../../lib/mockData/admin/Coupon";

export function useCouponSearch(coupons: Coupon[]) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(coupons);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      const q = query.trim().toLowerCase();

      if (!q) {
        setFiltered(coupons);
      } else {
        setFiltered(
          coupons.filter(
            (coupon) =>
              coupon.Product_name.toLowerCase().includes(q) ||
              coupon.Product_Description.toLowerCase().includes(q) ||
              coupon.Product_Status.toLowerCase().includes(q)
          )
        );
      }

      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, coupons]);

  return { query, setQuery, filtered, loading };
}
