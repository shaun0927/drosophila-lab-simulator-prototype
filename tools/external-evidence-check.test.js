const { validateExternalEvidence } = require('./external-evidence-check');

const baseLedger = `# Fly-Lab External Evidence Ledger

| Evidence gate | Required count | Accepted count | Current status | Blocking issue |
|---|---:|---:|---|---|
| Lived-experience event rows with user or observed-lab provenance | 5 | 0 | Pending collection | #27 |
| Lived-experience answer that changes a mechanic, guardrail, or SME risk | 1 | 0 | Pending collection | #27 |
| Fresh-player first-run sessions | 3 | 0 | Pending execution | #33 |
| SME or biology-aware review | 1 | 0 | Pending execution | #33 |
| Follow-up fix/cut issues for failed external criteria | As needed | 0 | Pending external findings | #33 |

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
const partialValidationResults = [
  'External validation in progress.',
  '## Validation Run 2026-08-22',
  '| Player | Route | Goal phrase | Failure-cause phrase | Second-run repair phrase | Result | Notes |',
  '| P-01 | default | defend record | bad CO2 | reduce exposure | Pass | raw notes linked |'
].join('\n');
const partialValidationResultsWithFollowUp = [
  'External validation in progress.',
  '## Validation Run 2026-08-22',
  '| Player | Route | Goal phrase | Failure-cause phrase | Second-run repair phrase | Result | Notes |',
  '| P-01 | default | defend record | random luck | add control | Fix | #44 resolved |'
].join('\n');
const partialValidationResultsWithoutId = [
  'External validation in progress.',
  '## Validation Run 2026-08-22',
  '| Player | Route | Goal phrase | Failure-cause phrase | Second-run repair phrase | Result | Notes |',
  '| player one | default | defend record | bad CO2 | reduce exposure | Pass | raw notes linked |'
].join('\n');
const partialValidationResultsWithRouteMismatch = [
  'External validation in progress.',
  '## Validation Run 2026-08-22',
  '| Player | Route | Goal phrase | Failure-cause phrase | Second-run repair phrase | Result | Notes |',
  '| P-01 | dirty fixture | defend record | no attack | preserve controls | Pass | raw notes linked |'
].join('\n');
const partialValidationResultsWithPhraseMismatch = [
  'External validation in progress.',
  '## Validation Run 2026-08-22',
  '| Player | Route | Goal phrase | Failure-cause phrase | Second-run repair phrase | Result | Notes |',
  '| P-01 | clean fixture | defend record | random luck | preserve controls | Pass | raw notes linked |'
].join('\n');
const partialSmeValidationResultsWithFixtures = [
  'External validation in progress.',
  '## Validation Run 2026-08-22',
  '| Review id | Fixtures reviewed | Stock/vial/calendar | Virgin/cross timing | CO2/sorting | Negative geotaxis | Record/reviewer logic | Result | Notes |',
  '| SME-01 | ?fixture=clean, ?fixture=dirty, ?fixture=missing-control | Accurate enough | Acceptable simplification | Acceptable simplification | Accurate enough | Accurate enough | Pass | none |'
].join('\n');
const partialSmeValidationResultsWithoutFixtures = [
  'External validation in progress.',
  '## Validation Run 2026-08-22',
  '| Review id | Fixtures reviewed | Stock/vial/calendar | Virgin/cross timing | CO2/sorting | Negative geotaxis | Record/reviewer logic | Result | Notes |',
  '| SME-01 | default route only | Accurate enough | Acceptable simplification | Acceptable simplification | Accurate enough | Accurate enough | Pass | none |'
].join('\n');
const partialSmeValidationResultsWithUnlinkedFixtures = [
  'External validation in progress.',
  '## Validation Run 2026-08-22',
  '| Review id | Fixtures reviewed | Stock/vial/calendar | Virgin/cross timing | CO2/sorting | Negative geotaxis | Record/reviewer logic | Result | Notes |',
  '| SME-01 | default route only | Accurate enough | Acceptable simplification | Acceptable simplification | Accurate enough | Accurate enough | Pass | none |',
  'Separate proxy notes mention ?fixture=clean, ?fixture=dirty, and ?fixture=missing-control.',
].join('\n');
const partialSmeValidationResultsWithRatingMismatch = [
  'External validation in progress.',
  '## Validation Run 2026-08-22',
  '| Review id | Fixtures reviewed | Stock/vial/calendar | Virgin/cross timing | CO2/sorting | Negative geotaxis | Record/reviewer logic | Result | Notes |',
  '| SME-01 | ?fixture=clean, ?fixture=dirty, ?fixture=missing-control | Accurate enough | Acceptable simplification | Misleading | Accurate enough | Accurate enough | Fix | #44 resolved |'
].join('\n');
const fullRouteCoverageValidationResults = [
  'External validation in progress.',
  '## Validation Run 2026-08-22',
  '| Player | Route | Goal phrase | Failure-cause phrase | Second-run repair phrase | Result | Notes |',
  '| P-01 | clean fixture | defend record | no attack | preserve controls | Pass | raw notes linked |',
  '| P-02 | dirty fixture | defend record | bad CO2 | reduce exposure | Pass | raw notes linked |',
  '| P-03 | missing-control fixture | defend record | missing control | add control | Pass | raw notes linked |'
].join('\n');
const partialExperienceMap = [
  'User lived-experience pass: in progress.',
  'Accepted lived-experience rows are being transferred from the evidence ledger.',
  '| LE-01 | firsthand | vial flip | label vial | timing | stale vial | bad cross | explicit exclusion |'
].join('\n');
const partialExperienceMapWithoutId = [
  'User lived-experience pass: in progress.',
  'Accepted lived-experience rows are being transferred from the evidence ledger.'
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

function expectFailWith(name, options, messagePart) {
  try {
    validateExternalEvidence({
      ledger: options.ledger || baseLedger,
      validationResults: options.validationResults || pendingValidationResults,
      experienceMap: options.experienceMap || pendingExperienceMap,
      progressAudit: options.progressAudit || pendingProgressAudit,
      goalAudit: options.goalAudit || pendingGoalAudit,
      gameData: options.gameData || matchingGameData
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

validateExternalEvidence({
  ledger: baseLedger
    .replace('| Fresh-player first-run sessions | 3 | 0 | Pending execution | #33 |', '| Fresh-player first-run sessions | 3 | 1 | In progress | #33 |')
    .replace('| P-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| P-01 | 2026-08-22 | default | Yes | defend record | bad CO2 | reduce exposure | Pass | none |'),
  validationResults: partialValidationResults,
  experienceMap: pendingExperienceMap,
  progressAudit: pendingProgressAudit,
  goalAudit: pendingGoalAudit,
  gameData: {
    externalEvidence: {
      livedRows: {accepted: 0, required: 5},
      livedDesignChange: {accepted: 0, required: 1},
      playerSessions: {accepted: 1, required: 3},
      smeReviews: {accepted: 0, required: 1}
    }
  }
});
console.log('pass fixture accepted: partial player evidence in progress');

validateExternalEvidence({
  ledger: baseLedger
    .replace('| Fresh-player first-run sessions | 3 | 0 | Pending execution | #33 |', '| Fresh-player first-run sessions | 3 | 3 | In progress | #33 |')
    .replace('| P-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| P-01 | 2026-08-22 | clean fixture | Yes | defend record | no attack | preserve controls | Pass | none |')
    .replace('| P-02 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| P-02 | 2026-08-22 | dirty fixture | Yes | defend record | bad CO2 | reduce exposure | Pass | none |')
    .replace('| P-03 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| P-03 | 2026-08-22 | missing-control fixture | Yes | defend record | missing control | add control | Pass | none |'),
  validationResults: fullRouteCoverageValidationResults,
  experienceMap: pendingExperienceMap,
  progressAudit: pendingProgressAudit,
  goalAudit: pendingGoalAudit,
  gameData: {
    externalEvidence: {
      livedRows: {accepted: 0, required: 5},
      livedDesignChange: {accepted: 0, required: 1},
      playerSessions: {accepted: 3, required: 3},
      smeReviews: {accepted: 0, required: 1}
    }
  }
});
console.log('pass fixture accepted: full player route coverage');

expectFailWith(
  'three accepted player rows without route coverage',
  {
    ledger: baseLedger
      .replace('| Fresh-player first-run sessions | 3 | 0 | Pending execution | #33 |', '| Fresh-player first-run sessions | 3 | 3 | In progress | #33 |')
      .replace('| P-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| P-01 | 2026-08-22 | clean fixture | Yes | defend record | no attack | preserve controls | Pass | none |')
      .replace('| P-02 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| P-02 | 2026-08-22 | clean fixture | Yes | defend record | no attack | preserve controls | Pass | none |')
      .replace('| P-03 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| P-03 | 2026-08-22 | clean fixture | Yes | defend record | no attack | preserve controls | Pass | none |'),
    validationResults: fullRouteCoverageValidationResults,
    experienceMap: pendingExperienceMap,
    gameData: {
      externalEvidence: {
        livedRows: {accepted: 0, required: 5},
        livedDesignChange: {accepted: 0, required: 1},
        playerSessions: {accepted: 3, required: 3},
        smeReviews: {accepted: 0, required: 1}
      }
    }
  },
  '#33 accepted player sessions must cover clean, dirty, and missing-control routes or fixtures before closure review'
);

validateExternalEvidence({
  ledger: baseLedger
    .replace('| Fresh-player first-run sessions | 3 | 0 | Pending execution | #33 |', '| Fresh-player first-run sessions | 3 | 1 | In progress | #33 |')
    .replace('| Follow-up fix/cut issues for failed external criteria | As needed | 0 | Pending external findings | #33 |', '| Follow-up fix/cut issues for failed external criteria | As needed | 1 | In progress | #33 |')
    .replace('| P-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| P-01 | 2026-08-22 | default | Yes | defend record | random luck | add control | Fix | #44 resolved |'),
  validationResults: partialValidationResultsWithFollowUp,
  experienceMap: pendingExperienceMap,
  progressAudit: pendingProgressAudit,
  goalAudit: pendingGoalAudit,
  gameData: {
    externalEvidence: {
      livedRows: {accepted: 0, required: 5},
      livedDesignChange: {accepted: 0, required: 1},
      playerSessions: {accepted: 1, required: 3},
      smeReviews: {accepted: 0, required: 1}
    }
  }
});
console.log('pass fixture accepted: fix decision with linked follow-up issue');

expectFailWith(
  'fix follow-up issue count not raised',
  {
    ledger: baseLedger
      .replace('| Fresh-player first-run sessions | 3 | 0 | Pending execution | #33 |', '| Fresh-player first-run sessions | 3 | 1 | In progress | #33 |')
      .replace('| P-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| P-01 | 2026-08-22 | default | Yes | defend record | random luck | add control | Fix | #44 resolved |'),
    validationResults: partialValidationResultsWithFollowUp,
    experienceMap: pendingExperienceMap,
    gameData: {
      externalEvidence: {
        livedRows: {accepted: 0, required: 5},
        livedDesignChange: {accepted: 0, required: 1},
        playerSessions: {accepted: 1, required: 3},
        smeReviews: {accepted: 0, required: 1}
      }
    }
  },
  '#33 follow-up issue accepted count must match unique concrete Fix/Cut follow-up references'
);

expectFailWith(
  'fix follow-up issue missing from validation results',
  {
    ledger: baseLedger
      .replace('| Fresh-player first-run sessions | 3 | 0 | Pending execution | #33 |', '| Fresh-player first-run sessions | 3 | 1 | In progress | #33 |')
      .replace('| Follow-up fix/cut issues for failed external criteria | As needed | 0 | Pending external findings | #33 |', '| Follow-up fix/cut issues for failed external criteria | As needed | 1 | In progress | #33 |')
      .replace('| P-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| P-01 | 2026-08-22 | default | Yes | defend record | random luck | add control | Fix | #44 resolved |'),
    validationResults: partialValidationResults,
    experienceMap: pendingExperienceMap,
    gameData: {
      externalEvidence: {
        livedRows: {accepted: 0, required: 5},
        livedDesignChange: {accepted: 0, required: 1},
        playerSessions: {accepted: 1, required: 3},
        smeReviews: {accepted: 0, required: 1}
      }
    }
  },
  '#44 counted Fix/Cut follow-up issue must be referenced in validation results'
);

expectFail(
  'player fix decision with blocking-open follow-up',
  baseLedger
    .replace('| Fresh-player first-run sessions | 3 | 0 | Pending execution | #33 |', '| Fresh-player first-run sessions | 3 | 1 | In progress | #33 |')
    .replace('| Follow-up fix/cut issues for failed external criteria | As needed | 0 | Pending external findings | #33 |', '| Follow-up fix/cut issues for failed external criteria | As needed | 1 | In progress | #33 |')
    .replace('| P-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| P-01 | 2026-08-22 | default | Yes | defend record | random luck | add control | Fix | #44 blocking open |'),
  'P-01 decision Fix follow-up must be resolved or accepted non-blocking before it can count',
  {
    externalEvidence: {
      livedRows: {accepted: 0, required: 5},
      livedDesignChange: {accepted: 0, required: 1},
      playerSessions: {accepted: 1, required: 3},
      smeReviews: {accepted: 0, required: 1}
    }
  }
);

validateExternalEvidence({
  ledger: baseLedger
    .replace('| Lived-experience event rows with user or observed-lab provenance | 5 | 0 | Pending collection | #27 |', '| Lived-experience event rows with user or observed-lab provenance | 5 | 1 | In progress | #27 |')
    .replace('| LE-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |', '| LE-01 | firsthand | vial flip | label vial | timing | stale vial | bad cross | explicit exclusion | Yes |'),
  validationResults: pendingValidationResults,
  experienceMap: partialExperienceMap,
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
console.log('pass fixture accepted: partial lived-experience evidence in progress');

expectFailWith(
  'accepted LE row missing from experience map',
  {
    ledger: baseLedger
      .replace('| Lived-experience event rows with user or observed-lab provenance | 5 | 0 | Pending collection | #27 |', '| Lived-experience event rows with user or observed-lab provenance | 5 | 1 | In progress | #27 |')
      .replace('| LE-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |', '| LE-01 | firsthand | vial flip | label vial | timing | stale vial | bad cross | explicit exclusion | Yes |'),
    validationResults: pendingValidationResults,
    experienceMap: partialExperienceMapWithoutId,
    gameData: {
      externalEvidence: {
        livedRows: {accepted: 1, required: 5},
        livedDesignChange: {accepted: 0, required: 1},
        playerSessions: {accepted: 0, required: 3},
        smeReviews: {accepted: 0, required: 1}
      }
    }
  },
  'LE-01 accepted lived-experience row must be referenced in the experience map'
);

expectFailWith(
  'accepted player row missing from validation results',
  {
    ledger: baseLedger
      .replace('| Fresh-player first-run sessions | 3 | 0 | Pending execution | #33 |', '| Fresh-player first-run sessions | 3 | 1 | In progress | #33 |')
      .replace('| P-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| P-01 | 2026-08-22 | default | Yes | defend record | bad CO2 | reduce exposure | Pass | none |'),
    validationResults: partialValidationResultsWithoutId,
    experienceMap: pendingExperienceMap,
    gameData: {
      externalEvidence: {
        livedRows: {accepted: 0, required: 5},
        livedDesignChange: {accepted: 0, required: 1},
        playerSessions: {accepted: 1, required: 3},
        smeReviews: {accepted: 0, required: 1}
      }
    }
  },
  'P-01 accepted player row must be referenced in validation results'
);

expectFailWith(
  'accepted player route mismatch in validation results',
  {
    ledger: baseLedger
      .replace('| Fresh-player first-run sessions | 3 | 0 | Pending execution | #33 |', '| Fresh-player first-run sessions | 3 | 1 | In progress | #33 |')
      .replace('| P-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| P-01 | 2026-08-22 | clean fixture | Yes | defend record | no attack | preserve controls | Pass | none |'),
    validationResults: partialValidationResultsWithRouteMismatch,
    experienceMap: pendingExperienceMap,
    gameData: {
      externalEvidence: {
        livedRows: {accepted: 0, required: 5},
        livedDesignChange: {accepted: 0, required: 1},
        playerSessions: {accepted: 1, required: 3},
        smeReviews: {accepted: 0, required: 1}
      }
    }
  },
  'P-01 accepted player route/fixture must match validation results'
);

expectFailWith(
  'accepted player phrase mismatch in validation results',
  {
    ledger: baseLedger
      .replace('| Fresh-player first-run sessions | 3 | 0 | Pending execution | #33 |', '| Fresh-player first-run sessions | 3 | 1 | In progress | #33 |')
      .replace('| P-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| P-01 | 2026-08-22 | clean fixture | Yes | defend record | no attack | preserve controls | Pass | none |'),
    validationResults: partialValidationResultsWithPhraseMismatch,
    experienceMap: pendingExperienceMap,
    gameData: {
      externalEvidence: {
        livedRows: {accepted: 0, required: 5},
        livedDesignChange: {accepted: 0, required: 1},
        playerSessions: {accepted: 1, required: 3},
        smeReviews: {accepted: 0, required: 1}
      }
    }
  },
  'P-01 accepted player failure-cause phrase must match validation results'
);

expectFailWith(
  'accepted SME row missing from validation results',
  {
    ledger: baseLedger
      .replace('| SME or biology-aware review | 1 | 0 | Pending execution | #33 |', '| SME or biology-aware review | 1 | 1 | In progress | #33 |')
      .replace('| SME-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| SME-01 | 2026-08-22 | genetics TA | Accurate enough | Acceptable simplification | Acceptable simplification | Accurate enough | Accurate enough | Pass | none |'),
    validationResults: partialValidationResultsWithoutId,
    experienceMap: pendingExperienceMap,
    gameData: {
      externalEvidence: {
        livedRows: {accepted: 0, required: 5},
        livedDesignChange: {accepted: 0, required: 1},
        playerSessions: {accepted: 0, required: 3},
        smeReviews: {accepted: 1, required: 1}
      }
    }
  },
  'SME-01 accepted SME row must be referenced in validation results'
);

validateExternalEvidence({
  ledger: baseLedger
    .replace('| SME or biology-aware review | 1 | 0 | Pending execution | #33 |', '| SME or biology-aware review | 1 | 1 | In progress | #33 |')
    .replace('| SME-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| SME-01 | 2026-08-22 | genetics TA | Accurate enough | Acceptable simplification | Acceptable simplification | Accurate enough | Accurate enough | Pass | none |'),
  validationResults: partialSmeValidationResultsWithFixtures,
  experienceMap: pendingExperienceMap,
  progressAudit: pendingProgressAudit,
  goalAudit: pendingGoalAudit,
  gameData: {
    externalEvidence: {
      livedRows: {accepted: 0, required: 5},
      livedDesignChange: {accepted: 0, required: 1},
      playerSessions: {accepted: 0, required: 3},
      smeReviews: {accepted: 1, required: 1}
    }
  }
});
console.log('pass fixture accepted: SME fixture coverage');

expectFailWith(
  'accepted SME row without fixture coverage',
  {
    ledger: baseLedger
      .replace('| SME or biology-aware review | 1 | 0 | Pending execution | #33 |', '| SME or biology-aware review | 1 | 1 | In progress | #33 |')
      .replace('| SME-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| SME-01 | 2026-08-22 | genetics TA | Accurate enough | Acceptable simplification | Acceptable simplification | Accurate enough | Accurate enough | Pass | none |'),
    validationResults: partialSmeValidationResultsWithoutFixtures,
    experienceMap: pendingExperienceMap,
    gameData: {
      externalEvidence: {
        livedRows: {accepted: 0, required: 5},
        livedDesignChange: {accepted: 0, required: 1},
        playerSessions: {accepted: 0, required: 3},
        smeReviews: {accepted: 1, required: 1}
      }
    }
  },
  '#33 accepted SME review must reference clean fixture coverage in validation results'
);

expectFailWith(
  'accepted SME row with unlinked fixture coverage',
  {
    ledger: baseLedger
      .replace('| SME or biology-aware review | 1 | 0 | Pending execution | #33 |', '| SME or biology-aware review | 1 | 1 | In progress | #33 |')
      .replace('| SME-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| SME-01 | 2026-08-22 | genetics TA | Accurate enough | Acceptable simplification | Acceptable simplification | Accurate enough | Accurate enough | Pass | none |'),
    validationResults: partialSmeValidationResultsWithUnlinkedFixtures,
    experienceMap: pendingExperienceMap,
    gameData: {
      externalEvidence: {
        livedRows: {accepted: 0, required: 5},
        livedDesignChange: {accepted: 0, required: 1},
        playerSessions: {accepted: 0, required: 3},
        smeReviews: {accepted: 1, required: 1}
      }
    }
  },
  '#33 accepted SME review must reference clean fixture coverage in validation results'
);

expectFailWith(
  'accepted SME rating mismatch in validation results',
  {
    ledger: baseLedger
      .replace('| SME or biology-aware review | 1 | 0 | Pending execution | #33 |', '| SME or biology-aware review | 1 | 1 | In progress | #33 |')
      .replace('| SME-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| SME-01 | 2026-08-22 | genetics TA | Accurate enough | Acceptable simplification | Acceptable simplification | Accurate enough | Accurate enough | Pass | none |'),
    validationResults: partialSmeValidationResultsWithRatingMismatch,
    experienceMap: pendingExperienceMap,
    gameData: {
      externalEvidence: {
        livedRows: {accepted: 0, required: 5},
        livedDesignChange: {accepted: 0, required: 1},
        playerSessions: {accepted: 0, required: 3},
        smeReviews: {accepted: 1, required: 1}
      }
    }
  },
  'SME-01 accepted SME CO2/sorting rating must match validation results'
);

expectFail(
  'accepted LE row without matching top-level count',
  baseLedger.replace('| LE-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |', '| LE-01 | firsthand | vial flip | label | timing | stale vial | bad cross | explicit exclusion | Yes |'),
  '#27 accepted count must match accepted LE intake rows'
);

expectFail(
  'design-change count raised without matching LE design effect',
  baseLedger
    .replace('| Lived-experience event rows with user or observed-lab provenance | 5 | 0 | Pending collection | #27 |', '| Lived-experience event rows with user or observed-lab provenance | 5 | 1 | In progress | #27 |')
    .replace('| Lived-experience answer that changes a mechanic, guardrail, or SME risk | 1 | 0 | Pending collection | #27 |', '| Lived-experience answer that changes a mechanic, guardrail, or SME risk | 1 | 1 | In progress | #27 |')
    .replace('| LE-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |', '| LE-01 | firsthand | vial flip | label vial | timing | stale vial | bad cross | explicit exclusion | Yes |'),
  '#27 design-change count must match accepted LE rows with mechanic, guardrail, or SME-risk design effects',
  {
    externalEvidence: {
      livedRows: {accepted: 1, required: 5},
      livedDesignChange: {accepted: 1, required: 1},
      playerSessions: {accepted: 0, required: 3},
      smeReviews: {accepted: 0, required: 1}
    }
  }
);

validateExternalEvidence({
  ledger: baseLedger
    .replace('| Lived-experience event rows with user or observed-lab provenance | 5 | 0 | Pending collection | #27 |', '| Lived-experience event rows with user or observed-lab provenance | 5 | 1 | In progress | #27 |')
    .replace('| Lived-experience answer that changes a mechanic, guardrail, or SME risk | 1 | 0 | Pending collection | #27 |', '| Lived-experience answer that changes a mechanic, guardrail, or SME risk | 1 | 1 | In progress | #27 |')
    .replace('| LE-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |', '| LE-01 | firsthand | vial flip | label vial | timing | stale vial | bad cross | mechanic change | Yes |'),
  validationResults: pendingValidationResults,
  experienceMap: partialExperienceMap,
  progressAudit: pendingProgressAudit,
  goalAudit: pendingGoalAudit,
  gameData: {
    externalEvidence: {
      livedRows: {accepted: 1, required: 5},
      livedDesignChange: {accepted: 1, required: 1},
      playerSessions: {accepted: 0, required: 3},
      smeReviews: {accepted: 0, required: 1}
    }
  }
});
console.log('pass fixture accepted: design-change row matches top-level count');

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
    .replace('| LE-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |', '| LE-01 | firsthand | vial flip | label vial | timing | stale vial | bad cross | explicit exclusion | Yes |'),
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

expectFail(
  'accepted LE row with incomplete required field',
  baseLedger
    .replace('| Lived-experience event rows with user or observed-lab provenance | 5 | 0 | Pending collection | #27 |', '| Lived-experience event rows with user or observed-lab provenance | 5 | 1 | In progress | #27 |')
    .replace('| LE-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |', '| LE-01 | firsthand | vial flip | Pending | timing | stale vial | bad cross | explicit exclusion | Yes |'),
  'LE-01 accepted lived-experience row has an incomplete required field',
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
  'accepted LE row with invalid provenance',
  baseLedger
    .replace('| Lived-experience event rows with user or observed-lab provenance | 5 | 0 | Pending collection | #27 |', '| Lived-experience event rows with user or observed-lab provenance | 5 | 1 | In progress | #27 |')
    .replace('| LE-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |', '| LE-01 | literature summary | vial flip | label vial | timing | stale vial | bad cross | explicit exclusion | Yes |'),
  'LE-01 accepted lived-experience row has invalid provenance',
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
  'accepted LE row with invalid design effect',
  baseLedger
    .replace('| Lived-experience event rows with user or observed-lab provenance | 5 | 0 | Pending collection | #27 |', '| Lived-experience event rows with user or observed-lab provenance | 5 | 1 | In progress | #27 |')
    .replace('| LE-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |', '| LE-01 | firsthand | vial flip | label vial | timing | stale vial | bad cross | cool feature | Yes |'),
  'LE-01 accepted lived-experience row has invalid design effect',
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
  'accepted no-experience LE row with design change',
  baseLedger
    .replace('| Lived-experience event rows with user or observed-lab provenance | 5 | 0 | Pending collection | #27 |', '| Lived-experience event rows with user or observed-lab provenance | 5 | 1 | In progress | #27 |')
    .replace('| Lived-experience answer that changes a mechanic, guardrail, or SME risk | 1 | 0 | Pending collection | #27 |', '| Lived-experience answer that changes a mechanic, guardrail, or SME risk | 1 | 1 | In progress | #27 |')
    .replace('| LE-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |', '| LE-01 | explicit no relevant experience | light show | add spectacle | novelty | fake memory | wrong slice | mechanic change | Yes |'),
  'LE-01 no-experience row must use explicit exclusion as its design effect',
  {
    externalEvidence: {
      livedRows: {accepted: 1, required: 5},
      livedDesignChange: {accepted: 1, required: 1},
      playerSessions: {accepted: 0, required: 3},
      smeReviews: {accepted: 0, required: 1}
    }
  }
);

expectFail(
  'duplicated accepted no-experience LE rows',
  baseLedger
    .replace('| Lived-experience event rows with user or observed-lab provenance | 5 | 0 | Pending collection | #27 |', '| Lived-experience event rows with user or observed-lab provenance | 5 | 2 | In progress | #27 |')
    .replace('| LE-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |', '| LE-01 | explicit no relevant experience | no fly-lab task | exclude candidate | boundary | fake memory | wrong slice | explicit exclusion | Yes |')
    .replace('| LE-02 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |', '| LE-02 | explicit no relevant experience | no assay memory | exclude candidate | boundary | fake confidence | wrong assay | explicit exclusion | Yes |'),
  '#27 no-experience decision must not be duplicated across accepted LE rows',
  {
    externalEvidence: {
      livedRows: {accepted: 2, required: 5},
      livedDesignChange: {accepted: 0, required: 1},
      playerSessions: {accepted: 0, required: 3},
      smeReviews: {accepted: 0, required: 1}
    }
  }
);

expectFail(
  'no-experience LE row mixed with lived LE row',
  baseLedger
    .replace('| Lived-experience event rows with user or observed-lab provenance | 5 | 0 | Pending collection | #27 |', '| Lived-experience event rows with user or observed-lab provenance | 5 | 2 | In progress | #27 |')
    .replace('| LE-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |', '| LE-01 | explicit no relevant experience | no fly-lab task | exclude candidate | boundary | fake memory | wrong slice | explicit exclusion | Yes |')
    .replace('| LE-02 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |', '| LE-02 | firsthand | vial flip | label vial | timing | stale vial | bad cross | explicit exclusion | Yes |'),
  '#27 no-experience decision cannot be mixed with accepted firsthand or observed LE rows',
  {
    externalEvidence: {
      livedRows: {accepted: 2, required: 5},
      livedDesignChange: {accepted: 0, required: 1},
      playerSessions: {accepted: 0, required: 3},
      smeReviews: {accepted: 0, required: 1}
    }
  }
);

expectFail(
  'accepted player row with incomplete required field',
  baseLedger
    .replace('| Fresh-player first-run sessions | 3 | 0 | Pending execution | #33 |', '| Fresh-player first-run sessions | 3 | 1 | In progress | #33 |')
    .replace('| P-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| P-01 | 2026-08-22 | default | Yes | Pending | bad CO2 | reduce exposure | Pass | none |'),
  'P-01 accepted player row has an incomplete required field',
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
  'accepted SME row with incomplete required field',
  baseLedger
    .replace('| SME or biology-aware review | 1 | 0 | Pending execution | #33 |', '| SME or biology-aware review | 1 | 1 | In progress | #33 |')
    .replace('| SME-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| SME-01 | 2026-08-22 | genetics TA | Accurate enough | Pending | Acceptable simplification | Acceptable simplification | Accurate enough | Pass | none |'),
  'SME-01 accepted SME row has an incomplete required field',
  {
    externalEvidence: {
      livedRows: {accepted: 0, required: 5},
      livedDesignChange: {accepted: 0, required: 1},
      playerSessions: {accepted: 0, required: 3},
      smeReviews: {accepted: 1, required: 1}
    }
  }
);

expectFail(
  'accepted LE row sourced from screenshot proxy',
  baseLedger
    .replace('| Lived-experience event rows with user or observed-lab provenance | 5 | 0 | Pending collection | #27 |', '| Lived-experience event rows with user or observed-lab provenance | 5 | 1 | In progress | #27 |')
    .replace('| LE-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | No |', '| LE-01 | screenshot proxy | vial flip | label vial | timing | stale vial | bad cross | explicit exclusion | Yes |'),
  'LE-01 accepted lived-experience row cannot use proxy evidence as an external-evidence source',
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
  'accepted player row sourced from implementer walkthrough',
  baseLedger
    .replace('| Fresh-player first-run sessions | 3 | 0 | Pending execution | #33 |', '| Fresh-player first-run sessions | 3 | 1 | In progress | #33 |')
    .replace('| P-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| P-01 | 2026-08-22 | implementer walkthrough | Yes | defend record | bad CO2 | reduce exposure | Pass | none |'),
  'P-01 accepted player row cannot use proxy evidence as an external-evidence source',
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
  'accepted SME row sourced from generic screenshot review',
  baseLedger
    .replace('| SME or biology-aware review | 1 | 0 | Pending execution | #33 |', '| SME or biology-aware review | 1 | 1 | In progress | #33 |')
    .replace('| SME-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| SME-01 | 2026-08-22 | screenshot review | Accurate enough | Acceptable simplification | Acceptable simplification | Acceptable simplification | Accurate enough | Pass | none |'),
  'SME-01 accepted SME row cannot use proxy evidence as an external-evidence source',
  {
    externalEvidence: {
      livedRows: {accepted: 0, required: 5},
      livedDesignChange: {accepted: 0, required: 1},
      playerSessions: {accepted: 0, required: 3},
      smeReviews: {accepted: 1, required: 1}
    }
  }
);

expectFail(
  'accepted SME row with invalid mechanic rating',
  baseLedger
    .replace('| SME or biology-aware review | 1 | 0 | Pending execution | #33 |', '| SME or biology-aware review | 1 | 1 | In progress | #33 |')
    .replace('| SME-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| SME-01 | 2026-08-22 | genetics TA | Looks fine | Acceptable simplification | Acceptable simplification | Accurate enough | Accurate enough | Pass | none |'),
  'SME-01 accepted SME row has an invalid mechanic rating',
  {
    externalEvidence: {
      livedRows: {accepted: 0, required: 5},
      livedDesignChange: {accepted: 0, required: 1},
      playerSessions: {accepted: 0, required: 3},
      smeReviews: {accepted: 1, required: 1}
    }
  }
);

expectFail(
  'accepted player Pass without completing the run',
  baseLedger
    .replace('| Fresh-player first-run sessions | 3 | 0 | Pending execution | #33 |', '| Fresh-player first-run sessions | 3 | 1 | In progress | #33 |')
    .replace('| P-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| P-01 | 2026-08-22 | default | No | defend record | bad CO2 | reduce exposure | Pass | none |'),
  'P-01 player Pass requires completing one run within 5 minutes',
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
  'accepted player row with ambiguous completion value',
  baseLedger
    .replace('| Fresh-player first-run sessions | 3 | 0 | Pending execution | #33 |', '| Fresh-player first-run sessions | 3 | 1 | In progress | #33 |')
    .replace('| P-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| P-01 | 2026-08-22 | default | Mostly | defend record | bad CO2 | reduce exposure | Fix | #44 |'),
  'P-01 accepted player row must record completion as Yes or No',
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
  'accepted SME Pass with misleading rating',
  baseLedger
    .replace('| SME or biology-aware review | 1 | 0 | Pending execution | #33 |', '| SME or biology-aware review | 1 | 1 | In progress | #33 |')
    .replace('| SME-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| SME-01 | 2026-08-22 | genetics TA | Accurate enough | Acceptable simplification | Misleading | Accurate enough | Accurate enough | Pass | none |'),
  'SME-01 SME row with a Misleading rating must be Fix or Cut',
  {
    externalEvidence: {
      livedRows: {accepted: 0, required: 5},
      livedDesignChange: {accepted: 0, required: 1},
      playerSessions: {accepted: 0, required: 3},
      smeReviews: {accepted: 1, required: 1}
    }
  }
);

expectFail(
  'accepted SME Fix with unsafe rating',
  baseLedger
    .replace('| SME or biology-aware review | 1 | 0 | Pending execution | #33 |', '| SME or biology-aware review | 1 | 1 | In progress | #33 |')
    .replace('| SME-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| SME-01 | 2026-08-22 | genetics TA | Accurate enough | Unsafe/ethically wrong | Acceptable simplification | Accurate enough | Accurate enough | Fix | #44 |'),
  'SME-01 SME row with an Unsafe/ethically wrong rating must be Cut',
  {
    externalEvidence: {
      livedRows: {accepted: 0, required: 5},
      livedDesignChange: {accepted: 0, required: 1},
      playerSessions: {accepted: 0, required: 3},
      smeReviews: {accepted: 1, required: 1}
    }
  }
);

expectFail(
  'player fix decision without follow-up issue',
  baseLedger
    .replace('| Fresh-player first-run sessions | 3 | 0 | Pending execution | #33 |', '| Fresh-player first-run sessions | 3 | 1 | In progress | #33 |')
    .replace('| P-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| P-01 | 2026-08-22 | default | Yes | defend record | random luck | add control | Fix | Pending |'),
  'P-01 decision Fix must link a follow-up issue',
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
  'player fix decision with vague follow-up note',
  baseLedger
    .replace('| Fresh-player first-run sessions | 3 | 0 | Pending execution | #33 |', '| Fresh-player first-run sessions | 3 | 1 | In progress | #33 |')
    .replace('| P-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| P-01 | 2026-08-22 | default | Yes | defend record | random luck | add control | Fix | needs issue |'),
  'P-01 decision Fix follow-up must be a concrete GitHub issue reference',
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
  'player fix decision referencing current gate issue',
  baseLedger
    .replace('| Fresh-player first-run sessions | 3 | 0 | Pending execution | #33 |', '| Fresh-player first-run sessions | 3 | 1 | In progress | #33 |')
    .replace('| Follow-up fix/cut issues for failed external criteria | As needed | 0 | Pending external findings | #33 |', '| Follow-up fix/cut issues for failed external criteria | As needed | 1 | In progress | #33 |')
    .replace('| P-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| P-01 | 2026-08-22 | default | Yes | defend record | random luck | add control | Fix | #33 |'),
  'P-01 decision Fix follow-up must not reference #27 or #33',
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
  'SME cut decision without follow-up issue',
  baseLedger
    .replace('| SME or biology-aware review | 1 | 0 | Pending execution | #33 |', '| SME or biology-aware review | 1 | 1 | In progress | #33 |')
    .replace('| SME-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| SME-01 | 2026-08-22 | genetics TA | Accurate enough | Acceptable simplification | Misleading | Acceptable simplification | Misleading | Cut | none |'),
  'SME-01 decision Cut must link a follow-up issue',
  {
    externalEvidence: {
      livedRows: {accepted: 0, required: 5},
      livedDesignChange: {accepted: 0, required: 1},
      playerSessions: {accepted: 0, required: 3},
      smeReviews: {accepted: 1, required: 1}
    }
  }
);

expectFail(
  'SME cut decision referencing current gate issue URL',
  baseLedger
    .replace('| SME or biology-aware review | 1 | 0 | Pending execution | #33 |', '| SME or biology-aware review | 1 | 1 | In progress | #33 |')
    .replace('| Follow-up fix/cut issues for failed external criteria | As needed | 0 | Pending external findings | #33 |', '| Follow-up fix/cut issues for failed external criteria | As needed | 1 | In progress | #33 |')
    .replace('| SME-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| SME-01 | 2026-08-22 | genetics TA | Accurate enough | Acceptable simplification | Misleading | Acceptable simplification | Misleading | Cut | https://github.com/shaun0927/drosophila-lab-simulator-prototype/issues/33 |'),
  'SME-01 decision Cut follow-up must not reference #27 or #33',
  {
    externalEvidence: {
      livedRows: {accepted: 0, required: 5},
      livedDesignChange: {accepted: 0, required: 1},
      playerSessions: {accepted: 0, required: 3},
      smeReviews: {accepted: 1, required: 1}
    }
  }
);

expectFail(
  'SME cut decision with vague follow-up note',
  baseLedger
    .replace('| SME or biology-aware review | 1 | 0 | Pending execution | #33 |', '| SME or biology-aware review | 1 | 1 | In progress | #33 |')
    .replace('| SME-01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |', '| SME-01 | 2026-08-22 | genetics TA | Accurate enough | Acceptable simplification | Misleading | Acceptable simplification | Misleading | Cut | open later |'),
  'SME-01 decision Cut follow-up must be a concrete GitHub issue reference',
  {
    externalEvidence: {
      livedRows: {accepted: 0, required: 5},
      livedDesignChange: {accepted: 0, required: 1},
      playerSessions: {accepted: 0, required: 3},
      smeReviews: {accepted: 1, required: 1}
    }
  }
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
    validationResults: pendingValidationResults,
    experienceMap: pendingExperienceMap,
    progressAudit: pendingProgressAudit,
    goalAudit: pendingGoalAudit,
    gameData: {
      externalEvidence: {
        livedRows: {accepted: 0, required: 5},
        livedDesignChange: {accepted: 0, required: 1},
        playerSessions: {accepted: 0, required: 3},
        smeReviews: {accepted: 0, required: 1},
        playerRouteCoverage: {accepted: 0, required: 3},
        followUpIssues: {accepted: 1, required: 'As needed'}
      }
    }
  });
  throw new Error('data.js follow-up mismatch fixture should have failed');
} catch (error) {
  if (!error.message.includes('data.js followUpIssues accepted count must match ledger')) {
    throw error;
  }
  console.log('bad fixture rejected: data.js follow-up count does not match ledger');
}

try {
  validateExternalEvidence({
    ledger: baseLedger,
    validationResults: pendingValidationResults,
    experienceMap: pendingExperienceMap,
    progressAudit: pendingProgressAudit,
    goalAudit: pendingGoalAudit,
    gameData: {
      externalEvidence: {
        livedRows: {accepted: 0, required: 5},
        livedDesignChange: {accepted: 0, required: 1},
        playerSessions: {accepted: 0, required: 3},
        smeReviews: {accepted: 0, required: 1},
        followUpIssues: {accepted: 0, required: 'As needed'}
      }
    }
  });
  throw new Error('data.js missing route coverage fixture should have failed');
} catch (error) {
  if (!error.message.includes('data.js externalEvidence must include playerRouteCoverage')) {
    throw error;
  }
  console.log('bad fixture rejected: data.js missing route coverage gate');
}

try {
  validateExternalEvidence({
    ledger: baseLedger,
    validationResults: pendingValidationResults,
    experienceMap: pendingExperienceMap,
    progressAudit: pendingProgressAudit,
    goalAudit: pendingGoalAudit,
    gameData: {
      externalEvidence: {
        livedRows: {accepted: 0, required: 5},
        livedDesignChange: {accepted: 0, required: 1},
        playerSessions: {accepted: 0, required: 3},
        playerRouteCoverage: {accepted: 1, required: 3},
        smeReviews: {accepted: 0, required: 1}
      }
    }
  });
  throw new Error('data.js route coverage mismatch fixture should have failed');
} catch (error) {
  if (!error.message.includes('data.js playerRouteCoverage accepted count must match ledger route coverage')) {
    throw error;
  }
  console.log('bad fixture rejected: data.js route coverage count does not match ledger');
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
