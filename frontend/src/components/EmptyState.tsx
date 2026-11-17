import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="empty">
      <p className="empty-title">
        <Icon className="h-4 w-4 text-muted" aria-hidden="true" />
        {title}
      </p>
      <p className="empty-text">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
