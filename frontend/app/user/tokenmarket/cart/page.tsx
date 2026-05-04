"use client";

import { useRouter } from "next/navigation";
import CartItem, {
  type UserCartItem,
} from "@/components/RouterUser/TokenMarket/CartItem";
import styles from "./page.module.css";

const mockCartItems: UserCartItem[] = [
  {
    id: "redeem-1",
    image: "/template.jpg",
    name: "Shimon Chocolate Snack",
    description: "Redeemed reward waiting for staff confirmation at the counter.",
    tokenPrice: 50,
    redeemedAt: "Redeemed today",
    timeLeft: "23h 45m",
  },
  {
    id: "redeem-2",
    image: "/BannerImg/imgTest_1.jpg",
    name: "School Store Coupon",
    description: "Show this item to redeem your coupon before the timer expires.",
    tokenPrice: 25,
    redeemedAt: "Redeemed yesterday",
    timeLeft: "8h 10m",
  },
];

export default function TokenMarketCartPage() {
  const router = useRouter();

  return (
    <div className={styles.page}>
      <button
        className={styles.backButton}
        type="button"
        onClick={() => router.back()}
        aria-label="Go back to previous page"
      >
        <svg
          className={styles.backIcon}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M15 18l-6-6 6-6"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.4"
          />
        </svg>
        <span>Back</span>
      </button>

      <header className={styles.header}>
        <h1 className={styles.title}>Your Cart</h1>
        <p className={styles.description}>
          Rewards you have redeemed will appear here.
        </p>
      </header>

      <section className={styles.list} aria-label="Redeemed reward list">
        {mockCartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </section>
    </div>
  );
}
