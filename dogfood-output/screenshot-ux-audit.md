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

Latest replacement screenshots:

- `desktop-clean.png`
- `mobile-clean.png`
- `desktop-validation-packet.png`
- `mobile-validation-packet.png`

## Findings

| Finding | Evidence | Risk | Action |
|---|---|---|---|
| Procedure route still showed `Live Assay Chamber` and `No mutant line yet` in the right panel | `desktop-clean.png`, `mobile-clean.png` | Drift: the UI told players they were still in the old phenomenon-first prototype while using Procedure Lab | Fixed |
| Footer still asked `make the phenomenon more believable, or more sensational?` in Procedure Lab | `desktop-clean.png`, `mobile-clean.png` | Drift: the bottom-line question contradicted the R-series notebook/evidence thesis | Fixed |
| Procedure route listed systems before telling the player what judgment mattered now | `desktop-clean.png`, `mobile-clean.png` | First-run risk: players could see many lab controls without understanding the current objective, next action, record risk, or reviewer vulnerability | Fixed with objective strip |
| Reviewer result explained the weakness but did not clearly convert it into a second-run action | `desktop-clean.png`, `mobile-clean.png` | #33 comprehension risk: players might understand the attack quote without knowing what to repair next | Fixed with next-run repair plan |
| #33 validation required leaving the prototype and reading docs before a session could start | `desktop-validation-packet.png`, `mobile-validation-packet.png` | Execution risk: moderators or SMEs could use the wrong route, skip fixture contrast, or blur #27 and #33 gates | Fixed with in-app validation packet |
| Procedure route screenshots are long on mobile | `mobile-clean.png`, `mobile-dirty.png`, `mobile-missing-control.png` | Usability risk for real first-run validation; not a functional blocker | Keep as #33 player-validation watch item |
| Lab Record View canvas labels are small and dense | `desktop-clean-after-record-view.png` | Polish/readability risk; not a scientific drift issue | Keep as later polish unless players miss the record summary |

## Fix Applied

Changed Procedure Lab chrome and canvas behavior:

- right panel title becomes `Lab Record View`
- footer becomes `Core question: can the notebook defend the claim?`
- canvas renders procedure record state instead of old mutant-line chamber text
- legacy publication-satire route keeps the old chamber language

Added Procedure Lab objective strip:

- current goal: build a defensible experiment record
- next action: state-derived recommendation for the next lab step
- record risk: latest vial, batch, assay, or reviewer weakness
- reviewer vulnerability: the likely critique attached to the current record state

Added Reviewer #2 repair plan:

- each reviewer finding maps to three concrete next-run corrections
- clean, dirty CO2, and missing-control fixtures verify different repair guidance
- repair text stays attached to evidence refs instead of introducing new phenomena or jokes

Added validation packet:

- `?validation=packet` opens a moderator/SME launch page inside the prototype
- fixture links are visible from the packet
- canvas and footer use validation-specific language instead of old mutant-line language
- packet states that #27 and #33 still require external evidence

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
screenshot proxy passed: objective strip visible on desktop/mobile clean fixture
screenshot proxy passed: objective strip and repair plan visible on desktop/mobile clean fixture
screenshot proxy passed: validation packet visible on desktop/mobile without legacy drift
```

## Remaining Limits

This audit cannot prove:

- a real player understands why Reviewer #2 attacked them
- the sorting UI feels like bench work rather than a UI exercise
- the sex/marker visual abstractions are acceptable to a biology-aware reviewer
- the user has supplied lived-experience events for #27

Therefore #27 and #33 should remain open.
