// app/user/leaderboard/page.tsx
import { leaderboardData } from "@/lib/mockData/user/Leaderboard";
import LeaderboardList     from "@/components/RouterUser/Leaderboard/Leaderboard";
import styles              from "./page.module.css";

export default function LeaderboardPage() {
  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Leaderboard</h1>
        <p className={styles.sub}>Monthly ranking — sorted by tokens</p>
      </div>
      <LeaderboardList data={leaderboardData} />
    </div>
  );
}