// components/layout/Sidebar.tsx
// ─────────────────────────────────────────────────────────
// Sidebar ใช้ร่วมกันทั้ง admin และ user
// ส่ง role="admin" หรือ role="user" เพื่อเลือก nav items
// ─────────────────────────────────────────────────────────
"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./Sidebar.module.css";
import { MENU_ITEMS, GENERAL_ITEMS }           from "./AdminSideBar/AdminNavconfig";
import { USER_MENU_ITEMS, USER_GENERAL_ITEMS } from "./UserSidebar/UserNavconfig";
import { NavItem } from "./SidebarItem";
import { Icons } from "@/components/icon/IconExport";

// ── Props ─────────────────────────────────────────────────
type Props = {
  role?: "admin" | "user"; // default = admin
};

// ── Logo ──────────────────────────────────────────────────
function LogoMark() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/enviroment_Logo.jpg"
      alt="Trashcan Smart"
      className={styles.logoMark}
    />
  );
}

// ── Sidebar ───────────────────────────────────────────────
export default function Sidebar({ role = "admin" }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile,   setIsMobile]   = useState(false);
  const sidebarRef                  = useRef<HTMLElement>(null);

  // ── เลือก nav items ตาม role ──────────────────────────
  const menuItems    = role === "admin" ? MENU_ITEMS    : USER_MENU_ITEMS;
  const generalItems = role === "admin" ? GENERAL_ITEMS : USER_GENERAL_ITEMS;

  // ── badge ตาม role ─────────────────────────────────────
  const badgeChar  = role === "admin" ? "AD" : "U";
  const badgeName  = role === "admin" ? "Admin Panel"   : "User Account";
  const badgeRole  = role === "admin" ? "Full Access"   : "Student";

  // ── เช็คขนาดหน้าจอ ────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── ปิดเมื่อคลิกนอก (mobile) ─────────────────────────
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileOpen]);

  const sidebarClass = [
    styles.sidebar,
    mobileOpen ? styles.mobileOpen : "",
  ].join(" ");

  return (
    <>
      {/* ── Mobile hamburger ───────────────────────────── */}
      <button
        className={styles.hamburger}
        onClick={(e) => { e.stopPropagation(); setMobileOpen((o) => !o); }}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <Icons.Close size={14} /> : <Icons.Menu size={20} />}
      </button>

      {/* ── Mobile backdrop ────────────────────────────── */}
      {isMobile && mobileOpen && (
        <div className={styles.overlay} onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Sidebar panel ──────────────────────────────── */}
      <aside ref={sidebarRef} className={sidebarClass}>
        <div className={styles.inner}>

          {/* Brand / Logo */}
          <div className={styles.brand}>
            <LogoMark />
            
          </div>

          {/* MENU section */}
          <div className={styles.section}>
            <p className={styles.sectionLabel}>Menu</p>
            {menuItems.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </div>

          <div className={styles.divider} />

          {/* GENERAL section */}
          <div className={styles.generalSection}>
            <p className={styles.sectionLabel}>General</p>
            {generalItems.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </div>

          {/* Badge — แสดงตาม role */}
          <div className={styles.adminBadge}>
            <div className={styles.adminBadgeInner}>
              <div className={styles.adminAvatar}>{badgeChar}</div>
              <div className={styles.adminInfo}>
                <p className={styles.adminName}>{badgeName}</p>
                <p className={styles.adminRole}>{badgeRole}</p>
              </div>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
}