// components/user/Market/ProductCard.tsx
// ─────────────────────────────────────────────────────────
// Card แต่ละ product — picture + info + redeem button
// ─────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import type { UserMarketProduct } from "@/lib/types/user/Market";
import RedeemConfirm from "./RedeemConfirm";
import styles from "./ProductCard.module.css";

type Props = {
  product: UserMarketProduct;
  onRedeem: (id: string) => Promise<void>;
};

export default function ProductCard({ product, onRedeem }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <div className={styles.card}>

        {/* ── Picture 16:10 ─────────────────────────── */}
        <div className={styles.imgWrap}>
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image} alt={product.name} className={styles.img} />
          ) : (
            <div className={styles.imgPlaceholder}>🎁</div>
          )}

          {/* Status badge */}
          <span className={`${styles.badge} ${product.status === "permanent" ? styles.permanent : styles.temporary}`}>
            {product.status === "permanent" ? "Permanent" : "Limited"}
          </span>
        </div>

        {/* ── Info ──────────────────────────────────── */}
        <div className={styles.info}>
          <p className={styles.name}>{product.name}</p>
          <p className={styles.desc}>{product.description}</p>

          {/* Date range — temporary only */}
          {product.status === "temporary" && product.dateFrom && product.dateTo && (
            <p className={styles.date}>📅 {product.dateFrom} – {product.dateTo}</p>
          )}

          <p className={styles.claim}>{product.claimPerMonth}x / month</p>
        </div>

        {/* ── Bottom: price + redeem ─────────────────── */}
        <div className={styles.bottom}>
          <span className={styles.price}>
            <span className={styles.priceNum}>{product.price}</span>
            <span className={styles.priceLabel}> tokens</span>
          </span>
          <button
            className={styles.redeemBtn}
            onClick={() => setShowConfirm(true)}
          >
            Redeem
          </button>
        </div>

      </div>

      {/* Confirm popup */}
      {showConfirm && (
        <RedeemConfirm
          product={product}
          onConfirm={onRedeem}
          onClose={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
