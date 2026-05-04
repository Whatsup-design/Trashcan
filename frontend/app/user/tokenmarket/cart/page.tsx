"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";

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

      <section className={styles.card}>
        <p className={styles.eyebrow}>Redeemed Rewards</p>
        <h1 className={styles.title}>Your Cart</h1>
        <p className={styles.description}>
          This page is ready for redeemed reward data. The next step is fetching
          the user cart by student ID from the JWT token.
        </p>
      </section>
    </div>
  );
}
