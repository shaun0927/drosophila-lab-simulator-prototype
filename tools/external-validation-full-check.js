const { spawnSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');
const liveIssues = process.argv.includes('--live-issues');
const help = process.argv.includes('--help') || process.argv.includes('-h');

const node = process.execPath;

const checks = [
  [node, ['--check', 'web-prototype/app.js']],
  [node, ['--check', 'web-prototype/data.js']],
  [node, ['--check', 'web-prototype/smoke-tests.js']],
  [node, ['--check', 'tools/external-evidence-check.js']],
  [node, ['--check', 'tools/external-evidence-check.test.js']],
  [node, ['--check', 'tools/external-validation-tracker-check.js']],
  [node, ['--check', 'tools/external-validation-tracker-check.test.js']],
  [node, ['--check', 'tools/external-validation-execution-contract-check.js']],
  [node, ['--check', 'tools/external-validation-execution-contract-check.test.js']],
  [node, ['--check', 'tools/external-validation-intake-runbook-check.js']],
  [node, ['--check', 'tools/external-validation-intake-runbook-check.test.js']],
  [node, ['--check', 'tools/external-validation-issue-state-audit.js']],
  [node, ['--check', 'tools/external-validation-issue-state-audit.test.js']],
  [node, ['--check', 'tools/external-validation-full-check.js']],
  [node, ['--check', 'tools/final-closure-readiness-check.js']],
  [node, ['--check', 'tools/final-closure-readiness-check.test.js']],
  [node, ['--check', 'tools/open-issue-triage-audit.js']],
  [node, ['--check', 'tools/open-issue-triage-audit.test.js']],
  [node, ['--check', 'tools/issue-template-contract-check.js']],
  [node, ['--check', 'tools/r-series-status-check.js']],
  [node, ['web-prototype/smoke-tests.js']],
  [node, ['tools/r-series-status-check.js']],
  [node, ['tools/external-evidence-check.js']],
  [node, ['tools/external-validation-tracker-check.js']],
  [node, ['tools/external-evidence-check.test.js']],
  [node, ['tools/external-validation-tracker-check.test.js']],
  [node, ['tools/external-validation-execution-contract-check.js']],
  [node, ['tools/external-validation-execution-contract-check.test.js']],
  [node, ['tools/external-validation-intake-runbook-check.js']],
  [node, ['tools/external-validation-intake-runbook-check.test.js']],
  [node, ['tools/external-validation-issue-state-audit.test.js']],
  [node, ['tools/final-closure-readiness-check.js']],
  [node, ['tools/final-closure-readiness-check.test.js']],
  [node, ['tools/open-issue-triage-audit.test.js']],
  [node, ['tools/issue-template-contract-check.js']],
  ['git', ['diff', '--check']]
];

if (help) {
  console.log([
    'Usage: node tools/external-validation-full-check.js [--live-issues]',
    '',
    'Runs the non-live local verification chain for #27/#33 external-validation work.',
    'Add --live-issues to also verify #27, #33, and #35-#39 against live GitHub issue state with authenticated gh.'
  ].join('\n'));
  process.exit(0);
}

function label(command, args) {
  const displayCommand = command === node ? 'node' : command;
  return `${displayCommand} ${args.join(' ')}`;
}

function run(command, args) {
  const display = label(command, args);
  console.log(`\n> ${display}`);
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: false
  });

  if (result.error) {
    console.error(`\nfailed to start: ${display}`);
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`\nfailed: ${display}`);
    process.exit(result.status || 1);
  }
}

for (const [command, args] of checks) {
  run(command, args);
}

if (liveIssues) {
  run(node, ['tools/external-validation-execution-contract-check.js', '--live-issues']);
  run(node, ['tools/external-validation-issue-state-audit.js']);
  run(node, ['tools/open-issue-triage-audit.js']);
} else {
  console.log('\n- skipped live issue-state and open-issue triage audits; run with --live-issues from an authenticated gh environment');
}

console.log('\nexternal validation full check passed');
