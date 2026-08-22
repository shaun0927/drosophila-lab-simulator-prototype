# R-Series Progress Audit

Date: 2026-08-22

Parent contract: [`fly-lab-product-thesis.md`](fly-lab-product-thesis.md)

Implementation PR: https://github.com/shaun0927/drosophila-lab-simulator-prototype/pull/34 merged to `main` at merge commit `f470330`.

CI guardrail: `.github/workflows/web-prototype-smoke.yml` runs JavaScript syntax checks and `node web-prototype/smoke-tests.js` on pull requests and pushes.

## Current implementation status

| Issue | Status | Evidence | Remaining gap |
|---|---|---|---|
| #26 R0 Product thesis | Closed | `docs/fly-lab-product-thesis.md`; supersession notes in README and existing design docs; merged via PR #34; main CI green | None for R0 |
| #27 R1 Experience map | Open, ready for user input | `docs/fly-lab-experience-map.md` has 16 events, 3 first-slice candidates, source list, and interview prompts; `docs/fly-lab-lived-experience-response-form.md` and `.github/ISSUE_TEMPLATE/fly_lab_lived_experience.yml` define the exact response format | User lived-experience answers are still pending, so the issue is not fully complete |
| #28 R2 Stock/vial/calendar state | Closed | `web-prototype/data.js`, `web-prototype/app.js`, `web-prototype/style.css`; smoke verified starting stocks, vial rack, label, flip, advance day, overdue consequence, notebook; merged via PR #34; main CI green | Player comprehension validation continues under #33 |
| #29 R3 Cross planner/virgin window | Closed | Lab route supports clear adults, next-day virgin window, collect candidates, select males, set cross vial, schedule scoring window; smoke verified flow; merged via PR #34; main CI green | SME timing review continues under #33 |
| #30 R4 CO2 bench/sorting | Closed | Procedure Lab has CO2 bench sorting, specimen pad cards, specimen zones, exposure meter, batch records, purity, ambiguity, confidence, and caveats; browser QA passed; merged via PR #34; main CI green | SME visual-tell and player bench-feel validation continue under #33 |
| #31 R5 Negative geotaxis assay | Closed | Batch records produce assay records with n, control, mean climb score, variance, confidence, caveats, and mini-plot bars; merged via PR #34; main CI green | SME scoring-abstraction and player readability validation continue under #33 |
| #32 R6 Figure/reviewer rewrite | Closed | Figure summary uses ExperimentRecord aggregation; reviewer findings inspect lineage, missing control, low n, CO2, ambiguity, and overclaim; URL fixtures cover representative paths; merged via PR #34; main CI green | Broader player/SME validation continues under #33 |
| #33 R7 Vertical slice validation | Open, ready for external validation | `web-prototype/smoke-tests.js`, URL fixtures, browser QA, `docs/fly-lab-playtest-sheet.md`, `docs/fly-lab-sme-validation-sheet.md`, `docs/fly-lab-validation-runbook.md`, `docs/fly-lab-validation-results.md`, and `.github/ISSUE_TEMPLATE/fly_lab_validation_finding.yml` | External player/SME validation has not been run, so #33 cannot close |

## Verification run

Commands run:

```bash
node --check web-prototype/app.js
node --check web-prototype/data.js
node --check web-prototype/smoke-tests.js
node web-prototype/smoke-tests.js
```

Smoke checks run with a DOM stub:

```text
R2 smoke passed: route, starting stocks, label, flip, advance day, calendar, notebook
R2 consequence smoke passed: overdue risk, confidence penalty, notebook consequence
R3 smoke passed: clear, window, collect, select males, set cross, scoring calendar
legacy route smoke passed: old publication prototype still reaches phenomenon screen
R4/R5 smoke passed: CO2 sorting, batch caveats, assay records, control/n caveats
R6 smoke passed: reviewer attacks record caveats and claim strength with evidence refs
fly-lab smoke passed: R2/R3, clean, dirty, missing-control, URL fixtures, legacy route
browser smoke passed: file URL Procedure Lab renders and sorting click registers
browser smoke passed: specimen pad renders and sorting click registers
browser smoke passed: assay mini-plot renders after controlled run
browser smoke passed: clean/dirty/missing-control URL fixtures load expected reviewer findings
responsive browser QA passed: desktop/mobile fixtures render without horizontal overflow
main CI passed: Web prototype smoke run https://github.com/shaun0927/drosophila-lab-simulator-prototype/actions/runs/32563843521
```

## Drift audit

No new arbitrary behavior phenomenon was added. `Light-Induced Swarm Dance` remains only in the old publication-satire route. The new default entry point sends the player to Procedure Lab first.

The current implementation stays aligned with the parent contract because:

- the first new system is stock/vial/calendar state
- all lab actions create notebook entries
- bad labels and old vials reduce lineage confidence
- virgin collection creates a timing window instead of a trivia prompt
- cross setup produces a scheduled scoring window rather than instant results
- CO2 sorting produces batch records with purity, ambiguity, exposure, and caveats, and presents specimens as a pad interaction rather than only a table
- negative geotaxis produces assay records with n, control, mean climb, variance, confidence, and caveats, and displays a compact plot for readability
- reviewer attacks now point to evidence refs from experiment records
- clean, dirty, and missing-control validation paths are reproducible through URL fixtures

## Why the full goal is not complete yet

The full objective asks for all R-series issues to be worked through, verified, analyzed, improved, and repeated without drift. R0 and R2-R6 are now closed because implementation, smoke coverage, browser QA where relevant, merge, and main CI evidence are sufficient for their scoped DoD. The full goal is still not complete because #27 and #33 require external/user evidence that has not been collected.

The remaining work is not blocked, but it must stay sequenced:

1. Run three player sessions using `docs/fly-lab-playtest-sheet.md`.
2. Run one SME or biology-aware review using `docs/fly-lab-sme-validation-sheet.md`.
3. Open fix/cut issues for misleading mechanics or serious player comprehension failures.
4. Only then decide whether #33 can close.

## Next iteration checklist

1. Run `node web-prototype/smoke-tests.js` after every change.
2. Perform browser visual QA on the Procedure Lab route.
3. Run player/SME validation and record results in `docs/fly-lab-validation-results.md`.
4. Open follow-up issues for validation failures.

## Do not do next

- Do not expand the phenomenon catalog.
- Do not build a full Mendelian solver before the one-cross loop is validated.
- Do not polish reviewer jokes before R5 records exist.
- Do not close #27 until user lived-experience answers are reflected.
