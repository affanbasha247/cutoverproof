import { Play } from "lucide-react";

import PageHeader from "../components/PageHeader";
import PhaseNotice from "../components/PhaseNotice";

const MODEL_PIECES = [
  {
    title: "Compromised principal",
    description:
      "Employee A is treated as attacker-controlled. The model includes the credentials and roles that principal can reach.",
  },
  {
    title: "Surviving capability",
    description:
      "Resource policies, KMS grants, and role trust edges are checked after the original permission is removed.",
  },
  {
    title: "Protected target",
    description:
      "The sensitive S3 object requires both object-read permission and permission to decrypt its KMS key.",
  },
];

export default function SimulationPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Attack simulation"
        description="Explore whether a compromised identity can retain access through alternative authorization paths after an IAM change."
        action={
          <button
            type="button"
            className="key key--primary"
            disabled
            title="Simulation execution arrives in Phase 2 and Phase 4."
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            Run simulation
          </button>
        }
      />

      <section className="panel p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="section-title">Modeled objects</h2>
          <span className="tag">Awaiting engine</span>
        </div>
        <dl className="mt-4">
          {MODEL_PIECES.map((piece) => (
            <div
              key={piece.title}
              className="grid gap-1 border-t border-rule py-4 first:border-t-0 first:pt-0 md:grid-cols-[16rem_minmax(0,1fr)] md:gap-8"
            >
              <dt>
                <h3 className="item-title">{piece.title}</h3>
              </dt>
              <dd className="text-sm leading-6 text-ink-2">{piece.description}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid items-start gap-8 xl:grid-cols-[1.4fr_1fr] xl:gap-12">
        <section className="panel p-5 sm:p-6">
          <h2 className="section-title">Compromised employee with a surviving path</h2>
          <p className="mt-2 max-w-[65ch] text-sm leading-6 text-ink-2">
            The intended first scenario removes Employee A’s direct access to a
            sensitive bucket. The attacker may still reach it through a role trust edge
            or a KMS grant that the cutover did not revoke.
          </p>

          <ol className="mt-5 space-y-4">
            {[
              "Employee A can read a sensitive S3 object using a direct policy.",
              "The administrator removes that policy in the proposed configuration.",
              "A role trust relationship or KMS grant survives the change.",
              "The simulator asks whether the attacker can still reach the object.",
            ].map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="font-mono text-xs text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-6 text-ink-2">{step}</p>
              </li>
            ))}
          </ol>

          <p className="mt-5 border-l-2 border-warning pl-3 text-sm leading-6 text-ink-2">
            This scenario is not executed yet. No attack path is claimed until the
            simulator and verification engine evaluate the real model.
          </p>
        </section>

        <PhaseNotice
          phase="Phase 2 and 4"
          title="Simulation engine"
          description="The screen is ready. Execution requires the permission evaluator and transition simulator."
          tone="info"
          points={[
            "Enumerate effective permissions from identity and resource policies.",
            "Follow assume-role trust edges from the compromised principal.",
            "Model selected STS sessions without assuming they keep stale policy permissions.",
            "Carry KMS grants and resource policies across deployment states until actually revoked.",
            "Inject propagation delays and deployment failures in Phase 4.",
          ]}
        />
      </div>
    </div>
  );
}
