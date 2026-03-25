// app/user/market/page.tsx
// ─────────────────────────────────────────────────────────
// Market page — banner carousel บนสุด
// ─────────────────────────────────────────────────────────
import BannerCarousel from "@/components/RouterUser/BannerImg/BannerCarousel";
import type { BannerItem } from "@/components/RouterUser/BannerImg/types";
// app/user/market/page.tsx
// ─────────────────────────────────────────────────────────
// Market page — banner + product grid
// ─────────────────────────────────────────────────────────

import ProductGrid    from "@/components/RouterUser/TokenMarket/ProductGrid";
import type { Product }    from "@/components/RouterUser/TokenMarket/types";
import styles from "./page.module.css";

// ── Mockup banners ────────────────────────────────────────
const BANNERS: BannerItem[] = [
  { id: "1", image: "/BannerImg/imgTest_1.jpg", alt: "Banner 1", title: "Collect bottles, earn tokens!", subtitle: "Drop at any Trashcan Smart" },
  { id: "2", image: "/BannerImg/imgTest_2.jpg", alt: "Banner 2", title: "Redeem your tokens",           subtitle: "Exchange for amazing rewards" },
  { id: "3", image: "/BannerImg/imgTest_3.jpg", alt: "Banner 3", title: "Sports Day Pass",              subtitle: "Limited time — ends March 31" },
  { id: "4", image: "/BannerImg/imgTest_4.jpg", alt: "Banner 4", title: "Free Coffee",                  subtitle: "Only 20 tokens" },
  { id: "5", image: "/BannerImg/imgTest_5.jpg", alt: "Banner 5", title: "New rewards added",            subtitle: "Check out the latest" },
];

// ── Mockup products ───────────────────────────────────────
const PRODUCTS: Product[] = [
  { id: "1", image: "", name: "Free Coffee",      description: "Redeem for 1 free coffee at the school canteen", status: "permanent",  claimPerMonth: 2, price: 20 },
  { id: "2", image: "", name: "Sports Day Pass",  description: "Free entry to the annual sports day event",      status: "temporary",  dateFrom: "2025-03-01", dateTo: "2025-03-31", claimPerMonth: 1, price: 50 },
  { id: "3", image: "", name: "Stationery Set",   description: "1 set of school stationery (pen, pencil, ruler)", status: "permanent", claimPerMonth: 1, price: 30 },
  { id: "4", image: "", name: "Movie Ticket",     description: "1 free movie ticket at the school cinema",        status: "temporary",  dateFrom: "2025-04-01", dateTo: "2025-04-30", claimPerMonth: 1, price: 80 },
  { id: "5", image: "", name: "Canteen Voucher",  description: "50 baht canteen voucher",                         status: "permanent",  claimPerMonth: 3, price: 40 },
  { id: "6", image: "", name: "Library Pass",     description: "Priority borrowing pass for 1 week",             status: "permanent",  claimPerMonth: 2, price: 15 },
  { id: "7", image: "", name: "PE Class Skip",    description: "Skip 1 PE class (with teacher approval)",         status: "temporary",  dateFrom: "2025-03-15", dateTo: "2025-05-15", claimPerMonth: 1, price: 100 },
  { id: "8", image: "", name: "School Badge",     description: "Exclusive eco-warrior school badge",              status: "permanent",  claimPerMonth: 1, price: 60 },
];

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