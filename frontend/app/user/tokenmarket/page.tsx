"use client";

import { useEffect, useState } from "react";
import BannerCarousel from "@/components/RouterUser/BannerImg/BannerCarousel";
import ProductGrid from "@/components/RouterUser/TokenMarket/ProductGrid";
import LoadingScreen from "@/components/Ui/Loadingscreen";
import { ApiError, apiFetch } from "@/lib/api";
import { logDevError } from "@/lib/devLog";
import type { UserBannerApiRow, UserBannerItem } from "@/lib/types/user/Banner";
import type {
  UserMarketApiRow,
  UserMarketProduct,
} from "@/lib/types/user/Market";
import styles from "./page.module.css";

function mapMarketProducts(rows: UserMarketApiRow[]): UserMarketProduct[] {
  return rows.map((row) => ({
    id: String(row.Product_ID),
    image: row.Product_ImgUrl ?? "",
    name: row.Product_name,
    description: row.Product_Description ?? "",
    status: row.Product_Status === "Temporary" ? "temporary" : "permanent",
    dateFrom: row.Product_StartDate ?? undefined,
    dateTo: row.Product_EndDate ?? undefined,
    claimPerMonth: row.Product_limit,
    price: row.Product_Price,
  }));
}

function mapBannerItems(rows: UserBannerApiRow[]): UserBannerItem[] {
  return rows
    .filter((row) => row.Banner_ImgUrl)
    .map((row) => ({
      id: String(row.Banner_ID),
      image: row.Banner_ImgUrl ?? "",
      alt: `Banner ${row.Banner_ID}`,
    }));
}

export default function MarketPage() {
  const [banners, setBanners] = useState<UserBannerItem[]>([]);
  const [products, setProducts] = useState<UserMarketProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      apiFetch("/user/Banner") as Promise<UserBannerApiRow[]>,
      apiFetch("/user/Market") as Promise<UserMarketApiRow[]>,
    ])
      .then(([bannerRes, marketRes]) => {
        setBanners(mapBannerItems(bannerRes));
        setProducts(mapMarketProducts(marketRes));
        setError("");
      })
      .catch((err) => {
        logDevError("user-token-market", err);

        if (err instanceof ApiError) {
          setError(err.message);
          return;
        }

        setError("Failed to load products");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className={styles.page}>
      {banners.length > 0 ? (
        <BannerCarousel banners={banners} autoPlayDelay={6000} />
      ) : null}

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Available Rewards</h2>
          <p className={styles.sectionSub}>{`${products.length} items available`}</p>
        </div>

        {error ? <p className={styles.error}>{error}</p> : null}
        {!error ? <ProductGrid products={products} /> : null}
      </div>
    </div>
  );
}
