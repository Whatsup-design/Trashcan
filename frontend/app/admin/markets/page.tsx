"use client";

import { useEffect, useState } from "react";
import CouponList from "@/components/RouterAdmin/Tokens/Coupon/CouponList";
import DataState from "@/components/Ui/DataState";
import { type Coupon, type CouponFormData } from "@/lib/mockData/admin/Coupon";
import { ApiError, apiDelete, apiFetch, apiPost, apiPut } from "@/lib/api";
import { logDevError } from "@/lib/devLog";
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

  function getSubmitErrorMessage(err: unknown) {
    if (err instanceof ApiError) {
      const message = err.message.trim();

      if (/payload too large|too large|entity too large|file too large|size/i.test(message)) {
        return "Image size is too large.";
      }

      if (/validation|invalid|required/i.test(message)) {
        return "Validation unsuccessful. Please check the form and try again.";
      }

      return message;
    }

    return "Failed to save coupon. Please try again.";
  }

  function loadMarket() {
    setLoading(true);
    setError("");
    apiFetch("/admin/Market")
      .then((res: Coupon[]) => setCoupons(res))
      .catch((err) => {
        logDevError("admin-market-load", err);
        setError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    loadMarket();
  }, []);

  function buildCouponFormData(data: CouponFormData) {
    const formData = new FormData();

    formData.append("Product_name", data.Product_name);
    formData.append("Product_Description", data.Product_Description ?? "");
    formData.append("Product_Price", String(data.Product_Price));
    formData.append("Product_Limited", String(data.Product_Limited));
    formData.append("Product_limit", String(data.Product_limit));

    if (data.Product_StartDate) {
      formData.append("Product_StartDate", data.Product_StartDate);
    }

    if (data.Product_EndDate) {
      formData.append("Product_EndDate", data.Product_EndDate);
    }

    if (data.Product_ImgFile) {
      formData.append("Product_Img", data.Product_ImgFile);
    }

    if (data.removeImage) {
      formData.append("removeImage", "true");
    }

    return formData;
  }

  async function handleAdd(data: CouponFormData) {
    try {
      const createdCoupon = await apiPost(
        "/admin/Market",
        buildCouponFormData(data)
      ) as Coupon;
      setCoupons((prev) => [createdCoupon, ...prev]);
    } catch (error) {
      logDevError("admin-market-add", error);
      throw new Error(getSubmitErrorMessage(error));
    }
  }

  async function handleEdit(id: number, data: CouponFormData) {
    try {
      const updatedCoupon = await apiPut(
        `/admin/Market/${id}`,
        buildCouponFormData(data)
      ) as Coupon;
      setCoupons((prev) =>
        prev.map((coupon) => (coupon.Product_ID === id ? updatedCoupon : coupon))
      );
    } catch (error) {
      logDevError("admin-market-edit", error);
    }
  }

  async function handleDelete(id: number) {
    try {
      await apiDelete(`/admin/Market/${id}`);
      setCoupons((prev) => prev.filter((coupon) => coupon.Product_ID !== id));
    } catch (error) {
      logDevError("admin-market-delete", error);
    }
  }

  return (
    <div className={styles.page}>
      <DataState loading={loading} error={error} onRetry={loadMarket}>
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
