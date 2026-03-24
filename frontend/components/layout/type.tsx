import { ComponentType } from "react";

export type NavItem = {
  href: string;
  label: string;
  Icon: ComponentType<{ className?: string; size?: number }>;
  onClick?: () => void; // optional click handler (e.g. for logout)
};