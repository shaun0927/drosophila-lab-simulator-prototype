# Fly-Lab Validation Results

Implementation PR: https://github.com/shaun0927/drosophila-lab-simulator-prototype/pull/34

No external player or SME validation has been run yet.

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
```

Reusable validation URLs:

- `web-prototype/index.html?fixture=clean`
- `web-prototype/index.html?fixture=dirty`
- `web-prototype/index.html?fixture=missing-control`

## Why this is not sufficient for #33

The smoke harness and browser checks prove that the route mechanics can execute, clean/dirty/missing-control paths produce different reviewer findings, reusable URL fixtures load those paths, the specimen pad renders, sorting clicks register, the assay mini-plot appears after a controlled run, and desktop/mobile fixture pages do not horizontally overflow. They do not prove that a fresh player understands the route, that the procedure feels good, or that a biology-aware reviewer accepts the simplifications.

## Pending validation

- [ ] 3 player first-run sessions.
- [ ] 1 SME or biology-aware validation pass.
- [ ] Follow-up issues for any misleading core mechanic.
