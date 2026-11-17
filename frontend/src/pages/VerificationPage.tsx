import { ListChecks, Play } from "lucide-react";

import PageHeader from "../components/PageHeader";
import PhaseNotice from "../components/PhaseNotice";
import StatusBadge from "../components/StatusBadge";

const CONDITIONS = [
  {
    title: "Attacker reachability",
    detail:
      "The compromised principal can reach the protected action through at least one modeled path.",
  },
  {
    title: "Explicit deny precedence",
    detail:
      "No applicable explicit Deny overrides every Allow on the path.",
  },
  {
    title: "Survivor independence",
    detail:
      "The path does not depend on a permission that the proposed cutover actually removes.",
  },
  {
    title: "Legitimate access preservation",
    detail:
      "The application’s required operations remain allowed without granting the attacker access.",
  },
];

export default function VerificationPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Z3 verification"
        description="Encode the bounded authorization model as SMT constraints and ask whether an unauthorized access path is satisfiable."
        action={
          <button
            type="button"
            className="key key--primary"
            disabled
            title="Z3 verification is implemented in Phase 3."
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            Run verification
          </button>
        }
      />

      <div className="grid gap-8 xl:grid-cols-[1.45fr_1fr] xl:gap-12">
        <section className="panel p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="section-title">What the solver will check</h2>
            <ListChecks className="h-4 w-4 text-muted" aria-hidden="true" />
          </div>
          <ol className="mt-4">
            {CONDITIONS.map((condition, index) => (
              <li
                key={condition.title}
                className="flex gap-4 border-t border-rule py-4 first:border-t-0 first:pt-0"
              >
                <span className="font-mono text-xs text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="item-title">{condition.title}</p>
                    <StatusBadge status="unknown" label="Not verified" />
                  </div>
                  <p className="mt-1 text-sm leading-6 text-ink-2">{condition.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="space-y-8">
          <section className="panel overflow-hidden">
            <div className="border-b border-rule px-5 py-4">
              <h2 className="section-title">Satisfaction target</h2>
            </div>
            <pre className="code-panel">
              <code>{`exists path:
  Assume(attacker, role, path)
  and Allows(role, "s3:GetObject", object)
  and Allows(role, "kms:Decrypt", key)
  and not ExplicitDeny(path)`}</code>
            </pre>
            <p className="border-t border-rule px-5 py-3 text-xs leading-5 text-muted">
              Illustrative query structure only. No SAT or UNSAT result exists until the
              Phase 3 encoder runs against a concrete model.
            </p>
          </section>

          <PhaseNotice
            phase="Phase 3"
            title="Real solver integration"
            description="The verification engine will use z3-solver directly, not precomputed answers."
            tone="verify"
            points={[
              "Translate policy statements into Boolean constraints over a finite action and resource universe.",
              "Ask Z3 for satisfiability and extract a counterexample path when SAT.",
              "Return UNKNOWN honestly on timeout or unsupported conditions.",
              "Reject assumptions outside the documented AWS subset.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
