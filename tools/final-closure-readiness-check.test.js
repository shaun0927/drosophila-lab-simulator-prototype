const {
  validateFinalClosureReadiness
} = require('./final-closure-readiness-check');

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

const pendingLedger = `# Ledger

| Evidence gate | Required count | Accepted count | Current status | Blocking issue |
|---|---:|---:|---|---|
| Lived-experience event rows with user or observed-lab provenance | 5 | 0 | Pending collection | #27 |
| Lived-experience answer that changes a mechanic, guardrail, or SME risk | 1 | 0 | Pending collection | #27 |
| Fresh-player first-run sessions | 3 | 0 | Pending execution | #33 |
| SME or biology-aware review | 1 | 0 | Pending execution | #33 |
| Follow-up fix/cut issues for failed external criteria | As needed | 0 | Pending external findings | #33 |

| Session id | Date | Route/fixture | Completed one run in 5 minutes? | Goal phrase | Failure-cause phrase | Second-run repair phrase | Decision | Follow-up issue |
|---|---|---|---|---|---|---|---|---|
| P-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
`;

const readyLedger = `# Ledger

| Evidence gate | Required count | Accepted count | Current status | Blocking issue |
|---|---:|---:|---|---|
| Lived-experience event rows with user or observed-lab provenance | 5 | 5 | Ready for closure review | #27 |
| Lived-experience answer that changes a mechanic, guardrail, or SME risk | 1 | 1 | Ready for closure review | #27 |
| Fresh-player first-run sessions | 3 | 3 | Ready for closure review | #33 |
| SME or biology-aware review | 1 | 1 | Ready for closure review | #33 |
| Follow-up fix/cut issues for failed external criteria | As needed | 0 | Pending external findings | #33 |

| Session id | Date | Route/fixture | Completed one run in 5 minutes? | Goal phrase | Failure-cause phrase | Second-run repair phrase | Decision | Follow-up issue |
|---|---|---|---|---|---|---|---|---|
| P-01 | 2026-08-22 | clean fixture | Yes | defend record | no attack | preserve controls | Pass | none |
| P-02 | 2026-08-22 | dirty fixture | Yes | defend record | bad CO2 | reduce exposure | Pass | none |
| P-03 | 2026-08-22 | missing-control fixture | Yes | defend record | missing control | add control | Pass | none |
`;

const finalChecklist = [
  'node tools/external-validation-full-check.js --live-issues',
  'player rows cover clean, dirty, and missing-control'
].join('\n');

const pendingDocs = {
  experienceMap: 'User lived-experience pass: pending user input',
  validationResults: 'No external player or SME validation has been run yet',
  progressAudit: '| #27 R1 Experience map | Open\n| #33 R7 Vertical slice validation | Open\n#27 and #33 require external/user evidence',
  goalAudit: 'Do not mark the thread goal complete\n#27 lacks lived-experience provenance\n#33 lacks player and SME validation',
  finalChecklist
};

const readyDocs = {
  experienceMap: 'User lived-experience pass: ready for closure review',
  validationResults: 'External evidence ready for closure review',
  progressAudit: '#27 and #33 evidence thresholds met',
  goalAudit: 'Ready for final closure audit',
  finalChecklist
};

let result = validateFinalClosureReadiness({ ledger: pendingLedger, ...pendingDocs });
assert(result.ready === false, 'pending fixture should not be ready');
console.log('pass fixture accepted: pending final closure state');

result = validateFinalClosureReadiness({ ledger: readyLedger, ...readyDocs });
assert(result.ready === true, 'ready fixture should be ready');
console.log('pass fixture accepted: ready final closure state');

expectFailure(
  'pending counts with ready goal audit',
  () => validateFinalClosureReadiness({
    ledger: pendingLedger,
    ...pendingDocs,
    goalAudit: 'Ready for final closure audit'
  }),
  'goal audit must preserve not-complete decision'
);

expectFailure(
  'ready counts with stale no-close goal audit',
  () => validateFinalClosureReadiness({
    ledger: readyLedger,
    ...readyDocs,
    goalAudit: 'Ready for final closure audit\nDo not mark the thread goal complete'
  }),
  'goal audit must not preserve not-complete decision'
);

expectFailure(
  'ready player count without route coverage',
  () => validateFinalClosureReadiness({
    ledger: readyLedger.replace('missing-control fixture', 'clean fixture'),
    ...readyDocs
  }),
  'goal audit must preserve not-complete decision'
);

expectFailure(
  'final checklist missing full live wrapper',
  () => validateFinalClosureReadiness({
    ledger: pendingLedger,
    ...pendingDocs,
    finalChecklist: 'node tools/external-evidence-check.js'
  }),
  'final closure checklist must require the full live verification wrapper'
);

console.log('final closure readiness self-test passed');
