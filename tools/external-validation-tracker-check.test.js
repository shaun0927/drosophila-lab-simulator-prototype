const {
  validateTrackerConsistency
} = require('./external-validation-tracker-check');

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

const gameData = {
  externalEvidence: {
    playerRouteCoverage: { accepted: 0, required: 3 }
  }
};

const ledger = `# Fly-Lab External Evidence Ledger

## Current Ledger Status

| Evidence gate | Required count | Accepted count | Current status | Blocking issue |
|---|---:|---:|---|---|
| Lived-experience event rows with user or observed-lab provenance | 5 | 0 | Pending collection | #27 |
| Lived-experience answer that changes a mechanic, guardrail, or SME risk | 1 | 0 | Pending collection | #27 |
| Fresh-player first-run sessions | 3 | 0 | Pending execution | #33 |
| SME or biology-aware review | 1 | 0 | Pending execution | #33 |
| Follow-up fix/cut issues for failed external criteria | As needed | 0 | Pending external findings | #33 |

## Intake Tables

### #27 lived-experience rows

| Row id | Provenance | Procedure event | Game verb | Player skill | Failure mode | Delayed consequence | Design effect | Accepted? |
|---|---|---|---|---|---|---|---|---|
| LE-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |

### #33 fresh-player sessions

| Session id | Date | Route/fixture | Completed one run in 5 minutes? | Goal phrase | Failure-cause phrase | Second-run repair phrase | Decision | Follow-up issue |
|---|---|---|---|---|---|---|---|---|
| P-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |

### #33 SME review

| Review id | Date | Reviewer role | Stock/vial/calendar | Virgin/cross timing | CO2/sorting | Negative geotaxis | Record/reviewer logic | Decision | Follow-up issue |
|---|---|---|---|---|---|---|---|---|---|
| SME-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
`;

const tracker = `# External Validation Execution Tracker

## Current Gate Summary

| Parent issue | Gate | Required | Accepted | Execution issue | Current issue state | Closure status |
|---|---:|---:|---|---|---|---|
| #27 | Lived-experience rows | 5 | 0 | #35 | Open | Blocked on real interview evidence |
| #27 | Design-changing lived row | 1 | 0 | #35 | Open | Blocked on accepted \`LE-*\` design effect |
| #33 | Fresh-player sessions | 3 | 0 | #36, #37, #38 | Open | Blocked on real player sessions |
| #33 | Player route coverage | 3 | 0 | #36, #37, #38 | Open | Blocked on clean, dirty, missing-control coverage |
| #33 | SME review | 1 | 0 | #39 | Open | Blocked on biology-aware fixture review |
| #33 | Fix/Cut follow-up issues | As needed | 0 | Created from #36-#39 findings | None yet | Pending external findings |

## Current Completion Decision

Do not close #27, #33, or the thread goal from the current tracker state.
`;

function validate(ledgerMarkdown = ledger, trackerMarkdown = tracker, data = gameData) {
  validateTrackerConsistency({ ledgerMarkdown, trackerMarkdown, gameData: data });
}

validate();
console.log('pass fixture accepted: current pending tracker');

expectFailure(
  'player count mismatch',
  () => validate(ledger, tracker.replace('| #33 | Fresh-player sessions | 3 | 0 |', '| #33 | Fresh-player sessions | 3 | 1 |')),
  '#33 player accepted tracker count expected 0, got 1'
);

expectFailure(
  'route coverage required mismatch',
  () => validate(ledger, tracker, { externalEvidence: { playerRouteCoverage: { accepted: 0, required: 2 } } }),
  '#33 route required tracker count expected 2, got 3'
);

expectFailure(
  'zero evidence marked ready',
  () => validate(ledger, tracker.replace('Blocked on real player sessions', 'Ready for closure review')),
  '#33:Fresh-player sessions below required evidence must stay blocked, pending, or in progress'
);

const partialPlayerLedger = ledger.replace(
  '| Fresh-player first-run sessions | 3 | 0 | Pending execution | #33 |',
  '| Fresh-player first-run sessions | 3 | 1 | In progress | #33 |'
);
const partialPlayerTracker = tracker.replace(
  '| #33 | Fresh-player sessions | 3 | 0 | #36, #37, #38 | Open | Blocked on real player sessions |',
  '| #33 | Fresh-player sessions | 3 | 1 | #36, #37, #38 | Open | In progress: one player session accepted |'
);

validate(partialPlayerLedger, partialPlayerTracker);
console.log('pass fixture accepted: partial player tracker in progress');

expectFailure(
  'partial player gate closed early',
  () => validate(partialPlayerLedger, partialPlayerTracker.replace('Open | In progress: one player session accepted', 'Closed | Complete')),
  '#33:Fresh-player sessions below required evidence must not mark issue state closed or resolved'
);

expectFailure(
  'partial player gate ready early',
  () => validate(partialPlayerLedger, partialPlayerTracker.replace('In progress: one player session accepted', 'Ready for closure review')),
  '#33:Fresh-player sessions below required evidence must stay blocked, pending, or in progress'
);

expectFailure(
  'missing no-closure decision',
  () => validate(ledger, tracker.replace('Do not close #27, #33, or the thread goal from the current tracker state.', '')),
  'tracker must preserve no-closure decision'
);

console.log('external validation tracker self-test passed');
