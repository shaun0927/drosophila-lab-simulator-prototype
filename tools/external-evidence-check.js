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

function acceptedIds(markdown, idPrefix, acceptedColumnIndex) {
  const ids = [];
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.startsWith(`| ${idPrefix}-`)) continue;
    const row = cells(line);
    const acceptedCell = row[acceptedColumnIndex];
    if (/^(Yes|Pass|Fix|Cut)$/i.test(acceptedCell)) ids.push(row[0]);
  }
  return ids;
}

function acceptedRows(markdown, idPrefix, acceptedColumnIndex) {
  const rows = [];
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.startsWith(`| ${idPrefix}-`)) continue;
    const row = cells(line);
    const acceptedCell = row[acceptedColumnIndex];
    if (/^(Yes|Pass|Fix|Cut)$/i.test(acceptedCell)) rows.push(row);
  }
  return rows;
}

function concreteFollowUpRefs(markdown) {
  const refs = new Set();
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.startsWith('| P-') && !line.startsWith('| SME-')) continue;
    const row = cells(line);
    const id = row[0];
    const isPlayer = id.startsWith('P-');
    const decision = isPlayer ? row[7] : row[8];
    const followUp = isPlayer ? row[8] : row[9];
    if (!/^(Fix|Cut)$/i.test(decision)) continue;
    const matches = (followUp || '').match(/#\d+|https:\/\/github\.com\/[^/\s]+\/[^/\s]+\/issues\/\d+/g) || [];
    for (const match of matches) refs.add(match);
  }
  return refs;
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

function requireAcceptedEvidenceReferences({ ledger, validationResults, experienceMap }) {
  for (const id of acceptedIds(ledger, 'LE', 8)) {
    assert(experienceMap.includes(id), `${id} accepted lived-experience row must be referenced in the experience map`);
  }
  for (const id of acceptedIds(ledger, 'P', 7)) {
    assert(validationResults.includes(id), `${id} accepted player row must be referenced in validation results`);
  }
  for (const id of acceptedIds(ledger, 'SME', 8)) {
    assert(validationResults.includes(id), `${id} accepted SME row must be referenced in validation results`);
  }
}

function requireLivedExperienceFieldsMatchMap(ledger, experienceMap) {
  for (const row of acceptedRows(ledger, 'LE', 8)) {
    const id = row[0];
    const mapText = experienceMap.split(/\r?\n/).filter(line => line.includes(id)).join('\n').toLowerCase();
    const requiredFields = [
      [row[1], 'accepted lived-experience provenance must match the experience map'],
      [row[2], 'accepted lived-experience procedure event must match the experience map'],
      [row[3], 'accepted lived-experience game verb must match the experience map'],
      [row[4], 'accepted lived-experience player skill must match the experience map'],
      [row[5], 'accepted lived-experience failure mode must match the experience map'],
      [row[6], 'accepted lived-experience delayed consequence must match the experience map'],
      [row[7], 'accepted lived-experience design effect must match the experience map']
    ];
    for (const [field, message] of requiredFields) {
      assert(mapText.includes(field.toLowerCase()), `${id} ${message}`);
    }
  }
}

function requireFollowUpReferencesInResults(ledger, validationResults) {
  for (const ref of concreteFollowUpRefs(ledger)) {
    assert(validationResults.includes(ref), `${ref} counted Fix/Cut follow-up issue must be referenced in validation results`);
  }
}

function requirePlayerRouteMatchesResults(ledger, validationResults) {
  for (const row of acceptedRows(ledger, 'P', 7)) {
    const id = row[0];
    const route = row[2];
    const resultText = validationResults.split(/\r?\n/).filter(line => line.includes(id)).join('\n').toLowerCase();
    assert(resultText.includes(route.toLowerCase()), `${id} accepted player route/fixture must match validation results`);
  }
}

function requirePlayerPhrasesMatchResults(ledger, validationResults) {
  for (const row of acceptedRows(ledger, 'P', 7)) {
    const id = row[0];
    const phrases = [
      [row[4], 'accepted player goal phrase must match validation results'],
      [row[5], 'accepted player failure-cause phrase must match validation results'],
      [row[6], 'accepted player second-run repair phrase must match validation results']
    ];
    const resultText = validationResults.split(/\r?\n/).filter(line => line.includes(id)).join('\n').toLowerCase();
    for (const [phrase, message] of phrases) {
      assert(resultText.includes(phrase.toLowerCase()), `${id} ${message}`);
    }
  }
}

function requireSmeFixtureCoverage(ledger, validationResults, smeAccepted) {
  if (smeAccepted < 1) return;
  const requiredFixtures = [
    [/\bclean\b/i, '#33 accepted SME review must reference clean fixture coverage in validation results'],
    [/\bdirty\b/i, '#33 accepted SME review must reference dirty fixture coverage in validation results'],
    [/missing[-\s]?control/i, '#33 accepted SME review must reference missing-control fixture coverage in validation results']
  ];
  for (const id of acceptedIds(ledger, 'SME', 8)) {
    const reviewText = validationResults.split(/\r?\n/).filter(line => line.includes(id)).join('\n');
    for (const [pattern, message] of requiredFixtures) {
      assert(pattern.test(reviewText), `${id} ${message}`);
    }
  }
}

function requireSmeRatingsMatchResults(ledger, validationResults) {
  for (const row of acceptedRows(ledger, 'SME', 8)) {
    const id = row[0];
    const resultRow = validationResults.split(/\r?\n/)
      .filter(line => line.startsWith('|') && line.includes(id))
      .map(cells)
      .find(candidate => candidate[0] === id);
    assert(resultRow, `${id} accepted SME rating row must be present in validation results`);
    const ratingChecks = [
      ['accepted SME stock/vial/calendar rating must match validation results', row[3], resultRow[2]],
      ['accepted SME virgin/cross timing rating must match validation results', row[4], resultRow[3]],
      ['accepted SME CO2/sorting rating must match validation results', row[5], resultRow[4]],
      ['accepted SME negative geotaxis rating must match validation results', row[6], resultRow[5]],
      ['accepted SME record/reviewer logic rating must match validation results', row[7], resultRow[6]]
    ];
    for (const [message, expected, actual] of ratingChecks) {
      assert(actual === expected, `${id} ${message}`);
    }
  }
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

function isConcreteIssueReference(value) {
  return /(^|\s)(#\d+|https:\/\/github\.com\/[^/\s]+\/[^/\s]+\/issues\/\d+)(\s|$)/.test(value || '');
}

function referencesCurrentGateIssue(value) {
  return /(^|\s)#(27|33)(\s|$)|\/issues\/(27|33)(\s|$)/.test(value || '');
}

function hasClosedFollowUpDisposition(value) {
  return /\b(resolved|accepted non-blocking)\b/i.test(value || '');
}

function isMissingEvidenceField(value) {
  return !value || /^(Pending|n\/a|-)$/i.test(value);
}

function isProxyEvidence(value) {
  return /\b(screenshot|smoke test|automated|implementer|walkthrough|proxy|dogfood|protocol summary|source-backed|issue comment|coached)\b/i.test(value || '');
}

function requireNoProxyEvidence(row, indexes, id, label) {
  const proxyIndex = indexes.find(index => isProxyEvidence(row[index]));
  assert(proxyIndex === undefined, `${id} accepted ${label} row cannot use proxy evidence as an external-evidence source`);
}

function requireSmeRatings(row, id) {
  const allowed = /^(Accurate enough|Acceptable simplification|Misleading|Unsafe\/ethically wrong)$/i;
  const invalidIndex = row.slice(3, 8).findIndex(value => !allowed.test(value || ''));
  assert(invalidIndex === -1, `${id} accepted SME row has an invalid mechanic rating`);
}

function requireLivedExperienceContract(row, id) {
  const provenance = row[1] || '';
  const designEffect = row[7] || '';
  assert(/^(firsthand|observed lab work|explicit no relevant experience)$/i.test(provenance), `${id} accepted lived-experience row has invalid provenance`);
  assert(/^(mechanic change|guardrail change|SME risk update|explicit exclusion)$/i.test(designEffect), `${id} accepted lived-experience row has invalid design effect`);
  if (/^explicit no relevant experience$/i.test(provenance)) {
    assert(/^explicit exclusion$/i.test(designEffect), `${id} no-experience row must use explicit exclusion as its design effect`);
  }
}

function requireNoConflictingNoExperienceRows(markdown) {
  let noExperienceCount = 0;
  let livedExperienceCount = 0;
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.startsWith('| LE-')) continue;
    const row = cells(line);
    if (!/^Yes$/i.test(row[8] || '')) continue;
    const provenance = row[1] || '';
    if (/^explicit no relevant experience$/i.test(provenance)) noExperienceCount += 1;
    if (/^(firsthand|observed lab work)$/i.test(provenance)) livedExperienceCount += 1;
  }
  assert(noExperienceCount <= 1, '#27 no-experience decision must not be duplicated across accepted LE rows');
  assert(noExperienceCount === 0 || livedExperienceCount === 0, '#27 no-experience decision cannot be mixed with accepted firsthand or observed LE rows');
}

function requirePlayerDecisionConsistency(row, id) {
  const completed = row[3] || '';
  const decision = row[7] || '';
  assert(/^(Yes|No)$/i.test(completed), `${id} accepted player row must record completion as Yes or No`);
  if (/^Pass$/i.test(decision)) {
    assert(/^Yes$/i.test(completed), `${id} player Pass requires completing one run within 5 minutes`);
  }
}

function requirePlayerRouteCoverage(markdown, playerAccepted) {
  if (playerAccepted < 3) return;
  const covered = playerRouteCoverage(markdown);

  assert(
    covered.clean && covered.dirty && covered.missingControl,
    '#33 accepted player sessions must cover clean, dirty, and missing-control routes or fixtures before closure review'
  );
}

function playerRouteCoverage(markdown) {
  const covered = {
    clean: false,
    dirty: false,
    missingControl: false
  };

  for (const line of markdown.split(/\r?\n/)) {
    if (!line.startsWith('| P-')) continue;
    const row = cells(line);
    if (!/^(Pass|Fix|Cut)$/i.test(row[7] || '')) continue;
    const route = row[2] || '';
    if (/\bclean\b/i.test(route)) covered.clean = true;
    if (/\bdirty\b/i.test(route)) covered.dirty = true;
    if (/missing[-\s]?control/i.test(route)) covered.missingControl = true;
  }

  return covered;
}

function playerRouteCoverageCount(markdown) {
  return Object.values(playerRouteCoverage(markdown)).filter(Boolean).length;
}

function requireSmeDecisionConsistency(row, id) {
  const ratings = row.slice(3, 8);
  const decision = row[8] || '';
  if (ratings.some(value => /^Misleading$/i.test(value || ''))) {
    assert(/^(Fix|Cut)$/i.test(decision), `${id} SME row with a Misleading rating must be Fix or Cut`);
  }
  if (ratings.some(value => /^Unsafe\/ethically wrong$/i.test(value || ''))) {
    assert(/^Cut$/i.test(decision), `${id} SME row with an Unsafe/ethically wrong rating must be Cut`);
  }
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
      assert(isConcreteIssueReference(followUp), `${id} decision ${decision} follow-up must be a concrete GitHub issue reference`);
      assert(!referencesCurrentGateIssue(followUp), `${id} decision ${decision} follow-up must not reference #27 or #33`);
      assert(hasClosedFollowUpDisposition(followUp), `${id} decision ${decision} follow-up must be resolved or accepted non-blocking before it can count`);
    }
  }
}

function requireAcceptedRowFields(markdown) {
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.startsWith('| LE-') && !line.startsWith('| P-') && !line.startsWith('| SME-')) continue;
    const row = cells(line);
    const id = row[0];

    if (id.startsWith('LE-') && /^Yes$/i.test(row[8] || '')) {
      const missingIndex = row.slice(1, 8).findIndex(isMissingEvidenceField);
      assert(missingIndex === -1, `${id} accepted lived-experience row has an incomplete required field`);
      requireNoProxyEvidence(row, [1, 2, 3, 4, 5, 6, 7], id, 'lived-experience');
      requireLivedExperienceContract(row, id);
    }

    if (id.startsWith('P-') && /^(Pass|Fix|Cut)$/i.test(row[7] || '')) {
      const missingIndex = row.slice(1, 7).findIndex(isMissingEvidenceField);
      assert(missingIndex === -1, `${id} accepted player row has an incomplete required field`);
      requireNoProxyEvidence(row, [1, 2, 3, 4, 5, 6], id, 'player');
      requirePlayerDecisionConsistency(row, id);
    }

    if (id.startsWith('SME-') && /^(Pass|Fix|Cut)$/i.test(row[8] || '')) {
      const missingIndex = row.slice(1, 8).findIndex(isMissingEvidenceField);
      assert(missingIndex === -1, `${id} accepted SME row has an incomplete required field`);
      requireNoProxyEvidence(row, [1, 2, 3, 4, 5, 6, 7], id, 'SME');
      requireSmeRatings(row, id);
      requireSmeDecisionConsistency(row, id);
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
  assert(evidence.playerRouteCoverage || !evidence.followUpIssues, 'data.js externalEvidence must include playerRouteCoverage when using the current follow-up gate status model');
  if (evidence.playerRouteCoverage) {
    assert(evidence.playerRouteCoverage.accepted === counts.playerRouteCoverageAccepted, 'data.js playerRouteCoverage accepted count must match ledger route coverage');
    assert(evidence.playerRouteCoverage.required === 3, 'data.js playerRouteCoverage required count must stay 3 unless #33 is explicitly re-scoped');
  }
  assert(evidence.smeReviews.accepted === counts.smeAccepted, 'data.js smeReviews accepted count must match ledger');
  assert(evidence.smeReviews.required === 1, 'data.js smeReviews required count must stay 1 unless #33 is explicitly re-scoped');
  if (evidence.followUpIssues) {
    assert(evidence.followUpIssues.accepted === counts.followUpAccepted, 'data.js followUpIssues accepted count must match ledger');
    assert(evidence.followUpIssues.required === 'As needed', 'data.js followUpIssues required count must stay As needed unless #33 is explicitly re-scoped');
  }
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
  const followUpRows = rows.get('Follow-up fix/cut issues for failed external criteria');

  assert(livedRows, 'missing #27 lived-experience current-status gate');
  assert(designChange, 'missing #27 design-change current-status gate');
  assert(playerRows, 'missing #33 player-session current-status gate');
  assert(smeRows, 'missing #33 SME-review current-status gate');
  assert(followUpRows, 'missing #33 follow-up issue current-status gate');

  assert(livedRows.required === '5', '#27 lived-experience required count must stay 5 unless the issue is explicitly re-scoped');
  assert(designChange.required === '1', '#27 design-change required count must stay 1 unless the issue is explicitly re-scoped');
  assert(playerRows.required === '3', '#33 player-session required count must stay 3 unless the issue is explicitly re-scoped');
  assert(smeRows.required === '1', '#33 SME-review required count must stay 1 unless the issue is explicitly re-scoped');
  assert(followUpRows.required === 'As needed', '#33 follow-up issue required count must stay As needed unless the issue is explicitly re-scoped');
  assert(livedRows.issue === '#27' && designChange.issue === '#27', '#27 ledger gates must point to #27');
  assert(playerRows.issue === '#33' && smeRows.issue === '#33', '#33 ledger gates must point to #33');
  assert(followUpRows.issue === '#33', '#33 follow-up ledger gate must point to #33');

  const livedAccepted = intCell(livedRows.accepted, '#27 lived-experience accepted count');
  const designAccepted = intCell(designChange.accepted, '#27 design-change accepted count');
  const playerAccepted = intCell(playerRows.accepted, '#33 player-session accepted count');
  const smeAccepted = intCell(smeRows.accepted, '#33 SME-review accepted count');
  const followUpAccepted = intCell(followUpRows.accepted, '#33 follow-up issue accepted count');

  rowsPresent(ledger, 'LE', 5);
  rowsPresent(ledger, 'P', 3);
  rowsPresent(ledger, 'SME', 1);

  assert(tableAcceptedCount(ledger, 'LE', 8) === livedAccepted, '#27 accepted count must match accepted LE intake rows');
  assert(livedDesignChangeCount(ledger) === designAccepted, '#27 design-change count must match accepted LE rows with mechanic, guardrail, or SME-risk design effects');
  assert(tableAcceptedCount(ledger, 'P', 7) === playerAccepted, '#33 player accepted count must match decided player rows');
  assert(tableAcceptedCount(ledger, 'SME', 8) === smeAccepted, '#33 SME accepted count must match decided SME rows');
  requireAcceptedRowFields(ledger);
  requireNoConflictingNoExperienceRows(ledger);
  requirePlayerRouteCoverage(ledger, playerAccepted);
  requireFixCutFollowUps(ledger);
  assert(concreteFollowUpRefs(ledger).size === followUpAccepted, '#33 follow-up issue accepted count must match unique concrete Fix/Cut follow-up references');
  assert(designAccepted <= livedAccepted, '#27 design-change accepted count cannot exceed accepted lived-experience rows');
  const counts = {
    livedAccepted,
    designAccepted,
    playerAccepted,
    playerRouteCoverageAccepted: playerRouteCoverageCount(ledger),
    smeAccepted,
    followUpAccepted
  };
  compareGameDataStatus(gameData, counts);

  if (experienceMap.includes('User lived-experience pass: pending user input')) {
    assert(livedAccepted === 0, '#27 accepted count cannot increase while the experience map still says user input is pending');
    assert(designAccepted === 0, '#27 design-change count cannot increase while the experience map still says user input is pending');
  }

  if (validationResults.includes('No external player or SME validation has been run yet')) {
    assert(playerAccepted === 0, '#33 player count cannot increase while validation results say no external validation has run');
    assert(smeAccepted === 0, '#33 SME count cannot increase while validation results say no external validation has run');
  }

  requireAcceptedEvidenceReferences({ledger, validationResults, experienceMap});
  requireLivedExperienceFieldsMatchMap(ledger, experienceMap);
  requireFollowUpReferencesInResults(ledger, validationResults);
  requirePlayerRouteMatchesResults(ledger, validationResults);
  requirePlayerPhrasesMatchResults(ledger, validationResults);
  requireSmeFixtureCoverage(ledger, validationResults, smeAccepted);
  requireSmeRatingsMatchResults(ledger, validationResults);
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
