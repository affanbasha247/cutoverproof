import {
  Crosshair,
  FileCode2,
  FileText,
  LayoutDashboard,
  Route,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/configuration", label: "Configuration", icon: FileCode2 },
  { to: "/simulation", label: "Attack simulation", icon: Crosshair },
  { to: "/verification", label: "Z3 verification", icon: ShieldCheck },
  { to: "/planner", label: "Deployment planner", icon: Route },
  { to: "/reports", label: "Security reports", icon: FileText },
];
