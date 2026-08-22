# Fly-Lab Validation Results

Implementation PR: https://github.com/shaun0927/drosophila-lab-simulator-prototype/pull/34 merged to `main` at merge commit `f470330`.

CI guardrail: `.github/workflows/web-prototype-smoke.yml` runs syntax checks and `node web-prototype/smoke-tests.js` for pull requests and pushes.

No external player or SME validation has been run yet.

Use [`fly-lab-validation-runbook.md`](fly-lab-validation-runbook.md) to run the remaining validation required to close #33.

R-series issue status after PR #34 merge:

- Closed: #26, #28, #29, #30, #31, #32.
- Still open: #27 for user lived-experience input, #33 for player/SME validation.

## Current internal regression status

Command:

```bash
node web-prototype/smoke-tests.js
```

Expected result:

```text
fly-lab smoke passed: R2/R3, clean, dirty, missing-control, URL fixtures, legacy route
browser smoke passed: specimen pad renders and sorting click registers
browser smoke passed: assay mini-plot renders after controlled run
browser smoke passed: clean/dirty/missing-control URL fixtures load expected reviewer findings
responsive browser QA passed: desktop/mobile fixtures render without horizontal overflow
main CI passed: Web prototype smoke run https://github.com/shaun0927/drosophila-lab-simulator-prototype/actions/runs/32563843521
screenshot UX audit passed after fixing Procedure Lab chrome drift: `dogfood-output/screenshot-ux-audit.md`
```

Reusable validation URLs:

- `web-prototype/index.html?fixture=clean`
- `web-prototype/index.html?fixture=dirty`
- `web-prototype/index.html?fixture=missing-control`

## Why this is not sufficient for #33

The smoke harness and browser checks prove that the route mechanics can execute, clean/dirty/missing-control paths produce different reviewer findings, reusable URL fixtures load those paths, the specimen pad renders, sorting clicks register, the assay mini-plot appears after a controlled run, and desktop/mobile fixture pages do not horizontally overflow. They do not prove that a fresh player understands the route, that the procedure feels good, or that a biology-aware reviewer accepts the simplifications.

The screenshot UX audit also caught and fixed a visible drift issue where Procedure Lab still used the old `Live Assay Chamber` and phenomenon-first footer language. This remains proxy evidence only, not a replacement for player or SME validation.

## Pending validation

- [ ] 3 player first-run sessions.
- [ ] 1 SME or biology-aware validation pass.
- [ ] Follow-up issues for any misleading core mechanic.
