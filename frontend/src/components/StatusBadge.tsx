import {
  AlertTriangle,
  Check,
  CircleHelp,
  Minus,
  type LucideIcon,
} from "lucide-react";

import type { SecurityStatus } from "../types/api";

const STATUS_STYLES: Record<
  SecurityStatus,
  { label: string; icon: LucideIcon }
> = {
  safe: { label: "Safe", icon: Check },
  at_risk: { label: "At risk", icon: AlertTriangle },
  unknown: { label: "Unknown", icon: CircleHelp },
  no_data: { label: "No data", icon: Minus },
};

function normaliseStatus(status: string | null | undefined): SecurityStatus {
  if (status === "safe" || status === "at_risk" || status === "unknown") {
    return status;
  }
  if (status === "unsafe") {
    return "at_risk";
  }
  return "no_data";
}

interface StatusBadgeProps {
  status: string | null | undefined;
  label?: string;
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const normalised = normaliseStatus(status);
  const style = STATUS_STYLES[normalised];
  const Icon = style.icon;

  return (
    <span className="status-line" data-status={normalised}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label ?? style.label}
    </span>
  );
}
