const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function cells(line) {
  return line.split('|').slice(1, -1).map(cell => cell.trim());
}

function parseSummaryRows(markdown) {
  const rows = [];
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.startsWith('| #') || line.includes('---')) continue;
    const row = cells(line);
    if (row.length !== 7 || row[1] === 'Gate') continue;
    rows.push({
      parent: row[0],
      gate: row[1],
      executionIssue: row[4],
      issueState: row[5],
      closureStatus: row[6]
    });
  }
  return rows;
}

function issueNumbersFrom(text) {
  const matches = text.match(/#\d+/g) || [];
  return [...new Set(matches.map(match => Number(match.slice(1))))];
}

function ghIssueState(number, cwd = root) {
  const output = execFileSync('gh', ['issue', 'view', String(number), '--json', 'number,state,title,url'], {
    cwd,
    encoding: 'utf8'
  });
  return JSON.parse(output);
}

function expectedIssueStates(markdown) {
  const summaryRows = parseSummaryRows(markdown);
  assert(summaryRows.length > 0, 'tracker has no current gate summary rows to audit');

  const expected = new Map();
  for (const row of summaryRows) {
    for (const number of issueNumbersFrom(row.parent)) {
      expected.set(number, 'OPEN');
    }
    for (const number of issueNumbersFrom(row.executionIssue)) {
      if (/^Open$/i.test(row.issueState)) {
        expected.set(number, 'OPEN');
      }
    }
  }

  return expected;
}

function auditTrackerIssueStates(markdown, fetchIssueState = ghIssueState) {
  const expected = expectedIssueStates(markdown);

  for (const number of [27, 33, 35, 36, 37, 38, 39]) {
    assert(expected.has(number), `tracker does not declare expected state for issue #${number}`);
  }

  for (const [number, expectedState] of expected.entries()) {
    const issue = fetchIssueState(number);
    assert(issue.state === expectedState, `issue #${number} tracker state mismatch: expected ${expectedState}, got ${issue.state}`);
  }

  assert(markdown.includes('Do not close #27, #33, or the thread goal from the current tracker state'), 'tracker must preserve current no-closure decision');
}

function main() {
  const trackerPath = path.join(root, 'docs/external-validation-execution-tracker.md');
  const tracker = fs.readFileSync(trackerPath, 'utf8');
  auditTrackerIssueStates(tracker);
  console.log('external validation issue-state audit passed: tracker issue states match GitHub');
}

if (require.main === module) {
  main();
}

module.exports = {
  auditTrackerIssueStates,
  expectedIssueStates,
  parseSummaryRows,
  issueNumbersFrom
};
