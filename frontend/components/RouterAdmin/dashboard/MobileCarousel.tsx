// components/dashboard/MobileCarousel.tsx
// ─────────────────────────────────────────────────────────
// Swipe carousel สำหรับ mobile — ใช้ embla-carousel-react
// "use client" จำเป็นเพราะใช้ useEmblaCarousel (browser hook)
// แสดงเฉพาะ mobile — desktop ซ่อนด้วย CSS
// ─────────────────────────────────────────────────────────
"use client";

import useEmblaCarousel from "embla-carousel-react";

import StatCard from "./StatCard";
import styles from "./MobileCarousel.module.css";

import { type DashboardData } from "@/types/AdminTypes";

type MobileCarouselProps = {
  data: DashboardData;
};

export default function MobileCarousel({ data }: MobileCarouselProps) {
  // useEmblaCarousel คืน [ref ให้ผูกกับ container, embla API]
  const [emblaRef] = useEmblaCarousel({
    loop: false,      // ไม่วนซ้ำ
    align: "start",   // card แรกชิดซ้าย
  });

  // stat cards ทั้งหมดที่จะ swipe ได้
  const cards = [
    { title: "Total Devices",  value: data.totalDevices, subtitle: "Registered",    accent: "blue"   as const },
    { title: "Bottles Today",  value: data.bottlesToday, subtitle: "Collected",     accent: "sky"    as const },
    { title: "Active Tokens",  value: data.activeTokens, subtitle: "In use",        accent: "green"  as const },
    { title: "Total Records",  value: data.totalRecords, subtitle: "All time",      accent: "orange" as const },
    { title: "System Uptime",  value: data.systemUptime, subtitle: "Last 30 days",  accent: "blue"   as const },
    { title: "Avg Rating",     value: `${data.avgRating} ★`, subtitle: "From users", accent: "sky"  as const },
  ];

  return (
    <div className={styles.wrapper}>
      {/* emblaRef ผูกกับ div นี้ — embla จัดการ swipe เองทั้งหมด */}
      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.container}>
          {cards.map((card) => (
            // แต่ละ slide
            <div key={card.title} className={styles.slide}>
              <StatCard {...card} />
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className={styles.dots}>
        {cards.map((card) => (
          <span key={card.title} className={styles.dot} />
        ))}
      </div>
    </div>
  );
}