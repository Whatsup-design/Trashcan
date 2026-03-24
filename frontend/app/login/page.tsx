// app/login/page.tsx
// ─────────────────────────────────────────────────────────
// Landing — เลือกว่าเป็นใคร
// ─────────────────────────────────────────────────────────
import Link from "next/link";
import styles from "./page.module.css";

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* ── Logo ──────────────────────────────────── */}
        <div className={styles.logoWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/IconLogo.png" alt="Trashcan Smart" className={styles.logo} />
          <div>
            <p className={styles.appName}>Trashcan Smart</p>
            <p className={styles.appSub}>Please select your account type</p>
          </div>
        </div>

        {/* ── Choose type ───────────────────────────── */}
        <div className={styles.choices}>

          {/* Student / Staff */}
          <Link href="/login/students" className={styles.choiceCard}>
            <img className={styles.choiceIcon} src="/kajonkietschool_Logo (1).png" alt="Student" width={24} style={{ margin : '4.5px' }} />
            <div className={styles.choiceText}>
              <p className={styles.choiceTitle}>Student & Staff</p>
              <p className={styles.choiceSub}>Login with Student ID or Staff ID</p>
            </div>
            <span className={styles.arrow}>→</span>
          </Link>

          {/* External */}
          <Link href="/login/external" className={`${styles.choiceCard} ${styles.disabled}`}>
            <span className={styles.choiceIcon}>👤</span>
            <div className={styles.choiceText}>
              <p className={styles.choiceTitle}>External / Visitor</p>
              <p className={styles.choiceSub}>Guardian · Line Point (coming soon)</p>
            </div>
            <span className={styles.comingSoon}>Soon</span>
          </Link>

        </div>

       

      </div>
    </div>
  );
}