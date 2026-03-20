"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";

export const NavItem = ({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={`${styles.navItem} ${isActive ? styles.active : ""}`}
    >
      <Icon className={styles.navIcon} />
      <span className={styles.navLabel}>{label}</span>
    </Link>
  );
};