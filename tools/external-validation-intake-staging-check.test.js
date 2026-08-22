const {
  validateIntakeStaging
} = require('./external-validation-intake-staging-check');

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

const validStaging = [
  '# External Validation Intake Staging',
  '',
  'This staging sheet is not evidence by itself. Do not raise accepted counts from this document, screenshots, smoke tests, implementer walkthroughs, issue comments, or packet visibility.',
  '',
  '## Staging Rules',
  '',
  '- Paste exact phrases before summary language.',
  '- Keep #27 lived-experience rows separate from #33 player and SME rows.',
  '- Leave accepted count fields unchanged until all target docs are updated and `node tools/external-validation-full-check.js --live-issues` passes.',
  '- Reject or restage any row that depends on screenshots, smoke tests, implementer walkthroughs, or coached interpretation.',
  '',
  '## #35 LE Staging',
  '',
  '`LE-01` through `LE-05`',
  '',
  '| Row id | Exact source phrase | Provenance | Procedure event | Game verb | Player skill | Failure mode | Delayed consequence | Design effect | Copy ready? |',
  '|---|---|---|---|---|---|---|---|---|---|',
  '| LE-01 |  |  |  |  |  |  |  |  | yes/no |',
  '| LE-02 |  |  |  |  |  |  |  |  | yes/no |',
  '| LE-03 |  |  |  |  |  |  |  |  | yes/no |',
  '| LE-04 |  |  |  |  |  |  |  |  | yes/no |',
  '| LE-05 |  |  |  |  |  |  |  |  | yes/no |',
  '',
  '## #36-#38 Player Staging',
  '',
  '`P-01`, `P-02`, `P-03`',
  'clean, dirty, missing-control',
  '',
  '| Session id | Issue | Route/fixture | Exact goal phrase | Exact failure-cause phrase | Exact second-run repair phrase | Completed one run in 5 minutes? | Observer intervention before 30 seconds? | Decision | Follow-up issue and disposition | Copy ready? |',
  '|---|---|---|---|---|---|---|---|---|---|---|',
  '| P-01 | #36 | clean |  |  |  | yes/no | yes/no | Pass/Fix/Cut |  | yes/no |',
  '| P-02 | #37 | dirty |  |  |  | yes/no | yes/no | Pass/Fix/Cut |  | yes/no |',
  '| P-03 | #38 | missing-control |  |  |  | yes/no | yes/no | Pass/Fix/Cut |  | yes/no |',
  '',
  '## #39 SME Staging',
  '',
  '`SME-01`',
  'stock/vial/calendar, virgin/cross timing, CO2/sorting, negative geotaxis, record/reviewer logic',
  '',
  '| Review id | Fixtures reviewed | Stock/vial/calendar | Virgin/cross timing | CO2/sorting | Negative geotaxis | Record/reviewer logic | Decision | Follow-up issue and disposition | Copy ready? |',
  '|---|---|---|---|---|---|---|---|---|---|',
  '| SME-01 | clean, dirty, missing-control |  |  |  |  |  | Pass/Fix/Cut |  | yes/no |',
  '',
  '## Copy Gate',
  '',
  'Compare staged rows against `docs/external-validation-launch-matrix.md`.',
  'Open or link concrete follow-up issues for every `Fix` or `Cut` row before counting it.',
  '',
  '## Current Decision',
  '',
  'Keep #27, #33, and the thread goal open until staging has been converted into accepted non-proxy evidence rows, target docs match, and the full live check passes.'
].join('\n');

validateIntakeStaging(validStaging);
console.log('pass fixture accepted: intake staging contract');

expectFailure(
  'missing non-evidence warning',
  () => validateIntakeStaging(validStaging.replace('This staging sheet is not evidence by itself.', 'This staging sheet counts as evidence.')),
  'intake staging missing required text'
);

expectFailure(
  'missing LE row',
  () => validateIntakeStaging(validStaging.replace('| LE-05 |  |  |  |  |  |  |  |  | yes/no |', '')),
  'intake staging expected five LE rows'
);

expectFailure(
  'wrong player route',
  () => validateIntakeStaging(validStaging.replace('| P-03 | #38 | missing-control |', '| P-03 | #38 | control |')),
  'P-03 staging route expected missing-control'
);

expectFailure(
  'wrong player issue',
  () => validateIntakeStaging(validStaging.replace('| P-02 | #37 | dirty |', '| P-02 | #36 | dirty |')),
  'P-02 staging issue expected #37'
);

expectFailure(
  'missing SME coverage',
  () => validateIntakeStaging(validStaging.replace('| SME-01 | clean, dirty, missing-control |', '| SME-01 | clean, dirty |')),
  'SME-01 staging row must preserve all fixture coverage'
);

console.log('external validation intake staging self-test passed');
