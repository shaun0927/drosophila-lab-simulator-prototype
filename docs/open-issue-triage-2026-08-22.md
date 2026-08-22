# Open Issue Triage

Date: 2026-08-22

Parent contract: [`fly-lab-product-thesis.md`](fly-lab-product-thesis.md)

This audit prevents issue-list drift after the R-series direction change. The current implementation target is a browser-first fly-lab procedure simulator with a publication wrapper. Older Unity, phenomenon-first, and automation-growth issues are preserved only when they remain useful as historical or later-backlog work.

## Labels Used

| Label | Meaning |
|---|---|
| `r-series-current` | Active R-series work. These issues can block the current product contract. |
| `superseded-by-r-series` | Older direction or planning artifact absorbed by the R-series contract and progress audit. |
| `parked-unity-line` | Unity or old tactile/visual production line. Do not use this to steer the browser Procedure Lab slice unless explicitly reactivated. |
| `post-r-series-backlog` | Potential later work after #27 and #33 validation gates are satisfied. |

## Active R-Series Blockers

| Issue | Decision | Why |
|---|---|---|
| #27 R1 lived experience map | Keep open, `r-series-current` | Requires user/lived-experience provenance. Screenshot proxy cannot close it. |
| #33 R7 vertical slice validation | Keep open, `r-series-current` | Requires fresh player sessions and SME review. Screenshot proxy can reduce risk but cannot prove completion. |

## Superseded Planning Issues

| Issue | Decision | Why |
|---|---|---|
| #1 0/1 phase agreement: phenomenon/paper loop | Close as superseded | Its phenomenon-first thesis is explicitly replaced by `fly-lab-product-thesis.md`; legacy route remains only as historical prototype. |
| #2 5-minute automation reward loop | Close as superseded | Useful ideas were absorbed into the R-series science contract, but the active first slice now prioritizes stock, vial, cross, sorting, assay record, and reviewer evidence. |
| #3 planning worksheet | Close as superseded | The detailed worksheet is represented by the product thesis, experience map, R-series issue plan, validation runbook, and progress audit. |

## Parked Unity / Old Prototype Line

These issues should remain visible but must not drive current Procedure Lab work without an explicit reactivation decision:

| Issues | Decision | Why |
|---|---|---|
| #4, #5 | Label `parked-unity-line`, `post-r-series-backlog` | Unity handoff and old SSOT contain valuable implementation evidence, but current iteration is browser Procedure Lab validation. |
| #7, #9, #10, #11, #20, #22, #23, #24, #25 | Label `parked-unity-line`, `post-r-series-backlog` | These target old Unity gates, brush feel, toy sessions, old claim economy, or decision-density work. They are not current blockers for R0-R7. |
| #12, #13, #14, #15, #16, #17, #18 | Label `parked-unity-line`, `post-r-series-backlog` | Visual/audio/material polish should wait until #33 validates the Procedure Lab slice and #27 supplies lived-experience grounding. |

## Current Completion State

R-series implementation work has been worked through for R0 and R2-R6, with smoke tests, browser/screenshot proxy QA, main CI, and issue closure evidence recorded in [`r-series-progress-audit.md`](r-series-progress-audit.md).

The full goal is not complete because:

- #27 still lacks user/lived-experience answers.
- #33 still lacks fresh-player and SME validation.
- Parked Unity/old-loop issues are now classified but not implemented or closed unless superseded.

## Drift Guardrail

Do not pick up #4/#5/#7/#9/#10-#25 as current implementation work until one of these is true:

1. #27 and #33 are satisfied and the project intentionally returns to Unity/production polish.
2. A parked issue is rewritten against the current `fly-lab-product-thesis.md` contract.
3. The user explicitly asks to reactivate the Unity/old-loop line.

Until then, the next valid work remains:

1. collect #27 lived-experience input, or
2. run #33 player/SME validation, or
3. use screenshot/browser proxy only for obvious visible drift and first-run comprehension risks.
