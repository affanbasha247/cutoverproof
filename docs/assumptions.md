# Model assumptions and limitations

CutoverProof is a bounded research prototype. Every verdict is relative to the model described here. A `safe` result means no modeled attacker path remains under these assumptions; it is not a proof about a live AWS account.

## Execution boundary

- All analysis is local. The tool never calls AWS and never applies Terraform.
- IAM configurations are JSON documents. Terraform plan import is planned but not implemented.
- No real credentials, account identifiers, or customer data are required. Demo identifiers are synthetic.
- Files are parsed as data, never executed.

## Supported authorization subset (target for Phase 2+)

### Identities and policies

- IAM users and roles.
- Customer-managed and inline identity policies.
- `Allow` and `Deny` statements with `Action`, `NotAction`, `Resource`, `NotResource`.
- Wildcards `*` and `?` over a finite, scenario-defined action/resource universe.
- Explicit Deny precedence over any Allow.
- Implicit deny when no statement allows an action.

### Trust and sessions

- Role trust policies gate `sts:AssumeRole`.
- The caller must also be allowed to call `sts:AssumeRole` on the target role.
- Selected STS sessions can be modeled with issuance/expiry times and optional session policies.
- Existing sessions are evaluated against **current** role policies, matching the AWS behavior that policy changes affect subsequent requests. The model does not assume an old session retains the permissions that were attached when it was issued.
- Service-side authorization caching is not assumed by default. If modeled, it is an explicit bounded propagation delay, not a claim about AWS guarantees.

### Resource policies and grants

- Selected S3 bucket policies.
- Selected KMS key policies and KMS grants.
- Same-account identity-policy and resource-policy Allows are combined as a union, subject to explicit Deny.
- KMS grants are modeled as independent capabilities that persist until retired. Real KMS also evaluates key policy constraints around grant creation/use; the prototype documents and bounds this simplification.
- Grant retirement and policy propagation can be given explicit delays in scenarios.

### Protected operations

The initial demonstration focuses on reading an S3 object protected by a KMS key:

- `s3:GetObject` on the object ARN;
- `kms:Decrypt` on the key ARN.

Both are required for the modeled read path.

## Unsupported or simplified behavior

- No full IAM condition-language support. Only a documented whitelist of condition operators/keys will be implemented; unsupported conditions must cause `UNKNOWN` or a validation error, not silent satisfaction.
- No service control policies (SCPs), permission boundaries, AWS Organizations, IAM Identity Center, or full cross-account semantics in v1.
- No policy variables or ARN interpolation beyond literal scenario values.
- No wildcard expansion over infinite ARN spaces; the scenario defines a finite universe.
- No full KMS key-policy/grant interaction, custom key stores, or encryption-context conditions in v1.
- No S3 Access Points, Object Lambda, VPC endpoint policies, or bucket ACL semantics in v1.
- No exhaustive modeling of every AWS service's authorization cache or eventual-consistency behavior. Delays are explicit, configurable research parameters.
- No automatic remediation of live infrastructure.
- No claims about Terraform provider behavior until plan parsing is implemented.

## Temporal model

A deployment is a sequence of steps. Each step produces a snapshot. Safety is checked at every snapshot, not only at the final state. Propagation delay means a change may take effect after a configured number of steps; this is a modeling choice for studying exposure windows. Injected failures can leave a prefix applied and a step incomplete. Rollback is modeled as another sequence of explicit steps.

KMS grants and resource policies are distinct from identity policies: removing an identity permission does not remove a grant or bucket policy. The planner must revoke or narrow them explicitly.

## Solver semantics

- Supported constraints are encoded into Z3 over the concrete scenario universe.
- `SAT` includes a counterexample path when one can be extracted.
- `UNSAT` means no satisfying assignment exists for the encoded constraints.
- `UNKNOWN` is returned on timeout or when the model uses semantics outside the supported subset.
- The solver result is never hardcoded and never replaced by heuristics presented as proof.

## Legitimate access

Application requirements are modeled as explicit required capabilities (for example, Application B must retain `s3:GetObject` on the protected object and `kms:Decrypt` on its key). A deployment plan that removes attacker access by breaking these requirements is not considered safe.

## Reporting

Reports must state the model version, scenario identity, deployed sequence, assumptions, unsupported features encountered, solver outcome, and timing. `safe` must never be presented as a guarantee about the real account.
