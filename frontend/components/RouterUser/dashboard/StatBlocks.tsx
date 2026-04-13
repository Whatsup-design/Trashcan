// components/user/dashboard/StatBlocks.tsx
// ─────────────────────────────────────────────────────────
// Desktop: 4 block เรียงแถว
// Mobile: swipe carousel ด้วย embla-carousel-react
// "use client" เพราะใช้ embla (browser hook)
// ─────────────────────────────────────────────────────────
"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import type { UserDashboardData } from "../../../lib/mockData/user/Dashboard";
import styles from "./StatBlocks.module.css";

// ── Rank suffix helper ────────────────────────────────────
function getRankSuffix(rank: number): string {
  if (rank === 1) return "st";
  if (rank === 2) return "nd";
  if (rank === 3) return "rd";
  return "th";
}

// ── Single block config ───────────────────────────────────
type Block = {
  label: string;
  value: string;
  subtext: string;
  accent: string;
  isRank?: boolean;
};

function getBlocks(data: UserDashboardData): Block[] {
  return [
    {
      label:   "Bottles Thrown",
      value:   data.bottlesThrown.toLocaleString(),
      subtext: "total bottles",
      accent:  "#1177FE",
    },
    {
      label:   "Total Weight",
      value:   `${data.weightGram.toLocaleString()}g`,
      subtext: "grams collected",
      accent:  "#48B7FF",
    },
    {
      label:   "Token Balance",
      value:   data.tokensBalance.toLocaleString(),
      subtext: "tokens available",
      accent:  "#22c55e",
    },
    {
      label:   "Your Rank",
      value:   `${data.leaderboardRank}${getRankSuffix(data.leaderboardRank)}`,
      subtext: `of ${data.totalUsers} students`,
      accent:  "#f59e0b",
      isRank:  true,
    },
  ];
}

// ── Block card ────────────────────────────────────────────
function BlockCard({ block }: { block: Block }) {
  return (
    <div className={styles.card}>
      <div className={styles.accentBar} style={{ background: block.accent }} />
      <p className={styles.cardLabel}>{block.label}</p>
      <p className={`${styles.cardValue} ${block.isRank ? styles.rankValue : ""}`}>
        {block.value}
      </p>
      <p className={styles.cardSubtext}>{block.subtext}</p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────
type Props = { data: UserDashboardData };

export default function StatBlocks({ data }: Props) {
  const blocks = getBlocks(data);

  // ── Embla setup ───────────────────────────────────────
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "center",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  // ── Track active dot ──────────────────────────────────
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className={styles.wrap}>

      {/* ── Desktop: 4 block แถวเดียว ─────────────────── */}
      <div className={styles.desktopGrid}>
        {blocks.map((block) => (
          <BlockCard key={block.label} block={block} />
        ))}
      </div>

      {/* ── Mobile: embla carousel ────────────────────── */}
      <div className={styles.mobileCarousel}>
        {/* Viewport */}
        <div className={styles.emblaViewport} ref={emblaRef}>
          <div className={styles.emblaContainer}>
            {blocks.map((block) => (
              <div key={block.label} className={styles.emblaSlide}>
                <BlockCard block={block} />
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className={styles.dots}>
          {blocks.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === selectedIndex ? styles.dotActive : ""}`}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
