"use client";

import { useMemo, useState } from "react";
import styles from "./ActivityLogTable.module.css";
import { type ActivityLog } from "@/lib/mockData/admin/ActivityLog";

type SortKey = keyof ActivityLog;
type SortDir = "asc" | "desc";

type Props = {
  data: ActivityLog[];
  date: string;
};

export default function ActivityLogTable({ data, date }: Props) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  function sortIcon(key: SortKey) {
    if (sortKey !== key) return " ↕";
    return sortDir === "asc" ? " ↑" : " ↓";
  }

  function formatTime(timestamp: string) {
    const parsed = new Date(timestamp);
    if (Number.isNaN(parsed.getTime())) {
      return timestamp;
    }

    return parsed.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const rows = [...data];

    const searched = query
      ? rows.filter((row) =>
          String(row.Student_ID).toLowerCase().includes(query) ||
          row.Student_Name.toLowerCase().includes(query) ||
          row.action.toLowerCase().includes(query)
        )
      : rows;

    searched.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];

      if (sortKey === "created_at") {
        const aTime = new Date(String(av)).getTime();
        const bTime = new Date(String(bv)).getTime();
        return sortDir === "asc" ? aTime - bTime : bTime - aTime;
      }

      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }

      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });

    return searched;
  }, [data, search, sortDir, sortKey]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalTokens = data.reduce((sum, row) => sum + row.tokens, 0);
  const totalGrams = data.reduce((sum, row) => sum + row.weight, 0);

  return (
    <div className={styles.wrap}>
      <div className={styles.topBar}>
        <div className={styles.dateWrap}>
          <span className={styles.dateIcon}>📅</span>
          <p className={styles.date}>{date}</p>
          <span className={styles.dateBadge}>Today</span>
        </div>

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

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className={styles.search}
            type="text"
            placeholder="Search ID, name, action..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <p className={styles.count}>{filtered.length} records</p>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => handleSort("Student_ID")} className={styles.sortable}>
                Student ID{sortIcon("Student_ID")}
              </th>
              <th onClick={() => handleSort("Student_Name")} className={styles.sortable}>
                Name{sortIcon("Student_Name")}
              </th>
              <th onClick={() => handleSort("action")} className={styles.sortable}>
                Action{sortIcon("action")}
              </th>
              <th onClick={() => handleSort("created_at")} className={styles.sortable}>
                Time{sortIcon("created_at")}
              </th>
              <th onClick={() => handleSort("tokens")} className={styles.sortable}>
                Tokens{sortIcon("tokens")}
              </th>
              <th onClick={() => handleSort("weight")} className={styles.sortable}>
                Weight (g){sortIcon("weight")}
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
                <tr key={`${row.Student_ID}-${row.created_at}`}>
                  <td className={styles.mono}>{row.Student_ID}</td>
                  <td className={styles.nameCell}>{row.Student_Name}</td>
                  <td>
                    <span
                      className={`${styles.actionBadge} ${
                        row.action === "Bottle collected"
                          ? styles.collected
                          : row.action === "Tokens redeemed"
                            ? styles.redeemed
                            : styles.other
                      }`}
                    >
                      {row.action}
                    </span>
                  </td>
                  <td className={styles.timeCell}>{formatTime(row.created_at)}</td>
                  <td
                    className={`${styles.tokenCell} ${
                      row.tokens >= 0 ? styles.tokenPositive : styles.tokenNegative
                    }`}
                  >
                    {row.tokens > 0 ? `+${row.tokens}` : row.tokens}
                  </td>
                  <td className={styles.gramCell}>{row.weight}g</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
          >
            ←
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((currentPage) => (
            <button
              key={currentPage}
              className={`${styles.pageBtn} ${currentPage === page ? styles.activePage : ""}`}
              onClick={() => setPage(currentPage)}
            >
              {currentPage}
            </button>
          ))}

          <button
            className={styles.pageBtn}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
