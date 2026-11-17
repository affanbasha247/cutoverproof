# Architecture

## Purpose

CutoverProof tests whether an AWS IAM cutover removes every unauthorized path to a protected resource, not just the permission named in the change. The system is deliberately bounded: it models a documented subset of IAM, STS, S3, and KMS behavior and returns results only for that model.

## Phase 1 implementation

```text
React dashboard (Vite, port 5173)
        │  /api/* through Vite proxy
        ▼
FastAPI (port 8000)
  ├── /api/health       runtime metadata
  ├── /api/overview     totals derived from data/reports/*.json
  ├── /api/configs      inventory of data/policies/*.json
  ├── /api/reports      inventory and raw retrieval
  └── /api/*/run        501 placeholders for later engines
        │
        ▼
Local JSON files (data/)
```

There is no database and no cloud connection. Report aggregation is read-only and tolerant of missing or malformed files: the dashboard reflects only files that exist.

### Backend modules

| Module | Phase 1 responsibility | Later responsibility |
|---|---|---|
| `app/core/` | Settings and repository paths. | Shared configuration. |
| `app/api/` | Typed HTTP contract and honest placeholders. | Endpoints for analysis, simulation, verification, planning. |
| `app/policy/` | Package placeholder. | IAM JSON validation, normalization, diffing. |
| `app/simulator/` | Package placeholder. | Effective permissions, trust traversal, attack paths. |
| `app/verification/` | Package placeholder. | Z3 encoding and counterexamples. |
| `app/planner/` | Package placeholder. | Sequence generation and re-verification. |
| `app/reports/` | Local report discovery and overview aggregation. | Report schema, persistence, export. |

### Frontend modules

| Path | Responsibility |
|---|---|
| `components/Layout.tsx` | Persistent sidebar, topbar, content frame. |
| `components/Topbar.tsx` | Live API health indicator. |
| `hooks/useApi.ts` | Loading/error/data state for API reads. |
| `services/api.ts` | Typed fetch wrapper and readable API errors. |
| `pages/OverviewPage.tsx` | Real report-derived metrics and runtime status. |
| `pages/ConfigurationPage.tsx` | Real file inventory; no policy semantics yet. |
| `pages/SimulationPage.tsx`, `VerificationPage.tsx`, `PlannerPage.tsx` | Explicit Phase 2–5 boundaries. |
| `pages/ReportsPage.tsx` | Real local report listing and raw JSON view. |

Every displayed metric originates in an API response. Empty states are rendered when the backend has no evidence. No page substitutes mock results for missing engines.

## Planned canonical model (Phase 2)

```json
{
  "schema_version": 1,
  "account": { "id": "111122223333", "alias": "demo" },
  "users": [
    {
      "name": "employee-a",
      "attached_policies": ["EmployeeReadPolicy"],
      "inline_policies": []
    }
  ],
  "roles": [
    {
      "name": "DataReaderRole",
      "trust_policy": { "Version": "2012-10-17", "Statement": [] },
      "attached_policies": ["DataReadPolicy"]
    }
  ],
  "policies": [
    {
      "name": "DataReadPolicy",
      "document": { "Version": "2012-10-17", "Statement": [] }
    }
  ],
  "s3_buckets": [
    { "name": "cutoverproof-sensitive", "policy": null }
  ],
  "kms_keys": [
    {
      "id": "key-id",
      "key_policy": { "Version": "2012-10-17", "Statement": [] },
      "grants": []
    }
  ],
  "sessions": [
    {
      "id": "session-1",
      "principal": "arn:aws:sts::111122223333:assumed-role/DataReaderRole/session-1",
      "issued_at": "2026-11-17T10:00:00Z",
      "expires_at": "2026-11-17T11:00:00Z"
    }
  ]
}
```

Normalization rules will be documented with the schema. Actions are lowercased for comparison; resource matching is case-sensitive where AWS is case-sensitive. Unsupported condition keys will not be silently treated as satisfied.

## Verification design (Phase 3)

1. Build a finite universe of principals, actions, resources, sessions, and grants from the concrete scenario.
2. Emit Boolean variables for capability facts such as `can_assume(attacker, role)` and `allows(role, s3:getobject, object)`.
3. Add constraints for explicit Deny precedence, identity/resource policy union, trust requirements, session policy intersection, and selected KMS grant semantics.
4. Ask Z3 whether `attacker_can_read(target)` is satisfiable.
5. On SAT, extract a witness path (principal → role/session → resource). On UNSAT, report no path under the encoded constraints. On timeout or unsupported semantics, return `UNKNOWN`.

The encoder must be evaluated against the exact scenario model supplied to the API. No precomputed verdicts or canned counterexamples are permitted.

## Deployment planning (Phase 4–5)

A deployment is an ordered list of actions such as detach policy, update trust, retire KMS grant, or attach replacement policy. Each prefix produces an intermediate state. The planner:

- simulates every intermediate state with the same evaluator used elsewhere;
- verifies that no modeled attacker path exists at any stage;
- checks required application operations at every stage;
- compares candidate orders (authored, deny-first, grant-revocation-first);
- re-verifies the recommended order before marking it safe within the model.

Propagation delays and injected failures are explicit scenario parameters. They are not claims about AWS guarantees.

## Reporting and evaluation (Phase 6–7)

Reports will be stored as JSON with a versioned schema, including status, findings, affected identities/resources, attack paths, intermediate unsafe states, solver results, recommendations, assumptions, and timing data. Phase 7 will run baseline orderings against synthetic scenarios and record measured metrics only.

## Design constraints

- Local-only execution; no AWS calls or automatic deployment.
- No AI/ML substitution for formal verification.
- Clear separation between the permission model, solver encoding, planner, and presentation.
- Security-critical logic covered by unit tests.
- Unsupported semantics surface as errors or `UNKNOWN`, never as optimistic results.
