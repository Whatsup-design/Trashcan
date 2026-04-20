"use client";

import { useEffect, useState } from "react";
import CouponList from "@/components/RouterAdmin/Tokens/Coupon/CouponList";
import DataState from "@/components/Ui/DataState";
import { type Coupon, type CouponFormData } from "@/lib/mockData/admin/Coupon";
import { ApiError, apiDelete, apiFetch, apiPost, apiPut } from "@/lib/api";
import styles from "./page.module.css";

export default function TokensPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function getErrorMessage(err: unknown) {
    if (err instanceof ApiError && err.status === 0) {
      return "Request timed out or network error. Please try again.";
    }
    return "Failed to load market data. Please try again.";
  }

  function loadMarket() {
    setLoading(true);
    setError("");
    apiFetch("/admin/Market")
      .then((res: Coupon[]) => setCoupons(res))
      .catch((err) => {
        console.error(err);
        setError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    loadMarket();
  }, []);

  async function handleAdd(data: CouponFormData) {
    try {
      const createdCoupon = await apiPost("/admin/Market", data) as Coupon;
      setCoupons((prev) => [createdCoupon, ...prev]);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleEdit(id: number, data: CouponFormData) {
    try {
      const updatedCoupon = await apiPut(`/admin/Market/${id}`, data) as Coupon;
      setCoupons((prev) =>
        prev.map((coupon) => (coupon.Product_ID === id ? updatedCoupon : coupon))
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id: number) {
    try {
      await apiDelete(`/admin/Market/${id}`);
      setCoupons((prev) => prev.filter((coupon) => coupon.Product_ID !== id));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={styles.page}>
      <DataState loading={loading} error={error} onRetry={loadMarket} isEmpty={!coupons.length} emptyText="No coupons found">
        <CouponList
          coupons={coupons}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </DataState>
    </div>
  );
}
