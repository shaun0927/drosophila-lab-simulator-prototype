# External Validation Execution Tracker

Last checked: 2026-08-23

Purpose: track whether the external validation execution issues have produced the evidence needed to close #27, #33, and the thread goal. This tracker is a status ledger, not evidence. It must not be used to raise accepted counts.

## Current Gate Summary

| Parent issue | Gate | Required | Accepted | Execution issue | Current issue state | Closure status |
|---|---|---:|---:|---|---|---|
| #27 | Lived-experience rows | 5 | 0 | #35 | Open | Blocked on real interview evidence |
| #27 | Design-changing lived row | 1 | 0 | #35 | Open | Blocked on accepted `LE-*` design effect |
| #33 | Fresh-player sessions | 3 | 0 | #36, #37, #38 | Open | Blocked on real player sessions |
| #33 | Player route coverage | 3 | 0 | #36, #37, #38 | Open | Blocked on clean, dirty, missing-control coverage |
| #33 | SME review | 1 | 0 | #39 | Open | Blocked on biology-aware fixture review |
| #33 | Fix/Cut follow-up issues | As needed | 0 | Created from #36-#39 findings | None yet | Pending external findings |

## Execution Issue Tracker

| Issue | Required evidence row | Packet source | Target docs | Current proof | Missing proof before resolution |
|---|---|---|---|---|---|
| #35 | `LE-01` through `LE-05` | `docs/external-validation-session-packets.md` #35 section | `docs/fly-lab-external-evidence-ledger.md`, `docs/fly-lab-experience-map.md` | Issue open; packet exists; ledger rows pending | Real lived-experience answers, five accepted rows, at least one design-changing row or explicit no-experience closure path |
| #36 | `P-01` clean | `docs/external-validation-session-packets.md` #36 section | `docs/fly-lab-external-evidence-ledger.md`, `docs/fly-lab-validation-results.md` | Issue open; packet exists; ledger row pending | Real fresh-player clean-route session, exact phrases, decision, any Fix/Cut follow-up disposition |
| #37 | `P-02` dirty | `docs/external-validation-session-packets.md` #37 section | `docs/fly-lab-external-evidence-ledger.md`, `docs/fly-lab-validation-results.md` | Issue open; packet exists; ledger row pending | Real fresh-player dirty-route session, exact phrases, decision, any Fix/Cut follow-up disposition |
| #38 | `P-03` missing-control | `docs/external-validation-session-packets.md` #38 section | `docs/fly-lab-external-evidence-ledger.md`, `docs/fly-lab-validation-results.md` | Issue open; packet exists; ledger row pending | Real fresh-player missing-control session, exact phrases, decision, any Fix/Cut follow-up disposition |
| #39 | `SME-01` | `docs/external-validation-session-packets.md` #39 section | `docs/fly-lab-external-evidence-ledger.md`, `docs/fly-lab-validation-results.md` | Issue open; packet exists; ledger row pending | Real biology-aware review, clean/dirty/missing-control fixture coverage, five core ratings, any Fix/Cut follow-up disposition |

## Resolution Rules

- #35 can resolve only after #27 evidence rows are accepted or an explicit no-experience closure path is documented.
- #36, #37, and #38 can resolve independently, but #33 cannot close until all three accepted player rows collectively cover clean, dirty, and missing-control.
- #39 can resolve only after `SME-01` covers clean, dirty, and missing-control fixtures and repeats the five required ratings in validation results.
- Fix/Cut findings from #36 through #39 require separate concrete GitHub issue references with `resolved` or `accepted non-blocking` disposition before their evidence rows count.
- Packet existence, screenshots, smoke tests, issue comments, and implementer walkthroughs are not acceptable evidence rows.

## Required Verification After Any Execution Issue Changes

Run:

```bash
node tools/external-evidence-check.js
node tools/r-series-status-check.js
node web-prototype/smoke-tests.js
node tools/issue-template-contract-check.js
```

Then update:

1. The execution issue (#35, #36, #37, #38, or #39).
2. Parent #27 or #33.
3. `docs/goal-completion-audit-2026-08-22.md`.
4. `docs/r-series-progress-audit.md`.
5. `docs/final-closure-review-checklist.md` only after all thresholds are met.

## Current Completion Decision

Do not close #27, #33, or the thread goal from the current tracker state.

The tracker proves the remaining work is well scoped. It does not prove the remaining external evidence exists.
