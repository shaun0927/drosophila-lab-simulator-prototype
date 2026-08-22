const fs = require('fs');
const path = require('path');

const root = process.cwd();

const requiredCommands = [
  'node web-prototype/smoke-tests.js',
  'node tools/r-series-status-check.js',
  'node tools/external-evidence-check.js',
  'node tools/issue-template-contract-check.js',
  'node tools/external-validation-gap-report.js',
  'node tools/external-validation-full-check.js --live-issues'
];

const requiredLaunchAids = [
  'web-prototype/index.html?validation=packet',
  'web-prototype/index.html?validation=capture',
  'web-prototype/index.html?validation=lived',
  'web-prototype/index.html?validation=status',
  'web-prototype/index.html?fixture=clean',
  'web-prototype/index.html?fixture=dirty',
  'web-prototype/index.html?fixture=missing-control'
];

const requiredWarnings = [
  'Do not count screenshots',
  'Do not change required evidence counts',
  'Do not mark the thread goal complete',
  'same person cannot count their own implementer walkthrough as a fresh-player session',
  'Do not close #27 before #35 is resolved',
  'Do not close #33 before #36, #37, #38, and #39 are resolved'
];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function validateExternalValidationPreflight(markdown = read('docs/external-validation-sprint-plan.md')) {
  assert(markdown.includes('## Preflight'), 'external validation sprint plan missing Preflight section');
  assert(markdown.includes('## Session Order'), 'external validation sprint plan missing Session Order section');
  assert(markdown.includes('## Roles'), 'external validation sprint plan missing Roles section');

  for (const command of requiredCommands) {
    assert(markdown.includes(command), `external validation preflight missing command: ${command}`);
  }
  for (const url of requiredLaunchAids) {
    assert(markdown.includes(url), `external validation preflight missing launch aid: ${url}`);
  }
  for (const warning of requiredWarnings) {
    assert(markdown.includes(warning), `external validation preflight missing warning: ${warning}`);
  }

  const preflightIndex = markdown.indexOf('## Preflight');
  const sessionOrderIndex = markdown.indexOf('## Session Order');
  const updateOrderIndex = markdown.indexOf('## Update Order');
  assert(sessionOrderIndex < preflightIndex, 'Session Order must appear before Preflight so moderators know the sequence before commands');
  assert(preflightIndex < updateOrderIndex, 'Preflight must appear before Update Order');

  return {
    commands: requiredCommands,
    launchAids: requiredLaunchAids,
    warnings: requiredWarnings
  };
}

function main() {
  const result = validateExternalValidationPreflight();
  console.log(`external validation preflight check passed: ${result.commands.length} commands and ${result.launchAids.length} launch aids are required before sessions`);
}

if (require.main === module) {
  main();
}

module.exports = {
  requiredCommands,
  requiredLaunchAids,
  requiredWarnings,
  validateExternalValidationPreflight
};
