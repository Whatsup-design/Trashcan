"use client";

import { useEffect, useState } from "react";
import { apiPut } from "@/lib/api";
import { logDevError } from "@/lib/devLog";
import type { UserMarketProduct } from "@/lib/types/user/Market";
import ProductCard from "./ProductCard";
import styles from "./ProductGrid.module.css";

type Props = {
  products: UserMarketProduct[];
  onTokensChange?: (tokens: number) => void;
};

type RedeemResponse = {
  currentTokens?: number;
};

export default function ProductGrid({ products, onTokensChange }: Props) {
  const [visibleProducts, setVisibleProducts] = useState(products);

  useEffect(() => {
    setVisibleProducts(products);
  }, [products]);

  async function handleRedeem(id: string): Promise<void> {
    try {
      const response = (await apiPut("/user/Redeem", {
        productId: Number(id),
      })) as RedeemResponse;

      if (typeof response.currentTokens === "number") {
        onTokensChange?.(response.currentTokens);
      }

      window.dispatchEvent(new Event("notifications:refresh"));
      setVisibleProducts((currentProducts) =>
        currentProducts.map((product) => {
          if (product.id !== id) return product;

          const remainingThisMonth = Math.max(product.remainingThisMonth - 1, 0);

          return {
            ...product,
            redeemedThisMonth: product.redeemedThisMonth + 1,
            remainingThisMonth,
            canRedeem: remainingThisMonth > 0,
          };
        })
      );
    } catch (err) {
      logDevError("user-token-market-redeem", err);
      throw err;
    }
  }

  if (visibleProducts.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No products available</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {visibleProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onRedeem={handleRedeem}
        />
      ))}
    </div>
  );
}
