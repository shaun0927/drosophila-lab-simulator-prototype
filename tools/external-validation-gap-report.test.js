const {
  buildGapReport
} = require('./external-validation-gap-report');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function expectFailure(name, fn, expectedMessage) {
  try {
    fn();
  } catch (error) {
    assert(error.message.includes(expectedMessage), `${name} failed with unexpected message: ${error.message}`);
    console.log(`bad fixture rejected: ${name}`);
    return;
  }
  throw new Error(`${name} should have failed`);
}

const pendingLedger = `# Ledger

| Evidence gate | Required count | Accepted count | Current status | Blocking issue |
|---|---:|---:|---|---|
| Lived-experience event rows with user or observed-lab provenance | 5 | 0 | Pending collection | #27 |
| Lived-experience answer that changes a mechanic, guardrail, or SME risk | 1 | 0 | Pending collection | #27 |
| Fresh-player first-run sessions | 3 | 0 | Pending execution | #33 |
| SME or biology-aware review | 1 | 0 | Pending execution | #33 |

| Session id | Date | Route/fixture | Completed one run in 5 minutes? | Goal phrase | Failure-cause phrase | Second-run repair phrase | Decision | Follow-up issue |
|---|---|---|---|---|---|---|---|---|
| P-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| P-02 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| P-03 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
`;

const pendingTracker = `# Tracker

| Parent issue | Gate | Required | Accepted | Execution issue | Current issue state | Closure status |
|---|---:|---:|---|---|---|---|
| #27 | Lived-experience rows | 5 | 0 | #35 | Open | Blocked on real interview evidence |
| #27 | Design-changing lived row | 1 | 0 | #35 | Open | Blocked on accepted \`LE-*\` design effect |
| #33 | Fresh-player sessions | 3 | 0 | #36, #37, #38 | Open | Blocked on real player sessions |
| #33 | Player route coverage | 3 | 0 | #36, #37, #38 | Open | Blocked on clean, dirty, missing-control coverage |
| #33 | SME review | 1 | 0 | #39 | Open | Blocked on biology-aware fixture review |
`;

const pending = buildGapReport({ ledger: pendingLedger, tracker: pendingTracker });
assert(!pending.ready, 'pending fixture should not be ready');
assert(pending.missing.length === 5, `pending fixture should have 5 gaps, got ${pending.missing.length}`);
assert(pending.markdown.includes('keep #27, #33, and the thread goal open'), 'pending report must preserve no-closure decision');
console.log('pass fixture accepted: pending gap report');

const partialLedger = pendingLedger
  .replace('| Fresh-player first-run sessions | 3 | 0 | Pending execution | #33 |', '| Fresh-player first-run sessions | 3 | 1 | In progress | #33 |')
  .replace('| P-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| P-01 | 2026-08-23 | clean | Yes | defend the record | missing control | add a control | Pass | None |');
const partial = buildGapReport({ ledger: partialLedger, tracker: pendingTracker });
assert(!partial.ready, 'partial fixture should not be ready');
assert(partial.gaps.find(gap => gap.id === '#33 fresh-player sessions').remaining === 2, 'partial report should leave two player sessions remaining');
assert(partial.gaps.find(gap => gap.id === '#33 route coverage').remaining === 2, 'partial report should leave two route targets remaining');
console.log('pass fixture accepted: partial gap report');

const readyLedger = pendingLedger
  .replace('| Lived-experience event rows with user or observed-lab provenance | 5 | 0 | Pending collection | #27 |', '| Lived-experience event rows with user or observed-lab provenance | 5 | 5 | Ready | #27 |')
  .replace('| Lived-experience answer that changes a mechanic, guardrail, or SME risk | 1 | 0 | Pending collection | #27 |', '| Lived-experience answer that changes a mechanic, guardrail, or SME risk | 1 | 1 | Ready | #27 |')
  .replace('| Fresh-player first-run sessions | 3 | 0 | Pending execution | #33 |', '| Fresh-player first-run sessions | 3 | 3 | Ready | #33 |')
  .replace('| SME or biology-aware review | 1 | 0 | Pending execution | #33 |', '| SME or biology-aware review | 1 | 1 | Ready | #33 |')
  .replace('| P-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| P-01 | 2026-08-23 | clean | Yes | defend the record | missing control | add a control | Pass | None |')
  .replace('| P-02 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| P-02 | 2026-08-23 | dirty | Yes | defend the record | overclaim | rerun with better label | Pass | None |')
  .replace('| P-03 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| P-03 | 2026-08-23 | missing-control | Yes | defend the record | no control | add control | Pass | None |');
const ready = buildGapReport({ ledger: readyLedger, tracker: pendingTracker });
assert(ready.ready, 'ready fixture should be ready');
assert(ready.missing.length === 0, 'ready fixture should have no remaining gaps');
assert(ready.markdown.includes('Decision: ready for final closure audit.'), 'ready report should permit final closure audit');
console.log('pass fixture accepted: ready gap report');

expectFailure(
  'missing tracker cross-check',
  () => buildGapReport({ ledger: pendingLedger, tracker: pendingTracker.replace('Blocked on real interview evidence', 'Pending') }),
  'gap report tracker cross-check missing #35 / Blocked on real interview evidence'
);

console.log('external validation gap report self-test passed');
