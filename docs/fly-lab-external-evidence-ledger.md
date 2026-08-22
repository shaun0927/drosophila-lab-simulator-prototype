# Fly-Lab External Evidence Ledger

Date opened: 2026-08-22

Purpose: keep the remaining external-evidence work for #27 and #33 auditable. This ledger is the intake checklist for evidence that cannot be produced by smoke tests, screenshots, or issue comments.

## Current Ledger Status

| Evidence gate | Required count | Accepted count | Current status | Blocking issue |
|---|---:|---:|---|---|
| Lived-experience event rows with user or observed-lab provenance | 5 | 0 | Pending collection | #27 |
| Lived-experience answer that changes a mechanic, guardrail, or SME risk | 1 | 0 | Pending collection | #27 |
| Fresh-player first-run sessions | 3 | 0 | Pending execution | #33 |
| SME or biology-aware review | 1 | 0 | Pending execution | #33 |
| Follow-up fix/cut issues for failed external criteria | As needed | 0 | Pending external findings | #33 |

## What Counts as Acceptable Evidence

### #27 lived-experience evidence

Accepted evidence must include all of the following:

- provenance: firsthand, observed lab work, or explicit "no relevant experience" user decision
- procedure event: the concrete lab action or situation
- game verb: what the player does
- player skill: what the player must notice, time, compare, or decide
- failure mode: how the player can be wrong
- delayed consequence: how the mistake returns later
- design effect: mechanic change, guardrail change, SME risk update, or explicit exclusion

Not acceptable as #27 closure evidence:

- screenshots of the lived-experience packet
- source-backed protocol summaries without user/lived-experience provenance
- arbitrary phenomenon ideas
- general enthusiasm, tone preference, or feature requests that do not map to a procedure event

### #33 player validation evidence

Each fresh-player session must include:

- session id and date
- whether the player completed a one-run path within 5 minutes
- exact player phrase for the perceived goal
- exact player phrase for one failure cause
- exact player phrase for one second-run repair
- observed blocker, if any
- pass/fix/cut decision

Not acceptable as #33 player closure evidence:

- automated smoke test output
- screenshots of the route
- the implementer's own walkthrough
- coached interpretation after the first-run observation window

### #33 SME validation evidence

The SME or biology-aware review must include:

- reviewer role or relevant biology experience level
- rating for stock/vial/calendar handling
- rating for virgin/cross timing abstraction
- rating for CO2/sorting abstraction
- rating for negative geotaxis assay abstraction
- rating for record-to-reviewer claim logic
- every `misleading` or `unsafe/ethically wrong` mark with a linked fix/cut issue

Not acceptable as #33 SME closure evidence:

- player fun feedback
- screenshots without rubric decisions
- generic "looks fine" approval without rating each core mechanic

## Intake Tables

### #27 lived-experience rows

| Row id | Provenance | Procedure event | Game verb | Player skill | Failure mode | Delayed consequence | Design effect | Accepted? |
|---|---|---|---|---|---|---|---|---|
| LE-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |
| LE-02 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |
| LE-03 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |
| LE-04 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |
| LE-05 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |

### #33 fresh-player sessions

| Session id | Date | Route/fixture | Completed one run in 5 minutes? | Goal phrase | Failure-cause phrase | Second-run repair phrase | Decision | Follow-up issue |
|---|---|---|---|---|---|---|---|---|
| P-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| P-02 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| P-03 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |

### #33 SME review

| Review id | Date | Reviewer role | Stock/vial/calendar | Virgin/cross timing | CO2/sorting | Negative geotaxis | Record/reviewer logic | Decision | Follow-up issue |
|---|---|---|---|---|---|---|---|---|---|
| SME-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |

## Closure Decision Rules

#27 can close only when:

1. At least 5 lived-experience rows are accepted, or the user explicitly records that no relevant firsthand/observed experience exists.
2. At least one accepted answer changes a mechanic, guardrail, or SME risk, unless the explicit no-experience decision is used.
3. `docs/fly-lab-experience-map.md` is updated with accepted provenance.
4. Unsupported arbitrary phenomena remain excluded from the first slice.

#33 can close only when:

1. Three player sessions are recorded.
2. One SME or biology-aware review is recorded.
3. Every serious player comprehension failure has a fix/cut decision.
4. Every misleading or unsafe SME mark has a linked fix/cut issue.
5. `docs/fly-lab-validation-results.md` summarizes the result.
6. `node web-prototype/smoke-tests.js` passes after any resulting implementation change.
7. `node tools/r-series-status-check.js` passes after the ledger and status docs are updated.

## Drift Checks Before Accepting Evidence

- Evidence must support the R-series Procedure Lab contract, not the old phenomenon-first route.
- `Light-Induced Swarm Dance` and similar unsupported spectacle cannot count as lived-experience evidence unless the user explicitly ties it to a real lab incident, and even then it must pass SME risk review before gameplay inclusion.
- A player session cannot be counted if the observer explains the goal before the first 30 seconds.
- SME review cannot be counted if it only reviews presentation polish and not the scientific simplifications.
- Parked Unity issues stay parked unless the evidence directly creates a rewritten R-series issue.
