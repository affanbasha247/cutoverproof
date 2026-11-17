import type { LucideIcon } from "lucide-react";

type Tone = "accent" | "safe" | "danger" | "warning";

const TONE_CLASSES: Record<Tone, string> = {
  accent: "metric--accent",
  safe: "metric--safe",
  danger: "metric--danger",
  warning: "metric--warning",
};

interface MetricCardProps {
  title: string;
  value: number | string | null;
  hint: string;
  icon: LucideIcon;
  tone: Tone;
  loading?: boolean;
}

export default function MetricCard({
  title,
  value,
  hint,
  icon: Icon,
  tone,
  loading = false,
}: MetricCardProps) {
  return (
    <div className={`metric ${TONE_CLASSES[tone]}`} aria-busy={loading}>
      <p className="metric-label">
        <Icon className="metric-icon h-3.5 w-3.5" aria-hidden="true" />
        {title}
      </p>
      <div className="metric-value">
        {loading ? (
          <>
            <span className="skeleton inline-block h-8 w-14" aria-hidden="true" />
            <span className="visually-hidden">Loading</span>
          </>
        ) : (
          value ?? "Not recorded"
        )}
      </div>
      <p className="metric-hint">{hint}</p>
    </div>
  );
}
