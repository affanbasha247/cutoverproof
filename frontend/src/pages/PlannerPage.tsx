import { Route } from "lucide-react";

import PageHeader from "../components/PageHeader";
import PhaseNotice from "../components/PhaseNotice";
import StatusBadge from "../components/StatusBadge";

const STRATEGIES = [
  {
    title: "Ordinary deployment order",
    description: "Apply the proposed Terraform changes in their authored order.",
  },
  {
    title: "Conservative deny-first",
    description: "Revoke broad access before adding new grants or trust edges.",
  },
  {
    title: "CutoverProof planned",
    description: "Search for an order that is safe at every intermediate state.",
  },
];

export default function PlannerPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Deployment planner"
        description="Explore deployment orders and reject any sequence that exposes a protected resource at an intermediate stage."
        action={
          <button
            type="button"
            className="key key--primary"
            disabled
            title="Deployment planning is implemented in Phase 5."
          >
            <Route className="h-4 w-4" aria-hidden="true" />
            Plan deployment
          </button>
        }
      />

      <section className="panel p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="section-title">Candidate deployment orders</h2>
          <span className="tag">Not evaluated</span>
        </div>
        <div className="mt-4">
          <table className="data-table">
            <thead>
              <tr>
                <th>Strategy</th>
                <th>Unsafe stages</th>
                <th>Legitimate failures</th>
                <th>Completion</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {STRATEGIES.map((strategy) => (
                <tr key={strategy.title}>
                  <td>
                    <span className="block font-medium text-ink">{strategy.title}</span>
                    <span className="mt-0.5 block text-xs text-muted">
                      {strategy.description}
                    </span>
                  </td>
                  <td data-label="Unsafe stages">Not measured</td>
                  <td data-label="Legitimate failures">Not measured</td>
                  <td data-label="Completion">Not measured</td>
                  <td data-label="Status">
                    <StatusBadge status="unknown" label="Not evaluated" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid items-start gap-8 xl:grid-cols-[1.4fr_1fr] xl:gap-12">
        <section className="panel p-5 sm:p-6">
          <h2 className="section-title">What makes a sequence acceptable</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-ink-2">
            {[
              "No modeled unauthorized access at any intermediate deployment state.",
              "Required application operations remain available throughout the transition.",
              "KMS grants and resource policies are revoked or narrowed in a safe order.",
              "The recommended sequence is re-verified end to end before being marked safe.",
              "Failure injection and rollback are evaluated in Phase 4 before planning in Phase 5.",
            ].map((constraint) => (
              <li key={constraint} className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 bg-accent" aria-hidden="true" />
                {constraint}
              </li>
            ))}
          </ul>
        </section>

        <PhaseNotice
          phase="Phase 5"
          title="Planner engine"
          description="No sequence is recommended until all intermediate states have been simulated and verified."
          tone="warning"
          points={[
            "Generate candidate orderings, including deny-first and grant-revocation-first.",
            "Score sequences by unsafe stages, exposure duration, and legitimate-operation failures.",
            "Re-verify the chosen sequence against the final configuration.",
            "Report only measured outcomes from the local simulator.",
          ]}
        />
      </div>
    </div>
  );
}
