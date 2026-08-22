# External Validation Sprint Plan

Date opened: 2026-08-22

Purpose: turn the remaining #27 and #33 blockers into one executable validation sprint. This plan does not replace the evidence ledger. It defines who runs what, in what order, and which artifact must change before either issue can close.

Session packet source: use [`external-validation-session-packets.md`](external-validation-session-packets.md) as the issue-by-issue field packet for #35 through #39.

Execution tracker: use [`external-validation-execution-tracker.md`](external-validation-execution-tracker.md) to see which #35 through #39 evidence rows are still missing before closure.

Intake runbook: use [`external-validation-intake-runbook.md`](external-validation-intake-runbook.md) after a real session to apply raw notes, accepted rows, status counts, issue comments, and verification commands in the correct order.

## Sprint Goal

Produce the missing non-proxy evidence for the R-series Procedure Lab slice:

| Gate | Needed output | Target artifact |
|---|---|---|
| #27 lived experience | 5 accepted `LE-*` rows, with at least 1 design-changing row | `docs/fly-lab-external-evidence-ledger.md`, `docs/fly-lab-experience-map.md` |
| #33 player validation | 3 accepted `P-*` first-run sessions covering clean, dirty, and missing-control routes or fixtures | `docs/fly-lab-external-evidence-ledger.md`, `docs/fly-lab-validation-results.md` |
| #33 SME validation | 1 accepted `SME-*` review covering clean, dirty, and missing-control fixtures | `docs/fly-lab-external-evidence-ledger.md`, `docs/fly-lab-validation-results.md` |
| Follow-up handling | Concrete issue references for every counted Fix/Cut row, with resolved or accepted-non-blocking disposition | GitHub issues, `docs/fly-lab-validation-results.md` |

## Execution Issues

Use these issues to run the sprint without blending evidence types:

| Issue | Evidence slot | Output |
|---|---|---|
| #35 | #27 lived-experience interview | `LE-01` through `LE-05`, including at least one design-changing row |
| #36 | #33 clean-route fresh-player session | `P-01` clean route or fixture evidence |
| #37 | #33 dirty-route fresh-player session | `P-02` dirty route or fixture evidence |
| #38 | #33 missing-control fresh-player session | `P-03` missing-control route or fixture evidence |
| #39 | #33 biology-aware SME review | `SME-01` clean, dirty, and missing-control fixture review with five core ratings |

Do not close #27 before #35 is resolved and reflected in the ledger and experience map.

Do not close #33 before #36, #37, #38, and #39 are resolved and reflected in the ledger and validation results.

## Roles

| Role | Responsibility | Must not do |
|---|---|---|
| Moderator | Starts sessions, reads only the allowed prompts, records exact phrases | Explain the game goal before the first 30 seconds |
| Recorder | Fills `docs/fly-lab-session-capture-packet.md` during or immediately after each session | Convert rough notes into polished summaries before raw phrases are captured |
| Evidence editor | Copies accepted rows into the ledger, experience map, and validation results | Raise accepted counts without matching `LE-*`, `P-*`, or `SME-*` result rows |
| Implementer | Opens and resolves scoped Fix/Cut follow-up issues when evidence demands a change | Patch mechanics from vibes, screenshots, or unaccepted notes |
| Closure reviewer | Runs the final checklist after all thresholds are met | Close #27, #33, or the thread goal from packet existence alone |

One person may hold multiple roles, but the same person cannot count their own implementer walkthrough as a fresh-player session.

## Session Order

Run the sprint in this order:

1. Preflight the current build.
2. Collect #27 lived-experience answers before editing game rules from memory.
3. Run three #33 player sessions.
4. Run one #33 SME review.
5. Open or resolve follow-up issues required by Fix/Cut rows.
6. Update the ledger, result docs, and issue comments.
7. Run final local verification.
8. Push and wait for main CI.
9. Only then run `docs/final-closure-review-checklist.md`.

## Preflight

Run:

```bash
node web-prototype/smoke-tests.js
node tools/r-series-status-check.js
node tools/external-evidence-check.js
node tools/issue-template-contract-check.js
```

Open these launch aids:

| Purpose | URL |
|---|---|
| Player validation packet | `web-prototype/index.html?validation=packet` |
| Capture packet | `web-prototype/index.html?validation=capture` |
| Lived-experience packet | `web-prototype/index.html?validation=lived` |
| Current evidence status | `web-prototype/index.html?validation=status` |
| Clean fixture | `web-prototype/index.html?fixture=clean` |
| Dirty fixture | `web-prototype/index.html?fixture=dirty` |
| Missing-control fixture | `web-prototype/index.html?fixture=missing-control` |

## #27 Lived-Experience Run

Use `docs/fly-lab-lived-experience-response-form.md` or `web-prototype/index.html?validation=lived`.

Minimum accepted output:

| Row | Required evidence |
|---|---|
| `LE-01` | firsthand or observed-lab procedure event translated into a game verb |
| `LE-02` | firsthand or observed-lab failure mode with delayed consequence |
| `LE-03` | firsthand or observed-lab player skill or visual tell |
| `LE-04` | firsthand or observed-lab criticism, pressure, or reviewer-facing weakness |
| `LE-05` | firsthand or observed-lab competence, comedy boundary, or exclusion guardrail |

At least one accepted `LE-*` row must have design effect `mechanic change`, `guardrail change`, or `SME risk update`.

Reject the row instead of counting it if it is secondhand trivia, general preference, unsupported spectacle, or only a prompt screenshot.

## #33 Player Sessions

Use `docs/fly-lab-playtest-sheet.md` and the player section of `docs/fly-lab-session-capture-packet.md`.

Assign target coverage before the sessions:

| Session | Target route or fixture coverage | Required exact phrases |
|---|---|---|
| `P-01` | clean | goal, failure cause, second-run repair |
| `P-02` | dirty | goal, failure cause, second-run repair |
| `P-03` | missing-control | goal, failure cause, second-run repair |

The player can wander naturally, but the accepted set must cover clean, dirty, and missing-control routes or fixtures before closure review.

Do not count a player row as Pass if:

- the moderator explains the goal before the first 30 seconds
- the player finishes but cannot identify why the reviewer attacked the run
- the player proposes a second-run repair the current game cannot support
- the row lacks the exact phrases required by the ledger

Use `Fix` when the route is playable but comprehension fails. Use `Cut` when the route teaches the wrong model or cannot be repaired without reworking the slice.

## #33 SME Review

Use `docs/fly-lab-sme-validation-sheet.md` and the SME section of `docs/fly-lab-session-capture-packet.md`.

The accepted `SME-01` review must cover all three fixtures:

- `web-prototype/index.html?fixture=clean`
- `web-prototype/index.html?fixture=dirty`
- `web-prototype/index.html?fixture=missing-control`

The result row must rate the five ledger mechanics:

| Ledger field | Source mechanics to consider |
|---|---|
| Stock/vial/calendar | stock age, vial age, maintenance timing, label completeness |
| Virgin/cross timing | virgin collection window and cross setup confidence |
| CO2/sorting | anesthesia tradeoff, sex/marker sorting abstraction, downstream caveat |
| Negative geotaxis | n, control, confidence, caveats, assay interpretation |
| Record/reviewer logic | whether the reviewer attack follows from the recorded weakness |

Any `Misleading` or `Unsafe/ethically wrong` rating requires a concrete Fix/Cut follow-up issue before the SME row can count.

## Update Order

After each accepted run:

Follow the detailed edit sequence in `docs/external-validation-intake-runbook.md`. In short:

1. Preserve raw notes and exact phrases before summarizing.
2. Update the matching result document and ledger row.
3. Mirror `LE-*` rows into the experience map, or mirror `P-*`/`SME-*` rows into validation results.
4. Open and disposition follow-up issues for every counted Fix/Cut row.
5. Run `node tools/external-validation-full-check.js --live-issues` before requesting closure review.

## Follow-Up Issue Rule

A Fix/Cut row can count only if the follow-up field names a concrete GitHub issue and says either:

- `resolved`
- `accepted non-blocking`

Do not count these as follow-up evidence:

- `TBD`
- `later`
- `needs issue`
- `see #27`
- `see #33`
- an open blocker without disposition

## Final Sprint Verification

Run:

```bash
node tools/external-validation-full-check.js --live-issues
gh run list --branch main --limit 5
```

Then run `docs/final-closure-review-checklist.md`.

## Drift Controls

- Screenshots can guide moderation, but they cannot fill `LE-*`, `P-*`, or `SME-*` rows.
- Do not revive Light-Induced Swarm Dance unless a lived-experience row and SME review both support it.
- Do not pull parked Unity issues into the R-series sprint unless evidence creates a rewritten R-series issue.
- Do not change required evidence counts to fit available evidence.
- Do not mark the thread goal complete until #27 and #33 are closed with evidence links and latest main CI is green.
