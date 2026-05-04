"use client";

import { apiPut } from "@/lib/api";
import { logDevError } from "@/lib/devLog";
import type { UserMarketProduct } from "@/lib/types/user/Market";
import ProductCard from "./ProductCard";
import styles from "./ProductGrid.module.css";

type Props = {
  products: UserMarketProduct[];
};

export default function ProductGrid({ products }: Props) {
  async function handleRedeem(id: string): Promise<void> {
    try {
      await apiPut("/user/Redeem", { productId: Number(id) });
    } catch (err) {
      logDevError("user-token-market-redeem", err);
      throw err;
    }
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
