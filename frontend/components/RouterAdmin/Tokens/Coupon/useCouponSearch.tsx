"use client";

import { useDeferredValue, useMemo, useState } from "react";
import type { Coupon } from "../../../../lib/mockData/admin/Coupon";

export function useCouponSearch(coupons: Coupon[]) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();

    if (!q) {
      return coupons;
    }

    return coupons.filter(
      (coupon) =>
        coupon.Product_name.toLowerCase().includes(q) ||
        coupon.Product_Description.toLowerCase().includes(q) ||
        coupon.Product_Status.toLowerCase().includes(q)
    );
  }, [coupons, deferredQuery]);

  const loading = query !== deferredQuery;

  return { query, setQuery, filtered, loading };
}
