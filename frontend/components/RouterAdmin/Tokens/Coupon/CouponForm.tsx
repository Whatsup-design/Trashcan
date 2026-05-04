"use client";

import { useEffect, useState } from "react";
import type { Coupon, CouponFormData } from "@/lib/mockData/admin/Coupon";
import styles from "./CouponForm.module.css";

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

type Props = {
  initialData?: Partial<CouponFormData> | Coupon;
  formId?: string;
  submitError?: string;
  onSubmit: (data: CouponFormData) => Promise<void> | void;
  onCancel: () => void;
  onDraftChange?: (data: CouponFormData) => void;
};

export default function CouponForm({
  initialData,
  formId,
  submitError,
  onSubmit,
  onCancel,
  onDraftChange,
}: Props) {
  const [Product_name, setProduct_name] = useState(initialData?.Product_name ?? "");
  const [Product_Description, setProduct_Description] = useState(initialData?.Product_Description ?? "");
  const [Product_Price, setProduct_Price] = useState(initialData?.Product_Price ?? 10);
  const [Product_Limited, setProduct_Limited] = useState(initialData?.Product_Limited ?? false);
  const [Product_limit, setProduct_limit] = useState(initialData?.Product_limit ?? 1);
  const [Product_ImgUrl, setProduct_ImgUrl] = useState(initialData?.Product_ImgUrl ?? "");
  const [Product_ImgFile, setProduct_ImgFile] = useState<File | null>(null);
  const [Product_StartDate, setProduct_StartDate] = useState(initialData?.Product_StartDate ?? "");
  const [Product_EndDate, setProduct_EndDate] = useState(initialData?.Product_EndDate ?? "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    onDraftChange?.({
      Product_name,
      Product_Description,
      Product_Price,
      Product_Limited,
      Product_limit,
      Product_ImgUrl: Product_ImgUrl || null,
      Product_ImgFile,
      Product_StartDate: Product_Limited ? Product_StartDate : undefined,
      Product_EndDate: Product_Limited ? Product_EndDate : undefined,
    });
  }, [
    Product_name,
    Product_Description,
    Product_Price,
    Product_Limited,
    Product_limit,
    Product_ImgUrl,
    Product_ImgFile,
    Product_StartDate,
    Product_EndDate,
    onDraftChange,
  ]);

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError("Image size is too large. Please upload an image smaller than 2 MB.");
      setProduct_ImgFile(null);
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      setProduct_ImgFile(null);
      e.target.value = "";
      return;
    }

    setError("");
    setProduct_ImgFile(file);
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

    if (Product_Limited && (!Product_StartDate || !Product_EndDate)) {
      setError("Date range is required for limited coupons");
      return;
    }

    if (Product_Limited && Product_StartDate > Product_EndDate) {
      setError("End date must be after start date");
      return;
    }

    setIsSubmitting(true);
    onSubmit({
      Product_name: Product_name.trim(),
      Product_Description: Product_Description.trim(),
      Product_Price,
      Product_Limited,
      Product_limit,
      Product_ImgUrl: Product_ImgUrl || null,
      Product_ImgFile,
      Product_StartDate: Product_Limited ? Product_StartDate : undefined,
      Product_EndDate: Product_Limited ? Product_EndDate : undefined,
    });
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1500);
  }

  return (
    <form id={formId} className={styles.form} onSubmit={handleSubmit}>
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
        <label className={styles.label}>Limited</label>
        <div className={styles.radioGroup}>
          {[
            { label: "False", value: false },
            { label: "True", value: true },
          ].map((option) => (
            <label key={option.label} className={`${styles.radioLabel} ${Product_Limited === option.value ? styles.radioActive : ""}`}>
              <input
                type="radio"
                name="limited"
                value={String(option.value)}
                checked={Product_Limited === option.value}
                onChange={() => setProduct_Limited(option.value)}
                className={styles.radioInput}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      {Product_Limited && (
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

      {(error || submitError) && <p className={styles.error}>{error || submitError}</p>}

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
