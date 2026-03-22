// components/tokens/coupon/CouponForm.tsx
// ─────────────────────────────────────────────────────────
// Form ใช้ร่วมกันทั้ง Add และ Edit
// initialData → edit mode, ไม่มี → add mode
// ─────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import type { Coupon, CouponFormData } from "./types"; // ← fix: import จาก types
import styles from "./CouponForm.module.css";

type Props = {
  initialData?: Coupon;                        // optional — มีแค่ edit mode
  onSubmit:  (data: CouponFormData) => void;   // ← fix: เปลี่ยนเป็น onSubmit
  onCancel:  () => void;
};

export default function CouponForm({ initialData, onSubmit, onCancel }: Props) {
  const [name,          setName]          = useState(initialData?.name          ?? "");
  const [description,   setDescription]   = useState(initialData?.description   ?? "");
  const [status,        setStatus]        = useState<"permanent" | "temporary">(initialData?.status ?? "permanent");
  const [dateFrom,      setDateFrom]      = useState(initialData?.dateFrom      ?? "");
  const [dateTo,        setDateTo]        = useState(initialData?.dateTo        ?? "");
  const [claimPerMonth, setClaimPerMonth] = useState(initialData?.claimPerMonth ?? 1);
  const [price,         setPrice]         = useState(initialData?.price         ?? 10); // ← fix: price
  const [picture,       setPicture]       = useState(initialData?.picture       ?? "");
  const [error,         setError]         = useState("");

  // ── Image upload → base64 ────────────────────────────
  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPicture(reader.result as string);
    reader.readAsDataURL(file);
  }

  // ── Submit ────────────────────────────────────────────
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) { setError("Name is required"); return; }
    if (status === "temporary" && (!dateFrom || !dateTo)) {
      setError("Date range is required for temporary coupons");
      return;
    }
    if (status === "temporary" && dateFrom > dateTo) {
      setError("End date must be after start date");
      return;
    }

    // ← fix: ใช้ price ไม่ใช่ priceTokens
    onSubmit({
      picture,
      name:         name.trim(),
      description:  description.trim(),
      status,
      dateFrom:     status === "temporary" ? dateFrom : undefined,
      dateTo:       status === "temporary" ? dateTo   : undefined,
      claimPerMonth,
      price,
    });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>

      {/* ── Picture upload ─────────────────────────── */}
      <div className={styles.field}>
        <label className={styles.label}>Picture</label>
        <div className={styles.uploadWrap}>
          {picture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={picture} alt="preview" className={styles.preview} />
          ) : (
            <div className={styles.uploadPlaceholder}>🖼️ Click to upload</div>
          )}
          <input
            type="file"
            accept="image/*"
            className={styles.fileInput}
            onChange={handleImage}
          />
        </div>
      </div>

      {/* ── Name ──────────────────────────────────── */}
      <div className={styles.field}>
        <label className={styles.label}>Name <span className={styles.required}>*</span></label>
        <input
          className={styles.input}
          type="text"
          placeholder="e.g. Free Coffee"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* ── Description ───────────────────────────── */}
      <div className={styles.field}>
        <label className={styles.label}>Description</label>
        <textarea
          className={styles.textarea}
          placeholder="Describe the reward..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      {/* ── Status ────────────────────────────────── */}
      <div className={styles.field}>
        <label className={styles.label}>Status</label>
        <div className={styles.radioGroup}>
          {(["permanent", "temporary"] as const).map((s) => (
            <label key={s} className={`${styles.radioLabel} ${status === s ? styles.radioActive : ""}`}>
              <input
                type="radio"
                name="status"
                value={s}
                checked={status === s}
                onChange={() => setStatus(s)}
                className={styles.radioInput}
              />
              {s === "permanent" ? "🟢 Permanent" : "🟠 Temporary"}
            </label>
          ))}
        </div>
      </div>

      {/* ── Date range (temporary only) ───────────── */}
      {status === "temporary" && (
        <div className={styles.dateRow}>
          <div className={styles.field}>
            <label className={styles.label}>From <span className={styles.required}>*</span></label>
            <input className={styles.input} type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>To <span className={styles.required}>*</span></label>
            <input className={styles.input} type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
        </div>
      )}

      {/* ── Claim per month ───────────────────────── */}
      <div className={styles.field}>
        <label className={styles.label}>Claim limit / month</label>
        <input
          className={styles.input}
          type="number" min={1} max={99}
          value={claimPerMonth}
          onChange={(e) => setClaimPerMonth(Number(e.target.value))}
        />
      </div>

      {/* ── Price tokens ──────────────────────────── */}
      <div className={styles.field}>
        <label className={styles.label}>Price (tokens)</label>
        <input
          className={styles.input}
          type="number" min={1}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>

      {/* ── Error ─────────────────────────────────── */}
      {error && <p className={styles.error}>{error}</p>}

      {/* ── Buttons ───────────────────────────────── */}
      <div className={styles.btns}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.confirmBtn}>
          {initialData ? "Save Changes" : "Add Coupon"}
        </button>
      </div>

    </form>
  );
}