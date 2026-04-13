// components/layout/navConfig.ts
import { Icons } from "@/components/icon/IconExport";
import { NavItem } from "../type";


export const MENU_ITEMS: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", Icon: Icons.Dashboard       },
  { href: "/admin/data",      label: "Data",      Icon: Icons.Data            },

  { href: "/admin/overview",   label: "overview",   Icon: Icons.Leader          },
  { href: "/admin/markets",    label: "Market",    Icon: Icons.Tokens          },
];

export const GENERAL_ITEMS: NavItem[] = [
  { href: "/admin/activity-log",      label: "Activity Log",      Icon: Icons.ActivtyLog      },
  { href: "/admin/settings",          label: "Setting",           Icon: Icons.Settigs         },
  { href: "/admin/devices",           label: "Devices",           Icon: Icons.Devices         }
];

//admin side
