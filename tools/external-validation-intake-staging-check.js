const fs = require('fs');
const path = require('path');

const root = process.cwd();

const requiredSections = [
  '## Staging Rules',
  '## #35 LE Staging',
  '## #36-#38 Player Staging',
  '## #39 SME Staging',
  '## Copy Gate',
  '## Current Decision'
];

const requiredTexts = [
  'This staging sheet is not evidence by itself.',
  'Do not raise accepted counts from this document, screenshots, smoke tests, implementer walkthroughs, issue comments, or packet visibility.',
  'Paste exact phrases before summary language.',
  'Keep #27 lived-experience rows separate from #33 player and SME rows.',
  'Leave accepted count fields unchanged until all target docs are updated and `node tools/external-validation-full-check.js --live-issues` passes.',
  'Reject or restage any row that depends on screenshots, smoke tests, implementer walkthroughs, or coached interpretation.',
  '`LE-01` through `LE-05`',
  '`P-01`, `P-02`, `P-03`',
  '`SME-01`',
  'clean, dirty, missing-control',
  'stock/vial/calendar, virgin/cross timing, CO2/sorting, negative geotaxis, record/reviewer logic',
  'Compare staged rows against `docs/external-validation-launch-matrix.md`.',
  'Open or link concrete follow-up issues for every `Fix` or `Cut` row before counting it.',
  'Keep #27, #33, and the thread goal open until staging has been converted into accepted non-proxy evidence rows, target docs match, and the full live check passes.'
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

function tableRows(markdown, prefix) {
  return markdown.split(/\r?\n/)
    .filter(line => line.startsWith(`| ${prefix}`))
    .map(cells);
}

function validateIntakeStaging(markdown = read('docs/external-validation-intake-staging.md')) {
  for (const text of requiredTexts) {
    assert(markdown.includes(text), `intake staging missing required text: ${text}`);
  }

  let previousIndex = -1;
  for (const section of requiredSections) {
    const index = markdown.indexOf(section);
    assert(index !== -1, `intake staging missing required section: ${section}`);
    assert(index > previousIndex, `intake staging section out of order: ${section}`);
    previousIndex = index;
  }

  const leRows = tableRows(markdown, 'LE-');
  assert(leRows.length === 5, `intake staging expected five LE rows, got ${leRows.length}`);
  leRows.forEach((row, index) => {
    const expected = `LE-${String(index + 1).padStart(2, '0')}`;
    assert(row[0] === expected, `intake staging expected ${expected}, got ${row[0]}`);
    assert(row.length === 10, `${expected} staging row must keep source phrase plus seven evidence fields and copy-ready flag`);
  });

  const playerRows = tableRows(markdown, 'P-');
  assert(playerRows.length === 3, `intake staging expected three P rows, got ${playerRows.length}`);
  const expectedPlayers = [
    ['P-01', '#36', 'clean'],
    ['P-02', '#37', 'dirty'],
    ['P-03', '#38', 'missing-control']
  ];
  expectedPlayers.forEach(([id, issue, route], index) => {
    const row = playerRows[index];
    assert(row[0] === id, `intake staging expected ${id}, got ${row[0]}`);
    assert(row[1] === issue, `${id} staging issue expected ${issue}, got ${row[1]}`);
    assert(row[2] === route, `${id} staging route expected ${route}, got ${row[2]}`);
    assert(row.length === 11, `${id} staging row must keep route, three phrases, completion, intervention, decision, follow-up, and copy-ready flag`);
  });

  const smeRows = tableRows(markdown, 'SME-');
  assert(smeRows.length === 1, `intake staging expected one SME row, got ${smeRows.length}`);
  assert(smeRows[0][0] === 'SME-01', `intake staging expected SME-01, got ${smeRows[0][0]}`);
  assert(smeRows[0][1] === 'clean, dirty, missing-control', 'SME-01 staging row must preserve all fixture coverage');
  assert(smeRows[0].length === 10, 'SME-01 staging row must keep fixture coverage, five ratings, decision, follow-up, and copy-ready flag');
}

function main() {
  validateIntakeStaging();
  console.log('external validation intake staging check passed: raw-to-ledger staging rows and anti-proxy rules are present');
}

if (require.main === module) {
  main();
}

module.exports = {
  requiredSections,
  requiredTexts,
  validateIntakeStaging
};
