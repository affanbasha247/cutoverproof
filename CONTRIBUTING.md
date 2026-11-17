# Contributing to CutoverProof

CutoverProof is a research prototype with a deliberately narrow security boundary. Contributions are welcome when they make the model more accurate, the evidence more trustworthy, or the local workflow easier to use.

## Before you start

- Read [README.md](README.md), [docs/architecture.md](docs/architecture.md), and [docs/assumptions.md](docs/assumptions.md).
- Check the roadmap and open issues before proposing a large engine change.
- Open an issue for anything that changes the authorization model or the API contract. Phase boundaries are intentional.

## Local setup

```bash
git clone https://github.com/affanbasha247/cutoverproof.git
cd cutoverproof
```

Backend:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m pytest -q
python -m uvicorn app.main:app --reload --port 8000
```

Frontend, in a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Before opening a pull request:

```bash
cd backend && .venv/bin/python -m pytest -q
cd frontend && npm run build
```

## What good changes look like

- **Security logic is tested.** Add a test for every new allow, deny, trust, grant, session, or transition rule.
- **Uncertainty is explicit.** Unsupported semantics return `UNKNOWN` or a validation error. They are never treated as safe.
- **The API stays honest.** Do not return a fabricated verdict, path, metric, or report. A `501` placeholder is better than a plausible lie.
- **The model boundaries are documented.** If you add AWS behavior, update `docs/assumptions.md` and explain any simplification.
- **The UI reflects real state.** No seeded dashboard numbers and no enabled controls for engines that do not exist.
- **Changes are small and reviewable.** Separate refactors from behavior changes when possible.

## Code style

### Python

- Target Python 3.9, the version used by the project.
- Keep functions typed and small enough to review.
- Use Pydantic models at API boundaries.
- Prefer explicit errors over silent fallbacks.
- Keep security-critical decisions in the engine modules, not in route handlers.

### TypeScript and CSS

- TypeScript strict mode is enabled.
- Use the existing semantic tokens in `frontend/src/tokens.css`. Do not add raw colors to components.
- Preserve the design system in `design.md` unless a design change is part of the proposal.
- Handle loading, empty, error, and populated states.
- Keep the interface usable with a keyboard and at phone widths.

## Pull requests

Include:

1. What changed and why.
2. Which model assumptions or API contracts changed.
3. Tests added or updated.
4. Screenshots for visible UI changes.
5. Known limitations.

Small documentation fixes can go directly to a pull request. Large model changes should begin as an issue so the semantics can be discussed before implementation.

## Commit messages

Use a short imperative summary, optionally followed by a body:

```text
Add KMS grant persistence check

Covers the first surviving-capability path and documents the
grant/key-policy simplification in the assumptions file.
```

## Reporting security issues

Do not open a public issue for a vulnerability. Follow [SECURITY.md](SECURITY.md).

## Community

By participating, you agree to follow [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
