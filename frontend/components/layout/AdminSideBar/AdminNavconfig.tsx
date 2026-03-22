// components/layout/navConfig.ts
import { ComponentType } from "react";
import { Icons } from "@/components/icon/IconExport";

type NavItem = {
  href: string;
  label: string;
  Icon: ComponentType<{ className?: string; size?: number }>;
};

export const MENU_ITEMS: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", Icon: Icons.Dashboard       },
  { href: "/admin/data",      label: "Data",      Icon: Icons.Data            },
  { href: "/admin/devices",   label: "Devices",   Icon: Icons.Devices         },
  { href: "/admin/bottles",   label: "Bottles",   Icon: Icons.Leader          },
  { href: "/admin/tokens",    label: "Tokens",    Icon: Icons.Tokens          },
];

export const GENERAL_ITEMS: NavItem[] = [
  { href: "/admin/activity-log",      label: "Activity Log",      Icon: Icons.ActivtyLog      },
  { href: "/admin/settings",          label: "Setting",           Icon: Icons.Settigs         },
];