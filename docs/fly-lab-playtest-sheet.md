# Fly-Lab Playtest Sheet

Use this for R7 player validation. This sheet measures whether the five-minute slice is playable and whether the player understands how to improve a second run.

## Session setup

- Build: local web prototype with Procedure Lab route.
- Target duration: 5 minutes.
- Moderator rule: do not explain mechanics unless the player is fully stuck for 30 seconds.
- Required paths to observe across sessions: clean path, dirty path, missing-control path.

## First-run observation checklist

| Check | Pass condition | Notes |
|---|---|---|
| Goal comprehension | Player can say the goal within 30 seconds | |
| Vial/label meaning | Player understands that label and age affect confidence | |
| CO2 tradeoff | Player notices CO2 helps sorting but hurts assay trust | |
| Sorting friction | Player treats sorting as a meaningful bench bottleneck, not a quiz | |
| Assay record | Player reads n/control/confidence/caveats before review | |
| Reviewer fairness | Player can point to the record that caused the attack | |
| Second-run intent | Player says one concrete improvement for the next run | |

## Post-run questions

1. What did you think the experiment was trying to prove?
2. Which step felt most like a real lab bottleneck?
3. Which mistake or caveat did Reviewer #2 attack?
4. Did CO2 feel like a tradeoff or just a button?
5. What would you do differently in a second run?
6. Did any step feel fake, arbitrary, or disconnected from fly-lab work?
7. Was the procedure friction interesting enough to keep, or should it be compressed?

## Result rubric

| Result | Meaning |
|---|---|
| Pass | Player finishes one route and names a concrete cause of the review outcome |
| Fix | Player finishes but misunderstands why the outcome happened |
| Cut/rework | Player cannot connect actions to records or reviewer attack |

## Required validation result record

After each session, append notes to `docs/fly-lab-validation-results.md`:

- player profile
- route taken
- exact goal phrase
- exact failure-cause phrase
- exact second-run repair phrase
- strongest moment
- weakest moment
- fix/cut follow-up issue links

The accepted `P-*` row in `docs/fly-lab-validation-results.md` must repeat the same route/fixture, goal phrase, failure-cause phrase, and second-run repair phrase recorded in `docs/fly-lab-external-evidence-ledger.md`.
