# External Validation Session Packets

Date opened: 2026-08-23

Purpose: provide copy-ready packets for issues #35 through #39. These packets are field forms only. They do not count as evidence until real answers are recorded, accepted rows are copied into the ledger/result docs, and the verification commands pass.

Use with:

- `docs/external-validation-sprint-plan.md`
- `docs/external-validation-launch-matrix.md`
- `docs/external-validation-intake-runbook.md`
- `docs/fly-lab-session-capture-packet.md`
- `docs/fly-lab-external-evidence-ledger.md`
- `docs/fly-lab-validation-results.md`
- `docs/fly-lab-experience-map.md`

## Global Rules

- Preserve exact phrases before interpreting them.
- Keep #27 lived-experience evidence separate from #33 player and SME evidence.
- Do not count screenshots, smoke tests, implementer walkthroughs, or packet visibility as external evidence.
- Do not raise accepted counts until the matching target document rows exist.
- Run `node tools/external-evidence-check.js` after every evidence-doc update.

## #35 Packet: EV1 Lived-Experience Interview

Target output: `LE-01` through `LE-05`, with at least one design-changing row.

Copy targets:

- `docs/fly-lab-external-evidence-ledger.md`
- `docs/fly-lab-experience-map.md`
- #27 issue comment

| Field | Value |
|---|---|
| Issue | #35 |

### Raw Interview Notes

| Prompt | Exact answer | Provenance |
|---|---|---|
| Repeated hands-on work |  | firsthand / observed lab work / explicit no relevant experience |
| Costliest mistake |  | firsthand / observed lab work / explicit no relevant experience |
| Hardest visual tell |  | firsthand / observed lab work / explicit no relevant experience |
| Real criticism |  | firsthand / observed lab work / explicit no relevant experience |
| Funny because real |  | firsthand / observed lab work / explicit no relevant experience |
| Satisfying competence |  | firsthand / observed lab work / explicit no relevant experience |
| Fake or off-limits detail |  | firsthand / observed lab work / explicit no relevant experience |
| Assay confidence |  | firsthand / observed lab work / explicit no relevant experience |

### Accepted Row Drafts

| Row id | Provenance | Procedure event | Game verb | Player skill | Failure mode | Delayed consequence | Design effect | Accepted? |
|---|---|---|---|---|---|---|---|---|
| LE-01 |  |  |  |  |  |  |  | Yes/No |
| LE-02 |  |  |  |  |  |  |  | Yes/No |
| LE-03 |  |  |  |  |  |  |  | Yes/No |
| LE-04 |  |  |  |  |  |  |  | Yes/No |
| LE-05 |  |  |  |  |  |  |  | Yes/No |

Reject any row that is generic preference, secondhand trivia, unsupported spectacle, or lacks a procedure event, game verb, failure mode, or delayed consequence.

## #36 Packet: EV2 P-01 Clean Route

Target output: `P-01` clean route or fixture evidence.

Copy targets:

- `docs/fly-lab-external-evidence-ledger.md`
- `docs/fly-lab-validation-results.md`
- #33 issue comment

| Field | Value |
|---|---|
| Session id | P-01 |
| Issue | #36 |
| Date |  |
| Player profile |  |
| Target route/fixture | clean |
| Completed one run in 5 minutes? | yes/no |
| Observer intervention before 30 seconds? | yes/no |
| Final reviewer finding |  |
| Decision | Pass/Fix/Cut |
| Follow-up issue and disposition |  |

| Required phrase | Exact player phrase |
|---|---|
| Goal within first 30 seconds |  |
| Cause of reviewer attack |  |
| Second-run repair |  |
| Most real lab friction |  |
| Fake, arbitrary, or disconnected step |  |

Do not count `P-01` as Pass if the player completes the route but cannot connect the record to the reviewer finding.

## #37 Packet: EV3 P-02 Dirty Route

Target output: `P-02` dirty route or fixture evidence.

Copy targets:

- `docs/fly-lab-external-evidence-ledger.md`
- `docs/fly-lab-validation-results.md`
- #33 issue comment

| Field | Value |
|---|---|
| Session id | P-02 |
| Issue | #37 |
| Date |  |
| Player profile |  |
| Target route/fixture | dirty |
| Completed one run in 5 minutes? | yes/no |
| Observer intervention before 30 seconds? | yes/no |
| Final reviewer finding |  |
| Decision | Pass/Fix/Cut |
| Follow-up issue and disposition |  |

| Required phrase | Exact player phrase |
|---|---|
| Goal within first 30 seconds |  |
| Cause of reviewer attack |  |
| Second-run repair |  |
| Most real lab friction |  |
| Fake, arbitrary, or disconnected step |  |

Do not count `P-02` as Pass if the dirty-route failure reads as random punishment rather than an experimental-record weakness.

## #38 Packet: EV4 P-03 Missing-Control Route

Target output: `P-03` missing-control route or fixture evidence.

Copy targets:

- `docs/fly-lab-external-evidence-ledger.md`
- `docs/fly-lab-validation-results.md`
- #33 issue comment

| Field | Value |
|---|---|
| Session id | P-03 |
| Issue | #38 |
| Date |  |
| Player profile |  |
| Target route/fixture | missing-control |
| Completed one run in 5 minutes? | yes/no |
| Observer intervention before 30 seconds? | yes/no |
| Final reviewer finding |  |
| Decision | Pass/Fix/Cut |
| Follow-up issue and disposition |  |

| Required phrase | Exact player phrase |
|---|---|
| Goal within first 30 seconds |  |
| Cause of reviewer attack |  |
| Second-run repair |  |
| Most real lab friction |  |
| Fake, arbitrary, or disconnected step |  |

Do not count `P-03` as Pass if the player cannot identify missing control as a reason the experimental claim is weak.

## #39 Packet: EV5 SME-01 Biology-Aware Review

Target output: `SME-01` fixture coverage and five core ratings.

Copy targets:

- `docs/fly-lab-external-evidence-ledger.md`
- `docs/fly-lab-validation-results.md`
- #33 issue comment

| Field | Value |
|---|---|
| Review id | SME-01 |
| Issue | #39 |
| Date |  |
| Reviewer role or experience level |  |
| Fixtures reviewed | `?fixture=clean`, `?fixture=dirty`, `?fixture=missing-control` |
| Decision | Pass/Fix/Cut |
| Follow-up issue and disposition |  |

Allowed ratings: `Accurate enough`, `Acceptable simplification`, `Misleading`, `Unsafe/ethically wrong`.

| Ledger field | Rating | Exact concern or approval note | Follow-up issue |
|---|---|---|---|
| Stock/vial/calendar |  |  |  |
| Virgin/cross timing |  |  |  |
| CO2/sorting |  |  |  |
| Negative geotaxis |  |  |  |
| Record/reviewer logic |  |  |  |

Do not count `SME-01` if the reviewer does not explicitly cover all three fixtures or does not rate all five core mechanics.

## Post-Session Checklist

After each session:

1. Decide whether the packet is accepted, rejected, Fix, or Cut using `docs/fly-lab-validation-finding-decision-tree.md`.
2. Copy accepted fields into `docs/fly-lab-external-evidence-ledger.md`.
3. Copy `LE-*` rows into `docs/fly-lab-experience-map.md`.
4. Copy `P-*` and `SME-*` rows into `docs/fly-lab-validation-results.md`.
5. Open or update any Fix/Cut follow-up issue.
6. Run:

```bash
node tools/external-validation-full-check.js --live-issues
```

7. Comment on #27 or #33 with the accepted/rejected row id, evidence-doc links, and remaining counts.
