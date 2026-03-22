// app/admin/layout.tsx
// Server Component — ไม่มี state ใดๆ
// แค่ประกอบ Sidebar + AdminHeader + content เข้าด้วยกัน

import Sidebar     from "@/components/layout/Sidebar";
import AdminHeader from "@/components/layout/Header/AppHeader";
import styles      from "./layout.module.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.shell}>

      {/* Sidebar — fixed ซ้าย */}
      <Sidebar role="admin"/>

      {/* Spacer ดัน content ออกจาก sidebar */}
      <div className={styles.spacer} />

      {/* Main area */}
      <div className={styles.main}>

        {/* Header — แยกเป็น component แล้ว มี logout */}
        <AdminHeader />

        {/* Page content */}
        <main className={styles.content}>
          {children}
        </main>

      </div>
    </div>
  );
}