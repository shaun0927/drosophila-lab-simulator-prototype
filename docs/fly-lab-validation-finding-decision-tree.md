# Fly-Lab Validation Finding Decision Tree

Date opened: 2026-08-22

Purpose: convert #27 lived-experience entries and #33 player/SME validation findings into scoped implementation issues without drifting into broad redesign, Unity backlog, or unsupported spectacle.

Use this after filling [`fly-lab-session-capture-packet.md`](fly-lab-session-capture-packet.md) and before editing gameplay.

## Inputs

| Input | Source document | Output |
|---|---|---|
| Lived-experience row | `docs/fly-lab-session-capture-packet.md` and `docs/fly-lab-external-evidence-ledger.md` | Update experience map, open lived-experience implementation issue, or reject |
| Player session finding | `docs/fly-lab-session-capture-packet.md` and `docs/fly-lab-validation-results.md` | Open validation finding issue, accept as pass evidence, or mark as non-blocking note |
| SME review finding | `docs/fly-lab-session-capture-packet.md` and `docs/fly-lab-validation-results.md` | Open fix/cut issue before #33 closure, or accept simplification |

## Top-Level Decision

| Question | If yes | If no |
|---|---|---|
| Is the evidence from a real player, SME, or lived/observed lab source? | Continue | Do not count it toward #27/#33 closure |
| Does it affect the Procedure Lab first slice? | Continue | Park as post-R-series backlog only if still useful |
| Does it map to a concrete mechanic, record field, visual tell, reviewer rule, or procedure step? | Continue | Record as note, not an implementation issue |
| Is the issue about old Unity polish, old phenomenon catalog content, or non-R-series scope? | Park or rewrite against R-series | Continue |

## #27 Lived-Experience Decision Tree

### Accept as a #27 evidence row

Accept when all are true:

- provenance is firsthand, observed lab work, or an explicit no-relevant-experience decision
- the incident names a concrete lab procedure or lab judgment
- the conversion row names a player verb
- the row has a failure mode and delayed consequence
- the row changes a mechanic, guardrail, SME risk, or exclusion decision

Result:

1. Update `docs/fly-lab-external-evidence-ledger.md`.
2. Update `docs/fly-lab-experience-map.md`.
3. If implementation changes are needed, open a new issue with `.github/ISSUE_TEMPLATE/fly_lab_lived_experience.yml`.

### Reject as #27 evidence

Reject when any are true:

- the entry is only mood, theme, or general preference
- it cannot be translated into a player action
- it describes unsupported spectacle with no lab provenance
- it would make the first slice scientifically misleading
- it duplicates an existing event without adding provenance or design effect

Result:

Record the rejection reason in session notes. Do not increase the ledger count.

### Open a lived-experience implementation issue

Open when the accepted row requires one of:

- new player action
- changed record consequence
- changed UI label or visual tell
- new guardrail against misleading play
- SME review of a risky simplification

The issue must include:

- Goal: the lived-experience gap being addressed
- Final Implementation Scope: the exact mechanic/doc/UI change
- Success Criteria: what will be observably different
- Verification Method: smoke, screenshot, player retry, SME review, or doc check
- Guardrails: what not to make more arbitrary
- Explicit Non-Goals: old Unity polish, broader genetics simulator, unrelated phenomenon content

## #33 Player Finding Decision Tree

### Count as pass evidence

Count one player session as pass evidence when all are true:

- the player reaches a Reviewer #2 finding within the target session
- the player names one plausible cause from the record
- the player names one plausible second-run repair
- the observer did not explain the goal during the first 30 seconds
- the player's explanation is not contradicted by the actual record

Result:

Update the `P-*` row in `docs/fly-lab-external-evidence-ledger.md` and append the exact phrases to `docs/fly-lab-validation-results.md`.

### Open a fix issue

Open a fix issue when:

- the player completes the run but misunderstands why the reviewer attacked
- the player treats CO2, labels, controls, or n as decorative
- the player cannot find the record evidence even after seeing the result
- the player understands the concept only after reading too much text
- the player proposes a valid second-run repair that the game does not allow

Default implementation scope:

- clarify the action/record/reviewer connection
- improve state visibility
- add or adjust a repair affordance
- reduce misleading wording

### Open a cut/rework issue

Open a cut/rework issue when:

- two or more players fail the same core connection
- a mechanic is only understandable through coaching
- a player action creates no meaningful record consequence
- the mechanic competes with the Procedure Lab thesis instead of supporting it

Default implementation scope:

- remove the mechanic from the first slice
- replace it with a smaller procedure action
- preserve the evidence record loop

## #33 SME Finding Decision Tree

### Accept as pass evidence

Count one SME review as pass evidence when:

- every core mechanic is rated `Accurate enough` or `Acceptable simplification`
- no core mechanic is rated `Misleading` or `Unsafe/ethically wrong`
- reviewer notes do not identify a false causal model
- reviewer notes do not require a fix/cut issue before closure

### Open a fix issue

Open a fix issue when:

- a simplification is directionally acceptable but the wording, timing, visual tell, or consequence is likely to confuse
- a mechanic needs a clearer caveat
- a record field is right in concept but presented with misleading confidence

Default implementation scope:

- adjust text, records, timing, visualization, or consequence
- keep the one-cross Procedure Lab loop intact
- re-run SME check for the affected mechanic

### Open a cut/rework issue

Open a cut/rework issue when:

- any core mechanic is `Unsafe/ethically wrong`
- a mechanic teaches the wrong biological or experimental intuition
- a visual tell cannot be made acceptable within the current UI
- the fix would require a broader genetics simulator before the first slice is validated

Default implementation scope:

- cut from first slice or replace with a safer abstraction
- update product thesis guardrails if needed
- require SME re-review before #33 closure

## Severity Mapping

| Evidence | Severity | Closure effect |
|---|---|---|
| One player misreads a non-core affordance but can explain the record | Follow-up polish after #33 | Does not block #33 |
| One player finishes but misattributes the reviewer finding | Fix before #33 can close | Blocks #33 until issue exists and disposition is recorded |
| Two or more players fail the same core connection | Cut or redesign before #33 can close | Blocks #33 |
| SME marks core mechanic `Misleading` | Fix before #33 can close | Blocks #33 |
| SME marks core mechanic `Unsafe/ethically wrong` | Cut or redesign before #33 can close | Blocks #33 |
| Lived-experience row changes a core mechanic | R1 lived-experience implementation issue | Blocks #27 until mapped and dispositioned |
| Lived-experience row is arbitrary spectacle | Reject | Does not count toward #27 |

## Drift-Prevention Rules

- Do not convert validation frustration into a larger feature unless the evidence demands it.
- Do not treat "needs more explanation" as the default fix; first check whether action feedback, record state, or reviewer mapping is unclear.
- Do not add a new organism, assay, phenotype, or Unity scene to solve a first-slice evidence problem.
- Do not close #33 by opening issues only; serious fix/cut issues must be resolved or explicitly accepted as non-blocking.
- Do not close #27 with source research alone; lived-experience provenance must be recorded or explicitly waived by the user.

## Required Issue Body Fields

Every follow-up issue opened from this decision tree must include:

- Goal
- Final Implementation Scope
- Success Criteria
- Verification Method
- Guardrails
- Explicit Non-Goals
- Implementation Approach
- PR Decomposition
- Over-Engineering Checklist
- Drift-Prevention Checklist
- Definition of Done

These fields must be specific to the finding. Generic template text is not acceptable.
