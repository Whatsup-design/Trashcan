// components/layout/Search/useSearch.ts
// ─────────────────────────────────────────────────────────
// Custom hook จัดการ search state และ animation
// แยกออกมาเพื่อให้ SearchBar.tsx อ่านง่าย
// ─────────────────────────────────────────────────────────
"use client";

import { useState, useRef, useCallback } from "react";

export function useSearch() {
  const [isOpen,  setIsOpen]  = useState(false); // expanded หรือเปล่า
  const [query,   setQuery]   = useState("");     // ค่าใน input
  const inputRef              = useRef<HTMLInputElement>(null);

  // ── เปิด search bar + focus input ─────────────────────
  const open = useCallback(() => {
    setIsOpen(true);
    // delay นิดนึงรอ animation expand ก่อน focus
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  // ── ปิด search bar + clear query ──────────────────────
  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  // ── toggle เปิด/ปิด ───────────────────────────────────
  const toggle = useCallback(() => {
    if (isOpen) close();
    else open();
  }, [isOpen, open, close]);

  // ── handle keyboard ───────────────────────────────────
  // กด Escape → ปิด
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") close();
  }, [close]);

  return {
    isOpen,
    query,
    setQuery,
    inputRef,
    open,
    close,
    toggle,
    handleKeyDown,
  };
}