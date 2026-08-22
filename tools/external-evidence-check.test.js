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
const pendingProgressAudit = [
  '| #27 R1 Experience map | Open, ready for user input | Evidence | Remaining gap |',
  '| #33 R7 Vertical slice validation | Open, proxy-audited and ready for external validation | Evidence | Remaining gap |',
  '#27 and #33 require external/user evidence'
].join('\n');
const pendingGoalAudit = [
  '## Current Decision',
  'Do not mark the thread goal complete.',
  '### Gap A: #27 lacks lived-experience provenance',
  '### Gap B: #33 lacks player and SME validation'
].join('\n');
const matchingGameData = {
  externalEvidence: {
    livedRows: {accepted: 0, required: 5},
    livedDesignChange: {accepted: 0, required: 1},
    playerSessions: {accepted: 0, required: 3},
    smeReviews: {accepted: 0, required: 1}
  }
};

function expectPass(name, ledger = baseLedger) {
  validateExternalEvidence({
    ledger,
    validationResults: pendingValidationResults,
    experienceMap: pendingExperienceMap,
    progressAudit: pendingProgressAudit,
    goalAudit: pendingGoalAudit,
    gameData: matchingGameData
  });
  console.log(`pass fixture accepted: ${name}`);
}

function expectFail(name, ledger, messagePart, gameData = matchingGameData) {
  try {
    validateExternalEvidence({
      ledger,
      validationResults: pendingValidationResults,
      experienceMap: pendingExperienceMap,
      progressAudit: pendingProgressAudit,
      goalAudit: pendingGoalAudit,
      gameData
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
  '#33 player count cannot increase while validation results say no external validation has run',
  {
    externalEvidence: {
      livedRows: {accepted: 0, required: 5},
      livedDesignChange: {accepted: 0, required: 1},
      playerSessions: {accepted: 1, required: 3},
      smeReviews: {accepted: 0, required: 1}
    }
  }
);

expectFail(
  'matching lived-experience count accepted while experience map still pending',
  baseLedger
    .replace('| Lived-experience event rows with user or observed-lab provenance | 5 | 0 | Pending collection | #27 |', '| Lived-experience event rows with user or observed-lab provenance | 5 | 1 | Pending collection | #27 |')
    .replace('| LE-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |', '| LE-01 | firsthand | vial flip | label vial | timing | stale vial | bad cross | mechanic change | Yes |'),
  '#27 accepted count cannot increase while the experience map still says user input is pending',
  {
    externalEvidence: {
      livedRows: {accepted: 1, required: 5},
      livedDesignChange: {accepted: 0, required: 1},
      playerSessions: {accepted: 0, required: 3},
      smeReviews: {accepted: 0, required: 1}
    }
  }
);

expectFail(
  'missing fifth lived-experience row',
  baseLedger.replace('| LE-05 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |\n', ''),
  'missing external evidence intake row: LE-05'
);

try {
  validateExternalEvidence({
    ledger: baseLedger,
    validationResults: pendingValidationResults,
    experienceMap: pendingExperienceMap,
    progressAudit: pendingProgressAudit,
    goalAudit: pendingGoalAudit,
    gameData: {
      externalEvidence: {
        livedRows: {accepted: 1, required: 5},
        livedDesignChange: {accepted: 0, required: 1},
        playerSessions: {accepted: 0, required: 3},
        smeReviews: {accepted: 0, required: 1}
      }
    }
  });
  throw new Error('data.js mismatch fixture should have failed');
} catch (error) {
  if (!error.message.includes('data.js livedRows accepted count must match ledger')) {
    throw error;
  }
  console.log('bad fixture rejected: data.js count does not match ledger');
}

try {
  validateExternalEvidence({
    ledger: baseLedger,
    validationResults: 'External sessions are summarized below.',
    experienceMap: pendingExperienceMap,
    progressAudit: pendingProgressAudit,
    goalAudit: pendingGoalAudit,
    gameData: matchingGameData
  });
  throw new Error('stale validation-results fixture should have failed');
} catch (error) {
  if (!error.message.includes('validation results missing required pending-evidence text')) {
    throw error;
  }
  console.log('bad fixture rejected: validation results lost pending external-evidence blocker');
}

try {
  validateExternalEvidence({
    ledger: baseLedger,
    validationResults: pendingValidationResults,
    experienceMap: pendingExperienceMap,
    progressAudit: pendingProgressAudit.replace('| #33 R7 Vertical slice validation | Open', '| #33 R7 Vertical slice validation | Closed'),
    goalAudit: pendingGoalAudit,
    gameData: matchingGameData
  });
  throw new Error('stale progress-audit fixture should have failed');
} catch (error) {
  if (!error.message.includes('progress audit missing required pending-evidence text: | #33 R7 Vertical slice validation | Open')) {
    throw error;
  }
  console.log('bad fixture rejected: progress audit closed #33 while evidence remains pending');
}

try {
  validateExternalEvidence({
    ledger: baseLedger,
    validationResults: pendingValidationResults,
    experienceMap: pendingExperienceMap,
    progressAudit: pendingProgressAudit,
    goalAudit: pendingGoalAudit.replace('Do not mark the thread goal complete.', 'The thread goal can now close.'),
    gameData: matchingGameData
  });
  throw new Error('stale goal-audit fixture should have failed');
} catch (error) {
  if (!error.message.includes('goal audit missing required pending-evidence text: Do not mark the thread goal complete')) {
    throw error;
  }
  console.log('bad fixture rejected: goal audit lost not-complete decision');
}

console.log('external evidence checker self-test passed');
