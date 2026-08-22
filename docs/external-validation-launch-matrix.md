# External Validation Launch Matrix

Date opened: 2026-08-23

Purpose: give the session runner one place to choose the correct prototype URL, packet, evidence row, and target document for issues #35 through #39.

This matrix is not evidence. It is an execution aid. Do not raise accepted counts from this document, screenshots, smoke tests, implementer walkthroughs, or packet visibility.

Use `docs/external-validation-participant-briefs.md` for copy-ready invitation text, first-30-seconds moderator language, answer-key guardrails, and SME review framing.

## Preflight

Before inviting a participant or reviewer, run:

```bash
node tools/external-validation-full-check.js --live-issues
node tools/external-validation-session-handoff.js
node tools/external-validation-gap-report.js
```

Required preflight result:

- #27, #33, and #35 through #39 are open.
- The gap report still says closure ready: no.
- The handoff says it is only for running sessions and must not raise accepted counts.
- The target fixture or packet URL opens without horizontal overflow on the intended device.

## Launch Matrix

Run the sessions in this order unless scheduling forces a different order. If order changes, do not merge player, SME, and lived-experience evidence into the same row.

| Order | Issue | Evidence row | Participant | Prototype URL | Packet source | Target docs | Count only after |
|---:|---|---|---|---|---|---|---|
| 1 | #35 | `LE-01` through `LE-05` | Person with firsthand or observed fly-lab context | `web-prototype/index.html?validation=lived` | `docs/external-validation-session-packets.md` #35 packet | `docs/fly-lab-external-evidence-ledger.md`, `docs/fly-lab-experience-map.md` | Five accepted `LE-*` rows exist and at least one row has a mechanic change, guardrail change, SME risk update, or explicit no-experience closure path |
| 2 | #36 | `P-01` clean | Fresh player who did not implement the slice | `web-prototype/index.html?fixture=clean&validation=capture` | `docs/external-validation-session-packets.md` #36 packet | `docs/fly-lab-external-evidence-ledger.md`, `docs/fly-lab-validation-results.md` | Exact phrases are recorded and the player connects the record to the reviewer finding |
| 3 | #37 | `P-02` dirty | Fresh player who did not implement the slice | `web-prototype/index.html?fixture=dirty&validation=capture` | `docs/external-validation-session-packets.md` #37 packet | `docs/fly-lab-external-evidence-ledger.md`, `docs/fly-lab-validation-results.md` | Exact phrases are recorded and the dirty failure reads as experimental-record weakness rather than random punishment |
| 4 | #38 | `P-03` missing-control | Fresh player who did not implement the slice | `web-prototype/index.html?fixture=missing-control&validation=capture` | `docs/external-validation-session-packets.md` #38 packet | `docs/fly-lab-external-evidence-ledger.md`, `docs/fly-lab-validation-results.md` | Exact phrases are recorded and the player identifies the missing control as a weak experimental claim |
| 5 | #39 | `SME-01` | Biology-aware reviewer | `web-prototype/index.html?fixture=clean`, `web-prototype/index.html?fixture=dirty`, `web-prototype/index.html?fixture=missing-control` | `docs/external-validation-session-packets.md` #39 packet | `docs/fly-lab-external-evidence-ledger.md`, `docs/fly-lab-validation-results.md` | The reviewer covers all three fixtures and rates stock/vial/calendar, virgin/cross timing, CO2/sorting, negative geotaxis, and record/reviewer logic |

## Moderator Rules

- Keep the first 30 seconds uncoached for player sessions unless the player is completely stuck.
- Preserve exact phrases before interpretation.
- Record the route or fixture exactly as `clean`, `dirty`, or `missing-control`.
- Treat screenshots as navigation aids only. Screenshots cannot fill `LE-*`, `P-*`, or `SME-*` rows.
- If a player or SME result is `Fix` or `Cut`, open a concrete follow-up issue before the row can count.
- Do not use #27 or #33 as a counted Fix/Cut follow-up issue.

## Intake Handoff

After each session:

1. Copy raw notes from the issue-specific packet into the matching target document.
2. Stage the row in `docs/external-validation-intake-staging.md` before accepted counts change.
3. Update `docs/fly-lab-external-evidence-ledger.md` only after the row passes the packet-specific count rule.
4. Update `docs/fly-lab-experience-map.md` for `LE-*` rows, or `docs/fly-lab-validation-results.md` for `P-*` and `SME-*` rows.
5. Run `node tools/external-validation-full-check.js --live-issues`.
6. Comment on the execution issue and parent issue with the accepted/rejected row id and remaining counts.

## Current Decision

Keep #27, #33, and the thread goal open until the launch matrix produces accepted non-proxy evidence rows and the full check passes.
