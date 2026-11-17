# Research gap and contribution

## Problem

An IAM cutover removes a permission in the proposed configuration. That does not prove the organization has removed every authorization path to the protected resource. Surviving capabilities can include:

- a resource-based policy that still names the compromised principal or a role it can assume;
- a KMS grant that remains active after identity policies change;
- a role trust relationship that lets the attacker pivot into a role that still has access;
- an intermediate deployment state in which old and new grants coexist;
- a deployment failure or partial rollback that leaves the system in an unintended state.

Authorization is also temporal. A sequence that is safe at the start and end can still expose data in the middle.

## Relationship to prior work

Hayha already analyzes intermediate infrastructure deployment states. **CutoverProof does not claim that checking intermediate states, by itself, is novel.** The prototype is designed to study a broader bounded question: whether a cutover preserves unauthorized capabilities through any modeled authorization mechanism, and how to repair the deployment order while preserving legitimate application workflows.

## Intended contribution

A bounded temporal authorization verification and repair approach that combines:

1. **Selected surviving capabilities** — identity policies, role trust, resource policies, KMS grants, and selected STS sessions, evaluated under explicit model assumptions.
2. **Authorization propagation** — configurable delays and failure injection, with results reported as model behavior rather than AWS guarantees.
3. **Failure and rollback behavior** — sequences are evaluated under injected deployment failures, not only successful completion.
4. **Legitimate-workflow preservation** — safety cannot be achieved by breaking the application; required operations are constraints on the plan.
5. **Repair** — candidate deployment orders are generated and re-verified, not merely rejected.

Formal verification is performed with Z3 over the concrete bounded model. No AI or machine-learning model substitutes for the solver.

## Research questions

- RQ1: After a permission removal, which modeled capabilities still allow an attacker to reach the protected resource?
- RQ2: Which intermediate deployment states create unauthorized access even when the initial and final states are safe?
- RQ3: Can a reordered deployment eliminate exposure while keeping required application operations available?
- RQ4: How does the approach behave under injected propagation delays and deployment failures?
- RQ5: What is the verification cost relative to baseline deployment strategies?

## Evaluation plan (Phase 7)

Compare at least:

- ordinary deployment ordering;
- conservative deny-first ordering;
- CutoverProof planning.

Measure, from actual local runs:

- unauthorized successful operations;
- exposure duration (deployment steps or simulated time);
- legitimate-operation failures;
- deployment completion time;
- recovery behavior under injected failures;
- verification execution time.

Results will be produced by the harness and reported with the scenario definitions and model assumptions. No experimental numbers are asserted in advance.

## Non-claims

- Not a complete AWS IAM implementation.
- Not a proof about a live AWS account.
- Not a replacement for AWS IAM Access Analyzer, policy simulation, or human review.
- Not a deployment tool; it never calls AWS.
- Not novel merely because it inspects intermediate states.

See `assumptions.md` for the exact modeled subset and simplifications.
