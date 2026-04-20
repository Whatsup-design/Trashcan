import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFoundPage() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.desc}>
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className={styles.actions}>
          <Link href="/" className={styles.btn}>
            Go Home
          </Link>
          <Link href="/login" className={`${styles.btn} ${styles.primary}`}>
            Go to Login
          </Link>
        </div>
      </section>
    </main>
  );
}
