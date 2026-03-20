// components/layout/Search/SearchBar.tsx
// ─────────────────────────────────────────────────────────
// Search button + animated expand input
// ปกติ = icon button
// คลิก = expand เป็น input bar animation
// คลิกนอก / Escape / X = กลับเป็น icon
// ─────────────────────────────────────────────────────────
"use client";

import { useEffect } from "react";
import { useSearch } from "./UseSearch";
import styles from "./Searchbar.module.css";

export default function SearchBar() {
  const {
    isOpen, query, setQuery,
    inputRef, toggle, close, handleKeyDown,
  } = useSearch();

  // ── ปิดเมื่อคลิกนอก search bar ───────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // ถ้าคลิกอยู่ใน .searchWrap → ไม่ปิด
      if (target.closest(`.${styles.searchWrap}`)) return;
      close();
    };
    // delay ป้องกัน close ทันทีตอน open
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handler);
    }, 50);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handler);
    };
  }, [isOpen, close]);

  return (
    <div className={styles.searchWrap}>

      {/* ── Collapsed: icon button ────────────────────── */}
      {/* แสดงเฉพาะตอนปิด */}
      {!isOpen && (
        <button
          className={styles.iconBtn}
          aria-label="Search"
          onClick={toggle}
        >
          <SearchIcon />
        </button>
      )}

      {/* ── Expanded: input bar ───────────────────────── */}
      {/* animate expand ด้วย CSS transition */}
      <div className={`${styles.inputWrap} ${isOpen ? styles.inputOpen : ""}`}>
        {/* Search icon ซ้ายใน input */}
        <span className={styles.inputIcon}>
          <SearchIcon />
        </span>

        {/* Input */}
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Search"
        />

        {/* Close button */}
        <button
          className={styles.closeBtn}
          onClick={close}
          aria-label="Close search"
          type="button"
          tabIndex={isOpen ? 0 : -1}
        >
          <CloseIcon />
        </button>
      </div>

    </div>
  );
}

// ── Icon components (inline SVG) ─────────────────────────
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}