const { validateExternalEvidence } = require('./external-evidence-check');

const baseLedger = `# Fly-Lab External Evidence Ledger

| Evidence gate | Required count | Accepted count | Current status | Blocking issue |
|---|---:|---:|---|---|
| Lived-experience event rows with user or observed-lab provenance | 5 | 0 | Pending collection | #27 |
| Lived-experience answer that changes a mechanic, guardrail, or SME risk | 1 | 0 | Pending collection | #27 |
| Fresh-player first-run sessions | 3 | 0 | Pending execution | #33 |
| SME or biology-aware review | 1 | 0 | Pending execution | #33 |

Not acceptable as #33 player closure evidence:
- screenshots of the route

| Row id | Provenance | Procedure event | Game verb | Player skill | Failure mode | Delayed consequence | Design effect | Accepted? |
|---|---|---|---|---|---|---|---|---|
| LE-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |
| LE-02 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |
| LE-03 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |
| LE-04 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |
| LE-05 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |

| Session id | Date | Route/fixture | Completed one run in 5 minutes? | Goal phrase | Failure-cause phrase | Second-run repair phrase | Decision | Follow-up issue |
|---|---|---|---|---|---|---|---|---|
| P-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| P-02 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| P-03 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |

| Review id | Date | Reviewer role | Stock/vial/calendar | Virgin/cross timing | CO2/sorting | Negative geotaxis | Record/reviewer logic | Decision | Follow-up issue |
|---|---|---|---|---|---|---|---|---|---|
| SME-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
`;

const pendingValidationResults = 'No external player or SME validation has been run yet';
const pendingExperienceMap = 'User lived-experience pass: pending user input';

function expectPass(name, ledger = baseLedger) {
  validateExternalEvidence({
    ledger,
    validationResults: pendingValidationResults,
    experienceMap: pendingExperienceMap
  });
  console.log(`pass fixture accepted: ${name}`);
}

function expectFail(name, ledger, messagePart) {
  try {
    validateExternalEvidence({
      ledger,
      validationResults: pendingValidationResults,
      experienceMap: pendingExperienceMap
    });
  } catch (error) {
    if (!error.message.includes(messagePart)) {
      throw new Error(`${name} failed with wrong message: ${error.message}`);
    }
    console.log(`bad fixture rejected: ${name}`);
    return;
  }
  throw new Error(`${name} should have failed`);
}

expectPass('current pending ledger');

expectFail(
  'accepted LE row without matching top-level count',
  baseLedger.replace('| LE-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |', '| LE-01 | firsthand | vial flip | label | timing | stale vial | bad cross | mechanic change | Yes |'),
  '#27 accepted count must match accepted LE intake rows'
);

expectFail(
  'top-level player count raised while validation results still pending',
  baseLedger.replace('| Fresh-player first-run sessions | 3 | 0 | Pending execution | #33 |', '| Fresh-player first-run sessions | 3 | 1 | Pending execution | #33 |'),
  '#33 player accepted count must match decided player rows'
);

expectFail(
  'matching player count accepted while validation results still pending',
  baseLedger
    .replace('| Fresh-player first-run sessions | 3 | 0 | Pending execution | #33 |', '| Fresh-player first-run sessions | 3 | 1 | Pending execution | #33 |')
    .replace('| P-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| P-01 | 2026-08-22 | default | Yes | defend record | bad CO2 | reduce exposure | Pass | none |'),
  '#33 player count cannot increase while validation results say no external validation has run'
);

expectFail(
  'matching lived-experience count accepted while experience map still pending',
  baseLedger
    .replace('| Lived-experience event rows with user or observed-lab provenance | 5 | 0 | Pending collection | #27 |', '| Lived-experience event rows with user or observed-lab provenance | 5 | 1 | Pending collection | #27 |')
    .replace('| LE-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |', '| LE-01 | firsthand | vial flip | label vial | timing | stale vial | bad cross | mechanic change | Yes |'),
  '#27 accepted count cannot increase while the experience map still says user input is pending'
);

expectFail(
  'missing fifth lived-experience row',
  baseLedger.replace('| LE-05 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |\n', ''),
  'missing external evidence intake row: LE-05'
);

console.log('external evidence checker self-test passed');
