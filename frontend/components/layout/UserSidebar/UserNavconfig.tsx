// components/layout/UserNavconfig.ts
// ─────────────────────────────────────────────────────────
// Nav config สำหรับ user sidebar
// แยกออกจาก Navconfig.ts (admin) เพื่อไม่ให้ปนกัน
// ─────────────────────────────────────────────────────────

import { ComponentType } from "react";
import { Icons } from "@/components/icon/IconExport";

type NavItem = {
  href: string;
  label: string;
  Icon: ComponentType<{ className?: string; size?: number }>;
};

export const USER_MENU_ITEMS: NavItem[] = [
  { href: "/user/dashboard",    label: "Dashboard",       Icon: Icons.Dashboard  },
  { href: "/user/token-market", label: "Token & Market",  Icon: Icons.Tokens     },
  { href: "/user/leaderboard",  label: "Leaderboard",     Icon: Icons.Data       },
  { href: "/user/about",        label: "About",           Icon: Icons.Devices    },
];

export const USER_GENERAL_ITEMS: NavItem[] = [
  { href: "/user/settings", label: "Settings", Icon: Icons.Settigs },
];