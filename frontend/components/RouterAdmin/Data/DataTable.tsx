// components/data/DataTable.tsx
// ─────────────────────────────────────────────────────────
// Table แสดงข้อมูล RFID พร้อม Search, Sort, Filter, Pagination
// "use client" จำเป็นเพราะมี state ทั้งหมด
// ─────────────────────────────────────────────────────────
"use client";

import { useState, useMemo } from "react";
import styles from "./DataTable.module.css";

// ── Type ──────────────────────────────────────────────────
import {type DataRow} from "@/types/AdminTypes"; // นำเข้า type จาก AdminTypes.tsx

type SortKey = keyof DataRow;
type SortDir = "asc" | "desc";

type DataTableProps = {
  data: DataRow[];
};

export default function DataTable({ data }: DataTableProps) {
  // ── States ───────────────────────────────────────────────
  const [search, setSearch]         = useState("");         // คำค้นหา
  const [sortKey, setSortKey]       = useState<SortKey>("studentId"); // column ที่ sort
  const [sortDir, setSortDir]       = useState<SortDir>("asc");       // ทิศทาง sort
  const [filterBottles, setFilterBottles] = useState("all"); // filter ขวด
  const [page, setPage]             = useState(1);          // หน้าปัจจุบัน
  const PER_PAGE = 10;                                       // จำนวนแถวต่อหน้า

  // ── Sort handler — คลิก header เพื่อ sort ───────────────
  function handleSort(key: SortKey) {
    if (sortKey === key) {
      // ถ้า sort column เดิม → สลับทิศทาง
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      // ถ้า sort column ใหม่ → เริ่มจาก asc
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1); // กลับหน้า 1 เมื่อ sort ใหม่
  }

  // ── Filter + Search + Sort (useMemo = คำนวณใหม่เฉพาะเมื่อ dependency เปลี่ยน)
  const filtered = useMemo(() => {
    let rows = [...data];

    // 1. Search — ค้นหาทุก column
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.rfidUid.toLowerCase().includes(q) ||
          r.studentId.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q)
      );
    }

    // 2. Filter ตาม bottles
    if (filterBottles === "high") rows = rows.filter((r) => r.bottles >= 50);
    if (filterBottles === "mid")  rows = rows.filter((r) => r.bottles >= 10 && r.bottles < 50);
    if (filterBottles === "low")  rows = rows.filter((r) => r.bottles < 10);

    // 3. Sort
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

  // ── Pagination ────────────────────────────────────────────
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  // slice ข้อมูลตามหน้าปัจจุบัน
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // ── Sort icon helper ──────────────────────────────────────
  function sortIcon(key: SortKey) {
    if (sortKey !== key) return " ↕";
    return sortDir === "asc" ? " ↑" : " ↓";
  }

  return (
    <div className={styles.wrap}>

      {/* ── Toolbar: Search + Filter ─────────────────────── */}
      <div className={styles.toolbar}>
        {/* Search input */}
        <input
          className={styles.search}
          type="text"
          placeholder="Search RFID, Student ID, Name..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />

        {/* Filter dropdown */}
        <select
          className={styles.filter}
          value={filterBottles}
          onChange={(e) => { setFilterBottles(e.target.value); setPage(1); }}
        >
          <option value="all">All Bottles</option>
          <option value="high">High (50+)</option>
          <option value="mid">Mid (10–49)</option>
          <option value="low">Low (0–9)</option>
        </select>
      </div>

      {/* ── Result count ─────────────────────────────────── */}
      <p className={styles.count}>
        {filtered.length} result{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* ── Table ────────────────────────────────────────── */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {/* คลิก header เพื่อ sort */}
              <th onClick={() => handleSort("rfidUid")}   className={styles.sortable}>RFID UID{sortIcon("rfidUid")}</th>
              <th onClick={() => handleSort("studentId")} className={styles.sortable}>Student ID{sortIcon("studentId")}</th>
              <th onClick={() => handleSort("name")}      className={styles.sortable}>Name{sortIcon("name")}</th>
              <th onClick={() => handleSort("bottles")}   className={styles.sortable}>Bottles{sortIcon("bottles")}</th>
              <th onClick={() => handleSort("tokens")}    className={styles.sortable}>Tokens{sortIcon("tokens")}</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              // ไม่มีข้อมูล
              <tr>
                <td colSpan={5} className={styles.empty}>No results found</td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr key={row.id}>
                  <td className={styles.mono}>{row.rfidUid}</td>
                  <td className={styles.mono}>{row.studentId}</td>
                  <td>{row.name}</td>
                  <td>
                    {/* Badge สีตามจำนวนขวด */}
                    <span className={`${styles.badge} ${
                      row.bottles >= 50 ? styles.high :
                      row.bottles >= 10 ? styles.mid  : styles.low
                    }`}>
                      {row.bottles}
                    </span>
                  </td>
                  <td className={styles.tokens}>{row.tokens}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ───────────────────────────────────── */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {/* ปุ่ม Previous */}
          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ←
          </button>

          {/* ปุ่มเลขหน้า */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`${styles.pageBtn} ${p === page ? styles.activePage : ""}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}

          {/* ปุ่ม Next */}
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