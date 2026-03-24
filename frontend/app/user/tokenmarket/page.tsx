// app/user/market/page.tsx
// ─────────────────────────────────────────────────────────
// Market page — banner carousel บนสุด
// ─────────────────────────────────────────────────────────
import BannerCarousel from "@/components/RouterUser/BannerCarousel";
import type { BannerItem } from "@/components/RouterUser/types";
import styles from "./page.module.css";

// ── Mockup banners ────────────────────────────────────────
// วางไฟล์รูปไว้ที่ public/banners/
// ถ้ายังไม่มีรูป ใช้ placeholder service ก่อนได้
const BANNERS: BannerItem[] = [
  {
    id: "1",
    image: "/BannerImg/imgTest_1.jpg",
    alt: "Banner 1",
    title: "Collect bottles, earn tokens!",
    subtitle: "Drop your bottles at any Trashcan Smart",
  },
  {
    id: "2",
    image: "/BannerImg/imgTest_2.jpg",
    alt: "Banner 2",
    title: "Redeem your tokens",
    subtitle: "Exchange tokens for amazing rewards",
  },
  {
    id: "3",
    image: "/BannerImg/imgTest_3.jpg",
    alt: "Banner 3",
    title: "Sports Day Pass",
    subtitle: "Limited time — ends March 31",
  },
  {
    id: "4",
    image: "/BannerImg/imgTest_4.jpg",
    alt: "Banner 4",
    title: "Free Coffee",
    subtitle: "Only 20 tokens at the canteen",
  },
  {
    id: "5",
    image: "/BannerImg/imgTest_5.jpg",
    alt: "Banner 5",
    title: "New rewards added",
    subtitle: "Check out the latest coupons",
  },
];

export default function MarketPage() {
  return (
    <div className={styles.page}>

      {/* ── Banner — edge to edge, no side padding ─── */}
      <BannerCarousel banners={BANNERS} autoPlayDelay={6000} />

      {/* ── Page content below banner ─────────────── */}
      <div className={styles.content}>
        <h1 className={styles.title}>Market</h1>
        <p className={styles.sub}>Redeem your tokens for rewards</p>
        {/* coupon/product list จะมาทีหลัง */}
      </div>

    </div>
  );
}