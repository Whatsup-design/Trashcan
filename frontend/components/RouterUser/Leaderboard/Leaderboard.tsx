// components/user/Leaderboard/LeaderboardList.tsx
// ─────────────────────────────────────────────────────────
// Sort entries by tokens descending
// Top 3 = gold / premium blue / bronze
// Current user row highlighted with blue edge
// Top banner shows user's own rank
// ─────────────────────────────────────────────────────────
import type { LeaderboardData, LeaderboardEntry } from "@/lib/mockData/user/Leaderboard";
import styles from "./Leaderboard.module.css";

type Props = {
  data: LeaderboardData;
};

// ── Rank medal config ──────────────────────────────────────
const RANK_CONFIG: Record<number, { label: string; className: string }> = {
  1: { label: "🥇", className: styles.gold   },
  2: { label: "🥈", className: styles.silver },
  3: { label: "🥉", className: styles.bronze },
};

// ── Initials from name ─────────────────────────────────────
function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

// ── Single row ────────────────────────────────────────────
function LeaderRow({
  entry,
  rank,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  rank: number;
  isCurrentUser: boolean;
}) {
  const config = RANK_CONFIG[rank];

  return (
    <div className={`${styles.row} ${isCurrentUser ? styles.currentUser : ""} ${config ? config.className : ""}`}>

      {/* Rank */}
      <div className={styles.rankWrap}>
        {config ? (
          <span className={styles.medal}>{config.label}</span>
        ) : (
          <span className={styles.rankNum}>#{rank}</span>
        )}
      </div>

      {/* Avatar */}
      <div className={`${styles.avatar} ${config ? config.className + "Avatar" : ""}`}>
        {entry.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={entry.avatar} alt={entry.name} className={styles.avatarImg} />
        ) : (
          <span className={styles.initials}>{getInitials(entry.name)}</span>
        )}
      </div>

      {/* Name */}
      <div className={styles.nameWrap}>
        <p className={styles.name}>
          {entry.name}
          {isCurrentUser && <span className={styles.youBadge}>You</span>}
        </p>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <span className={styles.statItem}>
          <span className={styles.statIcon}>🍶</span>
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

// ── Main component ────────────────────────────────────────
export default function LeaderboardList({ data }: Props) {
  // ── Sort by tokens descending (mockdata is intentionally unsorted)
  const sorted: LeaderboardEntry[] = [...data.entries].sort(
    (a, b) => b.tokens - a.tokens
  );

  // ── Find current user rank
  const currentUserRank = sorted.findIndex((e) => e.id === data.currentUserId) + 1;
  const currentUser     = sorted.find((e) => e.id === data.currentUserId);

  return (
    <div className={styles.wrap}>

      {/* ── Your rank banner ──────────────────────────── */}
      {currentUser && (
        <div className={styles.yourRankBanner}>
          <div className={styles.yourRankLeft}>
            <p className={styles.yourRankLabel}>Your ranking</p>
            <p className={styles.yourRankNum}>
              {currentUserRank === 1 ? "🥇" : currentUserRank === 2 ? "🥈" : currentUserRank === 3 ? "🥉" : ""}
              {" "}You are{" "}
              <span className={styles.yourRankBig}>
                {currentUserRank}{currentUserRank === 1 ? "st" : currentUserRank === 2 ? "nd" : currentUserRank === 3 ? "rd" : "th"}
              </span>
            </p>
          </div>
          <div className={styles.yourRankRight}>
            <span className={styles.yourStat}>🍶 {currentUser.bottles}</span>
            <span className={styles.yourStat}>🪙 {currentUser.tokens}</span>
          </div>
        </div>
      )}

      {/* ── Month label ───────────────────────────────── */}
      <p className={styles.monthLabel}>{data.month}</p>

      {/* ── Leaderboard rows ──────────────────────────── */}
      <div className={styles.list}>
        {sorted.map((entry, idx) => {
          const rank         = idx + 1;
          const isCurrentUser = entry.id === data.currentUserId;
          return (
            <LeaderRow
              key={entry.id}
              entry={entry}
              rank={rank}
              isCurrentUser={isCurrentUser}
            />
          );
        })}
      </div>

    </div>
  );
}