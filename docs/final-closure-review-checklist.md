# Final Closure Review Checklist

Date opened: 2026-08-22

Purpose: run this only after the external evidence ledger says #27 and #33 are ready for closure review. This checklist prevents the final thread goal from being marked complete merely because local tests pass or because the evidence packet exists.

## Required Inputs

- `docs/fly-lab-external-evidence-ledger.md` has #27 lived rows `5 / 5`, #27 design-changing lived evidence `1 / 1`, #33 player sessions `3 / 3`, #33 player route coverage `3 / 3`, and #33 SME review `1 / 1`.
- `docs/fly-lab-experience-map.md` says `User lived-experience pass: ready for closure review`.
- `docs/fly-lab-validation-results.md` says `External evidence ready for closure review`.
- `docs/r-series-progress-audit.md` says `#27 and #33 evidence thresholds met`.
- `docs/goal-completion-audit-2026-08-22.md` says `Ready for final closure audit`.
- `node tools/external-evidence-check.js` passes on the same commit.

## Evidence Integrity Checks

- Every accepted `LE-*` row in the ledger appears in `docs/fly-lab-experience-map.md` with the same provenance, procedure event, game verb, player skill, failure mode, delayed consequence, and design effect.
- Every accepted `P-*` row in the ledger appears in `docs/fly-lab-validation-results.md` with the same route/fixture, goal phrase, failure-cause phrase, second-run repair phrase, decision, and any Fix/Cut follow-up issue reference plus disposition.
- Every accepted `SME-*` row in the ledger appears in `docs/fly-lab-validation-results.md` with clean, dirty, and missing-control fixture coverage plus the same five core ratings, decision, and any Fix/Cut follow-up issue reference plus disposition.
- No accepted row uses screenshots, smoke tests, implementer walkthroughs, generic screenshot review, or source-only summaries as player, SME, or lived-experience evidence.
- No counted Fix/Cut follow-up references #27 or #33 as its implementation issue.

## Issue State Checks

- #27 is still open until the accepted lived-experience rows are reflected in `docs/fly-lab-experience-map.md` and any design-changing row has a scoped implementation issue or an explicit no-code disposition.
- #33 is still open until all player sessions, route coverage, SME review, and required follow-up issue dispositions are reflected in `docs/fly-lab-validation-results.md`.
- Parked Unity/old-loop issues remain parked unless a new explicit product decision rewrites them against the R-series Procedure Lab contract.
- `Light-Induced Swarm Dance` remains outside the first slice unless real lived-experience evidence and SME review both support reintroduction.

## Final Verification Commands

Run these on the closure commit:

```bash
node --check web-prototype/app.js
node --check web-prototype/data.js
node --check web-prototype/smoke-tests.js
node --check tools/external-evidence-check.js
node --check tools/external-evidence-check.test.js
node --check tools/r-series-status-check.js
node web-prototype/smoke-tests.js
node tools/r-series-status-check.js
node tools/external-evidence-check.js
node tools/external-evidence-check.test.js
node tools/issue-template-contract-check.js
git diff --check
gh run list --branch main --limit 5
```

## Completion Decision

Mark the thread goal complete only after:

1. #27 and #33 are closed with comments linking the evidence rows, validation results, and CI run.
2. `docs/goal-completion-audit-2026-08-22.md` changes from `Do not mark the thread goal complete` to a final complete decision.
3. The latest main CI run is green for the commit containing the final audit.
4. The final answer reports any remaining non-current parked backlog separately from the completed R-series objective.
