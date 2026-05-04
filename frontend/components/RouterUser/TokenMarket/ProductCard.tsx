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
  const redeemLabel = product.canRedeem ? "Redeem" : "Redeemed";
  const cardClassName = `${styles.card} ${!product.canRedeem ? styles.inactiveCard : ""}`;

  return (
    <>
      <div className={cardClassName}>

        {/* ── Picture 16:10 ─────────────────────────── */}
        <div className={styles.imgWrap}>
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image} alt={product.name} className={styles.img} />
          ) : (
            <div className={styles.imgPlaceholder}>🎁</div>
          )}

          {/* Status badge */}
          {product.isLimited ? (
            <span className={`${styles.badge} ${styles.temporary}`}>
              Limited
            </span>
          ) : null}
        </div>

        {/* ── Info ──────────────────────────────────── */}
        <div className={styles.info}>
          <p className={styles.name}>{product.name}</p>
          <p className={styles.desc}>{product.description}</p>

          {/* Date range — temporary only */}
          {product.isLimited && product.dateFrom && product.dateTo && (
            <p className={styles.date}>📅 {product.dateFrom} – {product.dateTo}</p>
          )}

          <p className={styles.claim}>
            {product.remainingThisMonth}/{product.claimPerMonth} left this month
          </p>
        </div>

        {/* ── Bottom: price + redeem ─────────────────── */}
        <div className={styles.bottom}>
          <span className={styles.price}>
            <span className={styles.priceNum}>{product.price}</span>
            <span className={styles.priceLabel}> tokens</span>
          </span>
          <button
            className={`${styles.redeemBtn} ${!product.canRedeem ? styles.disabledBtn : ""}`}
            onClick={() => setShowConfirm(true)}
            disabled={!product.canRedeem}
          >
            {redeemLabel}
          </button>
        </div>

      </div>

      {/* Confirm popup */}
      {showConfirm && product.canRedeem && (
        <RedeemConfirm
          product={product}
          onConfirm={onRedeem}
          onClose={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
