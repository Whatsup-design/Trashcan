"use client";

import { useState } from "react";
import type { Coupon, CouponFormData } from "@/lib/mockData/admin/Coupon";
import styles from "./CouponForm.module.css";

type Props = {
  initialData?: Coupon;
  onSubmit: (data: CouponFormData) => Promise<void> | void;
  onCancel: () => void;
};

export default function CouponForm({ initialData, onSubmit, onCancel }: Props) {
  const [Product_name, setProduct_name] = useState(initialData?.Product_name ?? "");
  const [Product_Description, setProduct_Description] = useState(initialData?.Product_Description ?? "");
  const [Product_Price, setProduct_Price] = useState(initialData?.Product_Price ?? 10);
  const [Product_Status, setProduct_Status] = useState<"Permanent" | "Temporary">(initialData?.Product_Status ?? "Permanent");
  const [Product_limit, setProduct_limit] = useState(initialData?.Product_limit ?? 1);
  const [Product_ImgUrl, setProduct_ImgUrl] = useState(initialData?.Product_ImgUrl ?? "");
  const [Product_StartDate, setProduct_StartDate] = useState(initialData?.Product_StartDate ?? "");
  const [Product_EndDate, setProduct_EndDate] = useState(initialData?.Product_EndDate ?? "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProduct_ImgUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!Product_name.trim()) {
      setError("Name is required");
      return;
    }

    if (Product_Status === "Temporary" && (!Product_StartDate || !Product_EndDate)) {
      setError("Date range is required for temporary coupons");
      return;
    }

    if (Product_Status === "Temporary" && Product_StartDate > Product_EndDate) {
      setError("End date must be after start date");
      return;
    }

    setIsSubmitting(true);
    onSubmit({
      Product_name: Product_name.trim(),
      Product_Description: Product_Description.trim(),
      Product_Price,
      Product_Status,
      Product_limit,
      Product_ImgUrl: Product_ImgUrl || null,
      Product_StartDate: Product_Status === "Temporary" ? Product_StartDate : undefined,
      Product_EndDate: Product_Status === "Temporary" ? Product_EndDate : undefined,
    });
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1500);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label}>Picture</label>
        <div className={styles.uploadWrap}>
          {Product_ImgUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={Product_ImgUrl} alt="preview" className={styles.preview} />
          ) : (
            <div className={styles.uploadPlaceholder}>Click to upload</div>
          )}
          <input
            type="file"
            accept="image/*"
            className={styles.fileInput}
            onChange={handleImage}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Name <span className={styles.required}>*</span></label>
        <input
          className={styles.input}
          type="text"
          placeholder="e.g. Free Coffee"
          value={Product_name}
          onChange={(e) => setProduct_name(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Description</label>
        <textarea
          className={styles.textarea}
          placeholder="Describe the reward..."
          value={Product_Description}
          onChange={(e) => setProduct_Description(e.target.value)}
          rows={3}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Status</label>
        <div className={styles.radioGroup}>
          {(["Permanent", "Temporary"] as const).map((status) => (
            <label key={status} className={`${styles.radioLabel} ${Product_Status === status ? styles.radioActive : ""}`}>
              <input
                type="radio"
                name="status"
                value={status}
                checked={Product_Status === status}
                onChange={() => setProduct_Status(status)}
                className={styles.radioInput}
              />
              {status}
            </label>
          ))}
        </div>
      </div>

      {Product_Status === "Temporary" && (
        <div className={styles.dateRow}>
          <div className={styles.field}>
            <label className={styles.label}>From <span className={styles.required}>*</span></label>
            <input className={styles.input} type="date" value={Product_StartDate} onChange={(e) => setProduct_StartDate(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>To <span className={styles.required}>*</span></label>
            <input className={styles.input} type="date" value={Product_EndDate} onChange={(e) => setProduct_EndDate(e.target.value)} />
          </div>
        </div>
      )}

      <div className={styles.field}>
        <label className={styles.label}>Claim limit / month</label>
        <input
          className={styles.input}
          type="number"
          min={1}
          max={99}
          value={Product_limit}
          onChange={(e) => setProduct_limit(Number(e.target.value))}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Price (tokens)</label>
        <input
          className={styles.input}
          type="number"
          min={1}
          value={Product_Price}
          onChange={(e) => setProduct_Price(Number(e.target.value))}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.btns}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.confirmBtn} disabled={isSubmitting}>
          {isSubmitting
            ? initialData
              ? "Saving..."
              : "Adding..."
            : initialData
              ? "Save Changes"
              : "Add Coupon"}
        </button>
      </div>
    </form>
  );
}
