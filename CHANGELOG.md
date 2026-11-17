# Changelog

All notable changes to CutoverProof are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project intends to use semantic versioning once releases begin.

## [Unreleased]

### Planned

- Phase 2: IAM JSON schema, configuration loader, permission diff, effective-permission evaluator, and the first attack scenario.
- Phase 3: Z3 constraints, SAT/UNSAT/UNKNOWN results, and counterexample paths.
- Phase 4: Intermediate deployment states, sessions, grants, propagation delays, and failure injection.
- Phase 5: Safe deployment planning with legitimate-access preservation.
- Phase 6: Attack-path visualization, report generation, and JSON export.
- Phase 7: Baseline comparison and documented evaluation results.

## [0.1.0] - 2026-11-17

### Added

- Local FastAPI service with health, overview, configuration inventory, and report endpoints.
- Report-derived dashboard totals with an explicit `no_data` state.
- Six-screen React and TypeScript dashboard: Overview, Configuration, Attack Simulation, Z3 Verification, Deployment Planner, and Security Reports.
- Cobalt design system with portable tokens in `frontend/src/tokens.css`.
- Pytest coverage for API responses, report aggregation, configuration metadata, and report path traversal.
- GitHub CI for the backend test suite and frontend production build.

### Security

- No AWS credentials, network calls to AWS, Terraform execution, or remote deployment.
- Phase-gated endpoints return `501` instead of fabricated analysis results.
