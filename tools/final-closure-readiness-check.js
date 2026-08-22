const fs = require('fs');
const path = require('path');

const root = process.cwd();
const requireReady = process.argv.includes('--require-ready');
const help = process.argv.includes('--help') || process.argv.includes('-h');

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

function acceptedRows(markdown, prefix, decisionIndex) {
  const rows = [];
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.startsWith(`| ${prefix}-`)) continue;
    const row = cells(line);
    if (/^(Yes|Pass|Fix|Cut)$/i.test(row[decisionIndex] || '')) rows.push(row);
  }
  return rows;
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

function requiredRow(rows, name) {
  const row = rows.get(name);
  assert(row, `missing final-closure evidence gate: ${name}`);
  return row;
}

function closureCounts(ledger) {
  const rows = currentStatusRows(ledger);
  return {
    livedRows: intCell(requiredRow(rows, 'Lived-experience event rows with user or observed-lab provenance').accepted, '#27 lived rows'),
    livedRowsRequired: intCell(requiredRow(rows, 'Lived-experience event rows with user or observed-lab provenance').required, '#27 lived rows required'),
    designChange: intCell(requiredRow(rows, 'Lived-experience answer that changes a mechanic, guardrail, or SME risk').accepted, '#27 design-changing lived row'),
    designChangeRequired: intCell(requiredRow(rows, 'Lived-experience answer that changes a mechanic, guardrail, or SME risk').required, '#27 design-changing lived row required'),
    playerSessions: intCell(requiredRow(rows, 'Fresh-player first-run sessions').accepted, '#33 player sessions'),
    playerSessionsRequired: intCell(requiredRow(rows, 'Fresh-player first-run sessions').required, '#33 player sessions required'),
    playerRouteCoverage: playerRouteCoverageCount(ledger),
    playerRouteCoverageRequired: 3,
    smeReviews: intCell(requiredRow(rows, 'SME or biology-aware review').accepted, '#33 SME review'),
    smeReviewsRequired: intCell(requiredRow(rows, 'SME or biology-aware review').required, '#33 SME review required')
  };
}

function isReady(counts) {
  return (
    counts.livedRows >= counts.livedRowsRequired &&
    counts.designChange >= counts.designChangeRequired &&
    counts.playerSessions >= counts.playerSessionsRequired &&
    counts.playerRouteCoverage >= counts.playerRouteCoverageRequired &&
    counts.smeReviews >= counts.smeReviewsRequired
  );
}

function validateFinalClosureReadiness({
  ledger = read('docs/fly-lab-external-evidence-ledger.md'),
  experienceMap = read('docs/fly-lab-experience-map.md'),
  validationResults = read('docs/fly-lab-validation-results.md'),
  progressAudit = read('docs/r-series-progress-audit.md'),
  goalAudit = read('docs/goal-completion-audit-2026-08-22.md'),
  finalChecklist = read('docs/final-closure-review-checklist.md')
} = {}) {
  const counts = closureCounts(ledger);
  const ready = isReady(counts);

  assert(finalChecklist.includes('node tools/external-validation-full-check.js --live-issues'), 'final closure checklist must require the full live verification wrapper');
  assert(finalChecklist.includes('player rows cover clean, dirty, and missing-control'), 'final closure checklist must describe route coverage as derived from accepted player rows');

  if (!ready) {
    assert(goalAudit.includes('Do not mark the thread goal complete'), 'goal audit must preserve not-complete decision while final closure evidence is missing');
    assert(progressAudit.includes('| #27 R1 Experience map | Open'), 'progress audit must keep #27 open while final closure evidence is missing');
    assert(progressAudit.includes('| #33 R7 Vertical slice validation | Open'), 'progress audit must keep #33 open while final closure evidence is missing');
    assert(!goalAudit.includes('Ready for final closure audit'), 'goal audit must not claim final closure readiness while evidence thresholds are missing');
  } else {
    assert(experienceMap.includes('User lived-experience pass: ready for closure review'), 'experience map must be ready for closure review when evidence thresholds are met');
    assert(validationResults.includes('External evidence ready for closure review'), 'validation results must be ready for closure review when evidence thresholds are met');
    assert(progressAudit.includes('#27 and #33 evidence thresholds met'), 'progress audit must say #27 and #33 evidence thresholds met');
    assert(goalAudit.includes('Ready for final closure audit'), 'goal audit must say ready for final closure audit');
    assert(!goalAudit.includes('Do not mark the thread goal complete'), 'goal audit must not preserve not-complete decision after final closure evidence is ready');
  }

  return { ready, counts };
}

function main() {
  if (help) {
    console.log([
      'Usage: node tools/final-closure-readiness-check.js [--require-ready]',
      '',
      'Verifies whether the current external-evidence state is allowed to enter final closure review.',
      'Without --require-ready, the current not-ready state is valid if the no-closure guardrails are intact.'
    ].join('\n'));
    return;
  }

  const { ready } = validateFinalClosureReadiness();
  if (requireReady && !ready) {
    throw new Error('final closure evidence is not ready: #27/#33 external evidence thresholds are still missing');
  }
  console.log(`final closure readiness check passed: ${ready ? 'ready for closure review' : 'not ready; external evidence still missing'}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  closureCounts,
  isReady,
  validateFinalClosureReadiness
};
