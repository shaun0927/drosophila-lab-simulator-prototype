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
  'docs/fly-lab-external-evidence-ledger.md',
  'docs/r-series-progress-audit.md',
  'docs/goal-completion-audit-2026-08-22.md',
  'docs/open-issue-triage-2026-08-22.md',
  'tools/external-evidence-check.js',
  'tools/external-evidence-check.test.js',
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
  ['docs/fly-lab-validation-runbook.md', 'web-prototype/index.html?validation=packet'],
  ['docs/fly-lab-validation-runbook.md', 'web-prototype/index.html?validation=lived'],
  ['docs/fly-lab-validation-runbook.md', '#33 can close only when'],
  ['docs/fly-lab-validation-results.md', 'No external player or SME validation has been run yet'],
  ['docs/fly-lab-validation-results.md', 'screenshot proxy passed: lived-experience packet visible on desktop/mobile without legacy drift'],
  ['docs/fly-lab-validation-results.md', 'External evidence ledger updated with accepted counts'],
  ['docs/fly-lab-external-evidence-ledger.md', 'Lived-experience event rows with user or observed-lab provenance'],
  ['docs/fly-lab-external-evidence-ledger.md', 'Fresh-player first-run sessions'],
  ['docs/fly-lab-external-evidence-ledger.md', '#27 can close only when'],
  ['docs/fly-lab-external-evidence-ledger.md', '#33 can close only when'],
  ['docs/fly-lab-external-evidence-ledger.md', 'Not acceptable as #33 player closure evidence'],
  ['docs/r-series-progress-audit.md', '#27 R1 Experience map'],
  ['docs/r-series-progress-audit.md', '#33 R7 Vertical slice validation'],
  ['docs/r-series-progress-audit.md', '#27 and #33 require external/user evidence'],
  ['docs/r-series-progress-audit.md', 'goal-completion-audit-2026-08-22.md'],
  ['docs/goal-completion-audit-2026-08-22.md', 'Do not mark the thread goal complete'],
  ['docs/goal-completion-audit-2026-08-22.md', '#27 lacks lived-experience provenance'],
  ['docs/goal-completion-audit-2026-08-22.md', '#33 lacks player and SME validation'],
  ['docs/goal-completion-audit-2026-08-22.md', 'Do not treat screenshots as player, SME, or lived-experience evidence'],
  ['docs/goal-completion-audit-2026-08-22.md', 'fly-lab-external-evidence-ledger.md'],
  ['docs/goal-completion-audit-2026-08-22.md', 'Main CI is green on the commit that contains the final audit'],
  ['docs/open-issue-triage-2026-08-22.md', 'r-series-current'],
  ['docs/open-issue-triage-2026-08-22.md', 'parked-unity-line'],
  ['docs/open-issue-triage-2026-08-22.md', '#1 0/1 phase agreement'],
  ['dogfood-output/screenshot-ux-audit.md', 'Added lived-experience packet'],
  ['web-prototype/app.js', '?validation=lived'],
  ['web-prototype/app.js', 'Unsupported arbitrary phenomena stay excluded from the first slice'],
  ['web-prototype/app.js', 'Do not invent unsupported first-slice phenomena'],
  ['web-prototype/smoke-tests.js', 'testLivedExperiencePacket'],
  ['web-prototype/smoke-tests.js', 'validation packets'],
  ['tools/external-evidence-check.js', 'external evidence ledger check passed'],
  ['tools/external-evidence-check.test.js', 'external evidence checker self-test passed'],
  ['tools/external-evidence-check.test.js', 'bad fixture rejected']
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
