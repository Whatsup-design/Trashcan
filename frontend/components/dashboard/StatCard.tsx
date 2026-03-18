// components/dashboard/StatCard.tsx
// ─────────────────────────────────────────────────────────
// Card เล็กๆ แสดงตัวเลขสรุป 1 ค่า เช่น Total Devices, Bottles Today
// รับ props มาแสดง — reuse ได้กับทุก stat
// ─────────────────────────────────────────────────────────

import styles from "./StatCard.module.css";

type StatCardProps = {
  title: string;        // หัวข้อ เช่น "Total Devices"
  value: string | number; // ค่าที่แสดง เช่น 24 หรือ "99.8%"
  subtitle?: string;    // ข้อความเล็กๆ ด้านล่าง เช่น "Online now"
  accent?: "blue" | "sky" | "green" | "orange"; // สีแถบซ้าย
};

// map accent color → CSS class
const accentMap = {
  blue:   styles.accentBlue,
  sky:    styles.accentSky,
  green:  styles.accentGreen,
  orange: styles.accentOrange,
};

export default function StatCard({
  title,
  value,
  subtitle,
  accent = "blue",
}: StatCardProps) {
  return (
    <div className={styles.card}>
      {/* แถบสีด้านซ้าย */}
      <div className={`${styles.accentBar} ${accentMap[accent]}`} />

      <div className={styles.body}>
        {/* หัวข้อ */}
        <p className={styles.title}>{title}</p>

        {/* ตัวเลขหลัก */}
        <p className={styles.value}>{value}</p>

        {/* ข้อความเสริม — แสดงเฉพาะถ้าส่งมา */}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    </div>
  );
}