const fs = require('fs');
const path = require('path');

const root = process.cwd();
const requiredFiles = [
  'docs/fly-lab-product-thesis.md',
  'docs/fly-lab-experience-map.md',
  'docs/fly-lab-lived-experience-response-form.md',
  'docs/fly-lab-playtest-sheet.md',
  'docs/fly-lab-sme-validation-sheet.md',
  'docs/fly-lab-validation-runbook.md',
  'docs/fly-lab-validation-results.md',
  'docs/fly-lab-session-capture-packet.md',
  'docs/fly-lab-validation-finding-decision-tree.md',
  'docs/fly-lab-external-evidence-ledger.md',
  'docs/r-series-progress-audit.md',
  'docs/goal-completion-audit-2026-08-22.md',
  'docs/open-issue-triage-2026-08-22.md',
  'tools/external-evidence-check.js',
  'tools/external-evidence-check.test.js',
  'tools/issue-template-contract-check.js',
  '.github/ISSUE_TEMPLATE/fly_lab_lived_experience.yml',
  '.github/ISSUE_TEMPLATE/fly_lab_validation_finding.yml',
  'dogfood-output/screenshot-ux-audit.md',
  'dogfood-output/screenshots/desktop-clean.png',
  'dogfood-output/screenshots/mobile-clean.png',
  'dogfood-output/screenshots/desktop-validation-packet.png',
  'dogfood-output/screenshots/mobile-validation-packet.png',
  'dogfood-output/screenshots/desktop-lived-experience-packet.png',
  'dogfood-output/screenshots/mobile-lived-experience-packet.png',
  'web-prototype/app.js',
  'web-prototype/smoke-tests.js'
];

const textChecks = [
  ['docs/fly-lab-product-thesis.md', 'fly-lab procedure simulator with a publication wrapper'],
  ['docs/fly-lab-product-thesis.md', 'Light-Induced Swarm Dance'],
  ['docs/fly-lab-experience-map.md', 'User lived-experience pass: pending user input'],
  ['docs/fly-lab-lived-experience-response-form.md', 'web-prototype/index.html?validation=lived'],
  ['docs/fly-lab-validation-runbook.md', 'web-prototype/index.html?validation=status'],
  ['docs/fly-lab-validation-runbook.md', 'web-prototype/index.html?validation=packet'],
  ['docs/fly-lab-validation-runbook.md', 'web-prototype/index.html?validation=capture'],
  ['docs/fly-lab-validation-runbook.md', 'web-prototype/index.html?validation=lived'],
  ['docs/fly-lab-validation-runbook.md', '#33 can close only when'],
  ['docs/fly-lab-validation-runbook.md', 'fly-lab-session-capture-packet.md'],
  ['docs/fly-lab-validation-runbook.md', 'fly-lab-validation-finding-decision-tree.md'],
  ['docs/fly-lab-validation-runbook.md', 'Over-Engineering Checklist'],
  ['docs/fly-lab-validation-runbook.md', 'Drift-Prevention Checklist'],
  ['docs/fly-lab-validation-results.md', 'No external player or SME validation has been run yet'],
  ['docs/fly-lab-validation-results.md', 'screenshot proxy passed: lived-experience packet visible on desktop/mobile without legacy drift'],
  ['docs/fly-lab-validation-results.md', 'External evidence ledger updated with accepted counts'],
  ['docs/fly-lab-external-evidence-ledger.md', 'Lived-experience event rows with user or observed-lab provenance'],
  ['docs/fly-lab-external-evidence-ledger.md', 'Fresh-player first-run sessions'],
  ['docs/fly-lab-external-evidence-ledger.md', 'fly-lab-session-capture-packet.md'],
  ['docs/fly-lab-external-evidence-ledger.md', 'fly-lab-validation-finding-decision-tree.md'],
  ['docs/fly-lab-external-evidence-ledger.md', '#27 can close only when'],
  ['docs/fly-lab-external-evidence-ledger.md', '#33 can close only when'],
  ['docs/fly-lab-external-evidence-ledger.md', 'Not acceptable as #33 player closure evidence'],
  ['docs/fly-lab-session-capture-packet.md', 'Do not close #27 or #33 from this packet alone'],
  ['docs/fly-lab-session-capture-packet.md', 'web-prototype/index.html?validation=capture'],
  ['docs/fly-lab-session-capture-packet.md', 'fly-lab-validation-finding-decision-tree.md'],
  ['docs/fly-lab-session-capture-packet.md', 'Observer intervention before 30 seconds?'],
  ['docs/fly-lab-session-capture-packet.md', 'Allowed ratings: `Accurate enough`, `Acceptable simplification`, `Misleading`, `Unsafe/ethically wrong`'],
  ['docs/fly-lab-session-capture-packet.md', 'node tools/external-evidence-check.js'],
  ['docs/fly-lab-validation-finding-decision-tree.md', 'Required Issue Body Fields'],
  ['docs/fly-lab-validation-finding-decision-tree.md', 'Do not convert validation frustration into a larger feature unless the evidence demands it'],
  ['docs/fly-lab-validation-finding-decision-tree.md', 'Cut or redesign before #33 can close'],
  ['.github/ISSUE_TEMPLATE/fly_lab_validation_finding.yml', 'Success Criteria'],
  ['.github/ISSUE_TEMPLATE/fly_lab_validation_finding.yml', 'Goal'],
  ['.github/ISSUE_TEMPLATE/fly_lab_validation_finding.yml', 'Final Implementation Scope'],
  ['.github/ISSUE_TEMPLATE/fly_lab_validation_finding.yml', 'Explicit Non-Goals'],
  ['.github/ISSUE_TEMPLATE/fly_lab_validation_finding.yml', 'PR Decomposition'],
  ['.github/ISSUE_TEMPLATE/fly_lab_validation_finding.yml', 'Over-Engineering Checklist'],
  ['.github/ISSUE_TEMPLATE/fly_lab_validation_finding.yml', 'Drift-Prevention Checklist'],
  ['.github/ISSUE_TEMPLATE/fly_lab_validation_finding.yml', 'Definition of Done'],
  ['.github/ISSUE_TEMPLATE/fly_lab_lived_experience.yml', 'Success Criteria'],
  ['.github/ISSUE_TEMPLATE/fly_lab_lived_experience.yml', 'Goal'],
  ['.github/ISSUE_TEMPLATE/fly_lab_lived_experience.yml', 'Final Implementation Scope'],
  ['.github/ISSUE_TEMPLATE/fly_lab_lived_experience.yml', 'Explicit Non-Goals'],
  ['.github/ISSUE_TEMPLATE/fly_lab_lived_experience.yml', 'PR Decomposition'],
  ['.github/ISSUE_TEMPLATE/fly_lab_lived_experience.yml', 'Over-Engineering Checklist'],
  ['.github/ISSUE_TEMPLATE/fly_lab_lived_experience.yml', 'Drift-Prevention Checklist'],
  ['.github/ISSUE_TEMPLATE/fly_lab_lived_experience.yml', 'Definition of Done'],
  ['docs/r-series-progress-audit.md', '#27 R1 Experience map'],
  ['docs/r-series-progress-audit.md', '#33 R7 Vertical slice validation'],
  ['docs/r-series-progress-audit.md', '?validation=status'],
  ['docs/r-series-progress-audit.md', '#27 and #33 require external/user evidence'],
  ['docs/r-series-progress-audit.md', 'tools/external-evidence-check.js'],
  ['docs/r-series-progress-audit.md', 'tools/issue-template-contract-check.js'],
  ['docs/r-series-progress-audit.md', '32575846239'],
  ['docs/r-series-progress-audit.md', 'external evidence ledger check passed: counts match intake rows, status docs, and in-app status'],
  ['docs/r-series-progress-audit.md', 'pass fixture accepted: partial player evidence in progress'],
  ['docs/r-series-progress-audit.md', 'pass fixture accepted: partial lived-experience evidence in progress'],
  ['docs/r-series-progress-audit.md', 'issue template contract check passed: evidence follow-up forms require scoped implementation fields'],
  ['docs/r-series-progress-audit.md', 'goal-completion-audit-2026-08-22.md'],
  ['docs/goal-completion-audit-2026-08-22.md', 'Do not mark the thread goal complete'],
  ['docs/goal-completion-audit-2026-08-22.md', '#27 lacks lived-experience provenance'],
  ['docs/goal-completion-audit-2026-08-22.md', '#33 lacks player and SME validation'],
  ['docs/goal-completion-audit-2026-08-22.md', 'web-prototype/index.html?validation=status'],
  ['docs/goal-completion-audit-2026-08-22.md', 'Do not treat screenshots as player, SME, or lived-experience evidence'],
  ['docs/goal-completion-audit-2026-08-22.md', 'fly-lab-external-evidence-ledger.md'],
  ['docs/goal-completion-audit-2026-08-22.md', 'tools/external-evidence-check.js'],
  ['docs/goal-completion-audit-2026-08-22.md', 'tools/issue-template-contract-check.js'],
  ['docs/goal-completion-audit-2026-08-22.md', '32575846239'],
  ['docs/goal-completion-audit-2026-08-22.md', 'Main CI is green on the commit that contains the final audit'],
  ['docs/open-issue-triage-2026-08-22.md', 'r-series-current'],
  ['docs/open-issue-triage-2026-08-22.md', 'parked-unity-line'],
  ['docs/open-issue-triage-2026-08-22.md', '#1 0/1 phase agreement'],
  ['dogfood-output/screenshot-ux-audit.md', 'Added lived-experience packet'],
  ['web-prototype/app.js', '?validation=status'],
  ['web-prototype/app.js', '?validation=capture'],
  ['web-prototype/app.js', 'Not complete: external evidence missing'],
  ['web-prototype/data.js', 'externalEvidence'],
  ['web-prototype/data.js', 'playerSessions: {accepted:0, required:3}'],
  ['web-prototype/app.js', '?validation=lived'],
  ['web-prototype/app.js', 'Do not count screenshots, smoke tests, or implementer walkthroughs as external evidence'],
  ['web-prototype/app.js', 'Unsupported arbitrary phenomena stay excluded from the first slice'],
  ['web-prototype/app.js', 'Do not invent unsupported first-slice phenomena'],
  ['web-prototype/smoke-tests.js', 'testGoalStatusPacket'],
  ['web-prototype/smoke-tests.js', 'testCapturePacket'],
  ['web-prototype/smoke-tests.js', 'testLivedExperiencePacket'],
  ['web-prototype/smoke-tests.js', 'validation/status/capture packets'],
  ['tools/external-evidence-check.js', 'external evidence ledger check passed'],
  ['tools/external-evidence-check.js', 'status docs'],
  ['tools/external-evidence-check.js', 'data.js playerSessions accepted count must match ledger'],
  ['tools/external-evidence-check.test.js', 'external evidence checker self-test passed'],
  ['tools/external-evidence-check.test.js', 'partial player evidence in progress'],
  ['tools/external-evidence-check.test.js', 'partial lived-experience evidence in progress'],
  ['tools/external-evidence-check.test.js', 'data.js count does not match ledger'],
  ['tools/external-evidence-check.test.js', 'validation results lost pending external-evidence blocker'],
  ['tools/external-evidence-check.test.js', 'progress audit closed #33 while evidence remains pending'],
  ['tools/external-evidence-check.test.js', 'goal audit lost not-complete decision'],
  ['tools/external-evidence-check.test.js', 'bad fixture rejected'],
  ['tools/issue-template-contract-check.js', 'issue template contract check passed'],
  ['tools/issue-template-contract-check.js', 'must be required'],
  ['tools/issue-template-contract-check.js', 'Final Implementation Scope'],
  ['tools/issue-template-contract-check.js', 'Definition of Done']
];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

for (const rel of requiredFiles) {
  assert(fs.existsSync(path.join(root, rel)), `missing required R-series artifact: ${rel}`);
}

for (const [rel, needle] of textChecks) {
  assert(read(rel).includes(needle), `${rel} missing required text: ${needle}`);
}

const progress = read('docs/r-series-progress-audit.md');
assert(progress.includes('| #27 R1 Experience map | Open'), '#27 must remain explicitly open until lived-experience evidence exists');
assert(progress.includes('| #33 R7 Vertical slice validation | Open'), '#33 must remain explicitly open until player/SME evidence exists');

const ledger = read('docs/fly-lab-external-evidence-ledger.md');
assert(ledger.includes('| LE-05 |'), '#27 ledger must reserve five lived-experience intake rows');
assert(ledger.includes('| P-03 |'), '#33 ledger must reserve three player-session rows');
assert(ledger.includes('| SME-01 |'), '#33 ledger must reserve one SME-review row');

const triage = read('docs/open-issue-triage-2026-08-22.md');
assert(triage.includes('#4, #5'), 'parked Unity line must remain classified');
assert(triage.includes('Do not pick up #4/#5/#7/#9/#10-#25'), 'parked issue drift guardrail missing');

console.log('r-series status check passed: artifacts present, packets wired, external blockers preserved, parked scope guarded, goal audit and evidence ledger linked');
