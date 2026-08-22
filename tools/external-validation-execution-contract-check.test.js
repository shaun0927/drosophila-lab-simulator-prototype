const {
  contracts,
  validateExecutionContracts
} = require('./external-validation-execution-contract-check');

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

const packetMarkdown = `# External Validation Session Packets

These packets are field forms only. They do not count as evidence until real answers are recorded.
Do not count screenshots, smoke tests, implementer walkthroughs, or packet visibility as external evidence.

## #35 Packet: EV1 Lived-Experience Interview
Target output: \`LE-01\` through \`LE-05\`
| Issue | #35 |
Raw Interview Notes
Accepted Row Drafts

## #36 Packet: EV2 P-01 Clean Route
Target output: \`P-01\` clean route or fixture evidence
| Issue | #36 |
Observer intervention before 30 seconds?
Goal within first 30 seconds

## #37 Packet: EV3 P-02 Dirty Route
Target output: \`P-02\` dirty route or fixture evidence
| Issue | #37 |
Observer intervention before 30 seconds?
Goal within first 30 seconds

## #38 Packet: EV4 P-03 Missing-Control Route
Target output: \`P-03\` missing-control route or fixture evidence
| Issue | #38 |
Observer intervention before 30 seconds?
Goal within first 30 seconds

## #39 Packet: EV5 SME-01 Biology-Aware Review
Target output: \`SME-01\` fixture coverage and five core ratings
| Issue | #39 |
Allowed ratings:
Stock/vial/calendar
Record/reviewer logic

Post-Session Checklist
`;

function bodyFor(contract) {
  return [
    '## Goal',
    '## Final Implementation Scope',
    '## Success Criteria',
    '## Verification Method',
    'node tools/external-evidence-check.js',
    'node tools/r-series-status-check.js',
    'node tools/external-validation-gap-report.js',
    'node tools/external-validation-full-check.js --live-issues',
    '## Guardrails',
    '## Explicit Non-Goals',
    '## Implementation Approach',
    '## PR Decomposition',
    '## Over-Engineering Checklist',
    '## Drift-Prevention Checklist',
    '## Definition of Done',
    'External evidence checker passes',
    'External validation gap report passes',
    ...contract.requiredBody
  ].join('\n');
}

function issueFor(contract, override = {}) {
  return {
    number: contract.issue,
    state: 'OPEN',
    body: bodyFor(contract),
    labels: contract.requiredLabels.map(name => ({ name })),
    ...override
  };
}

function fixtureIssues() {
  return contracts.map(contract => issueFor(contract));
}

validateExecutionContracts({ packetMarkdown, issues: fixtureIssues() });
console.log('pass fixture accepted: execution packet and issue contracts');

expectFailure(
  'missing packet warning',
  () => validateExecutionContracts({
    packetMarkdown: packetMarkdown.replace('They do not count as evidence until real answers are recorded.', ''),
    issues: fixtureIssues()
  }),
  'session packet missing required text'
);

expectFailure(
  'missing issue section',
  () => validateExecutionContracts({
    packetMarkdown,
    issues: fixtureIssues().map(issue => issue.number === 36 ? { ...issue, body: issue.body.replace('## Guardrails', '') } : issue)
  }),
  'execution issue #36 missing required text: ## Guardrails'
);

expectFailure(
  'missing issue route phrase',
  () => validateExecutionContracts({
    packetMarkdown,
    issues: fixtureIssues().map(issue => issue.number === 38 ? { ...issue, body: issue.body.replace('missing-control', 'missing control') } : issue)
  }),
  'execution issue #38 missing required text: missing-control'
);

expectFailure(
  'missing issue label',
  () => validateExecutionContracts({
    packetMarkdown,
    issues: fixtureIssues().map(issue => issue.number === 39 ? { ...issue, labels: [{ name: 'validation' }, { name: 'r-series-current' }] } : issue)
  }),
  'execution issue #39 missing required label: sme-review'
);

expectFailure(
  'closed execution issue',
  () => validateExecutionContracts({
    packetMarkdown,
    issues: fixtureIssues().map(issue => issue.number === 35 ? { ...issue, state: 'CLOSED' } : issue)
  }),
  'execution issue #35 must remain open'
);

console.log('external validation execution contract self-test passed');
