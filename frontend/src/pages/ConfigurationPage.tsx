import { ArrowRightLeft, FileCode2, RefreshCw } from "lucide-react";

import EmptyState from "../components/EmptyState";
import ErrorPanel from "../components/ErrorPanel";
import PageHeader from "../components/PageHeader";
import PhaseNotice from "../components/PhaseNotice";
import StatusBadge from "../components/StatusBadge";
import { useApi } from "../hooks/useApi";
import { formatBytes, formatDateTime } from "../services/format";
import type { ConfigListResponse } from "../types/api";

export default function ConfigurationPage() {
  const { data, loading, error, refetch } = useApi<ConfigListResponse>("/configs");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Configuration analysis"
        description="Inspect the local IAM configuration inventory. Parsing, permission comparison, and Terraform plan import arrive in Phase 2."
        action={
          <button
            type="button"
            className="key"
            disabled
            title="Configuration comparison is implemented in Phase 2."
          >
            <ArrowRightLeft className="h-4 w-4" aria-hidden="true" />
            Compare configurations
          </button>
        }
      />

      {error ? <ErrorPanel message={error} onRetry={refetch} /> : null}

      <div className="grid items-start gap-8 xl:grid-cols-[1.6fr_1fr] xl:gap-12">
        <section className="panel p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="section-title">IAM configuration files</h2>
              <p className="mt-1 text-sm text-muted">
                Files are discovered from{" "}
                <span className="font-mono text-xs text-ink">data/policies</span>.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="key"
                onClick={refetch}
                disabled={loading}
                title="Refresh configuration list"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Refresh
              </button>
            </div>
          </div>

          <div className="mt-5">
            {loading ? (
              <div className="space-y-3">
                <div className="skeleton h-9 w-full" />
                <div className="skeleton h-9 w-full" />
                <div className="skeleton h-9 w-full" />
              </div>
            ) : data && data.configs.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Configuration</th>
                    <th>Size</th>
                    <th>Modified</th>
                    <th>Analysis state</th>
                  </tr>
                </thead>
                <tbody>
                  {data.configs.map((config) => (
                    <tr key={config.id}>
                      <td>
                        <span className="flex items-center gap-2">
                          <FileCode2 className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                          <span>
                            <span className="block font-medium text-ink">
                              {config.filename}
                            </span>
                            <span className="mt-0.5 block font-mono text-xs text-muted">
                              {config.id}
                            </span>
                          </span>
                        </span>
                      </td>
                      <td data-label="Size">{formatBytes(config.size_bytes)}</td>
                      <td data-label="Modified">{formatDateTime(config.modified_at)}</td>
                      <td data-label="Analysis state">
                        <StatusBadge status="unknown" label="Not parsed" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState
                icon={FileCode2}
                title="No IAM configurations found"
                description="Add JSON configuration files to data/policies to populate this inventory. Phase 2 will validate them and compute added, modified, and removed permissions."
              />
            )}
          </div>
        </section>

        <div className="space-y-8">
          <PhaseNotice
            phase="Phase 2"
            title="Configuration reader and diff"
            description="The inventory above is real, but no policy semantics are evaluated yet."
            tone="info"
            points={[
              "Validate users, roles, managed policies, inline policies, and trust documents.",
              "Compare old and proposed configurations at statement and capability level.",
              "Show added, modified, and removed permissions with affected identities.",
              "Add the first synthetic compromised-employee scenario after the diff engine is tested.",
            ]}
          />
        </div>
      </div>

      <section className="border-t border-rule pt-5">
        <h2 className="section-title">Input boundary</h2>
        <ul className="mt-3 grid gap-3 text-sm leading-6 text-ink-2 md:grid-cols-3">
          <li>JSON IAM models only in Phase 1 and Phase 2; Terraform plan import is later.</li>
          <li>No AWS credentials, API calls, or remote mutations are used.</li>
          <li>Files are never executed; they are parsed as data.</li>
        </ul>
      </section>
    </div>
  );
}
