import { Download, ExternalLink, FileText, FolderOpen, RefreshCw } from "lucide-react";

import EmptyState from "../components/EmptyState";
import ErrorPanel from "../components/ErrorPanel";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { useApi } from "../hooks/useApi";
import { formatDateTime } from "../services/format";
import type { ReportListResponse } from "../types/api";

export default function ReportsPage() {
  const { data, loading, error, refetch } = useApi<ReportListResponse>("/reports");
  const reports = data?.reports ?? [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Security reports"
        description="Local analysis reports discovered on disk. Report generation and structured export arrive in Phase 6."
        action={
          <button
            type="button"
            className="key key--primary"
            disabled
            title="Structured export is implemented in Phase 6."
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Export JSON
          </button>
        }
      />

      {error ? <ErrorPanel message={error} onRetry={refetch} /> : null}

      <section className="panel p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="section-title">Stored analyses</h2>
            <p className="mt-1 text-sm text-muted">
              Files are discovered from{" "}
              <span className="font-mono text-xs text-ink">data/reports</span>.
            </p>
          </div>
          <button
            type="button"
            className="key"
            onClick={refetch}
            disabled={loading}
            title="Refresh report list"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Refresh
          </button>
        </div>

        <div className="mt-5">
          {loading ? (
            <div className="space-y-3">
              <div className="skeleton h-9 w-full" />
              <div className="skeleton h-9 w-full" />
              <div className="skeleton h-9 w-full" />
            </div>
          ) : reports.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Report</th>
                  <th>Created</th>
                  <th>Status</th>
                  <th>Raw output</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                        <span>
                          <span className="block font-medium text-ink">
                            {report.filename}
                          </span>
                          <span className="mt-0.5 block font-mono text-xs text-muted">
                            {report.id}
                          </span>
                        </span>
                      </span>
                    </td>
                    <td data-label="Created">{formatDateTime(report.created_at)}</td>
                    <td data-label="Status">
                      <StatusBadge status={report.security_status} />
                    </td>
                    <td data-label="Raw output">
                      <a
                        className="inline-flex items-center gap-1.5 text-accent underline decoration-rule-2 underline-offset-4 hover:decoration-accent"
                        href={`/api/reports/${encodeURIComponent(report.id)}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View JSON
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState
              icon={FolderOpen}
              title="No reports stored"
              description="Verification reports will appear here once Phase 6 writes them. Any real JSON report placed in data/reports is listed immediately."
            />
          )}
        </div>
      </section>

      <section className="panel p-5 sm:p-6">
        <h2 className="section-title">Report contents planned</h2>
        <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {[
            "Overall security status",
            "Affected identities and resources",
            "Attack paths and unsafe stages",
            "Z3 result, corrections, and assumptions",
          ].map((item) => (
            <div key={item} className="border-t border-rule pt-3 text-sm text-ink-2">
              {item}
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
