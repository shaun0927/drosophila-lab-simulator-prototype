const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();
const liveIssues = process.argv.includes('--live-issues');
const help = process.argv.includes('--help') || process.argv.includes('-h');

const requiredSections = [
  '## Goal',
  '## Final Implementation Scope',
  '## Success Criteria',
  '## Verification Method',
  '## Guardrails',
  '## Explicit Non-Goals',
  '## Implementation Approach',
  '## PR Decomposition',
  '## Over-Engineering Checklist',
  '## Drift-Prevention Checklist',
  '## Definition of Done'
];

const contracts = [
  {
    issue: 35,
    row: 'LE-01',
    packetHeading: '## #35 Packet: EV1 Lived-Experience Interview',
    requiredBody: ['LE-01', 'LE-05', 'docs/fly-lab-lived-experience-response-form.md', 'docs/fly-lab-experience-map.md', 'explicit no relevant experience'],
    requiredPacket: ['Target output: `LE-01` through `LE-05`', 'Raw Interview Notes', 'Accepted Row Drafts'],
    requiredLabels: ['r-series-current', 'validation', 'needs-user-input']
  },
  {
    issue: 36,
    row: 'P-01',
    route: 'clean',
    packetHeading: '## #36 Packet: EV2 P-01 Clean Route',
    requiredBody: ['P-01', 'clean', 'exact goal phrase', 'exact failure-cause phrase', 'exact second-run repair phrase'],
    requiredPacket: ['Target output: `P-01` clean route or fixture evidence', 'Observer intervention before 30 seconds?', 'Goal within first 30 seconds'],
    requiredLabels: ['r-series-current', 'validation']
  },
  {
    issue: 37,
    row: 'P-02',
    route: 'dirty',
    packetHeading: '## #37 Packet: EV3 P-02 Dirty Route',
    requiredBody: ['P-02', 'dirty', 'exact goal phrase', 'exact failure-cause phrase', 'exact second-run repair phrase'],
    requiredPacket: ['Target output: `P-02` dirty route or fixture evidence', 'Observer intervention before 30 seconds?', 'Goal within first 30 seconds'],
    requiredLabels: ['r-series-current', 'validation']
  },
  {
    issue: 38,
    row: 'P-03',
    route: 'missing-control',
    packetHeading: '## #38 Packet: EV4 P-03 Missing-Control Route',
    requiredBody: ['P-03', 'missing-control', 'exact goal phrase', 'exact failure-cause phrase', 'exact second-run repair phrase'],
    requiredPacket: ['Target output: `P-03` missing-control route or fixture evidence', 'Observer intervention before 30 seconds?', 'Goal within first 30 seconds'],
    requiredLabels: ['r-series-current', 'validation']
  },
  {
    issue: 39,
    row: 'SME-01',
    packetHeading: '## #39 Packet: EV5 SME-01 Biology-Aware Review',
    requiredBody: ['SME-01', '?fixture=clean', '?fixture=dirty', '?fixture=missing-control', 'five core ratings'],
    requiredPacket: ['Target output: `SME-01` fixture coverage and five core ratings', 'Allowed ratings:', 'Stock/vial/calendar', 'Record/reviewer logic'],
    requiredLabels: ['r-series-current', 'validation', 'sme-review']
  }
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function labelNames(issue) {
  return (issue.labels || []).map(label => label.name);
}

function requireText(text, needle, context) {
  assert(text.includes(needle), `${context} missing required text: ${needle}`);
}

function issueBody(number, cwd = root) {
  const output = execFileSync('gh', ['issue', 'view', String(number), '--json', 'number,state,title,body,labels'], {
    cwd,
    encoding: 'utf8'
  });
  return JSON.parse(output);
}

function validatePacketContracts(packetMarkdown) {
  requireText(packetMarkdown, 'These packets are field forms only. They do not count as evidence until real answers are recorded', 'session packet');
  requireText(packetMarkdown, 'Do not count screenshots, smoke tests, implementer walkthroughs, or packet visibility as external evidence', 'session packet');
  requireText(packetMarkdown, 'Post-Session Checklist', 'session packet');

  for (const contract of contracts) {
    const context = `session packet #${contract.issue}`;
    requireText(packetMarkdown, contract.packetHeading, context);
    requireText(packetMarkdown, `Issue | #${contract.issue}`, context);
    for (const needle of contract.requiredPacket) {
      requireText(packetMarkdown, needle, context);
    }
  }
}

function validateIssueContract(issue, contract) {
  assert(issue.state === 'OPEN', `execution issue #${contract.issue} must remain open until evidence is accepted or rejected`);
  const labels = labelNames(issue);
  for (const label of contract.requiredLabels) {
    assert(labels.includes(label), `execution issue #${contract.issue} missing required label: ${label}`);
  }
  assert(!labels.includes('parked-unity-line'), `execution issue #${contract.issue} must not be parked`);

  for (const section of requiredSections) {
    requireText(issue.body, section, `execution issue #${contract.issue}`);
  }
  for (const needle of contract.requiredBody) {
    requireText(issue.body, needle, `execution issue #${contract.issue}`);
  }
  requireText(issue.body, 'node tools/external-evidence-check.js', `execution issue #${contract.issue}`);
  requireText(issue.body, 'node tools/r-series-status-check.js', `execution issue #${contract.issue}`);
  requireText(issue.body, 'External evidence checker passes', `execution issue #${contract.issue}`);
}

function validateExecutionContracts({
  packetMarkdown = read('docs/external-validation-session-packets.md'),
  issues = []
} = {}) {
  validatePacketContracts(packetMarkdown);

  if (issues.length > 0) {
    const byNumber = new Map(issues.map(issue => [issue.number, issue]));
    for (const contract of contracts) {
      const issue = byNumber.get(contract.issue);
      assert(issue, `missing execution issue #${contract.issue} from audit input`);
      validateIssueContract(issue, contract);
    }
  }
}

function main() {
  if (help) {
    console.log([
      'Usage: node tools/external-validation-execution-contract-check.js [--live-issues]',
      '',
      'Checks local #35-#39 session packets. Add --live-issues to verify live GitHub issue bodies and labels.'
    ].join('\n'));
    return;
  }

  const issues = liveIssues ? contracts.map(contract => issueBody(contract.issue)) : [];
  validateExecutionContracts({ issues });
  console.log(`external validation execution contract check passed: session packets${liveIssues ? ' and live issue bodies' : ''} match #35-#39 evidence contracts`);
}

if (require.main === module) {
  main();
}

module.exports = {
  contracts,
  requiredSections,
  validateExecutionContracts,
  validateIssueContract,
  validatePacketContracts
};
