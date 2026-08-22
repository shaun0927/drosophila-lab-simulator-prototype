const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();

const policy = {
  active: [27, 33, 35, 36, 37, 38, 39],
  parked: [4, 5, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 23, 24, 25],
  superseded: [1, 2, 3],
  auditMaxIssue: 39
};

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function labelNames(issue) {
  return (issue.labels || []).map(label => label.name);
}

function hasLabel(issue, name) {
  return labelNames(issue).includes(name);
}

function ghIssue(number, cwd = root) {
  const output = execFileSync('gh', ['issue', 'view', String(number), '--json', 'number,state,title,labels,url'], {
    cwd,
    encoding: 'utf8'
  });
  return JSON.parse(output);
}

function ghOpenIssues(cwd = root) {
  const output = execFileSync('gh', ['issue', 'list', '--state', 'open', '--limit', '100', '--json', 'number,title,labels,state'], {
    cwd,
    encoding: 'utf8'
  });
  return JSON.parse(output);
}

function mapIssues(issues) {
  return new Map(issues.map(issue => [issue.number, issue]));
}

function requireIssue(issuesByNumber, number) {
  const issue = issuesByNumber.get(number);
  assert(issue, `missing issue #${number} from audit input`);
  return issue;
}

function auditOpenIssueTriage({
  issues,
  openIssues,
  triageMarkdown = fs.readFileSync(path.join(root, 'docs/open-issue-triage-2026-08-22.md'), 'utf8')
}) {
  const issuesByNumber = mapIssues(issues);

  assert(triageMarkdown.includes('Do not pick up #4/#5/#7/#9/#10-#25'), 'open issue triage must preserve parked-issue no-pickup warning');
  assert(triageMarkdown.includes('The full goal is not complete because:'), 'open issue triage must preserve current incompletion analysis');

  for (const number of policy.active) {
    const issue = requireIssue(issuesByNumber, number);
    assert(issue.state === 'OPEN', `active R-series issue #${number} must remain open until its evidence gate resolves`);
    assert(hasLabel(issue, 'r-series-current'), `active R-series issue #${number} must have r-series-current label`);
    assert(!hasLabel(issue, 'parked-unity-line'), `active R-series issue #${number} must not be parked`);
  }

  for (const number of policy.parked) {
    const issue = requireIssue(issuesByNumber, number);
    assert(issue.state === 'OPEN', `parked issue #${number} must remain open as visible backlog`);
    assert(hasLabel(issue, 'parked-unity-line'), `parked issue #${number} must have parked-unity-line label`);
    assert(hasLabel(issue, 'post-r-series-backlog'), `parked issue #${number} must have post-r-series-backlog label`);
    assert(!hasLabel(issue, 'r-series-current'), `parked issue #${number} must not have r-series-current label`);
  }

  for (const number of policy.superseded) {
    const issue = requireIssue(issuesByNumber, number);
    assert(issue.state === 'CLOSED', `superseded issue #${number} must stay closed`);
    assert(hasLabel(issue, 'superseded-by-r-series'), `superseded issue #${number} must have superseded-by-r-series label`);
  }

  const allowedOpen = new Set([...policy.active, ...policy.parked]);
  for (const issue of openIssues) {
    if (issue.number > policy.auditMaxIssue) continue;
    assert(allowedOpen.has(issue.number), `open issue #${issue.number} is not classified as active R-series or parked backlog`);
  }
}

function fetchAuditInput(cwd = root) {
  const numbers = [...new Set([...policy.active, ...policy.parked, ...policy.superseded])];
  return {
    issues: numbers.map(number => ghIssue(number, cwd)),
    openIssues: ghOpenIssues(cwd)
  };
}

function main() {
  auditOpenIssueTriage(fetchAuditInput());
  console.log('open issue triage audit passed: active, parked, and superseded issue states match the R-series triage');
}

if (require.main === module) {
  main();
}

module.exports = {
  auditOpenIssueTriage,
  fetchAuditInput,
  policy
};
