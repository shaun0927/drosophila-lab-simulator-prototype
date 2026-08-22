# Screenshot UX Audit

Date: 2026-08-22

Scope: screenshot-based heuristic audit for the R-series fly-lab procedure slice.

This is not a replacement for #27 lived-experience input or #33 player/SME validation. It is a proxy audit for visible drift, readability, and obvious UX contradictions that can be detected from screenshots.

## Screenshots Reviewed

Committed under `dogfood-output/screenshots/`:

- `desktop-clean.png`
- `mobile-clean.png`
- `desktop-clean-after-record-view.png`
- `desktop-dirty-after-record-view.png`

## Findings

| Finding | Evidence | Risk | Action |
|---|---|---|---|
| Procedure route still showed `Live Assay Chamber` and `No mutant line yet` in the right panel | `desktop-clean.png`, `mobile-clean.png` | Drift: the UI told players they were still in the old phenomenon-first prototype while using Procedure Lab | Fixed |
| Footer still asked `make the phenomenon more believable, or more sensational?` in Procedure Lab | `desktop-clean.png`, `mobile-clean.png` | Drift: the bottom-line question contradicted the R-series notebook/evidence thesis | Fixed |
| Procedure route screenshots are long on mobile | `mobile-clean.png`, `mobile-dirty.png`, `mobile-missing-control.png` | Usability risk for real first-run validation; not a functional blocker | Keep as #33 player-validation watch item |
| Lab Record View canvas labels are small and dense | `desktop-clean-after-record-view.png` | Polish/readability risk; not a scientific drift issue | Keep as later polish unless players miss the record summary |

## Fix Applied

Changed Procedure Lab chrome and canvas behavior:

- right panel title becomes `Lab Record View`
- footer becomes `Core question: can the notebook defend the claim?`
- canvas renders procedure record state instead of old mutant-line chamber text
- legacy publication-satire route keeps the old chamber language

## Verification

Commands run:

```bash
node --check web-prototype/app.js
node --check web-prototype/data.js
node --check web-prototype/smoke-tests.js
node web-prototype/smoke-tests.js
```

Browser assertion:

```text
browser smoke passed: procedure route uses Lab Record View and notebook footer
```

## Remaining Limits

This audit cannot prove:

- a real player understands why Reviewer #2 attacked them
- the sorting UI feels like bench work rather than a UI exercise
- the sex/marker visual abstractions are acceptable to a biology-aware reviewer
- the user has supplied lived-experience events for #27

Therefore #27 and #33 should remain open.
