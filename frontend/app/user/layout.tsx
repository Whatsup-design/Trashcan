// app/user/layout.tsx
import Sidebar   from "@/components/layout/Sidebar";
import AppHeader from "@/components/layout/Header/AppHeader";
import styles    from "../admin/layout.module.css";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <Sidebar role="user" />         {/* ← user nav items */}
      <div className={styles.spacer} />
      <div className={styles.main}>
        <AppHeader />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}