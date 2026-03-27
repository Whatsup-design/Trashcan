// components/user/Market/ProductGrid.tsx
// ─────────────────────────────────────────────────────────
// Grid layout สำหรับ product cards
// Desktop: 4 columns, Mobile: 2 columns
// จัดการ redeem state ทั้งหมด
// ─────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import type { Product } from "@/lib/mockData/user/BannerToken";
import ProductCard from "./ProductCard";
import styles from "./ProductGrid.module.css";

type Props = {
  products: Product[];
};

export default function ProductGrid({ products }: Props) {
  // ── mock redeem function ───────────────────────────────
  // ตอน connect backend แก้ตรงนี้เลย
  async function handleRedeem(id: string): Promise<void> {
    // mock loading 1.5 วิ
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Redeemed product:", id);
    // ตอนจริง: await redeemApi(id)
  }

  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No products available</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onRedeem={handleRedeem}
        />
      ))}
    </div>
  );
}