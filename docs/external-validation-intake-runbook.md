# External Validation Intake Runbook

Date opened: 2026-08-23

Purpose: define the exact edit order after real #35 through #39 evidence is collected. This runbook prevents raw notes, ledger counts, validation results, issue comments, and closure audits from drifting apart.

This is not evidence. Do not raise any accepted count from this document.

## Before Any Session

Run:

```bash
node tools/external-validation-full-check.js --live-issues
```

Required result before starting:

- #27, #33, and #35 through #39 are still open.
- #35 through #39 issue bodies and labels match the execution contracts.
- The open-issue triage still parks the Unity/old-loop backlog.
- Final closure readiness reports `not ready; external evidence still missing`.

If the command fails, fix the guardrail drift before collecting new evidence.

## Intake Source Order

Use the source matching the execution issue:

| Issue | Raw source | Countable row |
|---|---|---|
| #35 | `docs/external-validation-session-packets.md` #35 packet or `?validation=lived` | `LE-01` through `LE-05` |
| #36 | `docs/external-validation-session-packets.md` #36 packet or `?validation=capture` | `P-01` clean |
| #37 | `docs/external-validation-session-packets.md` #37 packet or `?validation=capture` | `P-02` dirty |
| #38 | `docs/external-validation-session-packets.md` #38 packet or `?validation=capture` | `P-03` missing-control |
| #39 | `docs/external-validation-session-packets.md` #39 packet or SME sheet | `SME-01` |

Use `docs/external-validation-launch-matrix.md` before the session to select the exact prototype URL, fixture, packet, target docs, and count rule. The launch matrix is not evidence and must not raise accepted counts.

Preserve exact wording from the respondent/player/reviewer before summarizing. Screenshots, smoke tests, packet visibility, implementer walkthroughs, and generic source summaries still do not count as external evidence.

## Accepted Row Edit Order

For each accepted `LE-*` row:

1. Copy the accepted row into `docs/fly-lab-external-evidence-ledger.md`.
2. Copy the same `LE-*` row into `docs/fly-lab-experience-map.md` with the same provenance, procedure event, game verb, player skill, failure mode, delayed consequence, and design effect.
3. Update #35 with the raw-answer source and row ids.
4. Update #27 with accepted counts and remaining #27 closure status.
5. Run `node tools/external-evidence-check.js`.

For each accepted `P-*` row:

1. Append the raw session summary and exact phrases to `docs/fly-lab-validation-results.md`.
2. Copy the accepted row into `docs/fly-lab-external-evidence-ledger.md`.
3. Confirm the validation result repeats the same route/fixture, goal phrase, failure-cause phrase, second-run repair phrase, decision, and follow-up disposition.
4. Update the matching execution issue #36, #37, or #38.
5. Update #33 with accepted counts and remaining route/SME gaps.
6. Run `node tools/external-evidence-check.js`.

For the accepted `SME-01` row:

1. Append fixture coverage and five ratings to `docs/fly-lab-validation-results.md`.
2. Copy the accepted row into `docs/fly-lab-external-evidence-ledger.md`.
3. Confirm the validation result repeats clean, dirty, and missing-control fixture coverage plus the same five ratings, decision, and follow-up disposition.
4. Update #39.
5. Update #33 with accepted counts and remaining player/follow-up gaps.
6. Run `node tools/external-evidence-check.js`.

## Fix/Cut Handling

Before a `Fix` or `Cut` row can count:

1. Open a concrete GitHub issue for the implementation change.
2. Use the scoped implementation fields required by `.github/ISSUE_TEMPLATE/fly_lab_validation_finding.yml` or `.github/ISSUE_TEMPLATE/fly_lab_lived_experience.yml`.
3. Resolve the follow-up issue or explicitly mark it `accepted non-blocking`.
4. Put the same follow-up issue reference and disposition in both the ledger row and the matching validation-results row.
5. Run `node tools/external-evidence-check.js`.

Do not use #27 or #33 as the follow-up reference for a counted Fix/Cut row.

## Status Update Order

After any accepted evidence row changes:

1. `docs/fly-lab-external-evidence-ledger.md`
2. `docs/fly-lab-experience-map.md` for `LE-*`, or `docs/fly-lab-validation-results.md` for `P-*` and `SME-*`
3. `web-prototype/data.js` external-evidence counts
4. `docs/external-validation-execution-tracker.md`
5. `docs/r-series-progress-audit.md`
6. `docs/goal-completion-audit-2026-08-22.md`
7. Execution issue #35, #36, #37, #38, or #39
8. Parent issue #27 or #33

Do not edit closure-ready language until the validators demand it from actual accepted counts.

## Required Verification After Intake

Run:

```bash
node tools/external-validation-full-check.js --live-issues
```

On the final closure commit only, also run:

```bash
node tools/final-closure-readiness-check.js --require-ready
```

The `--require-ready` command must fail while #27 or #33 evidence is still missing.

## Rejection Notes

Rejected notes may be summarized in the execution issue, but they must not raise ledger counts.

Reject evidence if it is:

- coached before the first 30 seconds for a player row
- missing exact player phrases
- missing SME fixture coverage or ratings
- sourced from screenshots, smoke tests, implementer walkthroughs, or packet visibility
- a generic preference without a lab procedure event
- a phenomenon-first idea not grounded in lived evidence and SME review

## Closure Handoff

Only after the full-check passes and `node tools/final-closure-readiness-check.js --require-ready` passes:

1. Run `docs/final-closure-review-checklist.md`.
2. Close #27 with links to `LE-*` evidence rows and CI.
3. Close #33 with links to `P-*`, `SME-*`, any Fix/Cut follow-up dispositions, and CI.
4. Update `docs/goal-completion-audit-2026-08-22.md` from not-complete to final-complete.
5. Report parked Unity/old-loop backlog separately from the completed R-series objective.
