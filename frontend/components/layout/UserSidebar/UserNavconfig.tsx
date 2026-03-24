// components/layout/UserNavconfig.ts
// ─────────────────────────────────────────────────────────
// Nav config สำหรับ user sidebar
// แยกออกจาก Navconfig.ts (admin) เพื่อไม่ให้ปนกัน
// ─────────────────────────────────────────────────────────

import { ComponentType } from "react";
import { Icons } from "@/components/icon/IconExport";
import { NavItem } from "../type";


export const USER_MENU_ITEMS: NavItem[] = [
  { href: "/user/dashboard",    label: "Dashboard",       Icon: Icons.Dashboard  },
  { href: "/user/tokenmarket", label: "Token & Market",  Icon: Icons.Tokens     },
  { href: "/user/leaderboard",  label: "Leaderboard",     Icon: Icons.Leader     },
  { href: "/user/about",        label: "About",           Icon: Icons.Info    },
];

export const USER_GENERAL_ITEMS: NavItem[] = [
  { href: "/user/settings", label: "Settings", Icon: Icons.Settigs },
];
//user side