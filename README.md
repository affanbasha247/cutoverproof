# CutoverProof

CutoverProof is a local research prototype for checking whether an AWS IAM cutover can leave unauthorized access behind. It models old and proposed configurations, attack paths, deployment states, and (from Phase 3) Z3-backed authorization checks.

**Current status: Phase 1.** The FastAPI backend and React dashboard run locally and communicate through real API calls. Policy parsing, attack simulation, Z3 verification, deployment planning, and report generation are not implemented yet. Endpoints for those capabilities return HTTP `501` rather than fabricated results.

## What works in Phase 1

- FastAPI service with `/api/health`, `/api/overview`, `/api/configs`, `/api/reports`, and raw report retrieval.
- Dashboard totals derived from actual JSON files in `data/reports`; the empty state is `no_data`, not a fake “secure” result.
- Configuration inventory derived from actual files in `data/policies`.
- Six-page light Cobalt dashboard with honest phase placeholders.
- Backend tests for health, overview aggregation, configuration listing, report listing, and path-traversal rejection.
- Vite proxy so the browser talks to `/api` without CORS friction.

## Prerequisites

Verified on this machine:

- Python 3.9.6 from Apple Command Line Tools (`/usr/bin/python3`).
- Node.js with npm 11.6.2.
- No AWS account, credentials, Terraform, Docker, or cloud network access required.

## Run locally

Use two terminals.

### Terminal 1 — backend

```bash
cd /Users/affanbasha247/CutoverProof/backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

Verify:

```bash
curl http://127.0.0.1:8000/api/health
curl http://127.0.0.1:8000/api/overview
```

Interactive API docs: <http://127.0.0.1:8000/docs>

### Terminal 2 — frontend

```bash
cd /Users/affanbasha247/CutoverProof/frontend
npm install
npm run dev
```

Open <http://localhost:5173>. The topbar health pill and Overview cards call the backend through the Vite proxy.

## Tests and production build

```bash
cd /Users/affanbasha247/CutoverProof/backend
source .venv/bin/activate
python -m pytest -q
```

```bash
cd /Users/affanbasha247/CutoverProof/frontend
npm run build
```

## API surface (Phase 1)

| Method | Path | Behavior |
|---|---|---|
| GET | `/api/health` | Service status and mode. |
| GET | `/api/overview` | Totals computed from stored report files. |
| GET | `/api/configs` | Real files in `data/policies`. |
| GET | `/api/reports` | Real reports in `data/reports`. |
| GET | `/api/reports/{id}` | Raw local report JSON. |
| POST | `/api/analysis/run` | `501` — Phase 2. |
| POST | `/api/simulation/run` | `501` — Phase 2/4. |
| POST | `/api/verification/run` | `501` — Phase 3. |
| POST | `/api/planner/run` | `501` — Phase 5. |

No endpoint generates SAT/UNSAT answers, attack paths, or deployment plans yet.

## Project layout

```text
CutoverProof/
├── backend/        FastAPI app, tests, requirements
├── frontend/       React + TypeScript + Vite + Tailwind dashboard
├── data/           Local IAM models, scenarios, plans, reports
├── docs/           Architecture, research gap, assumptions
├── README.md
└── .gitignore
```

- `backend/app/policy/` — configuration reader and evaluator (Phase 2).
- `backend/app/simulator/` — effective permissions and attack paths (Phase 2/4).
- `backend/app/verification/` — Z3 encoder and counterexamples (Phase 3).
- `backend/app/planner/` — safe deployment sequences (Phase 5).
- `backend/app/reports/` — report storage/aggregation (Phase 6).

## Design system

The dashboard uses a light Cobalt system: cool near-white paper on a slightly deeper canvas, blue-grey hairlines, Familjen Grotesk heads, IBM Plex Sans body text, and semantic signals for safe, unsafe, attack-path, configuration, simulation, and Z3 states. Tokens live in `frontend/src/tokens.css`; the locked system is documented in `design.md`. The shell is a top bar with six destinations and a disclosure menu below 60rem, not a sidebar.

## Honesty and safety rules

- Dashboard numbers come from backend responses, never from seeded constants.
- No hardcoded security verdicts.
- No AWS API calls and no remote deployment.
- “Safe” is always model-scoped and reported with assumptions.
- Unsupported behavior must return `UNKNOWN` or an explanatory error, not a guessed verdict.

## Troubleshooting

- **`python3` venv or pip fails:** run `python3 -m ensurepip --upgrade`. If the Command Line Tools Python is broken, install Python 3.12 from python.org and recreate `.venv`.
- **Port already in use:** stop the other process or start Uvicorn with `--port 8001` and update the Vite proxy target.
- **Frontend shows API offline:** confirm Uvicorn is running on `127.0.0.1:8000` and that the terminal shows no import errors.
- **Empty dashboard:** expected in Phase 1; there are no reports yet. Zeros and `no_data` are real computed values.

## Roadmap

- Phase 2: IAM JSON schema, loader, diff, effective-permission evaluator, first attack scenario.
- Phase 3: Z3 encoding, real SAT/UNSAT/UNKNOWN results, counterexamples.
- Phase 4: intermediate deployment states, sessions, grants, delays, failure injection.
- Phase 5: safe deployment planner with legitimate-access preservation.
- Phase 6: full dashboard wiring, attack-path visualization, report export.
- Phase 7: baseline comparison and documented experimental results.

See `docs/architecture.md`, `docs/research_gap.md`, and `docs/assumptions.md` for scope and limitations.
