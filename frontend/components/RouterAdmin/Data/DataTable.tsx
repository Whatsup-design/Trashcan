"use client";

import { useMemo, useState } from "react";

import type { DataRow } from "@/lib/mockData/admin/Data";

import styles from "./DataTable.module.css";

type SortKey = keyof DataRow;
type SortDir = "asc" | "desc";

type DataTableProps = {
  data: DataRow[];
};

export default function DataTable({ data }: DataTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("Student_ID");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [filterBottles, setFilterBottles] = useState("all");
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  const filtered = useMemo(() => {
    let rows = [...data];

    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          String(r.RFID_ID).toLowerCase().includes(q) ||
          String(r.Student_ID).toLowerCase().includes(q) ||
          r.Student_Name.toLowerCase().includes(q)
      );
    }

    if (filterBottles === "high") {
      rows = rows.filter((r) => r.Student_Bottles >= 50);
    }
    if (filterBottles === "mid") {
      rows = rows.filter(
        (r) => r.Student_Bottles >= 10 && r.Student_Bottles < 50
      );
    }
    if (filterBottles === "low") {
      rows = rows.filter((r) => r.Student_Bottles < 10);
    }

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
  }, [data, search, filterBottles, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function sortIcon(key: SortKey) {
    if (sortKey !== key) return " ↕";
    return sortDir === "asc" ? " ↑" : " ↓";
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <input
          className={styles.search}
          type="text"
          placeholder="Search RFID, Student ID, Name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className={styles.filter}
          value={filterBottles}
          onChange={(e) => {
            setFilterBottles(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All Bottles</option>
          <option value="high">High (50+)</option>
          <option value="mid">Mid (10-49)</option>
          <option value="low">Low (0-9)</option>
        </select>
      </div>

      <p className={styles.count}>
        {filtered.length} result{filtered.length !== 1 ? "s" : ""}
      </p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th
                onClick={() => handleSort("RFID_ID")}
                className={styles.sortable}
              >
                RFID UID{sortIcon("RFID_ID")}
              </th>
              <th
                onClick={() => handleSort("Student_ID")}
                className={styles.sortable}
              >
                Student ID{sortIcon("Student_ID")}
              </th>
              <th
                onClick={() => handleSort("Student_Name")}
                className={styles.sortable}
              >
                Name{sortIcon("Student_Name")}
              </th>
              <th
                onClick={() => handleSort("Student_Bottles")}
                className={styles.sortable}
              >
                Bottles{sortIcon("Student_Bottles")}
              </th>
              <th
                onClick={() => handleSort("Student_Tokens")}
                className={styles.sortable}
              >
                Tokens{sortIcon("Student_Tokens")}
              </th>
              <th
                onClick={() => handleSort("Student_weight")}
                className={styles.sortable}
              >
                Weight{sortIcon("Student_weight")}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  No results found
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr key={row.Student_ID}>
                  <td className={styles.mono}>{row.RFID_ID}</td>
                  <td className={styles.mono}>{row.Student_ID}</td>
                  <td>{row.Student_Name}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        row.Student_Bottles >= 50
                          ? styles.high
                          : row.Student_Bottles >= 10
                            ? styles.mid
                            : styles.low
                      }`}
                    >
                      {row.Student_Bottles}
                    </span>
                  </td>
                  <td className={styles.tokens}>{row.Student_Tokens}</td>
                  <td>{row.Student_weight}</td>
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
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ←
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`${styles.pageBtn} ${
                p === page ? styles.activePage : ""
              }`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}

          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
