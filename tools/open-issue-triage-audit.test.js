const {
  auditOpenIssueTriage,
  policy
} = require('./open-issue-triage-audit');

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

function issue(number, state, labels) {
  return {
    number,
    state,
    labels: labels.map(name => ({ name }))
  };
}

function fixtureIssues() {
  return [
    ...policy.active.map(number => issue(number, 'OPEN', ['r-series-current'])),
    ...policy.parked.map(number => issue(number, 'OPEN', ['parked-unity-line', 'post-r-series-backlog'])),
    ...policy.superseded.map(number => issue(number, 'CLOSED', ['superseded-by-r-series']))
  ];
}

const triageMarkdown = [
  '# Open Issue Triage',
  'The full goal is not complete because:',
  'Do not pick up #4/#5/#7/#9/#10-#25 as current implementation work until one of these is true:'
].join('\n');

function run(issues = fixtureIssues(), openIssues = fixtureIssues().filter(item => item.state === 'OPEN')) {
  auditOpenIssueTriage({ issues, openIssues, triageMarkdown });
}

run();
console.log('pass fixture accepted: current issue triage policy');

expectFailure(
  'active issue missing current label',
  () => run(fixtureIssues().map(item => item.number === 33 ? issue(33, 'OPEN', []) : item)),
  'active R-series issue #33 must have r-series-current label'
);

expectFailure(
  'parked issue missing parked label',
  () => run(fixtureIssues().map(item => item.number === 12 ? issue(12, 'OPEN', ['post-r-series-backlog']) : item)),
  'parked issue #12 must have parked-unity-line label'
);

expectFailure(
  'parked issue promoted to current',
  () => run(fixtureIssues().map(item => item.number === 24 ? issue(24, 'OPEN', ['parked-unity-line', 'post-r-series-backlog', 'r-series-current']) : item)),
  'parked issue #24 must not have r-series-current label'
);

expectFailure(
  'superseded issue reopened',
  () => run(fixtureIssues().map(item => item.number === 2 ? issue(2, 'OPEN', ['superseded-by-r-series']) : item)),
  'superseded issue #2 must stay closed'
);

expectFailure(
  'unclassified open issue',
  () => run(fixtureIssues(), [...fixtureIssues().filter(item => item.state === 'OPEN'), issue(6, 'OPEN', [])]),
  'open issue #6 is not classified as active R-series or parked backlog'
);

expectFailure(
  'missing no-pickup warning',
  () => auditOpenIssueTriage({
    issues: fixtureIssues(),
    openIssues: fixtureIssues().filter(item => item.state === 'OPEN'),
    triageMarkdown: '# Open Issue Triage'
  }),
  'open issue triage must preserve parked-issue no-pickup warning'
);

console.log('open issue triage audit self-test passed');
