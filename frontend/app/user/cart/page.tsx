"use client";

import styles from "./page.module.css";

export default function UserCartPage() {
  return (
    <div className={styles.page}>
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
