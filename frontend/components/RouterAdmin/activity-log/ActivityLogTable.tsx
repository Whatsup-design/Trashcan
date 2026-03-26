// components/activity-log/ActivityLogTable.tsx
// ─────────────────────────────────────────────────────────
// ตาราง Activity Log — ID, Name, Action, Time, Token, Gram
// มี search + sort + pagination
// ข้อมูลจะถูกล้างทุกวัน (daily reset)
// "use client" เพราะมี state search/sort/pagination
// ─────────────────────────────────────────────────────────
"use client";

import { useState, useMemo } from "react";
import styles from "./ActivityLogTable.module.css";
import { type ActivityLog } from "@/types/AdminTypes";

// ── Type ──────────────────────────────────────────────────


type SortKey = keyof ActivityLog;
type SortDir = "asc" | "desc";

type Props = {
  data: ActivityLog[];
  date: string; // วันที่แสดง เช่น "2025-03-22"
};

export default function ActivityLogTable({ data, date }: Props) {
  const [search,  setSearch]  = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("time");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page,    setPage]    = useState(1);
  const PER_PAGE = 15;

  // ── Sort handler ──────────────────────────────────────
  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  }

  function sortIcon(key: SortKey) {
    if (sortKey !== key) return " ↕";
    return sortDir === "asc" ? " ↑" : " ↓";
  }

  // ── Filter + Sort ─────────────────────────────────────
  const filtered = useMemo(() => {
    let rows = [...data];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.studentId.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.action.toLowerCase().includes(q)
      );
    }

    // Sort
    rows.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });

    return rows;
  }, [data, search, sortKey, sortDir]);

  // ── Pagination ────────────────────────────────────────
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // ── Summary stats ─────────────────────────────────────
  const totalTokens = data.reduce((s, r) => s + r.tokenReceived, 0);
  const totalGrams  = data.reduce((s, r) => s + r.gramOfBottle, 0);

  return (
    <div className={styles.wrap}>

      {/* ── Date + summary ──────────────────────────── */}
      <div className={styles.topBar}>
        <div className={styles.dateWrap}>
          <span className={styles.dateIcon}>📅</span>
          <p className={styles.date}>{date}</p>
          <span className={styles.dateBadge}>Today</span>
        </div>

        {/* Summary stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <p className={styles.statVal}>{data.length}</p>
            <p className={styles.statLabel}>Actions</p>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <p className={styles.statVal}>{totalTokens}</p>
            <p className={styles.statLabel}>Tokens Given</p>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <p className={styles.statVal}>{totalGrams}g</p>
            <p className={styles.statLabel}>Total Weight</p>
          </div>
        </div>
      </div>

      {/* ── Search ──────────────────────────────────── */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className={styles.search}
            type="text"
            placeholder="Search ID, name, action..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <p className={styles.count}>{filtered.length} records</p>
      </div>

      {/* ── Table ───────────────────────────────────── */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => handleSort("studentId")} className={styles.sortable}>
                Student ID{sortIcon("studentId")}
              </th>
              <th onClick={() => handleSort("name")} className={styles.sortable}>
                Name{sortIcon("name")}
              </th>
              <th onClick={() => handleSort("action")} className={styles.sortable}>
                Action{sortIcon("action")}
              </th>
              <th onClick={() => handleSort("time")} className={styles.sortable}>
                Time{sortIcon("time")}
              </th>
              <th onClick={() => handleSort("tokenReceived")} className={styles.sortable}>
                Tokens{sortIcon("tokenReceived")}
              </th>
              <th onClick={() => handleSort("gramOfBottle")} className={styles.sortable}>
                Weight (g){sortIcon("gramOfBottle")}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.empty}>No records found</td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr key={row.id}>
                  <td className={styles.mono}>{row.studentId}</td>
                  <td className={styles.nameCell}>{row.name}</td>
                  <td>
                    <span className={`${styles.actionBadge} ${
                      row.action.includes("collected") ? styles.collected :
                      row.action.includes("redeemed")  ? styles.redeemed  : styles.other
                    }`}>
                      {row.action}
                    </span>
                  </td>
                  <td className={styles.timeCell}>{row.time}</td>
                  <td className={styles.tokenCell}>+{row.tokenReceived}</td>
                  <td className={styles.gramCell}>{row.gramOfBottle}g</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ──────────────────────────────── */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >←</button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`${styles.pageBtn} ${p === page ? styles.activePage : ""}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}

          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >→</button>
        </div>
      )}

    </div>
  );
}