# External Validation Intake Staging

Date opened: 2026-08-23

Purpose: stage real #35 through #39 session material before accepted counts are raised in `docs/fly-lab-external-evidence-ledger.md`.

This staging sheet is not evidence by itself. It is a pre-copy review aid. Do not raise accepted counts from this document, screenshots, smoke tests, implementer walkthroughs, issue comments, or packet visibility.

Use after a real session has filled one of these sources:

- `docs/external-validation-session-packets.md`
- `docs/fly-lab-session-capture-packet.md`
- `web-prototype/index.html?validation=capture`
- `web-prototype/index.html?validation=lived`

## Staging Rules

- Paste exact phrases before summary language.
- Keep #27 lived-experience rows separate from #33 player and SME rows.
- Stage only one issue row group at a time.
- Leave accepted count fields unchanged until all target docs are updated and `node tools/external-validation-full-check.js --live-issues` passes.
- Reject or restage any row that depends on screenshots, smoke tests, implementer walkthroughs, or coached interpretation.

## #35 LE Staging

Before copying to the ledger, confirm each accepted `LE-*` candidate has the same fields ready for both target docs.

| Check | Required value |
|---|---|
| Source issue | #35 |
| Row ids | `LE-01` through `LE-05` |
| Target docs | `docs/fly-lab-external-evidence-ledger.md`, `docs/fly-lab-experience-map.md` |
| Required provenance | firsthand, observed lab work, or explicit no relevant experience |
| Required design effect | mechanic change, guardrail change, SME risk update, or explicit exclusion |
| Count blocker | No accepted #27 count until five valid `LE-*` rows and at least one design-changing row exist, unless explicit no-experience closure path is used |

| Row id | Exact source phrase | Provenance | Procedure event | Game verb | Player skill | Failure mode | Delayed consequence | Design effect | Copy ready? |
|---|---|---|---|---|---|---|---|---|---|
| LE-01 |  |  |  |  |  |  |  |  | yes/no |
| LE-02 |  |  |  |  |  |  |  |  | yes/no |
| LE-03 |  |  |  |  |  |  |  |  | yes/no |
| LE-04 |  |  |  |  |  |  |  |  | yes/no |
| LE-05 |  |  |  |  |  |  |  |  | yes/no |

## #36-#38 Player Staging

Before copying to the ledger, confirm the same route, phrase, decision, and follow-up disposition will appear in `docs/fly-lab-validation-results.md`.

| Check | Required value |
|---|---|
| Source issues | #36, #37, #38 |
| Row ids | `P-01`, `P-02`, `P-03` |
| Target docs | `docs/fly-lab-external-evidence-ledger.md`, `docs/fly-lab-validation-results.md` |
| Required routes | clean, dirty, missing-control |
| Required exact phrases | goal within first 30 seconds, cause of reviewer attack, second-run repair |
| Count blocker | No accepted #33 player count until the matching `P-*` row is present in validation results with the same route, phrases, decision, and follow-up disposition |

| Session id | Issue | Route/fixture | Exact goal phrase | Exact failure-cause phrase | Exact second-run repair phrase | Completed one run in 5 minutes? | Observer intervention before 30 seconds? | Decision | Follow-up issue and disposition | Copy ready? |
|---|---|---|---|---|---|---|---|---|---|---|
| P-01 | #36 | clean |  |  |  | yes/no | yes/no | Pass/Fix/Cut |  | yes/no |
| P-02 | #37 | dirty |  |  |  | yes/no | yes/no | Pass/Fix/Cut |  | yes/no |
| P-03 | #38 | missing-control |  |  |  | yes/no | yes/no | Pass/Fix/Cut |  | yes/no |

## #39 SME Staging

Before copying to the ledger, confirm the reviewer covered all three fixtures and rated the same five core mechanics that the ledger expects.

Allowed ratings: `Accurate enough`, `Acceptable simplification`, `Misleading`, `Unsafe/ethically wrong`.

| Check | Required value |
|---|---|
| Source issue | #39 |
| Row id | `SME-01` |
| Target docs | `docs/fly-lab-external-evidence-ledger.md`, `docs/fly-lab-validation-results.md` |
| Required fixture coverage | clean, dirty, missing-control |
| Required ratings | stock/vial/calendar, virgin/cross timing, CO2/sorting, negative geotaxis, record/reviewer logic |
| Count blocker | No accepted #33 SME count until validation results repeat all three fixtures, five ratings, decision, and any follow-up disposition |

| Review id | Fixtures reviewed | Stock/vial/calendar | Virgin/cross timing | CO2/sorting | Negative geotaxis | Record/reviewer logic | Decision | Follow-up issue and disposition | Copy ready? |
|---|---|---|---|---|---|---|---|---|---|
| SME-01 | clean, dirty, missing-control |  |  |  |  |  | Pass/Fix/Cut |  | yes/no |

## Copy Gate

Before editing accepted counts:

1. Compare staged rows against `docs/external-validation-launch-matrix.md`.
2. Copy accepted `LE-*` rows to both `docs/fly-lab-external-evidence-ledger.md` and `docs/fly-lab-experience-map.md`.
3. Copy accepted `P-*` and `SME-*` rows to both `docs/fly-lab-external-evidence-ledger.md` and `docs/fly-lab-validation-results.md`.
4. Open or link concrete follow-up issues for every `Fix` or `Cut` row before counting it.
5. Run `node tools/external-validation-full-check.js --live-issues`.
6. Comment on #27 or #33 and the execution issue with accepted/rejected row ids and remaining counts.

## Current Decision

Keep #27, #33, and the thread goal open until staging has been converted into accepted non-proxy evidence rows, target docs match, and the full live check passes.
