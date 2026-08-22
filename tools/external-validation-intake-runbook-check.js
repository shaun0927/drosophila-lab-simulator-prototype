const fs = require('fs');
const path = require('path');

const root = process.cwd();

const requiredTexts = [
  'This is not evidence. Do not raise any accepted count from this document.',
  'node tools/external-validation-full-check.js --live-issues',
  'Final closure readiness reports `not ready; external evidence still missing`.',
  '| #35 | `docs/external-validation-session-packets.md` #35 packet or `?validation=lived` | `LE-01` through `LE-05` |',
  '| #36 | `docs/external-validation-session-packets.md` #36 packet or `?validation=capture` | `P-01` clean |',
  '| #37 | `docs/external-validation-session-packets.md` #37 packet or `?validation=capture` | `P-02` dirty |',
  '| #38 | `docs/external-validation-session-packets.md` #38 packet or `?validation=capture` | `P-03` missing-control |',
  '| #39 | `docs/external-validation-session-packets.md` #39 packet or SME sheet | `SME-01` |',
  'Preserve exact wording from the respondent/player/reviewer before summarizing.',
  'For each accepted `LE-*` row:',
  'Copy the same `LE-*` row into `docs/fly-lab-experience-map.md`',
  'For each accepted `P-*` row:',
  'Confirm the validation result repeats the same route/fixture, goal phrase, failure-cause phrase, second-run repair phrase, decision, and follow-up disposition.',
  'For the accepted `SME-01` row:',
  'Confirm the validation result repeats clean, dirty, and missing-control fixture coverage plus the same five ratings, decision, and follow-up disposition.',
  'Before a `Fix` or `Cut` row can count:',
  'Do not use #27 or #33 as the follow-up reference for a counted Fix/Cut row.',
  'Do not edit closure-ready language until the validators demand it from actual accepted counts.',
  'node tools/final-closure-readiness-check.js --require-ready',
  'The `--require-ready` command must fail while #27 or #33 evidence is still missing.',
  'Rejected notes may be summarized in the execution issue, but they must not raise ledger counts.'
];

const orderedTexts = [
  '## Before Any Session',
  '## Intake Source Order',
  '## Accepted Row Edit Order',
  '## Fix/Cut Handling',
  '## Status Update Order',
  '## Required Verification After Intake',
  '## Rejection Notes',
  '## Closure Handoff'
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function validateIntakeRunbook(markdown) {
  for (const text of requiredTexts) {
    assert(markdown.includes(text), `intake runbook missing required text: ${text}`);
  }

  let previousIndex = -1;
  for (const text of orderedTexts) {
    const index = markdown.indexOf(text);
    assert(index !== -1, `intake runbook missing required section: ${text}`);
    assert(index > previousIndex, `intake runbook section out of order: ${text}`);
    previousIndex = index;
  }

  const statusOrder = [
    '1. `docs/fly-lab-external-evidence-ledger.md`',
    '2. `docs/fly-lab-experience-map.md` for `LE-*`, or `docs/fly-lab-validation-results.md` for `P-*` and `SME-*`',
    '3. `web-prototype/data.js` external-evidence counts',
    '4. `docs/external-validation-execution-tracker.md`',
    '5. `docs/r-series-progress-audit.md`',
    '6. `docs/goal-completion-audit-2026-08-22.md`',
    '7. Execution issue #35, #36, #37, #38, or #39',
    '8. Parent issue #27 or #33'
  ];
  for (const text of statusOrder) {
    assert(markdown.includes(text), `intake runbook missing status update order item: ${text}`);
  }
}

function main() {
  const runbook = fs.readFileSync(path.join(root, 'docs/external-validation-intake-runbook.md'), 'utf8');
  validateIntakeRunbook(runbook);
  console.log('external validation intake runbook check passed: evidence intake order and anti-drift rules are present');
}

if (require.main === module) {
  main();
}

module.exports = {
  orderedTexts,
  requiredTexts,
  validateIntakeRunbook
};
