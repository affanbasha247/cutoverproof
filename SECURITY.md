# Security policy

CutoverProof is a local research prototype. It does not call AWS, apply infrastructure changes, or store cloud credentials.

## Supported versions

| Version | Supported |
|---|---|
| `0.1.x` (Phase 1) | Yes, during active development |
| Older snapshots | No |

## Reporting a vulnerability

Please do not open a public issue for a vulnerability.

Use GitHub's private vulnerability reporting on the repository's **Security** tab:

1. Open <https://github.com/affanbasha247/cutoverproof/security/advisories/new>.
2. Describe the issue, the affected component, and the smallest safe reproduction.
3. Remove tokens, account identifiers, customer data, and other sensitive values from logs and screenshots.

Reports will be reviewed on a best-effort basis. This is a research project, so no response or fix timeline is guaranteed.

## Scope

In scope:

- The FastAPI service, request validation, path handling, and local file access.
- The React client and its interaction with the local API.
- Dependency vulnerabilities that affect the local application.
- Documentation that makes a security claim the code does not support.

Out of scope:

- The security of a real AWS account or deployment.
- Claims that exceed the documented authorization model.
- Social engineering, physical access, or issues in third-party services.

## Safety boundaries

- No AWS credentials are required or accepted by the application.
- No AWS API calls, Terraform execution, or remote deployment are performed.
- Analysis is local and model-scoped. A `safe` result means no modeled attack path remains, not that a live account is secure.
- Report data is stored as local JSON and should not contain production secrets.

## Dependency hygiene

The Python environment is pinned in `backend/requirements.txt`. The frontend uses the committed `package-lock.json`. CI installs from those files and runs the test suite and production build.
