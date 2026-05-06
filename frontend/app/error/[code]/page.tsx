import Link from "next/link";
import styles from "./page.module.css";

type Props = {
  params: Promise<{ code: string }>;
};

const CONTENT: Record<
  string,
  { title: string; desc: string; showLogin?: boolean }
> = {
  "401": {
    title: "Unauthorized",
    desc: "You need to sign in before accessing this page.",
    showLogin: true,
  },
  "403": {
    title: "Forbidden",
    desc: "You do not have permission to view this page.",
    showLogin: true,
  },
  "404": {
    title: "Not Found",
    desc: "The requested resource was not found.",
  },
  "500": {
    title: "Server Error",
    desc: "Something went wrong. Please try again.",
  },
};

export default async function ErrorCodePage({ params }: Props) {
  const { code } = await params;
  const item = CONTENT[code] ?? CONTENT["500"];
  const safeCode = CONTENT[code] ? code : "500";

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.code}>{safeCode}</h1>
        <h2 className={styles.title}>{item.title}</h2>
        <p className={styles.desc}>{item.desc}</p>
        <div className={styles.actions}>
          <Link href="/" className={styles.btn}>
            Go Home
          </Link>
          {item.showLogin ? (
            <Link href="/login/students" className={`${styles.btn} ${styles.primary}`}>
              Sign In
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  );
}
