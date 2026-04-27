"use client";

import { useEffect, useRef, useState } from "react";
import type {
  LeaderboardData,
  LeaderboardEntry,
} from "@/lib/mockData/user/Leaderboard";
import styles from "./Leaderboard.module.css";

type Props = {
  data: LeaderboardData;
};

const RANK_CONFIG: Record<number, { label: string; className: string }> = {
  1: { label: "🥇", className: styles.gold },
  2: { label: "🥈", className: styles.silver },
  3: { label: "🥉", className: styles.bronze },
};

function getRankDisplay(rank: number) {
  const config = RANK_CONFIG[rank];
  if (config) {
    return <span className={styles.medal}>{config.label}</span>;
  }

  return <span className={styles.rankNum}>#{rank}</span>;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getRankSuffix(rank: number): string {
  if (rank === 1) return "st";
  if (rank === 2) return "nd";
  if (rank === 3) return "rd";
  return "th";
}

function LeaderRow({
  entry,
  rank,
  isCurrentUser,
  rowRef,
  index,
}: {
  entry: LeaderboardEntry;
  rank: number;
  isCurrentUser: boolean;
  rowRef?: React.RefObject<HTMLDivElement | null>;
  index: number;
}) {
  const config = RANK_CONFIG[rank];

  return (
    <div
      ref={isCurrentUser ? rowRef : undefined}
      className={`${styles.row} ${isCurrentUser ? styles.currentUser : ""} ${config ? config.className : ""}`}
      style={{ animationDelay: `${index * 36}ms` }}
    >
      <div className={styles.rankWrap}>{getRankDisplay(rank)}</div>

      <div className={styles.avatar}>
        {entry.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={entry.avatar} alt={entry.name} className={styles.avatarImg} />
        ) : (
          <span className={styles.initials}>{getInitials(entry.name)}</span>
        )}
      </div>

      <div className={styles.nameWrap}>
        <p className={styles.name}>
          {entry.name}
          {isCurrentUser ? <span className={styles.youBadge}>You</span> : null}
        </p>
      </div>

      <div className={styles.stats}>
        <span className={styles.statItem}>
          <span className={styles.statIcon}>🍾</span>
          <span className={styles.statVal}>{entry.bottles}</span>
        </span>
        <span className={styles.statItem}>
          <span className={styles.statIcon}>🪙</span>
          <span className={styles.statVal}>{entry.tokens}</span>
        </span>
      </div>
    </div>
  );
}

export default function LeaderboardList({ data }: Props) {
  const sorted = [...data.entries].sort((a, b) => b.tokens - a.tokens);
  const currentUserRank =
    sorted.findIndex((entry) => entry.id === data.currentUserId) + 1;
  const currentUser =
    sorted.find((entry) => entry.id === data.currentUserId) ?? null;
  const currentUserIsTopTen = currentUserRank > 0 && currentUserRank <= 10;

  const currentRowRef = useRef<HTMLDivElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const lastScrollYRef = useRef(0);
  const showFloatingSheetRef = useRef(!currentUserIsTopTen);
  const [showFloatingSheet, setShowFloatingSheet] = useState(!currentUserIsTopTen);
  const [animateSheetIn, setAnimateSheetIn] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setShowFloatingSheet(false);
      showFloatingSheetRef.current = false;
      setAnimateSheetIn(false);
      return;
    }

    if (!currentUserIsTopTen) {
      setShowFloatingSheet(true);
      showFloatingSheetRef.current = true;
      setAnimateSheetIn(false);
      return;
    }

    lastScrollYRef.current = window.scrollY;

    const updateVisibility = () => {
      const rowEl = currentRowRef.current;
      if (!rowEl) {
        setShowFloatingSheet(true);
        showFloatingSheetRef.current = true;
        setAnimateSheetIn(false);
        return;
      }

      const currentScrollY = window.scrollY;
      const rect = rowEl.getBoundingClientRect();
      const sheetHeight = sheetRef.current?.offsetHeight ?? 0;
      const triggerLine = window.innerHeight - sheetHeight - 10;
      const rowAboveViewport = rect.bottom < 0;
      const rowBelowTriggerLine = rect.top > triggerLine;
      const rowVisibleEnough = !rowAboveViewport && !rowBelowTriggerLine;
      const nextShowState = !rowVisibleEnough;
      const isScrollingUp = currentScrollY < lastScrollYRef.current;
      const previousShowState = showFloatingSheetRef.current;

      if (nextShowState && !previousShowState && isScrollingUp) {
        setAnimateSheetIn(true);
      } else if (!nextShowState) {
        setAnimateSheetIn(false);
      }

      setShowFloatingSheet(nextShowState);
      showFloatingSheetRef.current = nextShowState;
      lastScrollYRef.current = currentScrollY;
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, [currentUser, currentUserIsTopTen]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.yourRankBanner}>
        <div className={styles.yourRankLeft}>
          <p className={styles.yourRankLabel}>Your ranking</p>
          <p className={styles.yourRankNum}>
            {currentUserRank <= 3 ? RANK_CONFIG[currentUserRank]?.label : null} You are{" "}
            <span className={styles.yourRankBig}>
              {currentUserRank}
              {getRankSuffix(currentUserRank)}
            </span>
          </p>
        </div>
        <div className={styles.yourRankRight}>
          <span className={styles.yourStat}>🍾 {currentUser.bottles}</span>
          <span className={styles.yourStat}>🪙 {currentUser.tokens}</span>
        </div>
      </div>

      <p className={styles.monthLabel}>{data.month}</p>

      <div className={styles.list}>
        {sorted.map((entry, idx) => (
          <LeaderRow
            key={entry.id}
            entry={entry}
            rank={idx + 1}
            isCurrentUser={entry.id === data.currentUserId}
            rowRef={entry.id === data.currentUserId ? currentRowRef : undefined}
            index={idx}
          />
        ))}
      </div>

      <div
        ref={sheetRef}
        className={`${styles.floatingSheet} ${
          showFloatingSheet ? styles.sheetVisible : styles.sheetHidden
        } ${showFloatingSheet && animateSheetIn ? styles.sheetReturn : ""}`}
        onAnimationEnd={() => setAnimateSheetIn(false)}
      >
        <div className={`${styles.row} ${styles.currentUser} ${styles.floatingRow}`}>
          <div className={styles.rankWrap}>{getRankDisplay(currentUserRank)}</div>

          <div className={styles.avatar}>
            {currentUser.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className={styles.avatarImg}
              />
            ) : (
              <span className={styles.initials}>{getInitials(currentUser.name)}</span>
            )}
          </div>

          <div className={styles.nameWrap}>
            <p className={styles.name}>
              {currentUser.name}
              <span className={styles.youBadge}>You</span>
            </p>
          </div>

          <div className={styles.stats}>
            <span className={styles.statItem}>
              <span className={styles.statIcon}>🍾</span>
              <span className={styles.statVal}>{currentUser.bottles}</span>
            </span>
            <span className={styles.statItem}>
              <span className={styles.statIcon}>🪙</span>
              <span className={styles.statVal}>{currentUser.tokens}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
