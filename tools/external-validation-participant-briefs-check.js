const fs = require('fs');
const path = require('path');

const root = process.cwd();

const requiredSections = [
  '## Global Moderator Rules',
  '## #35 Lived-Experience Invitation',
  '## #36-#38 Fresh-Player Invitation',
  '## #39 SME Reviewer Invitation',
  '## Drift Checks'
];

const requiredTexts = [
  'These briefs are not evidence.',
  'Do not raise accepted counts from invitations, screenshots, smoke tests, implementer walkthroughs, or packet visibility.',
  'Do not explain the goal, correct causal interpretation, or name clean/dirty/missing-control during the first 30 seconds of player sessions.',
  'Do preserve exact phrases before paraphrasing.',
  'Do not ask participants to validate screenshots; ask them to play, review, or answer from experience.',
  'node tools/external-validation-full-check.js --live-issues',
  '`LE-01` through `LE-05`',
  'If you have no relevant firsthand or observed experience, saying that explicitly is also useful.',
  'Do not suggest Light-Induced Swarm Dance, optogenetics, or broad spectacle unless the participant brings it up as a real experience.',
  '`P-01` clean',
  '`P-02` dirty',
  '`P-03` missing-control',
  'Do not send the route meaning or answer key.',
  'That this is the clean route',
  'That CO2/dirty handling is the intended weakness',
  'That missing control is the intended weakness',
  'What caused the reviewer attack?',
  'What would you do differently in a second run?',
  '`SME-01`',
  'stock/vial/calendar, virgin/cross timing, CO2/sorting, negative geotaxis, and record/reviewer logic',
  '`Accurate enough`',
  '`Acceptable simplification`',
  '`Misleading`',
  '`Unsafe/ethically wrong`',
  'Do not close #27, #33, or the thread goal from completed invitations.'
];

const expectedPlayerRows = [
  ['#36', '`P-01` clean', '`web-prototype/index.html?fixture=clean&validation=capture`'],
  ['#37', '`P-02` dirty', '`web-prototype/index.html?fixture=dirty&validation=capture`'],
  ['#38', '`P-03` missing-control', '`web-prototype/index.html?fixture=missing-control&validation=capture`']
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

function playerRows(markdown) {
  return markdown.split(/\r?\n/)
    .filter(line => /^\|\s*#3[678]\s*\|/.test(line))
    .map(cells);
}

function validateParticipantBriefs(markdown = read('docs/external-validation-participant-briefs.md')) {
  for (const text of requiredTexts) {
    assert(markdown.includes(text), `participant briefs missing required text: ${text}`);
  }

  let previousIndex = -1;
  for (const section of requiredSections) {
    const index = markdown.indexOf(section);
    assert(index !== -1, `participant briefs missing required section: ${section}`);
    assert(index > previousIndex, `participant briefs section out of order: ${section}`);
    previousIndex = index;
  }

  const rows = playerRows(markdown);
  assert(rows.length === 3, `participant briefs expected three player route rows, got ${rows.length}`);
  expectedPlayerRows.forEach(([issue, rowId, url], index) => {
    const row = rows[index];
    assert(row[0] === issue, `participant briefs expected player issue ${issue}, got ${row[0]}`);
    assert(row[1] === rowId, `${issue} player row expected ${rowId}, got ${row[1]}`);
    assert(row[2] === url, `${issue} player URL expected ${url}, got ${row[2]}`);
  });

  for (const url of [
    '`web-prototype/index.html?fixture=clean`',
    '`web-prototype/index.html?fixture=dirty`',
    '`web-prototype/index.html?fixture=missing-control`'
  ]) {
    assert(markdown.includes(url), `participant briefs missing SME fixture URL: ${url}`);
  }
}

function main() {
  validateParticipantBriefs();
  console.log('external validation participant briefs check passed: invitation scripts, answer-key guardrails, and handoff links are present');
}

if (require.main === module) {
  main();
}

module.exports = {
  expectedPlayerRows,
  requiredSections,
  requiredTexts,
  validateParticipantBriefs
};
