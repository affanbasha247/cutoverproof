import {
  Activity,
  Database,
  FlaskConical,
  GitBranch,
  RefreshCw,
  Server,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import EmptyState from "../components/EmptyState";
import ErrorPanel from "../components/ErrorPanel";
import MetricCard from "../components/MetricCard";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { useApi } from "../hooks/useApi";
import { formatDateTime } from "../services/format";
import type {
  HealthResponse,
  OverviewResponse,
  SecurityStatus,
} from "../types/api";

const STATUS_SUMMARY: Record<
  SecurityStatus,
  { title: string; description: string }
> = {
  no_data: {
    title: "No verification evidence yet",
    description:
      "The dashboard is connected to the API, but no stored analysis report exists. Metrics remain at zero until a real verification run writes a report.",
  },
  safe: {
    title: "No modeled attack path remains",
    description:
      "Stored reports found no surviving unauthorized path within the modeled AWS subset. This is a model-scoped result, not proof of the live account.",
  },
  at_risk: {
    title: "Surviving access was detected",
    description:
      "At least one stored analysis found an unauthorized capability that outlived the intended cutover. Review the affected report before deploying.",
  },
  unknown: {
    title: "Results need classification",
    description:
      "Report files exist but do not contain a recognized security status. Treat them as unverified until the producing engine is upgraded.",
  },
};

const PIPELINE = [
  { label: "Read configuration", phase: "Phase 2", tone: "info" },
  { label: "Simulate attack paths", phase: "Phase 2 to 4", tone: "info" },
  { label: "Verify with Z3", phase: "Phase 3", tone: "verify" },
  { label: "Plan safe order", phase: "Phase 5", tone: "warning" },
  { label: "Write report", phase: "Phase 6", tone: "accent" },
];

const STATUS_SCALE = [
  { key: "safe", label: "Safe", className: "scale-safe" },
  { key: "at_risk", label: "At risk", className: "scale-at_risk" },
  { key: "unknown", label: "Unknown", className: "scale-unknown" },
  { key: "no_data", label: "No data", className: "scale-no_data" },
];

export default function OverviewPage() {
  const overview = useApi<OverviewResponse>("/overview");
  const health = useApi<HealthResponse>("/health");
  const [lastChecked, setLastChecked] = useState<string | null>(null);

  useEffect(() => {
    if (health.data) {
      setLastChecked(new Date().toISOString());
    }
  }, [health.data]);

  const status: SecurityStatus = overview.data?.security_status ?? "no_data";
  const summary = STATUS_SUMMARY[status];

  function refreshAll() {
    overview.refetch();
    health.refetch();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Cutover security overview"
        description="Evidence from local IAM cutover analyses. Every figure below is computed from stored reports; no demonstration metrics are seeded."
        action={
          <button
            type="button"
            className="key"
            onClick={refreshAll}
            disabled={overview.loading || health.loading}
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Refresh
          </button>
        }
      />

      {overview.error ? (
        <ErrorPanel message={overview.error} onRetry={overview.refetch} />
      ) : null}

      <section className="panel panel--graphite p-5 sm:p-6 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
          <div>
            <p className="text-sm text-graphite-muted">
              Current status:{" "}
              <span className="font-medium text-graphite-ink">
                {status === "no_data"
                  ? "No data"
                  : status === "at_risk"
                    ? "At risk"
                    : status === "safe"
                      ? "Safe"
                      : "Unknown"}
              </span>
            </p>
            <h2 className="mt-3 max-w-[24ch] text-2xl font-semibold text-graphite-ink sm:text-3xl">
              {summary.title}
            </h2>
            <p className="mt-3 max-w-[62ch] text-sm leading-6 text-graphite-muted">
              {summary.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Local simulation", "No AWS calls", "Report-derived metrics"].map(
                (label) => (
                  <span key={label} className="tag">
                    {label}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="border-t border-graphite-2 pt-5 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
            <div className="flex items-center gap-2 text-graphite-muted">
              <Database className="h-4 w-4" aria-hidden="true" />
              <p className="text-sm font-medium text-graphite-ink">Evidence source</p>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-graphite-muted">Report store</dt>
                <dd className="font-mono text-xs text-accent-2">data/reports</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-graphite-muted">Recorded scenarios</dt>
                <dd className="text-graphite-ink">
                  {overview.loading
                    ? "Loading"
                    : overview.data?.scenarios_tested ?? "Not recorded"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-graphite-2 pt-3">
                <dt className="text-graphite-muted">Aggregate status</dt>
                <dd className="text-graphite-ink">
                  {status === "no_data"
                    ? "No data"
                    : status === "at_risk"
                      ? "At risk"
                      : status === "safe"
                        ? "Safe"
                        : "Unknown"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="status-scale mt-6" aria-label="Security status scale">
          {STATUS_SCALE.map((item) => (
            <span
              key={item.key}
              className={`${item.className} ${status === item.key ? "is-active" : ""}`}
            >
              {item.label}
            </span>
          ))}
        </div>
      </section>

      <section aria-label="Security metrics">
        <div className="metric-grid">
          <MetricCard
            title="Scenarios tested"
            value={overview.data?.scenarios_tested ?? null}
            hint="Scenario count recorded by stored analyses."
            icon={FlaskConical}
            tone="accent"
            loading={overview.loading}
          />
          <MetricCard
            title="Safe transitions"
            value={overview.data?.safe_transitions ?? null}
            hint="Reports whose modeled cutover left no unauthorized path."
            icon={ShieldCheck}
            tone="safe"
            loading={overview.loading}
          />
          <MetricCard
            title="Unsafe transitions"
            value={overview.data?.unsafe_transitions ?? null}
            hint="Reports that detected a surviving unauthorized capability."
            icon={ShieldAlert}
            tone="danger"
            loading={overview.loading}
          />
          <MetricCard
            title="Attack paths"
            value={overview.data?.attack_paths ?? null}
            hint="Concrete paths recorded across stored analysis reports."
            icon={GitBranch}
            tone="warning"
            loading={overview.loading}
          />
        </div>
      </section>

      <section className="panel">
        <div className="grid lg:grid-cols-[1.5fr_1fr]">
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="section-title">Latest analysis</h2>
              <Activity className="h-4 w-4 text-muted" aria-hidden="true" />
            </div>
            <div className="mt-4">
              {overview.loading ? (
                <div className="space-y-3">
                  <div className="skeleton h-4 w-2/3" />
                  <div className="skeleton h-4 w-1/2" />
                  <div className="skeleton h-16 w-full" />
                </div>
              ) : overview.data?.latest_activity ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="item-title">
                        {overview.data.latest_activity.title}
                      </p>
                      <p className="mt-1 font-mono text-xs text-muted">
                        {overview.data.latest_activity.report_id}
                      </p>
                    </div>
                    <StatusBadge
                      status={overview.data.latest_activity.security_status}
                    />
                  </div>
                  <p className="text-xs text-muted">
                    {formatDateTime(overview.data.latest_activity.created_at)}
                  </p>
                  <Link to="/reports" className="key">
                    Open reports
                  </Link>
                </div>
              ) : (
                <EmptyState
                  icon={Activity}
                  title="No analysis activity"
                  description="When a verification run writes a report to data/reports, its title, status, and timestamp will appear here."
                />
              )}
            </div>
          </div>

          <div className="border-t border-rule p-5 sm:p-6 lg:border-l lg:border-t-0">
            <div className="flex items-center justify-between gap-4">
              <h2 className="section-title">API health</h2>
              <Server className="h-4 w-4 text-muted" aria-hidden="true" />
            </div>
            <div className="mt-4">
              {health.loading ? (
                <div className="space-y-3">
                  <div className="skeleton h-4 w-1/2" />
                  <div className="skeleton h-4 w-2/3" />
                  <div className="skeleton h-4 w-1/2" />
                </div>
              ) : health.error ? (
                <div className="space-y-3">
                  <p className="text-sm text-error">Backend unreachable</p>
                  <p className="text-xs leading-5 text-muted">{health.error}</p>
                  <button type="button" className="key" onClick={health.refetch}>
                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                    Retry
                  </button>
                </div>
              ) : health.data ? (
                <dl className="space-y-2.5 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted">Status</dt>
                    <dd className="status-line" data-status="safe">
                      Operational
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted">Service</dt>
                    <dd className="font-mono text-xs text-ink">
                      {health.data.service}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted">Version</dt>
                    <dd className="font-mono text-xs text-ink">
                      {health.data.version}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted">Mode</dt>
                    <dd className="text-ink">{health.data.mode}</dd>
                  </div>
                  <div className="border-t border-rule pt-3 text-xs text-muted">
                    Checked {formatDateTime(lastChecked)}
                  </div>
                </dl>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="panel p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="section-title">How a cutover result is produced</h2>
            <p className="mt-1 text-sm text-muted">
              Five stages from configuration read to stored evidence.
            </p>
          </div>
          <span className="tag">Phase 1 scaffold</span>
        </div>

        <ol className="trace mt-5">
          {PIPELINE.map((step, index) => (
            <li key={step.label} className="trace-stage" data-tone={step.tone}>
              <span className="trace-index">{String(index + 1).padStart(2, "0")}</span>
              <p className="trace-title">{step.label}</p>
              <p className="trace-phase">{step.phase}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
