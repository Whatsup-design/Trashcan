"use client";

// components/layout/AppHeader.tsx

import Logout      from "./Logout/Logout";
import styles      from "./AppHeader.module.css";
import Bell        from "./Bells/bell";
import Searchbar   from "./Search/Searchbar";
import { usePathname } from "next/navigation";

const PAGE_TITLES = [
  { path: "/user/tokenmarket/cart", title: "Redeem Cart" },
  { path: "/user/tokenmarket", title: "Token Market" },
  { path: "/user/leaderboard", title: "Leaderboard" },
  { path: "/user/settings", title: "Settings" },
  { path: "/user/about", title: "About" },
  { path: "/user/dashboard", title: "User Dashboard" },
  { path: "/admin/activity-log", title: "Activity Log" },
  { path: "/admin/markets", title: "Market Management" },
  { path: "/admin/devices", title: "Device Management" },
  { path: "/admin/data", title: "Student Data" },
  { path: "/admin/overview", title: "Overview" },
  { path: "/admin/dashboard", title: "Admin Dashboard" },
] as const;

function getPageTitle(pathname: string) {
  return PAGE_TITLES.find(({ path }) => pathname.startsWith(path))?.title ?? "Dashboard";
}

export default function AppHeader() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className={styles.header}>

      <div className={styles.headerLeft}>
        <span className={styles.pageTitle}>{pageTitle}</span>
      </div>

      <div className={styles.headerRight}>
        <Searchbar />
        <Bell />
        
        <Logout />
      </div>

    </header>
  );
}
