const fs = require('fs');
const path = require('path');

const root = process.cwd();

const requiredTexts = [
  'This is the field packet for #27 lived-experience collection and #33 player/SME validation.',
  'web-prototype/index.html?validation=capture',
  'docs/external-validation-session-packets.md',
  'Issue-specific packets | `docs/external-validation-session-packets.md` #35 through #39',
  'Record exact phrases before interpreting them.',
  'Do not count screenshots, smoke tests, or implementer walkthroughs as external evidence.',
  'Observer intervention before 30 seconds?',
  'Goal within first 30 seconds',
  'Cause of reviewer attack',
  'Second-run repair',
  'Allowed ratings: `Accurate enough`, `Acceptable simplification`, `Misleading`, `Unsafe/ethically wrong`',
  'Every misleading or unsafe core mechanic needs a concrete follow-up issue before the row can count.',
  'node tools/external-validation-preflight-check.js',
  'node tools/external-validation-gap-report.js',
  'node tools/external-validation-full-check.js --live-issues',
  'Do not close #27 or #33 from this packet alone.'
];

const requiredSections = [
  '## Capture Rules',
  '## Pre-Session Setup',
  '## #27 Lived-Experience Capture',
  '## #33 Fresh-Player Capture',
  '## #33 SME Capture',
  '## After-Session Update Order',
  '## Closure Warning'
];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function validateCapturePacket(markdown = read('docs/fly-lab-session-capture-packet.md')) {
  for (const text of requiredTexts) {
    assert(markdown.includes(text), `capture packet missing required text: ${text}`);
  }

  let previousIndex = -1;
  for (const section of requiredSections) {
    const index = markdown.indexOf(section);
    assert(index !== -1, `capture packet missing required section: ${section}`);
    assert(index > previousIndex, `capture packet section out of order: ${section}`);
    previousIndex = index;
  }

  for (const issue of ['#35', '#36', '#37', '#38', '#39']) {
    assert(markdown.includes(issue), `capture packet missing execution issue reference: ${issue}`);
  }
}

function main() {
  validateCapturePacket();
  console.log('external validation capture packet check passed: raw evidence fields, commands, and anti-proxy warnings are present');
}

if (require.main === module) {
  main();
}

module.exports = {
  requiredSections,
  requiredTexts,
  validateCapturePacket
};
