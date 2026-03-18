"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./Sidebar.module.css";
import { MENU_ITEMS, GENERAL_ITEMS } from "./Navconfig";
import { NavItem } from "./SidebarItem";
import { Icons } from "@/components/icon/IconExport";
import Image from "next/image";

// ── Logo ──────────────────────────────────────────────────
function LogoMark() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/IconLogo.jpg"
      alt="Trashcan Smart"
      className={styles.logoWrap}
    />
  );
}

// ── Sidebar ───────────────────────────────────────────────
export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile]     = useState(false);
  const sidebarRef                  = useRef<HTMLElement>(null);
  // ตรวจสอบขนาดหน้าจอและตั้งค่า isMobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  // ปิด sidebar เมื่อคลิกนอกพื้นที่ (เฉพาะบนมือถือ)
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
  // if not mobile, ensure sidebar is open
  const sidebarClass = [
    styles.sidebar,
    mobileOpen ? styles.mobileOpen : "",
  ].join(" ");
  // relate to stype


  return (
    <>
      {/* ── Mobile hamburger ── */}
      <button
        className={styles.hamburger}
        onClick={(e) => {
                        e.stopPropagation();
                        setMobileOpen((o) => !o)}}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <Icons.Close size={14} /> : <Icons.Menu size={20} />}
      </button>
        {/* Mobile : set for iconclose or Iconmenu ( Hamburgur ) */}
      {/* ── Mobile backdrop ── */}
      {isMobile && mobileOpen && (
        <div
          className={styles.overlay}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar panel ── */}
      <aside ref={sidebarRef} className={sidebarClass}>
        <div className={styles.inner}>

          {/* Brand */}
          <div className={styles.brand}>
            <LogoMark />
            <div className={styles.brandText}>
        
            </div>
          </div>

          {/* MENU section */}
          <div className={styles.section}>
            <p className={styles.sectionLabel}>Menu</p>
            {MENU_ITEMS.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </div>

          <div className={styles.divider} />

          {/* GENERAL section */}
          <div className={styles.generalSection}>
            <p className={styles.sectionLabel}>General</p>
            {GENERAL_ITEMS.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </div>

          {/* Admin badge */}
          <div className={styles.adminBadge}>
            <div className={styles.adminBadgeInner}>
              <div className={styles.adminAvatar}>AD</div>
              <div className={styles.adminInfo}>
                <p className={styles.adminName}>Admin Panel</p>
                <p className={styles.adminRole}>Full Access</p>
              </div>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
}