# R-Series Progress Audit

Date: 2026-08-22

Parent contract: [`fly-lab-product-thesis.md`](fly-lab-product-thesis.md)

Implementation PR: https://github.com/shaun0927/drosophila-lab-simulator-prototype/pull/34 merged to `main` at merge commit `f470330`.

CI guardrail: `.github/workflows/web-prototype-smoke.yml` runs JavaScript syntax checks, `node web-prototype/smoke-tests.js`, `node tools/r-series-status-check.js`, `node tools/external-evidence-check.js`, `node tools/external-validation-tracker-check.js`, `node tools/external-validation-tracker-check.test.js`, `node tools/external-validation-execution-contract-check.js`, `node tools/external-validation-execution-contract-check.test.js`, `node tools/external-validation-intake-runbook-check.js`, `node tools/external-validation-intake-runbook-check.test.js`, `node tools/external-validation-gap-report.js`, `node tools/external-validation-gap-report.test.js`, `node tools/external-validation-preflight-check.js`, `node tools/external-validation-preflight-check.test.js`, `node tools/external-evidence-check.test.js`, `node tools/external-validation-issue-state-audit.test.js`, `node tools/final-closure-readiness-check.js`, `node tools/final-closure-readiness-check.test.js`, `node tools/open-issue-triage-audit.test.js`, and `node tools/issue-template-contract-check.js` on pull requests and pushes.

Status guardrail: `node tools/r-series-status-check.js` verifies that required R-series artifacts, validation packets, screenshot evidence, external blocker language, issue-template contract checks, and parked-issue drift guardrails are still present.

External-evidence guardrail: `node tools/external-evidence-check.js` verifies that ledger counts match intake rows, in-app status counts, and pending/open/not-complete audit language while #27 and #33 external evidence remains incomplete.

Issue-template contract guardrail: `node tools/issue-template-contract-check.js` verifies that #27 lived-experience entries and #33 validation findings keep scoped implementation fields required before they can become implementation work.

Open-issue triage: [`open-issue-triage-2026-08-22.md`](open-issue-triage-2026-08-22.md) classifies the older Unity/phenomenon-first issues so they do not steer the current R-series browser slice by accident.

Open-issue triage live audit: `node tools/open-issue-triage-audit.js` uses authenticated `gh` locally to verify that active R-series issues have `r-series-current`, parked Unity/old-loop issues have `parked-unity-line` plus `post-r-series-backlog`, superseded planning issues stay closed, and no unclassified issue through #39 is open. `node tools/open-issue-triage-audit.test.js` covers this policy in CI with mock issues.

Thread-goal audit: [`goal-completion-audit-2026-08-22.md`](goal-completion-audit-2026-08-22.md) checks the user's active objective requirement by requirement and records why the overall goal is still not complete.

Final closure checklist: [`final-closure-review-checklist.md`](final-closure-review-checklist.md) defines the last review pass required after #27 and #33 evidence thresholds are met and before the thread goal can be marked complete.

Final closure readiness guardrail: `node tools/final-closure-readiness-check.js` verifies that the current not-ready state preserves no-closure language, and `node tools/final-closure-readiness-check.js --require-ready` fails until #27/#33 evidence counts and clean/dirty/missing-control route coverage are ready for closure review.

External validation sprint plan: [`external-validation-sprint-plan.md`](external-validation-sprint-plan.md) turns the remaining #27/#33 evidence work into a role-based session order with update, follow-up, and closure rules.

External validation intake runbook: [`external-validation-intake-runbook.md`](external-validation-intake-runbook.md) defines the exact edit order after #35 through #39 produce real evidence, including when to update ledger rows, result docs, status counts, issue comments, and final closure commands.

External validation intake runbook guardrail: `node tools/external-validation-intake-runbook-check.js` verifies the runbook keeps the required source order, accepted-row edit order, Fix/Cut handling, status update order, and final closure handoff rules. `node tools/external-validation-intake-runbook-check.test.js` keeps missing-warning, command drift, section-order, and status-update mismatch fixtures in CI.

External validation execution issues: #35 collects #27 `LE-01` through `LE-05`; #36 collects #33 `P-01` clean; #37 collects #33 `P-02` dirty; #38 collects #33 `P-03` missing-control; #39 collects #33 `SME-01` fixture/rating review.

Session packet source: [`external-validation-session-packets.md`](external-validation-session-packets.md) provides copy-ready raw packets for #35 through #39 so session notes can be captured before ledger/result rows are edited.

External validation execution contract guardrail: `node tools/external-validation-execution-contract-check.js` verifies the local #35-#39 packet contract, and `node tools/external-validation-execution-contract-check.js --live-issues` verifies the live execution issue bodies, labels, gap-report command, full live wrapper command, malformed handoff command rejection, and required commands before evidence collection proceeds.

External validation execution tracker: [`external-validation-execution-tracker.md`](external-validation-execution-tracker.md) records that #35 through #39 are open and that #27/#33 accepted evidence counts remain at zero until real sessions are recorded. `node tools/external-validation-tracker-check.js` verifies the tracker counts against the ledger and route-coverage status.

External validation tracker self-test: `node tools/external-validation-tracker-check.test.js` verifies that tracker count mismatches, route coverage mismatches, stale ready language with zero or partial evidence, premature closed/resolved issue-state language, and missing no-closure decisions are rejected before execution-state updates can drift.

External validation gap report: `node tools/external-validation-gap-report.js` prints the current remaining #27/#33 evidence gaps, their accepted/required/remaining counts, execution issue mapping, and the no-closure decision while evidence is missing. `node tools/external-validation-gap-report.test.js` covers pending, partial, ready, and tracker cross-check fixtures.

External validation preflight guardrail: `node tools/external-validation-preflight-check.js` verifies the sprint plan requires the pre-session smoke/status/evidence/template/gap/full-live commands, all launch URLs, and anti-proxy/no-closure warnings before sessions begin. `node tools/external-validation-preflight-check.test.js` covers missing command, missing launch aid, missing warning, and ordering fixtures.

Live issue-state audit: `node tools/external-validation-issue-state-audit.js` uses authenticated `gh` locally to verify that #27, #33, and #35 through #39 still match the open states recorded in the execution tracker. This is not a CI gate because it depends on live GitHub issue state.

Issue-state audit self-test: `node tools/external-validation-issue-state-audit.test.js` uses mock issue states in CI to verify that the live audit parser rejects closed issues, missing no-closure decisions, and missing required execution issues.

Full local verification wrapper: `node tools/external-validation-full-check.js` runs the non-live syntax, smoke, R-series status, external-evidence ledger, tracker, audit self-test, issue-template, and whitespace checks. Add `--live-issues` to include the authenticated `gh` issue-state audit before closure decisions.

External-evidence ledger: [`fly-lab-external-evidence-ledger.md`](fly-lab-external-evidence-ledger.md) records the unfilled #27 lived-experience slots and #33 player/SME validation slots.

## Current implementation status

| Issue | Status | Evidence | Remaining gap |
|---|---|---|---|
| #26 R0 Product thesis | Closed | `docs/fly-lab-product-thesis.md`; supersession notes in README and existing design docs; merged via PR #34; main CI green | None for R0 |
| #27 R1 Experience map | Open, ready for user input | `docs/fly-lab-experience-map.md` has 16 events, 3 first-slice candidates, source list, and interview prompts; `docs/fly-lab-lived-experience-response-form.md`, `?validation=lived`, `.github/ISSUE_TEMPLATE/fly_lab_lived_experience.yml`, and `node tools/issue-template-contract-check.js` define and guard the exact response-to-implementation contract | User lived-experience answers are still pending, so the issue is not fully complete |
| #28 R2 Stock/vial/calendar state | Closed | `web-prototype/data.js`, `web-prototype/app.js`, `web-prototype/style.css`; smoke verified starting stocks, vial rack, label, flip, advance day, overdue consequence, notebook; merged via PR #34; main CI green | Player comprehension validation continues under #33 |
| #29 R3 Cross planner/virgin window | Closed | Lab route supports clear adults, next-day virgin window, collect candidates, select males, set cross vial, schedule scoring window; smoke verified flow; merged via PR #34; main CI green | SME timing review continues under #33 |
| #30 R4 CO2 bench/sorting | Closed | Procedure Lab has CO2 bench sorting, specimen pad cards, specimen zones, exposure meter, batch records, purity, ambiguity, confidence, and caveats; browser QA passed; merged via PR #34; main CI green | SME visual-tell and player bench-feel validation continue under #33 |
| #31 R5 Negative geotaxis assay | Closed | Batch records produce assay records with n, control, mean climb score, variance, confidence, caveats, and mini-plot bars; merged via PR #34; main CI green | SME scoring-abstraction and player readability validation continue under #33 |
| #32 R6 Figure/reviewer rewrite | Closed | Figure summary uses ExperimentRecord aggregation; reviewer findings inspect lineage, missing control, low n, CO2, ambiguity, and overclaim; URL fixtures cover representative paths; merged via PR #34; main CI green | Broader player/SME validation continues under #33 |
| #33 R7 Vertical slice validation | Open, proxy-audited and ready for external validation | `web-prototype/smoke-tests.js`, URL fixtures, `?validation=packet`, browser QA, objective strip screenshots, Reviewer #2 repair-plan checks, `docs/fly-lab-playtest-sheet.md`, `docs/fly-lab-sme-validation-sheet.md`, `docs/fly-lab-validation-runbook.md`, `docs/fly-lab-validation-results.md`, `.github/ISSUE_TEMPLATE/fly_lab_validation_finding.yml`, and `node tools/issue-template-contract-check.js` | External player/SME validation has not been run, so #33 cannot close |

## Verification run

Commands run:

```bash
node --check web-prototype/app.js
node --check web-prototype/data.js
node --check web-prototype/smoke-tests.js
node --check tools/external-evidence-check.js
node --check tools/external-evidence-check.test.js
node --check tools/issue-template-contract-check.js
node web-prototype/smoke-tests.js
node tools/r-series-status-check.js
node tools/external-evidence-check.js
node tools/external-evidence-check.test.js
node tools/issue-template-contract-check.js
```

Smoke checks run with a DOM stub:

```text
R2 smoke passed: route, starting stocks, label, flip, advance day, calendar, notebook
R2 consequence smoke passed: overdue risk, confidence penalty, notebook consequence
R3 smoke passed: clear, window, collect, select males, set cross, scoring calendar
legacy route smoke passed: old publication prototype still reaches phenomenon screen
R4/R5 smoke passed: CO2 sorting, batch caveats, assay records, control/n caveats
R6 smoke passed: reviewer attacks record caveats and claim strength with evidence refs
fly-lab smoke passed: R2/R3, objective strip, reviewer repair plans, validation/status/capture packets, clean, dirty, missing-control, URL fixtures, legacy route
browser smoke passed: file URL Procedure Lab renders and sorting click registers
browser smoke passed: specimen pad renders and sorting click registers
browser smoke passed: assay mini-plot renders after controlled run
browser smoke passed: clean/dirty/missing-control URL fixtures load expected reviewer findings
responsive browser QA passed: desktop/mobile fixtures render without horizontal overflow
main CI status must be checked for the latest pushed commit with `gh run list --branch main --limit 5`
screenshot UX audit passed after fixing Procedure Lab chrome drift: `dogfood-output/screenshot-ux-audit.md`
screenshot proxy passed: objective strip visible on desktop/mobile clean fixture
screenshot proxy passed: objective strip and repair plan visible on desktop/mobile clean fixture
screenshot proxy passed: validation packet visible on desktop/mobile without legacy drift
screenshot proxy passed: lived-experience packet visible on desktop/mobile without legacy drift
r-series status check passed: artifacts present, packets wired, external blockers preserved, parked scope guarded, goal audit and evidence ledger linked
external evidence ledger check passed: counts match intake rows, status docs, and in-app status
pass fixture accepted: partial player evidence in progress
pass fixture accepted: partial lived-experience evidence in progress
external evidence checker self-test passed
issue template contract check passed: evidence follow-up forms require scoped implementation fields
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
- Procedure Lab chrome now uses `Lab Record View` and `can the notebook defend the claim?` instead of old phenomenon-first chamber/footer language
- Procedure Lab first screen now exposes current goal, next action, record risk, and reviewer vulnerability before the dense system list
- Reviewer #2 results now include next-run repair plans tied to the attacked record weakness, so the validation slice tests whether failure can teach a better second run
- `?validation=status` opens an in-app status view showing #27 at 0/5 lived rows and #33 at 0/3 player sessions plus 0/1 SME review
- the in-app status view distinguishes missing external evidence from in-progress partial evidence before closure review
- `?validation=packet` opens an in-app launch page for #33 player/SME sessions with fixture links and closure criteria
- `?validation=capture` opens an in-app raw evidence capture checklist for #27/#33 session notes before ledger updates
- `?validation=lived` opens a separate #27 launch page for collecting real lab incidents without mixing them into #33 validation evidence
- `node tools/external-evidence-check.js` prevents the ledger, in-app status, validation results, progress audit, and goal audit from drifting apart while external evidence counts remain incomplete, without blocking valid partial evidence updates
- `node tools/external-evidence-check.js` rejects accepted LE/player/SME rows that still contain incomplete required evidence fields
- `node tools/external-evidence-check.js` rejects accepted external-evidence rows that use screenshots, smoke tests, implementer walkthroughs, or proxy reviews as the evidence source
- `node tools/external-evidence-check.js` requires accepted SME rows to use the allowed mechanic-rating rubric
- `node tools/external-evidence-check.js` rejects player Pass rows unless the player completed one run within 5 minutes
- `node tools/external-evidence-check.js` rejects SME Pass rows when any core mechanic is rated Misleading or Unsafe/ethically wrong
- `node tools/external-evidence-check.js` requires every accepted LE row id to appear in the experience map and every accepted P/SME row id to appear in validation results
- `node tools/external-evidence-check.js` requires each accepted #27 lived-experience row in the ledger to match the same LE id in `docs/fly-lab-experience-map.md`
- `node tools/external-evidence-check.js` requires Fix/Cut follow-up fields to contain a concrete GitHub issue reference
- `node tools/external-evidence-check.js` rejects Fix/Cut follow-up references that point back to #27 or #33
- `node tools/external-evidence-check.js` rejects Fix/Cut follow-up evidence unless the follow-up field says `resolved` or `accepted non-blocking`, so opening an issue alone cannot close #33
- `node tools/external-evidence-check.js` requires counted Fix/Cut follow-up issue references to also appear in `docs/fly-lab-validation-results.md`
- `node tools/external-evidence-check.js` requires accepted player and SME result rows to repeat the ledger decision and any Fix/Cut follow-up issue reference plus disposition
- `node tools/external-evidence-check.js` requires the follow-up issue accepted count to match unique concrete Fix/Cut follow-up references
- `?validation=status` and `web-prototype/data.js` expose the Fix/Cut follow-up issue gate so the in-app status cannot hide unresolved validation failures
- `node tools/r-series-status-check.js` requires the follow-up issue ledger gate to remain `As needed`, linked to #33, and represented by a non-negative accepted count
- `node tools/external-evidence-check.js` requires accepted LE provenance and design-effect fields to use the allowed #27 closure vocabulary
- `node tools/external-evidence-check.js` requires explicit no-relevant-experience LE rows to use `explicit exclusion`, not mechanic/guardrail/SME-risk design changes
- `node tools/external-evidence-check.js` rejects duplicated no-experience LE rows and mixed no-experience plus firsthand/observed LE evidence
- `node tools/external-evidence-check.js` requires the #27 design-change count to match accepted LE rows whose design effect is a mechanic change, guardrail change, or SME-risk update
- `node tools/external-evidence-check.js` requires three accepted #33 player sessions to collectively cover clean, dirty, and missing-control routes or fixtures before closure review
- `node tools/external-evidence-check.js` requires accepted #33 SME evidence ids to reference clean, dirty, and missing-control fixture coverage in `docs/fly-lab-validation-results.md`
- `node tools/external-evidence-check.js` requires each accepted #33 SME core rating in the ledger to match the same SME review id in `docs/fly-lab-validation-results.md`
- `node tools/external-evidence-check.js` requires each accepted #33 player route/fixture in the ledger to match the same player id in `docs/fly-lab-validation-results.md`
- `node tools/external-evidence-check.js` requires each accepted #33 player goal phrase, failure-cause phrase, and second-run repair phrase in the ledger to match the same player id in `docs/fly-lab-validation-results.md`
- `?validation=status`, `web-prototype/data.js`, and `node tools/external-evidence-check.js` expose and validate #33 route/fixture coverage so the in-app status cannot claim closure readiness from player-session count alone
- `node tools/external-evidence-check.js` rejects `Fix` or `Cut` player/SME evidence rows unless they link a concrete follow-up issue before counting
- `node tools/r-series-status-check.js` uses ledger counts to accept either zero-evidence pending language or partial-evidence in-progress language, so status guardrails do not block real validation progress
- `node tools/external-evidence-check.js` requires all-thresholds-met fixtures to move status docs to `External evidence ready for closure review`, `User lived-experience pass: ready for closure review`, `#27 and #33 evidence thresholds met`, and `Ready for final closure audit`
- `node tools/issue-template-contract-check.js` prevents #27/#33 follow-up issue forms from losing required implementation-contract fields before evidence becomes work

## Why the full goal is not complete yet

The full objective asks for all issues to be worked through, verified, analyzed, improved, and repeated without drift. R0 and R2-R6 are now closed because implementation, smoke coverage, browser QA where relevant, merge, and main CI evidence are sufficient for their scoped DoD. Older non-R issues have been classified in the open-issue triage doc; #1-#3 are superseded planning artifacts, and #4/#5/#7/#9/#10-#25 are parked Unity/old-loop backlog unless explicitly reactivated. The full goal is still not complete because #27 and #33 require external/user evidence that has not been collected.

The remaining work is not blocked, but it must stay sequenced:

1. Run three player sessions using `docs/fly-lab-playtest-sheet.md`.
2. Run one SME or biology-aware review using `docs/fly-lab-sme-validation-sheet.md`.
3. Open fix/cut issues for misleading mechanics or serious player comprehension failures.
4. Only then decide whether #33 can close.

## Next iteration checklist

1. Run `node web-prototype/smoke-tests.js` after every change.
2. Run `node tools/r-series-status-check.js` after scope, doc, issue, or packet changes.
3. Perform browser visual QA on the Procedure Lab route.
4. Run player/SME validation and record results in `docs/fly-lab-validation-results.md`.
5. Open follow-up issues for validation failures.
6. Keep parked Unity/old-loop issues out of current implementation unless they are rewritten against the R-series contract.

## Do not do next

- Do not expand the phenomenon catalog.
- Do not build a full Mendelian solver before the one-cross loop is validated.
- Do not polish reviewer jokes before R5 records exist.
- Do not close #27 until user lived-experience answers are reflected.
- Do not use parked Unity/old-loop issues as active scope for the browser Procedure Lab slice.
