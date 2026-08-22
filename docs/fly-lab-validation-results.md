# Fly-Lab Validation Results

Implementation PR: https://github.com/shaun0927/drosophila-lab-simulator-prototype/pull/34 merged to `main` at merge commit `f470330`.

CI guardrail: `.github/workflows/web-prototype-smoke.yml` runs syntax checks, `node web-prototype/smoke-tests.js`, `node tools/r-series-status-check.js`, `node tools/external-evidence-check.js`, `node tools/external-evidence-check.test.js`, and `node tools/issue-template-contract-check.js` for pull requests and pushes.

No external player or SME validation has been run yet.

When the first valid player or SME result is recorded, replace the sentence above with `External validation in progress.` and add a dated `## Validation Run YYYY-MM-DD` section before raising accepted counts in [`fly-lab-external-evidence-ledger.md`](fly-lab-external-evidence-ledger.md).

Use [`fly-lab-validation-runbook.md`](fly-lab-validation-runbook.md) to run the remaining validation required to close #33.

Use [`fly-lab-external-evidence-ledger.md`](fly-lab-external-evidence-ledger.md) to record which #27 and #33 external-evidence slots are still pending or accepted.

R-series issue status after PR #34 merge:

- Closed: #26, #28, #29, #30, #31, #32.
- Still open: #27 for user lived-experience input, #33 for player/SME validation.

## Current internal regression status

Command:

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

Expected result:

```text
fly-lab smoke passed: R2/R3, objective strip, reviewer repair plans, validation/status/capture packets, clean, dirty, missing-control, URL fixtures, legacy route
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

Reusable validation URLs:

- `web-prototype/index.html?fixture=clean`
- `web-prototype/index.html?fixture=dirty`
- `web-prototype/index.html?fixture=missing-control`
- `web-prototype/index.html?validation=status`
- `web-prototype/index.html?validation=packet`
- `web-prototype/index.html?validation=capture`
- `web-prototype/index.html?validation=lived`

## Why this is not sufficient for #33

The smoke harness and browser checks prove that the route mechanics can execute, clean/dirty/missing-control paths produce different reviewer findings and next-run repair plans, reusable URL fixtures load those paths, the specimen pad renders, sorting clicks register, the assay mini-plot appears after a controlled run, and desktop/mobile fixture pages do not horizontally overflow. They do not prove that a fresh player understands the route, that the procedure feels good, or that a biology-aware reviewer accepts the simplifications.

The screenshot UX audit also caught and fixed visible drift where Procedure Lab still used the old `Live Assay Chamber` and phenomenon-first footer language. Later proxy passes added an objective strip for current goal, next action, record risk, and reviewer vulnerability, added a Reviewer #2 next-run repair plan after the result card still risked ending at explanation rather than player improvement, added an in-app status packet so the remaining #27/#33 evidence gaps are visible, added an in-app validation packet so #33 sessions can launch from the prototype, added an in-app capture packet so raw #27/#33 evidence fields are visible during sessions, and added a separate lived-experience packet for #27 collection. The external evidence checker now allows valid partial player, SME, or lived-experience evidence to be recorded as in progress before closure thresholds are met. This remains proxy evidence only, not a replacement for player, SME, or user lived-experience evidence.

## Pending validation

- [ ] 3 player first-run sessions.
- [ ] 1 SME or biology-aware validation pass.
- [ ] SME validation results explicitly cover `?fixture=clean`, `?fixture=dirty`, and `?fixture=missing-control`.
- [ ] Follow-up issues for any misleading core mechanic.
- [ ] Counted Fix/Cut follow-up issue references and dispositions summarized here before ledger counts increase.
- [ ] External evidence ledger updated with accepted counts.
