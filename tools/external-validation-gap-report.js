const fs = require('fs');
const path = require('path');
const {
  closureCounts,
  isReady
} = require('./final-closure-readiness-check');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function remaining(accepted, required) {
  return Math.max(0, required - accepted);
}

function buildGapReport({
  ledger = read('docs/fly-lab-external-evidence-ledger.md'),
  tracker = read('docs/external-validation-execution-tracker.md')
} = {}) {
  const counts = closureCounts(ledger);
  const ready = isReady(counts);
  const gaps = [
    {
      id: '#27 lived-experience rows',
      accepted: counts.livedRows,
      required: counts.livedRowsRequired,
      remaining: remaining(counts.livedRows, counts.livedRowsRequired),
      issue: '#35',
      next: 'collect accepted LE-01 through LE-05 rows or document explicit no-experience closure path'
    },
    {
      id: '#27 design-changing lived row',
      accepted: counts.designChange,
      required: counts.designChangeRequired,
      remaining: remaining(counts.designChange, counts.designChangeRequired),
      issue: '#35',
      next: 'capture at least one mechanic change, guardrail change, or SME risk update'
    },
    {
      id: '#33 fresh-player sessions',
      accepted: counts.playerSessions,
      required: counts.playerSessionsRequired,
      remaining: remaining(counts.playerSessions, counts.playerSessionsRequired),
      issue: '#36 #37 #38',
      next: 'run fresh-player sessions for clean, dirty, and missing-control targets'
    },
    {
      id: '#33 route coverage',
      accepted: counts.playerRouteCoverage,
      required: counts.playerRouteCoverageRequired,
      remaining: remaining(counts.playerRouteCoverage, counts.playerRouteCoverageRequired),
      issue: '#36 #37 #38',
      next: 'ensure accepted player rows collectively cover clean, dirty, and missing-control'
    },
    {
      id: '#33 SME review',
      accepted: counts.smeReviews,
      required: counts.smeReviewsRequired,
      remaining: remaining(counts.smeReviews, counts.smeReviewsRequired),
      issue: '#39',
      next: 'record SME-01 with clean, dirty, missing-control fixture coverage and five ratings'
    }
  ];

  const missing = gaps.filter(gap => gap.remaining > 0);
  const lines = [
    '# External Validation Gap Report',
    '',
    `Closure ready: ${ready ? 'yes' : 'no'}`,
    '',
    '| Gap | Accepted | Required | Remaining | Execution issue | Next action |',
    '|---|---:|---:|---:|---|---|'
  ];

  for (const gap of gaps) {
    lines.push(`| ${gap.id} | ${gap.accepted} | ${gap.required} | ${gap.remaining} | ${gap.issue} | ${gap.next} |`);
  }

  lines.push('');
  lines.push(ready ? 'Decision: ready for final closure audit.' : 'Decision: keep #27, #33, and the thread goal open; external evidence is still missing.');

  if (!ready) {
    for (const gap of missing) {
      if (gap.issue === '#35') {
        if (gap.id.includes('lived-experience')) {
          assertTrackerMentions(tracker, '#35', 'Blocked on real interview evidence');
        }
        if (gap.id.includes('design-changing')) {
          assertTrackerMentions(tracker, '#35', 'Blocked on accepted `LE-*` design effect');
        }
      }
      if (gap.issue.includes('#36')) assertTrackerMentions(tracker, '#36, #37, #38', 'Blocked on');
      if (gap.issue === '#39') assertTrackerMentions(tracker, '#39', 'Blocked on biology-aware fixture review');
    }
  }

  return {
    ready,
    gaps,
    missing,
    markdown: lines.join('\n')
  };
}

function assertTrackerMentions(tracker, issueText, statusText) {
  if (!tracker.includes(issueText) || !tracker.includes(statusText)) {
    throw new Error(`gap report tracker cross-check missing ${issueText} / ${statusText}`);
  }
}

function main() {
  const report = buildGapReport();
  console.log(report.markdown);
  console.log('');
  console.log(`external validation gap report passed: ${report.missing.length} gap(s) remain`);
}

if (require.main === module) {
  main();
}

module.exports = {
  buildGapReport
};
