// app/user/market/page.tsx
// ─────────────────────────────────────────────────────────
// Market page — banner carousel บนสุด
// ─────────────────────────────────────────────────────────
import BannerCarousel from "@/components/RouterUser/BannerImg/BannerCarousel";

// app/user/market/page.tsx
// ─────────────────────────────────────────────────────────
// Market page — banner + product grid
// ─────────────────────────────────────────────────────────

import ProductGrid    from "@/components/RouterUser/TokenMarket/ProductGrid";

import styles from "./page.module.css";

// ── Mockup banners ────────────────────────────────────────
import BannerToken from "@/lib/mockData/user/BannerToken"

const {BANNERS, PRODUCTS} = BannerToken
export default function MarketPage() {
  return (
    <div className={styles.page}>

      {/* ── Banner — edge to edge ─────────────────────── */}
      <BannerCarousel banners={BANNERS} autoPlayDelay={6000} />

      {/* ── Products ──────────────────────────────────── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Available Rewards</h2>
          <p className={styles.sectionSub}>{PRODUCTS.length} items available</p>
        </div>
        <ProductGrid products={PRODUCTS} />
      </div>

    </div>
  );
}