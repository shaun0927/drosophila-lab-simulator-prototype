# Fly-Lab Session Capture Packet

Date opened: 2026-08-22

Purpose: capture the exact external evidence needed to update [`fly-lab-external-evidence-ledger.md`](fly-lab-external-evidence-ledger.md). This is the field packet for #27 lived-experience collection and #33 player/SME validation. It should be filled during or immediately after sessions, before summary language is written.

Prototype launch aid: `web-prototype/index.html?validation=capture` opens the same capture checklist inside the playable prototype. It is a recording aid only; it does not replace external evidence.

Use [`fly-lab-validation-finding-decision-tree.md`](fly-lab-validation-finding-decision-tree.md) to decide whether a captured finding becomes pass evidence, a fix issue, a cut/rework issue, or a rejected note.

## Capture Rules

- Record exact phrases before interpreting them.
- Keep player validation, SME validation, and lived-experience evidence separate.
- Do not count screenshots, smoke tests, or implementer walkthroughs as external evidence.
- Do not coach a player during the first 30 seconds unless they are completely stuck; if coached, mark the session as `Fix` or `Cut/rework`, not `Pass`.
- Open a follow-up issue for every serious misunderstanding, misleading mechanic, unsafe framing, or lived-experience item that changes implementation.

## Pre-Session Setup

| Item | Required value |
|---|---|
| Build | Current `main` deployment or local `web-prototype/index.html` |
| Default route | Procedure Lab |
| Player validation launch | `web-prototype/index.html?validation=packet` |
| Capture launch | `web-prototype/index.html?validation=capture` |
| Lived-experience launch | `web-prototype/index.html?validation=lived` |
| Required fixtures | `?fixture=clean`, `?fixture=dirty`, `?fixture=missing-control` |
| Issue-specific packets | `docs/external-validation-session-packets.md` #35 through #39 |
| Execution issues | #35, #36, #37, #38, #39 |
| Result document | `docs/fly-lab-validation-results.md` |
| Ledger document | `docs/fly-lab-external-evidence-ledger.md` |

Before a session, run or confirm the latest CI equivalent:

```bash
node web-prototype/smoke-tests.js
node tools/r-series-status-check.js
node tools/external-evidence-check.js
node tools/external-validation-preflight-check.js
node tools/external-validation-gap-report.js
```

## #27 Lived-Experience Capture

Use this section when collecting real fly-lab experience from the user or another person with firsthand/observed lab context.

### Raw answers

| Prompt | Exact answer |
|---|---|
| Repeated hands-on work |  |
| Costliest mistake |  |
| Hardest visual tell |  |
| Real criticism from PI/senior/collaborator/reviewer |  |
| Funny because real |  |
| Satisfying competence |  |
| Fake or off-limits detail |  |
| Assay confidence |  |

### Conversion rows

Copy accepted rows into the ledger as `LE-*` rows, then copy design-relevant rows into `docs/fly-lab-experience-map.md`.

| Candidate id | Provenance | Procedure event | Game verb | Player skill | Failure mode | Delayed consequence | Design effect | Accept? |
|---|---|---|---|---|---|---|---|---|
| LE-candidate-01 |  |  |  |  |  |  |  | yes/no |
| LE-candidate-02 |  |  |  |  |  |  |  | yes/no |
| LE-candidate-03 |  |  |  |  |  |  |  | yes/no |
| LE-candidate-04 |  |  |  |  |  |  |  | yes/no |
| LE-candidate-05 |  |  |  |  |  |  |  | yes/no |

### #27 reject reasons

Mark a candidate as rejected if:

- it is only a general preference
- it has no procedure event
- it cannot become a player verb
- it is arbitrary spectacle without lived or source support
- it would teach an unsafe or misleading lab intuition

## #33 Fresh-Player Capture

Use one copy per player.

| Field | Value |
|---|---|
| Session id | P- |
| Date |  |
| Player profile |  |
| Route/fixture |  |
| Completed one run in 5 minutes? | yes/no |
| Final reviewer finding |  |
| Observer intervention before 30 seconds? | yes/no |
| Decision | Pass/Fix/Cut |
| Follow-up issue |  |

### Exact phrases

| Moment | Exact player phrase |
|---|---|
| Goal within first 30 seconds |  |
| Cause of reviewer attack |  |
| Second-run repair |  |
| Step that felt most like real lab friction |  |
| Step that felt fake/arbitrary/disconnected |  |

### Observation marks

| Check | Pass/Fix/Cut | Evidence |
|---|---|---|
| Goal comprehension |  |  |
| Vial/label meaning |  |  |
| CO2 tradeoff |  |  |
| Sorting friction |  |  |
| Assay record reading |  |  |
| Reviewer fairness |  |  |
| Second-run intent |  |  |

### #33 player follow-up triggers

Open a validation finding issue if:

- the player cannot say the goal after the first run
- the player cannot connect their action to the reviewer finding
- the player thinks CO2, labels, controls, or n are decorative rather than causal
- the player names a second-run repair that the game does not support
- the route is only playable through moderator coaching

## #33 SME Capture

Use one copy for the biology-aware reviewer.

| Field | Value |
|---|---|
| Review id | SME- |
| Date |  |
| Reviewer role or experience level |  |
| Review route/fixture |  |
| Decision | Pass/Fix/Cut |
| Follow-up issue |  |

### Mechanic ratings

Allowed ratings: `Accurate enough`, `Acceptable simplification`, `Misleading`, `Unsafe/ethically wrong`.

| Mechanic | Rating | Exact concern or approval note | Follow-up issue |
|---|---|---|---|
| Stock/vial age warnings |  |  |  |
| Label completeness and lineage confidence |  |  |  |
| Vial flip as maintenance action |  |  |  |
| Virgin collection window |  |  |  |
| Cross setup confidence |  |  |  |
| CO2 exposure as downstream behavior caveat |  |  |  |
| Sex/marker sorting abstraction |  |  |  |
| Batch purity/confidence summary |  |  |  |
| Negative geotaxis n/control/confidence |  |  |  |
| Reviewer attacks tied to record caveats |  |  |  |

Every misleading or unsafe core mechanic needs a concrete follow-up issue before the row can count.

### #33 SME follow-up triggers

Open a validation finding issue if:

- any core mechanic is marked `Misleading`
- any core mechanic is marked `Unsafe/ethically wrong`
- the reviewer says a simplification teaches the wrong causal model
- the reviewer says a visual tell is likely to train the wrong observation skill
- the reviewer says a mechanic should be cut rather than patched with text

## After-Session Update Order

1. Append raw session notes to `docs/fly-lab-validation-results.md`.
2. Update `docs/fly-lab-external-evidence-ledger.md` counts and intake rows.
3. For #27 accepted rows, update `docs/fly-lab-experience-map.md`.
4. Open follow-up issues for every fix/cut trigger.
5. Apply `docs/fly-lab-validation-finding-decision-tree.md` before changing implementation.
6. Run:

```bash
node web-prototype/smoke-tests.js
node tools/r-series-status-check.js
node tools/external-evidence-check.js
node tools/external-validation-gap-report.js
node tools/external-validation-full-check.js --live-issues
```

7. Update #27 or #33 with the result link and whether closure criteria are now met.

## Closure Warning

Do not close #27 or #33 from this packet alone. The packet is only valid after real answers are recorded, transferred into the ledger, summarized in the result docs, and checked by CI.
