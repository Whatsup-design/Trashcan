import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getRedirectPath } from "@/lib/auth/getRedirectPath";
import { AUTH_ROLE_COOKIE, AUTH_TOKEN_COOKIE } from "@/lib/auth/sessionConfig";
import styles from "./page.module.css";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;
  const role = cookieStore.get(AUTH_ROLE_COOKIE)?.value;
  const redirectPath = token ? getRedirectPath(role) : null;

  if (redirectPath) {
    redirect(redirectPath);
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.png" alt="Trashcan Smart" className={styles.logo} />
          <div>
            <p className={styles.appName}>Trashcan Smart</p>
            <p className={styles.appSub}>Please select your account type</p>
          </div>
        </div>

        <div className={styles.choices}>
          <Link href="/login/students" className={styles.choiceCard}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.choiceIcon}
              src="/kajonkietschool_Logo (1).png"
              alt="Student"
              width={24}
              style={{ margin: "4.5px" }}
            />
            <div className={styles.choiceText}>
              <p className={styles.choiceTitle}>Student & Staff</p>
              <p className={styles.choiceSub}>Login with Student ID or Staff ID</p>
            </div>
            <span className={styles.arrow}>Go</span>
          </Link>

          <Link
            href="/login/external"
            className={`${styles.choiceCard} ${styles.disabled}`}
          >
            <span className={styles.choiceIcon}>EX</span>
            <div className={styles.choiceText}>
              <p className={styles.choiceTitle}>External / Visitor</p>
              <p className={styles.choiceSub}>Guardian via Line Point (coming soon)</p>
            </div>
            <span className={styles.comingSoon}>Soon</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
