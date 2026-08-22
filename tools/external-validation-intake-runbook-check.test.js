const {
  orderedTexts,
  requiredTexts,
  validateIntakeRunbook
} = require('./external-validation-intake-runbook-check');

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

const validRunbook = [
  '# External Validation Intake Runbook',
  ...orderedTexts,
  ...requiredTexts,
  ...statusOrder
].join('\n');

validateIntakeRunbook(validRunbook);
console.log('pass fixture accepted: intake runbook contract');

expectFailure(
  'missing no-evidence warning',
  () => validateIntakeRunbook(validRunbook.replace('This is not evidence. Do not raise any accepted count from this document.', '')),
  'intake runbook missing required text'
);

expectFailure(
  'sections out of order',
  () => validateIntakeRunbook(validRunbook.replace('# External Validation Intake Runbook\n', '# External Validation Intake Runbook\n## Closure Handoff\n')),
  'intake runbook section out of order'
);

expectFailure(
  'missing full check command',
  () => validateIntakeRunbook(validRunbook.replace(/node tools\/external-validation-full-check\.js --live-issues/g, 'node tools/external-evidence-check.js')),
  'intake runbook missing required text: node tools/external-validation-full-check.js --live-issues'
);

expectFailure(
  'missing status count update',
  () => validateIntakeRunbook(validRunbook.replace('3. `web-prototype/data.js` external-evidence counts', '')),
  'intake runbook missing status update order item'
);

console.log('external validation intake runbook self-test passed');
