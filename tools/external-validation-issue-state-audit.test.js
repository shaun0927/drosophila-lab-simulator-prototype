const {
  auditTrackerIssueStates,
  expectedIssueStates,
  issueNumbersFrom
} = require('./external-validation-issue-state-audit');

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

const baseTracker = `# External Validation Execution Tracker

## Current Gate Summary

| Parent issue | Gate | Required | Accepted | Execution issue | Current issue state | Closure status |
|---|---|---:|---:|---|---|---|
| #27 | Lived-experience rows | 5 | 0 | #35 | Open | Blocked on real interview evidence |
| #27 | Design-changing lived row | 1 | 0 | #35 | Open | Blocked on accepted \`LE-*\` design effect |
| #33 | Fresh-player sessions | 3 | 0 | #36, #37, #38 | Open | Blocked on real player sessions |
| #33 | Player route coverage | 3 | 0 | #36, #37, #38 | Open | Blocked on clean, dirty, missing-control coverage |
| #33 | SME review | 1 | 0 | #39 | Open | Blocked on biology-aware fixture review |
| #33 | Fix/Cut follow-up issues | As needed | 0 | Created from #36-#39 findings | None yet | Pending external findings |

## Current Completion Decision

Do not close #27, #33, or the thread goal from the current tracker state.
`;

function openIssue(number) {
  return { number, state: 'OPEN' };
}

auditTrackerIssueStates(baseTracker, openIssue);
console.log('pass fixture accepted: current open issue states');

const expected = expectedIssueStates(baseTracker);
for (const number of [27, 33, 35, 36, 37, 38, 39]) {
  assert(expected.get(number) === 'OPEN', `expected #${number} to be OPEN`);
}
console.log('pass fixture accepted: expected issue map');

assert(issueNumbersFrom('#36, #37, #38').join(',') === '36,37,38', 'issueNumbersFrom should parse grouped issue refs');
console.log('pass fixture accepted: grouped issue refs');

expectFailure(
  'closed issue while tracker says open',
  () => auditTrackerIssueStates(baseTracker, number => ({ number, state: number === 37 ? 'CLOSED' : 'OPEN' })),
  'issue #37 tracker state mismatch'
);

expectFailure(
  'missing no-closure decision',
  () => auditTrackerIssueStates(baseTracker.replace('Do not close #27, #33, or the thread goal from the current tracker state.', ''), openIssue),
  'tracker must preserve current no-closure decision'
);

expectFailure(
  'missing required execution issue',
  () => auditTrackerIssueStates(baseTracker.replace('#39 | Open', 'none | Open'), openIssue),
  'tracker does not declare expected state for issue #39'
);

console.log('external validation issue-state audit self-test passed');
