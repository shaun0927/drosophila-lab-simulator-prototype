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

function livedDesignChangeCount(markdown) {
  let count = 0;
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.startsWith('| LE-')) continue;
    const row = cells(line);
    const designEffect = row[7] || '';
    const accepted = row[8] || '';
    if (/^Yes$/i.test(accepted) && /(mechanic change|guardrail change|SME risk)/i.test(designEffect)) count += 1;
  }
  return count;
}

function rowsPresent(markdown, idPrefix, expected) {
  for (let i = 1; i <= expected; i += 1) {
    const id = `${idPrefix}-${String(i).padStart(2, '0')}`;
    assert(markdown.includes(`| ${id} |`), `missing external evidence intake row: ${id}`);
  }
}

function isMissingFollowUp(value) {
  return !value || /^(Pending|none|n\/a|-|No)$/i.test(value);
}

function requireFixCutFollowUps(markdown) {
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.startsWith('| P-') && !line.startsWith('| SME-')) continue;
    const row = cells(line);
    const id = row[0];
    const isPlayer = id.startsWith('P-');
    const decision = isPlayer ? row[7] : row[8];
    const followUp = isPlayer ? row[8] : row[9];
    if (/^(Fix|Cut)$/i.test(decision)) {
      assert(!isMissingFollowUp(followUp), `${id} decision ${decision} must link a follow-up issue before it can count`);
    }
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

function requireText(text, needle, label) {
  assert(text && text.includes(needle), `${label} missing required pending-evidence text: ${needle}`);
}

function requireAnyText(text, needles, label, reason) {
  assert(text && needles.some(needle => text.includes(needle)), `${label} missing required ${reason}: ${needles.join(' OR ')}`);
}

function requirePendingStatusDocs({ counts, validationResults, experienceMap, progressAudit, goalAudit }) {
  const needsLivedEvidence = counts.livedAccepted < 5 || counts.designAccepted < 1;
  const needsValidationEvidence = counts.playerAccepted < 3 || counts.smeAccepted < 1;
  const hasAnyLivedEvidence = counts.livedAccepted > 0 || counts.designAccepted > 0;
  const hasAnyValidationEvidence = counts.playerAccepted > 0 || counts.smeAccepted > 0;

  if (needsLivedEvidence) {
    if (hasAnyLivedEvidence) {
      requireAnyText(experienceMap, ['User lived-experience pass: in progress', 'Accepted lived-experience rows'], 'experience map', 'partial lived-evidence status');
    } else {
      requireText(experienceMap, 'User lived-experience pass: pending user input', 'experience map');
    }
    requireText(progressAudit, '| #27 R1 Experience map | Open', 'progress audit');
    requireText(goalAudit, '#27 lacks lived-experience provenance', 'goal audit');
  }

  if (needsValidationEvidence) {
    if (hasAnyValidationEvidence) {
      requireAnyText(validationResults, ['External validation in progress', '## Validation Run'], 'validation results', 'partial external-validation status');
    } else {
      requireText(validationResults, 'No external player or SME validation has been run yet', 'validation results');
    }
    requireText(progressAudit, '| #33 R7 Vertical slice validation | Open', 'progress audit');
    requireText(goalAudit, '#33 lacks player and SME validation', 'goal audit');
  }

  if (needsLivedEvidence || needsValidationEvidence) {
    requireText(progressAudit, '#27 and #33 require external/user evidence', 'progress audit');
    requireText(goalAudit, 'Do not mark the thread goal complete', 'goal audit');
  }
}

function validateExternalEvidence({ ledger, validationResults, experienceMap, progressAudit = '', goalAudit = '', gameData }) {
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
  assert(livedDesignChangeCount(ledger) === designAccepted, '#27 design-change count must match accepted LE rows with mechanic, guardrail, or SME-risk design effects');
  assert(tableAcceptedCount(ledger, 'P', 7) === playerAccepted, '#33 player accepted count must match decided player rows');
  assert(tableAcceptedCount(ledger, 'SME', 8) === smeAccepted, '#33 SME accepted count must match decided SME rows');
  requireFixCutFollowUps(ledger);
  assert(designAccepted <= livedAccepted, '#27 design-change accepted count cannot exceed accepted lived-experience rows');
  const counts = {livedAccepted, designAccepted, playerAccepted, smeAccepted};
  compareGameDataStatus(gameData, counts);

  if (experienceMap.includes('User lived-experience pass: pending user input')) {
    assert(livedAccepted === 0, '#27 accepted count cannot increase while the experience map still says user input is pending');
    assert(designAccepted === 0, '#27 design-change count cannot increase while the experience map still says user input is pending');
  }

  if (validationResults.includes('No external player or SME validation has been run yet')) {
    assert(playerAccepted === 0, '#33 player count cannot increase while validation results say no external validation has run');
    assert(smeAccepted === 0, '#33 SME count cannot increase while validation results say no external validation has run');
  }

  requirePendingStatusDocs({counts, validationResults, experienceMap, progressAudit, goalAudit});

  assert(ledger.includes('Do not treat screenshots as player, SME, or lived-experience evidence') || ledger.includes('screenshots of the route'), 'ledger must reject screenshot-only closure evidence');
}

function runCli() {
  validateExternalEvidence({
    ledger: read('docs/fly-lab-external-evidence-ledger.md'),
    validationResults: read('docs/fly-lab-validation-results.md'),
    experienceMap: read('docs/fly-lab-experience-map.md'),
    progressAudit: read('docs/r-series-progress-audit.md'),
    goalAudit: read('docs/goal-completion-audit-2026-08-22.md'),
    gameData: loadGameData()
  });
  console.log('external evidence ledger check passed: counts match intake rows, status docs, and in-app status');
}

if (require.main === module) {
  runCli();
}

module.exports = {
  validateExternalEvidence
};
