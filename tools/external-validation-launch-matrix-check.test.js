const {
  validateLaunchMatrix
} = require('./external-validation-launch-matrix-check');

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

const validMatrix = [
  '# External Validation Launch Matrix',
  '',
  'This matrix is not evidence. It is an execution aid. Do not raise accepted counts from this document, screenshots, smoke tests, implementer walkthroughs, or packet visibility.',
  '',
  '## Preflight',
  '',
  'node tools/external-validation-full-check.js --live-issues',
  'node tools/external-validation-session-handoff.js',
  'node tools/external-validation-gap-report.js',
  '',
  '## Launch Matrix',
  '',
  '| Order | Issue | Evidence row | Participant | Prototype URL | Packet source | Target docs | Count only after |',
  '|---:|---|---|---|---|---|---|---|',
  '| 1 | #35 | `LE-01` through `LE-05` | Person with firsthand or observed fly-lab context | `web-prototype/index.html?validation=lived` | `docs/external-validation-session-packets.md` #35 packet | `docs/fly-lab-external-evidence-ledger.md`, `docs/fly-lab-experience-map.md` | Five accepted `LE-*` rows exist and at least one row has a mechanic change, guardrail change, SME risk update, or explicit no-experience closure path |',
  '| 2 | #36 | `P-01` clean | Fresh player who did not implement the slice | `web-prototype/index.html?fixture=clean&validation=capture` | `docs/external-validation-session-packets.md` #36 packet | `docs/fly-lab-external-evidence-ledger.md`, `docs/fly-lab-validation-results.md` | Exact phrases are recorded and the player connects the record to the reviewer finding |',
  '| 3 | #37 | `P-02` dirty | Fresh player who did not implement the slice | `web-prototype/index.html?fixture=dirty&validation=capture` | `docs/external-validation-session-packets.md` #37 packet | `docs/fly-lab-external-evidence-ledger.md`, `docs/fly-lab-validation-results.md` | Exact phrases are recorded and the dirty failure reads as experimental-record weakness rather than random punishment |',
  '| 4 | #38 | `P-03` missing-control | Fresh player who did not implement the slice | `web-prototype/index.html?fixture=missing-control&validation=capture` | `docs/external-validation-session-packets.md` #38 packet | `docs/fly-lab-external-evidence-ledger.md`, `docs/fly-lab-validation-results.md` | Exact phrases are recorded and the player identifies the missing control as a weak experimental claim |',
  '| 5 | #39 | `SME-01` | Biology-aware reviewer | `web-prototype/index.html?fixture=clean`, `web-prototype/index.html?fixture=dirty`, `web-prototype/index.html?fixture=missing-control` | `docs/external-validation-session-packets.md` #39 packet | `docs/fly-lab-external-evidence-ledger.md`, `docs/fly-lab-validation-results.md` | The reviewer covers all three fixtures and rates stock/vial/calendar, virgin/cross timing, CO2/sorting, negative geotaxis, and record/reviewer logic |',
  '',
  '## Moderator Rules',
  '',
  'Screenshots cannot fill `LE-*`, `P-*`, or `SME-*` rows.',
  'Do not use #27 or #33 as a counted Fix/Cut follow-up issue.',
  '',
  '## Intake Handoff',
  '',
  '## Current Decision',
  '',
  'Keep #27, #33, and the thread goal open until the launch matrix produces accepted non-proxy evidence rows and the full check passes.'
].join('\n');

validateLaunchMatrix(validMatrix);
console.log('pass fixture accepted: launch matrix contract');

expectFailure(
  'missing non-evidence warning',
  () => validateLaunchMatrix(validMatrix.replace('This matrix is not evidence. It is an execution aid.', 'This matrix is ready to count.')),
  'launch matrix missing required text'
);

expectFailure(
  'wrong clean URL',
  () => validateLaunchMatrix(validMatrix.replace('`web-prototype/index.html?fixture=clean&validation=capture`', '`web-prototype/index.html?fixture=clean`')),
  '#36 launch URL expected'
);

expectFailure(
  'missing SME fixture URL',
  () => validateLaunchMatrix(validMatrix.replace('`web-prototype/index.html?fixture=missing-control`', '`web-prototype/index.html?fixture=control`')),
  '#39 launch URL expected'
);

expectFailure(
  'wrong row order',
  () => validateLaunchMatrix(validMatrix.replace('| 4 | #38 |', '| 6 | #38 |')),
  '#38 launch order expected'
);

expectFailure(
  'missing target doc',
  () => validateLaunchMatrix(validMatrix.replace('`docs/fly-lab-external-evidence-ledger.md`, `docs/fly-lab-experience-map.md`', '`docs/fly-lab-external-evidence-ledger.md`')),
  '#35 target docs missing'
);

console.log('external validation launch matrix self-test passed');
