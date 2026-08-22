const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function cells(line) {
  return line.split('|').slice(1, -1).map(cell => cell.trim());
}

function parseLedgerStatus(markdown) {
  const rows = new Map();
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.startsWith('| ') || line.includes('---')) continue;
    const row = cells(line);
    if (row.length !== 5 || row[0] === 'Evidence gate') continue;
    rows.set(row[0], {
      required: row[1],
      accepted: row[2],
      status: row[3],
      issue: row[4]
    });
  }
  return rows;
}

function parseTrackerSummary(markdown) {
  const rows = new Map();
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.startsWith('| #') || line.includes('---')) continue;
    const row = cells(line);
    if (row.length !== 7 || row[1] === 'Gate') continue;
    rows.set(`${row[0]}:${row[1]}`, {
      parent: row[0],
      gate: row[1],
      required: row[2],
      accepted: row[3],
      executionIssue: row[4],
      issueState: row[5],
      closureStatus: row[6]
    });
  }
  return rows;
}

function acceptedRows(markdown, prefix, decisionIndex) {
  const rows = [];
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.startsWith(`| ${prefix}-`)) continue;
    const row = cells(line);
    if (/^(Yes|Pass|Fix|Cut)$/i.test(row[decisionIndex] || '')) {
      rows.push(row);
    }
  }
  return rows;
}

function livedDesignChangeCount(markdown) {
  return acceptedRows(markdown, 'LE', 8).filter(row => (
    /^(mechanic change|guardrail change|SME risk update)$/i.test(row[7] || '')
  )).length;
}

function playerRouteCoverageCount(markdown) {
  const coverage = { clean: false, dirty: false, missingControl: false };
  for (const row of acceptedRows(markdown, 'P', 7)) {
    const route = row[2] || '';
    if (/\bclean\b/i.test(route)) coverage.clean = true;
    if (/\bdirty\b/i.test(route)) coverage.dirty = true;
    if (/missing[-\s]?control/i.test(route)) coverage.missingControl = true;
  }
  return Object.values(coverage).filter(Boolean).length;
}

function loadGameData() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(read('web-prototype/data.js'), context);
  return context.window.GAME_DATA;
}

function requireTrackerRow(rows, key) {
  const row = rows.get(key);
  assert(row, `tracker missing gate row: ${key}`);
  return row;
}

function compareNumber(label, actual, expected) {
  assert(String(actual) === String(expected), `${label} expected ${expected}, got ${actual}`);
}

function numericCount(value) {
  return /^\d+$/.test(String(value)) ? Number(value) : null;
}

function validateIncompleteGateState(key, row) {
  const required = numericCount(row.required);
  const accepted = numericCount(row.accepted);
  if (required === null || accepted === null || accepted >= required) return;

  assert(!/\b(Closed|Resolved|Done)\b/i.test(row.issueState), `${key} below required evidence must not mark issue state closed or resolved`);
  assert(/\b(Blocked|Pending|In progress)\b/i.test(row.closureStatus), `${key} below required evidence must stay blocked, pending, or in progress`);
  assert(!/\b(Ready|Complete|Closed|Resolved|Done)\b/i.test(row.closureStatus), `${key} below required evidence must not use ready or complete closure language`);
}

function validateTrackerConsistency({
  ledgerMarkdown = read('docs/fly-lab-external-evidence-ledger.md'),
  trackerMarkdown = read('docs/external-validation-execution-tracker.md'),
  gameData = loadGameData()
} = {}) {
  const ledgerRows = parseLedgerStatus(ledgerMarkdown);
  const trackerRows = parseTrackerSummary(trackerMarkdown);
  const evidence = gameData.externalEvidence;

  assert(evidence, 'web-prototype/data.js missing externalEvidence for tracker comparison');

  const livedLedger = ledgerRows.get('Lived-experience event rows with user or observed-lab provenance');
  const designLedger = ledgerRows.get('Lived-experience answer that changes a mechanic, guardrail, or SME risk');
  const playerLedger = ledgerRows.get('Fresh-player first-run sessions');
  const smeLedger = ledgerRows.get('SME or biology-aware review');
  const followUpLedger = ledgerRows.get('Follow-up fix/cut issues for failed external criteria');

  assert(livedLedger && designLedger && playerLedger && smeLedger && followUpLedger, 'ledger missing status rows required by execution tracker');

  const livedTracker = requireTrackerRow(trackerRows, '#27:Lived-experience rows');
  compareNumber('#27 lived required tracker count', livedTracker.required, livedLedger.required);
  compareNumber('#27 lived accepted tracker count', livedTracker.accepted, livedLedger.accepted);
  assert(livedTracker.executionIssue === '#35', '#27 lived tracker row must point to #35');

  const designTracker = requireTrackerRow(trackerRows, '#27:Design-changing lived row');
  compareNumber('#27 design-change required tracker count', designTracker.required, designLedger.required);
  compareNumber('#27 design-change accepted tracker count', designTracker.accepted, livedDesignChangeCount(ledgerMarkdown));
  assert(designTracker.executionIssue === '#35', '#27 design-change tracker row must point to #35');

  const playerTracker = requireTrackerRow(trackerRows, '#33:Fresh-player sessions');
  compareNumber('#33 player required tracker count', playerTracker.required, playerLedger.required);
  compareNumber('#33 player accepted tracker count', playerTracker.accepted, playerLedger.accepted);
  assert(playerTracker.executionIssue === '#36, #37, #38', '#33 player tracker row must point to #36, #37, #38');

  const routeTracker = requireTrackerRow(trackerRows, '#33:Player route coverage');
  compareNumber('#33 route required tracker count', routeTracker.required, evidence.playerRouteCoverage.required);
  compareNumber('#33 route accepted tracker count', routeTracker.accepted, playerRouteCoverageCount(ledgerMarkdown));
  assert(routeTracker.executionIssue === '#36, #37, #38', '#33 route tracker row must point to #36, #37, #38');

  const smeTracker = requireTrackerRow(trackerRows, '#33:SME review');
  compareNumber('#33 SME required tracker count', smeTracker.required, smeLedger.required);
  compareNumber('#33 SME accepted tracker count', smeTracker.accepted, smeLedger.accepted);
  assert(smeTracker.executionIssue === '#39', '#33 SME tracker row must point to #39');

  const followUpTracker = requireTrackerRow(trackerRows, '#33:Fix/Cut follow-up issues');
  compareNumber('#33 follow-up required tracker count', followUpTracker.required, followUpLedger.required);
  compareNumber('#33 follow-up accepted tracker count', followUpTracker.accepted, followUpLedger.accepted);
  assert(followUpTracker.executionIssue === 'Created from #36-#39 findings', '#33 follow-up tracker row must point to #36-#39 findings');

  for (const [key, row] of trackerRows.entries()) {
    validateIncompleteGateState(key, row);
  }

  assert(trackerMarkdown.includes('Do not close #27, #33, or the thread goal from the current tracker state'), 'tracker must preserve no-closure decision for current pending state');
}

function main() {
  validateTrackerConsistency();
  console.log('external validation tracker check passed: tracker counts match ledger and route coverage status');
}

if (require.main === module) {
  main();
}

module.exports = {
  acceptedRows,
  livedDesignChangeCount,
  parseLedgerStatus,
  parseTrackerSummary,
  playerRouteCoverageCount,
  validateTrackerConsistency
};
