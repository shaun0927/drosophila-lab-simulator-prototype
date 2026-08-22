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
  ['docs/fly-lab-lived-experience-response-form.md', 'web-prototype/index.html?validation=lived'],
  ['docs/fly-lab-validation-runbook.md', 'web-prototype/index.html?validation=status'],
  ['docs/fly-lab-validation-runbook.md', 'web-prototype/index.html?validation=packet'],
  ['docs/fly-lab-validation-runbook.md', 'web-prototype/index.html?validation=capture'],
  ['docs/fly-lab-validation-runbook.md', 'web-prototype/index.html?validation=lived'],
  ['docs/fly-lab-validation-runbook.md', '#33 can close only when'],
  ['docs/fly-lab-validation-runbook.md', 'accepted player sessions collectively cover clean, dirty, and missing-control routes or fixtures'],
  ['docs/fly-lab-validation-runbook.md', 'accepted SME review id references clean, dirty, and missing-control fixture coverage in validation results'],
  ['docs/fly-lab-validation-runbook.md', 'fly-lab-session-capture-packet.md'],
  ['docs/fly-lab-validation-runbook.md', 'fly-lab-validation-finding-decision-tree.md'],
  ['docs/fly-lab-validation-runbook.md', 'Over-Engineering Checklist'],
  ['docs/fly-lab-validation-runbook.md', 'Drift-Prevention Checklist'],
  ['docs/fly-lab-validation-runbook.md', 'resolved` or `accepted non-blocking`'],
  ['docs/fly-lab-validation-runbook.md', 'The same follow-up issue reference and disposition must also appear in `docs/fly-lab-validation-results.md`'],
  ['docs/fly-lab-validation-results.md', 'External validation in progress'],
  ['docs/fly-lab-validation-results.md', 'node tools/external-evidence-check.js'],
  ['docs/fly-lab-validation-results.md', 'node tools/issue-template-contract-check.js'],
  ['docs/fly-lab-validation-results.md', 'gh run list --branch main --limit 5'],
  ['docs/fly-lab-validation-results.md', 'external evidence ledger check passed: counts match intake rows, status docs, and in-app status'],
  ['docs/fly-lab-validation-results.md', 'pass fixture accepted: partial player evidence in progress'],
  ['docs/fly-lab-validation-results.md', 'issue template contract check passed: evidence follow-up forms require scoped implementation fields'],
  ['docs/fly-lab-validation-results.md', 'Counted Fix/Cut follow-up issue references and dispositions summarized here before ledger counts increase'],
  ['docs/fly-lab-validation-results.md', 'SME validation results explicitly cover `?fixture=clean`, `?fixture=dirty`, and `?fixture=missing-control` on the accepted SME review id'],
  ['docs/fly-lab-validation-results.md', 'screenshot proxy passed: lived-experience packet visible on desktop/mobile without legacy drift'],
  ['docs/fly-lab-validation-results.md', 'External evidence ledger updated with accepted counts'],
  ['docs/fly-lab-external-evidence-ledger.md', 'Lived-experience event rows with user or observed-lab provenance'],
  ['docs/fly-lab-external-evidence-ledger.md', 'Fresh-player first-run sessions'],
  ['docs/fly-lab-external-evidence-ledger.md', 'fly-lab-session-capture-packet.md'],
  ['docs/fly-lab-external-evidence-ledger.md', 'fly-lab-validation-finding-decision-tree.md'],
  ['docs/fly-lab-external-evidence-ledger.md', '#27 can close only when'],
  ['docs/fly-lab-external-evidence-ledger.md', '#33 can close only when'],
  ['docs/fly-lab-external-evidence-ledger.md', 'accepted player sessions collectively cover clean, dirty, and missing-control routes or fixtures before closure review'],
  ['docs/fly-lab-external-evidence-ledger.md', 'accepted SME review id references clean, dirty, and missing-control fixture coverage'],
  ['docs/fly-lab-external-evidence-ledger.md', 'resolved` or `accepted non-blocking` disposition before the row can count'],
  ['docs/fly-lab-external-evidence-ledger.md', 'including every counted Fix/Cut follow-up issue reference and disposition'],
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
  ['docs/fly-lab-validation-finding-decision-tree.md', 'disposition must be written in the ledger follow-up field before the evidence row can count'],
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
  ['docs/r-series-progress-audit.md', 'gh run list --branch main --limit 5'],
  ['docs/r-series-progress-audit.md', 'external evidence ledger check passed: counts match intake rows, status docs, and in-app status'],
  ['docs/r-series-progress-audit.md', 'pass fixture accepted: partial player evidence in progress'],
  ['docs/r-series-progress-audit.md', 'pass fixture accepted: partial lived-experience evidence in progress'],
  ['docs/r-series-progress-audit.md', 'issue template contract check passed: evidence follow-up forms require scoped implementation fields'],
  ['docs/r-series-progress-audit.md', 'in-progress partial evidence before closure review'],
  ['docs/r-series-progress-audit.md', 'rejects accepted LE/player/SME rows that still contain incomplete required evidence fields'],
  ['docs/r-series-progress-audit.md', 'rejects accepted external-evidence rows that use screenshots, smoke tests, implementer walkthroughs, or proxy reviews as the evidence source'],
  ['docs/r-series-progress-audit.md', 'requires accepted SME rows to use the allowed mechanic-rating rubric'],
  ['docs/r-series-progress-audit.md', 'rejects player Pass rows unless the player completed one run within 5 minutes'],
  ['docs/r-series-progress-audit.md', 'rejects SME Pass rows when any core mechanic is rated Misleading or Unsafe/ethically wrong'],
  ['docs/r-series-progress-audit.md', 'requires every accepted LE row id to appear in the experience map and every accepted P/SME row id to appear in validation results'],
  ['docs/r-series-progress-audit.md', 'requires Fix/Cut follow-up fields to contain a concrete GitHub issue reference'],
  ['docs/r-series-progress-audit.md', 'rejects Fix/Cut follow-up references that point back to #27 or #33'],
  ['docs/r-series-progress-audit.md', 'opening an issue alone cannot close #33'],
  ['docs/r-series-progress-audit.md', 'requires counted Fix/Cut follow-up issue references to also appear in `docs/fly-lab-validation-results.md`'],
  ['docs/r-series-progress-audit.md', 'requires the follow-up issue accepted count to match unique concrete Fix/Cut follow-up references'],
  ['docs/r-series-progress-audit.md', 'the in-app status cannot hide unresolved validation failures'],
  ['docs/r-series-progress-audit.md', 'requires the follow-up issue ledger gate to remain `As needed`, linked to #33, and represented by a non-negative accepted count'],
  ['docs/r-series-progress-audit.md', 'requires accepted LE provenance and design-effect fields to use the allowed #27 closure vocabulary'],
  ['docs/r-series-progress-audit.md', 'requires explicit no-relevant-experience LE rows to use `explicit exclusion`, not mechanic/guardrail/SME-risk design changes'],
  ['docs/r-series-progress-audit.md', 'rejects duplicated no-experience LE rows and mixed no-experience plus firsthand/observed LE evidence'],
  ['docs/r-series-progress-audit.md', 'requires the #27 design-change count to match accepted LE rows'],
  ['docs/r-series-progress-audit.md', 'requires three accepted #33 player sessions to collectively cover clean, dirty, and missing-control routes or fixtures before closure review'],
  ['docs/r-series-progress-audit.md', 'requires accepted #33 SME evidence ids to reference clean, dirty, and missing-control fixture coverage'],
  ['docs/r-series-progress-audit.md', 'the in-app status cannot claim closure readiness from player-session count alone'],
  ['docs/r-series-progress-audit.md', 'uses ledger counts to accept either zero-evidence pending language or partial-evidence in-progress language'],
  ['docs/r-series-progress-audit.md', 'rejects `Fix` or `Cut` player/SME evidence rows unless they link a concrete follow-up issue before counting'],
  ['docs/r-series-progress-audit.md', 'goal-completion-audit-2026-08-22.md'],
  ['docs/goal-completion-audit-2026-08-22.md', 'Do not mark the thread goal complete'],
  ['docs/goal-completion-audit-2026-08-22.md', '#27 lacks lived-experience provenance'],
  ['docs/goal-completion-audit-2026-08-22.md', '#33 lacks player and SME validation'],
  ['docs/goal-completion-audit-2026-08-22.md', 'web-prototype/index.html?validation=status'],
  ['docs/goal-completion-audit-2026-08-22.md', 'Do not treat screenshots as player, SME, or lived-experience evidence'],
  ['docs/goal-completion-audit-2026-08-22.md', 'fly-lab-external-evidence-ledger.md'],
  ['docs/goal-completion-audit-2026-08-22.md', 'tools/external-evidence-check.js'],
  ['docs/goal-completion-audit-2026-08-22.md', 'tools/issue-template-contract-check.js'],
  ['docs/goal-completion-audit-2026-08-22.md', 'gh run list --branch main --limit 5'],
  ['docs/goal-completion-audit-2026-08-22.md', 'Main CI is green on the commit that contains the final audit'],
  ['docs/goal-completion-audit-2026-08-22.md', 'The current guardrail set includes'],
  ['docs/goal-completion-audit-2026-08-22.md', 'proxy-evidence rejection'],
  ['docs/goal-completion-audit-2026-08-22.md', 'follow-up count validation'],
  ['docs/goal-completion-audit-2026-08-22.md', 'follow-up self-reference rejection'],
  ['docs/goal-completion-audit-2026-08-22.md', 'follow-up disposition validation'],
  ['docs/goal-completion-audit-2026-08-22.md', 'follow-up result-summary references'],
  ['docs/goal-completion-audit-2026-08-22.md', 'SME review-id fixture-coverage validation'],
  ['docs/goal-completion-audit-2026-08-22.md', 'no-experience conflict rejection'],
  ['docs/goal-completion-audit-2026-08-22.md', 'These guardrails make false closure harder; they do not provide the missing lived, player, or SME evidence'],
  ['docs/goal-completion-audit-2026-08-22.md', 'duplicated or mixed explicit no-experience rows'],
  ['docs/goal-completion-audit-2026-08-22.md', 'incomplete #33 player route coverage'],
  ['docs/goal-completion-audit-2026-08-22.md', '0/3 route-coverage'],
  ['docs/goal-completion-audit-2026-08-22.md', 'Clean, dirty, and missing-control route or fixture coverage'],
  ['docs/goal-completion-audit-2026-08-22.md', 'Clean, dirty, and missing-control fixture coverage linked to the accepted SME review id'],
  ['docs/goal-completion-audit-2026-08-22.md', 'vague, self-referential, or unresolved Fix/Cut follow-up notes'],
  ['docs/goal-completion-audit-2026-08-22.md', 'missing Fix/Cut follow-up references in validation results'],
  ['docs/goal-completion-audit-2026-08-22.md', 'Do not count accepted external-evidence rows unless they pass the ledger validator'],
  ['docs/open-issue-triage-2026-08-22.md', 'r-series-current'],
  ['docs/open-issue-triage-2026-08-22.md', 'parked-unity-line'],
  ['docs/open-issue-triage-2026-08-22.md', '#1 0/1 phase agreement'],
  ['dogfood-output/screenshot-ux-audit.md', 'Added lived-experience packet'],
  ['web-prototype/app.js', '?validation=status'],
  ['web-prototype/app.js', '?validation=capture'],
  ['web-prototype/app.js', 'Not complete: external evidence missing'],
  ['web-prototype/app.js', 'Not complete: external evidence in progress'],
  ['web-prototype/app.js', 'External evidence ready for closure review'],
  ['web-prototype/app.js', 'evidenceGateStatus'],
  ['web-prototype/app.js', 'playerRouteCoverage'],
  ['web-prototype/app.js', 'Route/fixture coverage'],
  ['web-prototype/data.js', 'externalEvidence'],
  ['web-prototype/data.js', 'playerSessions: {accepted:0, required:3}'],
  ['web-prototype/data.js', 'playerRouteCoverage: {accepted:0, required:3}'],
  ['web-prototype/data.js', "followUpIssues: {accepted:0, required:'As needed'}"],
  ['web-prototype/app.js', '?validation=lived'],
  ['web-prototype/app.js', 'Fix/Cut follow-up issues'],
  ['web-prototype/app.js', 'Do not count screenshots, smoke tests, or implementer walkthroughs as external evidence'],
  ['web-prototype/app.js', 'Unsupported arbitrary phenomena stay excluded from the first slice'],
  ['web-prototype/app.js', 'Do not invent unsupported first-slice phenomena'],
  ['web-prototype/smoke-tests.js', 'testGoalStatusPacket'],
  ['web-prototype/smoke-tests.js', 'goal status missing follow-up issue gate'],
  ['web-prototype/smoke-tests.js', 'goal status missing route coverage gate'],
  ['web-prototype/smoke-tests.js', 'goal status should stay incomplete until route coverage is met'],
  ['web-prototype/smoke-tests.js', 'Not complete: external evidence in progress'],
  ['web-prototype/smoke-tests.js', 'testCapturePacket'],
  ['web-prototype/smoke-tests.js', 'testLivedExperiencePacket'],
  ['web-prototype/smoke-tests.js', 'validation/status/capture packets'],
  ['tools/external-evidence-check.js', 'external evidence ledger check passed'],
  ['tools/external-evidence-check.js', 'status docs'],
  ['tools/external-evidence-check.js', 'data.js playerSessions accepted count must match ledger'],
  ['tools/external-evidence-check.js', 'must link a follow-up issue before it can count'],
  ['tools/external-evidence-check.js', 'design-change count must match accepted LE rows'],
  ['tools/external-evidence-check.js', 'accepted player row has an incomplete required field'],
  ['tools/external-evidence-check.js', 'cannot use proxy evidence as an external-evidence source'],
  ['tools/external-evidence-check.js', 'accepted SME row has an invalid mechanic rating'],
  ['tools/external-evidence-check.js', 'player Pass requires completing one run within 5 minutes'],
  ['tools/external-evidence-check.js', 'SME row with a Misleading rating must be Fix or Cut'],
  ['tools/external-evidence-check.js', 'SME row with an Unsafe/ethically wrong rating must be Cut'],
  ['tools/external-evidence-check.js', 'accepted player row must be referenced in validation results'],
  ['tools/external-evidence-check.js', 'counted Fix/Cut follow-up issue must be referenced in validation results'],
  ['tools/external-evidence-check.js', 'accepted lived-experience row must be referenced in the experience map'],
  ['tools/external-evidence-check.js', 'follow-up must be a concrete GitHub issue reference'],
  ['tools/external-evidence-check.js', 'follow-up must not reference #27 or #33'],
  ['tools/external-evidence-check.js', 'follow-up must be resolved or accepted non-blocking before it can count'],
  ['tools/external-evidence-check.js', 'follow-up issue accepted count must match unique concrete Fix/Cut follow-up references'],
  ['tools/external-evidence-check.js', 'data.js followUpIssues accepted count must match ledger'],
  ['tools/external-evidence-check.js', 'data.js externalEvidence must include playerRouteCoverage'],
  ['tools/external-evidence-check.js', 'data.js playerRouteCoverage accepted count must match ledger route coverage'],
  ['tools/external-evidence-check.js', 'accepted lived-experience row has invalid provenance'],
  ['tools/external-evidence-check.js', 'accepted lived-experience row has invalid design effect'],
  ['tools/external-evidence-check.js', 'no-experience row must use explicit exclusion as its design effect'],
  ['tools/external-evidence-check.js', 'no-experience decision must not be duplicated across accepted LE rows'],
  ['tools/external-evidence-check.js', 'no-experience decision cannot be mixed with accepted firsthand or observed LE rows'],
  ['tools/external-evidence-check.js', 'accepted player sessions must cover clean, dirty, and missing-control routes or fixtures before closure review'],
  ['tools/external-evidence-check.js', 'accepted SME review must reference clean fixture coverage in validation results'],
  ['tools/external-evidence-check.test.js', 'external evidence checker self-test passed'],
  ['tools/external-evidence-check.test.js', 'partial player evidence in progress'],
  ['tools/external-evidence-check.test.js', 'partial lived-experience evidence in progress'],
  ['tools/external-evidence-check.test.js', 'fix decision with linked follow-up issue'],
  ['tools/external-evidence-check.test.js', 'player fix decision with blocking-open follow-up'],
  ['tools/external-evidence-check.test.js', 'fix follow-up issue missing from validation results'],
  ['tools/external-evidence-check.test.js', 'fix follow-up issue count not raised'],
  ['tools/external-evidence-check.test.js', 'player fix decision without follow-up issue'],
  ['tools/external-evidence-check.test.js', 'SME cut decision without follow-up issue'],
  ['tools/external-evidence-check.test.js', 'player fix decision with vague follow-up note'],
  ['tools/external-evidence-check.test.js', 'SME cut decision with vague follow-up note'],
  ['tools/external-evidence-check.test.js', 'player fix decision referencing current gate issue'],
  ['tools/external-evidence-check.test.js', 'SME cut decision referencing current gate issue URL'],
  ['tools/external-evidence-check.test.js', 'design-change count raised without matching LE design effect'],
  ['tools/external-evidence-check.test.js', 'design-change row matches top-level count'],
  ['tools/external-evidence-check.test.js', 'accepted LE row with incomplete required field'],
  ['tools/external-evidence-check.test.js', 'accepted LE row with invalid provenance'],
  ['tools/external-evidence-check.test.js', 'accepted LE row with invalid design effect'],
  ['tools/external-evidence-check.test.js', 'accepted no-experience LE row with design change'],
  ['tools/external-evidence-check.test.js', 'duplicated accepted no-experience LE rows'],
  ['tools/external-evidence-check.test.js', 'no-experience LE row mixed with lived LE row'],
  ['tools/external-evidence-check.test.js', 'full player route coverage'],
  ['tools/external-evidence-check.test.js', 'three accepted player rows without route coverage'],
  ['tools/external-evidence-check.test.js', 'SME fixture coverage'],
  ['tools/external-evidence-check.test.js', 'accepted SME row without fixture coverage'],
  ['tools/external-evidence-check.test.js', 'accepted SME row with unlinked fixture coverage'],
  ['tools/external-evidence-check.test.js', 'accepted player row with incomplete required field'],
  ['tools/external-evidence-check.test.js', 'accepted SME row with incomplete required field'],
  ['tools/external-evidence-check.test.js', 'accepted LE row sourced from screenshot proxy'],
  ['tools/external-evidence-check.test.js', 'accepted player row sourced from implementer walkthrough'],
  ['tools/external-evidence-check.test.js', 'accepted SME row sourced from generic screenshot review'],
  ['tools/external-evidence-check.test.js', 'accepted SME row with invalid mechanic rating'],
  ['tools/external-evidence-check.test.js', 'accepted player Pass without completing the run'],
  ['tools/external-evidence-check.test.js', 'accepted player row with ambiguous completion value'],
  ['tools/external-evidence-check.test.js', 'accepted SME Pass with misleading rating'],
  ['tools/external-evidence-check.test.js', 'accepted SME Fix with unsafe rating'],
  ['tools/external-evidence-check.test.js', 'accepted LE row missing from experience map'],
  ['tools/external-evidence-check.test.js', 'accepted player row missing from validation results'],
  ['tools/external-evidence-check.test.js', 'accepted SME row missing from validation results'],
  ['tools/external-evidence-check.test.js', 'data.js count does not match ledger'],
  ['tools/external-evidence-check.test.js', 'data.js follow-up count does not match ledger'],
  ['tools/external-evidence-check.test.js', 'data.js missing route coverage gate'],
  ['tools/external-evidence-check.test.js', 'data.js route coverage count does not match ledger'],
  ['tools/external-evidence-check.test.js', 'validation results lost pending external-evidence blocker'],
  ['tools/external-evidence-check.test.js', 'progress audit closed #33 while evidence remains pending'],
  ['tools/external-evidence-check.test.js', 'goal audit lost not-complete decision'],
  ['tools/external-evidence-check.test.js', 'bad fixture rejected'],
  ['tools/issue-template-contract-check.js', 'issue template contract check passed'],
  ['tools/issue-template-contract-check.js', 'must be required'],
  ['tools/issue-template-contract-check.js', 'Final Implementation Scope'],
  ['tools/issue-template-contract-check.js', 'Definition of Done'],
  ['tools/r-series-status-check.js', 'must not hard-code a GitHub Actions run id'],
  ['tools/r-series-status-check.js', 'validateEvidenceStatusLanguage'],
  ['tools/r-series-status-check.js', 'partial player/SME validation progress'],
  ['tools/r-series-status-check.js', 'follow-up issue gate must remain As needed in the ledger'],
  ['tools/r-series-status-check.js', 'pending user-input language while #27 evidence count is zero']
];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function cells(line) {
  return line.split('|').slice(1, -1).map(cell => cell.trim());
}

function currentStatusRows(markdown) {
  const rows = new Map();
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.startsWith('| ') || line.includes('---')) continue;
    const row = cells(line);
    if (row.length !== 5 || row[0] === 'Evidence gate') continue;
    rows.set(row[0], {
      required: row[1],
      accepted: Number(row[2]),
      status: row[3],
      issue: row[4]
    });
  }
  return rows;
}

function requireAnyText(text, needles, message) {
  assert(needles.some(needle => text.includes(needle)), `${message}: ${needles.join(' OR ')}`);
}

function validateEvidenceStatusLanguage() {
  const ledgerRows = currentStatusRows(read('docs/fly-lab-external-evidence-ledger.md'));
  const livedRows = ledgerRows.get('Lived-experience event rows with user or observed-lab provenance');
  const designChange = ledgerRows.get('Lived-experience answer that changes a mechanic, guardrail, or SME risk');
  const playerRows = ledgerRows.get('Fresh-player first-run sessions');
  const smeRows = ledgerRows.get('SME or biology-aware review');
  const followUpRows = ledgerRows.get('Follow-up fix/cut issues for failed external criteria');
  const experienceMap = read('docs/fly-lab-experience-map.md');
  const validationResults = read('docs/fly-lab-validation-results.md');

  assert(livedRows && designChange && playerRows && smeRows && followUpRows, 'ledger missing evidence status rows required for dynamic status language check');
  assert(followUpRows.required === 'As needed', 'follow-up issue gate must remain As needed in the ledger');
  assert(followUpRows.issue === '#33', 'follow-up issue gate must remain linked to #33');
  assert(Number.isInteger(followUpRows.accepted) && followUpRows.accepted >= 0, 'follow-up issue accepted count must be a non-negative integer');

  const hasLivedEvidence = livedRows.accepted > 0 || designChange.accepted > 0;
  const hasValidationEvidence = playerRows.accepted > 0 || smeRows.accepted > 0 || followUpRows.accepted > 0;

  if (hasLivedEvidence) {
    requireAnyText(experienceMap, ['User lived-experience pass: in progress', 'Accepted lived-experience rows'], 'experience map must describe partial lived-evidence progress');
  } else {
    assert(experienceMap.includes('User lived-experience pass: pending user input'), 'experience map must preserve pending user-input language while #27 evidence count is zero');
  }

  if (hasValidationEvidence) {
    requireAnyText(validationResults, ['External validation in progress', '## Validation Run'], 'validation results must describe partial player/SME validation progress');
  } else {
    assert(validationResults.includes('No external player or SME validation has been run yet'), 'validation results must preserve no-external-validation language while #33 evidence count is zero');
  }
}

for (const rel of requiredFiles) {
  assert(fs.existsSync(path.join(root, rel)), `missing required R-series artifact: ${rel}`);
}

for (const [rel, needle] of textChecks) {
  assert(read(rel).includes(needle), `${rel} missing required text: ${needle}`);
}

validateEvidenceStatusLanguage();

for (const rel of [
  'docs/fly-lab-validation-results.md',
  'docs/r-series-progress-audit.md',
  'docs/goal-completion-audit-2026-08-22.md'
]) {
  const content = read(rel);
  assert(!/actions\/runs\/\d+/.test(content), `${rel} must not hard-code a GitHub Actions run URL`);
  assert(!/\b\d{11}\b/.test(content), `${rel} must not hard-code a GitHub Actions run id`);
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
