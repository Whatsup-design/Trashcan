// components/user/Market/RedeemConfirm.tsx
// ─────────────────────────────────────────────────────────
// Redeem confirmation popup
// States: confirm → loading (spinner) → success (checkmark) → auto close
// ใช้ createPortal ครอบทั้งหน้า
// ─────────────────────────────────────────────────────────
"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { Product } from "./types";
import styles from "./RedeemConfirm.module.css";

type Props = {
  product: Product;
  onConfirm: (id: string) => Promise<void>; // async — จะ handle loading
  onClose: () => void;
};

type Stage = "confirm" | "loading" | "success";

export default function RedeemConfirm({ product, onConfirm, onClose }: Props) {
  const [stage, setStage] = useState<Stage>("confirm");

  // ── Handle confirm ─────────────────────────────────────
  async function handleConfirm() {
    setStage("loading");
    try {
      await onConfirm(product.id); // setTimeout mock หรือ real API
      setStage("success");
    } catch {
      setStage("confirm"); // ถ้า error → กลับ confirm
    }
  }

  // ── Auto close หลัง success 2 วิ ──────────────────────
  useEffect(() => {
    if (stage !== "success") return;
    const timer = setTimeout(() => onClose(), 2000);
    return () => clearTimeout(timer);
  }, [stage, onClose]);

  return createPortal(
    <>
      {/* Backdrop — ปิดได้เฉพาะตอน confirm */}
      <div
        className={styles.backdrop}
        onClick={stage === "confirm" ? onClose : undefined}
      />

      {/* Dialog */}
      <div className={styles.dialog}>

        {/* ── Confirm stage ─────────────────────────── */}
        {stage === "confirm" && (
          <>
            {/* flex-row: picture | info */}
            <div className={styles.row}>
              {/* Picture */}
              <div className={styles.imgWrap}>
                {product.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.image} alt={product.name} className={styles.img} />
                ) : (
                  <div className={styles.imgPlaceholder}>🎁</div>
                )}
              </div>

              {/* Info */}
              <div className={styles.info}>
                <p className={styles.productName}>{product.name}</p>
                <p className={styles.productDesc}>{product.description}</p>

                {/* Status badge */}
                <span className={`${styles.badge} ${product.status === "permanent" ? styles.permanent : styles.temporary}`}>
                  {product.status === "permanent" ? "Permanent" : `Until ${product.dateTo}`}
                </span>

                {/* Price */}
                <p className={styles.price}>
                  <span className={styles.priceNum}>{product.price}</span>
                  <span className={styles.priceLabel}> tokens</span>
                </p>

                <p className={styles.claimNote}>
                  Claim limit: {product.claimPerMonth}x / month
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className={styles.divider} />

            {/* Confirm question */}
            <p className={styles.question}>
              Are you sure you want to redeem this reward?
            </p>

            {/* Buttons */}
            <div className={styles.btns}>
              <button className={styles.cancelBtn} onClick={onClose}>
                Cancel
              </button>
              <button className={styles.confirmBtn} onClick={handleConfirm}>
                Redeem
              </button>
            </div>
          </>
        )}

        {/* ── Loading stage ──────────────────────────── */}
        {stage === "loading" && (
          <div className={styles.centerStage}>
            <div className={styles.spinner} />
            <p className={styles.stageText}>Processing...</p>
          </div>
        )}

        {/* ── Success stage ──────────────────────────── */}
        {stage === "success" && (
          <div className={styles.centerStage}>
            <div className={styles.checkWrap}>
              <svg className={styles.checkIcon} viewBox="0 0 52 52">
                <circle className={styles.checkCircle} cx="26" cy="26" r="25" fill="none" />
                <path  className={styles.checkMark}  fill="none" d="M14 27l8 8 16-16" />
              </svg>
            </div>
            <p className={styles.successText}>Redeemed!</p>
            <p className={styles.successSub}>Closing automatically...</p>
          </div>
        )}

      </div>
    </>,
    document.body
  );
}