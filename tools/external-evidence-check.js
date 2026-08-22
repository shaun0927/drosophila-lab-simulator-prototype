const fs = require('fs');
const path = require('path');
const vm = require('vm');

function read(rel) {
  return fs.readFileSync(path.join(process.cwd(), rel), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function cells(line) {
  return line.split('|').slice(1, -1).map(cell => cell.trim());
}

function intCell(value, label) {
  assert(/^\d+$/.test(value), `${label} must be a non-negative integer, got: ${value}`);
  return Number(value);
}

function currentStatusRows(markdown) {
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

function tableAcceptedCount(markdown, idPrefix, acceptedColumnIndex) {
  let count = 0;
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.startsWith(`| ${idPrefix}-`)) continue;
    const row = cells(line);
    const acceptedCell = row[acceptedColumnIndex];
    if (/^(Yes|Pass|Fix|Cut)$/i.test(acceptedCell)) count += 1;
  }
  return count;
}

function rowsPresent(markdown, idPrefix, expected) {
  for (let i = 1; i <= expected; i += 1) {
    const id = `${idPrefix}-${String(i).padStart(2, '0')}`;
    assert(markdown.includes(`| ${id} |`), `missing external evidence intake row: ${id}`);
  }
}

function loadGameData() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(read('web-prototype/data.js'), context);
  return context.window.GAME_DATA;
}

function compareGameDataStatus(gameData, counts) {
  if (!gameData) return;
  const evidence = gameData.externalEvidence;
  assert(evidence, 'web-prototype/data.js missing externalEvidence status');
  assert(evidence.livedRows.accepted === counts.livedAccepted, 'data.js livedRows accepted count must match ledger');
  assert(evidence.livedRows.required === 5, 'data.js livedRows required count must stay 5 unless #27 is explicitly re-scoped');
  assert(evidence.livedDesignChange.accepted === counts.designAccepted, 'data.js livedDesignChange accepted count must match ledger');
  assert(evidence.livedDesignChange.required === 1, 'data.js livedDesignChange required count must stay 1 unless #27 is explicitly re-scoped');
  assert(evidence.playerSessions.accepted === counts.playerAccepted, 'data.js playerSessions accepted count must match ledger');
  assert(evidence.playerSessions.required === 3, 'data.js playerSessions required count must stay 3 unless #33 is explicitly re-scoped');
  assert(evidence.smeReviews.accepted === counts.smeAccepted, 'data.js smeReviews accepted count must match ledger');
  assert(evidence.smeReviews.required === 1, 'data.js smeReviews required count must stay 1 unless #33 is explicitly re-scoped');
}

function validateExternalEvidence({ ledger, validationResults, experienceMap, gameData }) {
  const rows = currentStatusRows(ledger);
  const livedRows = rows.get('Lived-experience event rows with user or observed-lab provenance');
  const designChange = rows.get('Lived-experience answer that changes a mechanic, guardrail, or SME risk');
  const playerRows = rows.get('Fresh-player first-run sessions');
  const smeRows = rows.get('SME or biology-aware review');

  assert(livedRows, 'missing #27 lived-experience current-status gate');
  assert(designChange, 'missing #27 design-change current-status gate');
  assert(playerRows, 'missing #33 player-session current-status gate');
  assert(smeRows, 'missing #33 SME-review current-status gate');

  assert(livedRows.required === '5', '#27 lived-experience required count must stay 5 unless the issue is explicitly re-scoped');
  assert(designChange.required === '1', '#27 design-change required count must stay 1 unless the issue is explicitly re-scoped');
  assert(playerRows.required === '3', '#33 player-session required count must stay 3 unless the issue is explicitly re-scoped');
  assert(smeRows.required === '1', '#33 SME-review required count must stay 1 unless the issue is explicitly re-scoped');
  assert(livedRows.issue === '#27' && designChange.issue === '#27', '#27 ledger gates must point to #27');
  assert(playerRows.issue === '#33' && smeRows.issue === '#33', '#33 ledger gates must point to #33');

  const livedAccepted = intCell(livedRows.accepted, '#27 lived-experience accepted count');
  const designAccepted = intCell(designChange.accepted, '#27 design-change accepted count');
  const playerAccepted = intCell(playerRows.accepted, '#33 player-session accepted count');
  const smeAccepted = intCell(smeRows.accepted, '#33 SME-review accepted count');

  rowsPresent(ledger, 'LE', 5);
  rowsPresent(ledger, 'P', 3);
  rowsPresent(ledger, 'SME', 1);

  assert(tableAcceptedCount(ledger, 'LE', 8) === livedAccepted, '#27 accepted count must match accepted LE intake rows');
  assert(tableAcceptedCount(ledger, 'P', 7) === playerAccepted, '#33 player accepted count must match decided player rows');
  assert(tableAcceptedCount(ledger, 'SME', 8) === smeAccepted, '#33 SME accepted count must match decided SME rows');
  assert(designAccepted <= livedAccepted, '#27 design-change accepted count cannot exceed accepted lived-experience rows');
  compareGameDataStatus(gameData, {livedAccepted, designAccepted, playerAccepted, smeAccepted});

  if (experienceMap.includes('User lived-experience pass: pending user input')) {
    assert(livedAccepted === 0, '#27 accepted count cannot increase while the experience map still says user input is pending');
    assert(designAccepted === 0, '#27 design-change count cannot increase while the experience map still says user input is pending');
  }

  if (validationResults.includes('No external player or SME validation has been run yet')) {
    assert(playerAccepted === 0, '#33 player count cannot increase while validation results say no external validation has run');
    assert(smeAccepted === 0, '#33 SME count cannot increase while validation results say no external validation has run');
  }

  assert(ledger.includes('Do not treat screenshots as player, SME, or lived-experience evidence') || ledger.includes('screenshots of the route'), 'ledger must reject screenshot-only closure evidence');
}

function runCli() {
  validateExternalEvidence({
    ledger: read('docs/fly-lab-external-evidence-ledger.md'),
    validationResults: read('docs/fly-lab-validation-results.md'),
    experienceMap: read('docs/fly-lab-experience-map.md'),
    gameData: loadGameData()
  });
  console.log('external evidence ledger check passed: counts match intake rows and pending blockers are consistent');
}

if (require.main === module) {
  runCli();
}

module.exports = {
  validateExternalEvidence
};
