# Fly-Lab Validation Runbook

Use this to execute the remaining #33 validation without drifting into general feedback. During the session, record raw answers in [`fly-lab-session-capture-packet.md`](fly-lab-session-capture-packet.md) before summarizing results.

After capture, use [`fly-lab-validation-finding-decision-tree.md`](fly-lab-validation-finding-decision-tree.md) to convert findings into pass evidence, fix issues, cut/rework issues, or rejected notes.

## Validation Goal

Prove or disprove the current five-minute fly-lab slice against two separate questions:

1. Player question: can a fresh player understand what they did wrong and how to improve a second run?
2. SME question: are the fly-lab simplifications acceptable rather than misleading?

## Required Build

Use `main` at or after commit `7869d53`.

Internal guardrail before any session:

```bash
node web-prototype/smoke-tests.js
```

Expected:

```text
fly-lab smoke passed: R2/R3, objective strip, reviewer repair plans, validation/capture packets, clean, dirty, missing-control, URL fixtures, legacy route
```

## Validation URLs

Use local or hosted equivalents of:

- `web-prototype/index.html`
- `web-prototype/index.html?validation=status`
- `web-prototype/index.html?validation=packet`
- `web-prototype/index.html?validation=capture`
- `web-prototype/index.html?validation=lived`
- `web-prototype/index.html?fixture=clean`
- `web-prototype/index.html?fixture=dirty`
- `web-prototype/index.html?fixture=missing-control`

The status packet URL shows the currently unfilled #27/#33 evidence gates. It does not satisfy validation by itself.

The validation packet URL is the moderator/SME launch page. It does not satisfy validation by itself.

The capture packet URL is the session recording aid. It does not satisfy validation by itself.

The lived-experience packet URL is for #27 collection and should not be counted as #33 player/SME evidence.

The fixture URLs are not the first-run playtest. They are controlled comparison states for debrief and SME review.

## Player Session Protocol

Minimum: 3 fresh players.

Duration: 5 minutes play, 5 minutes debrief.

Moderator rules:

- Do not explain mechanics during the first 30 seconds.
- Do not correct a suboptimal choice unless the player is fully blocked.
- Record exact phrases when the player explains a failure.
- If the player asks what something means, note the object and continue with minimal clarification.

### Player Session Steps

1. Open `web-prototype/index.html`.
2. Ask the player to play one run until a Reviewer #2 finding appears.
3. Do not mention clean/dirty/missing-control upfront.
4. After the run, ask:
   - What was the experiment trying to prove?
   - What caused the reviewer attack?
   - What would you do differently in a second run?
   - Which part felt like lab work rather than a menu?
   - Which part felt fake or arbitrary?
5. Show one fixture URL that contrasts with their route.
6. Ask whether the different reviewer finding makes sense.

### Player Pass/Fail Rules

| Result | Condition |
|---|---|
| Pass | Player identifies at least one real cause of the reviewer finding and names a plausible second-run improvement |
| Fix | Player finishes but misattributes the reviewer finding to random chance or flavor text |
| Cut/rework | Player cannot connect vial/sorting/assay records to the reviewer result |

## SME Session Protocol

Minimum: 1 biology-aware reviewer.

Use `docs/fly-lab-sme-validation-sheet.md`.

Required review fixtures:

1. `?fixture=clean`
2. `?fixture=dirty`
3. `?fixture=missing-control`

Ask the SME to classify every core mechanic:

- accurate enough
- acceptable simplification
- misleading
- unsafe or ethically wrong framing

## Fix/Cut Issue Rules

Open a follow-up issue if any of the following happens:

- two or more players cannot explain why Reviewer #2 attacked them
- one or more SME marks a core mechanic as misleading
- one or more SME marks a mechanic as unsafe or ethically wrong
- players read CO2 as a free pause button rather than an assay caveat
- players read the assay mini-plot as a score meter rather than an experiment record

Each follow-up issue must include:

- observed evidence
- affected mechanic
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

Before a Fix/Cut player or SME row can count in the evidence ledger, its follow-up field must include a concrete GitHub issue reference plus either `resolved` or `accepted non-blocking`. The same follow-up issue reference and disposition must also appear in `docs/fly-lab-validation-results.md`. A still-open blocker can be recorded in notes, but it must not be counted as closure evidence.

Use `.github/ISSUE_TEMPLATE/fly_lab_validation_finding.yml` for these follow-up issues.

Use `docs/fly-lab-validation-finding-decision-tree.md` to choose `Fix before #33 can close`, `Cut or redesign before #33 can close`, or `Follow-up polish after #33`.

## Results Recording

Record results in `docs/fly-lab-validation-results.md` under a dated section:

```md
## Validation Run YYYY-MM-DD

### Player Sessions

| Player | Route | Reviewer finding | Understood cause? | Second-run improvement | Result | Notes |
|---|---|---|---|---|---|---|

### SME Review

Fixtures reviewed: `?fixture=clean`, `?fixture=dirty`, `?fixture=missing-control`

| Mechanic | Rating | Evidence | Required action |
|---|---|---|---|

### Follow-Up Issues

- #NN: title
```

## Closure Gate for #33

#33 can close only when:

- 3 player sessions are recorded
- 1 SME review is recorded
- accepted SME review references clean, dirty, and missing-control fixture coverage in validation results
- accepted player sessions collectively cover clean, dirty, and missing-control routes or fixtures
- clean/dirty/missing-control fixture differences are understood or follow-up issues are opened
- all `misleading` or `unsafe` SME findings have fix/cut issues with resolved or accepted-non-blocking dispositions
