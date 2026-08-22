const fs = require('fs');
const path = require('path');

const root = process.cwd();

const expectedRows = [
  {
    issue: '#35',
    evidenceRow: '`LE-01` through `LE-05`',
    url: '`web-prototype/index.html?validation=lived`',
    packet: '`docs/external-validation-session-packets.md` #35 packet',
    targetDocs: ['`docs/fly-lab-external-evidence-ledger.md`', '`docs/fly-lab-experience-map.md`'],
    countRule: 'Five accepted `LE-*` rows exist'
  },
  {
    issue: '#36',
    evidenceRow: '`P-01` clean',
    url: '`web-prototype/index.html?fixture=clean&validation=capture`',
    packet: '`docs/external-validation-session-packets.md` #36 packet',
    targetDocs: ['`docs/fly-lab-external-evidence-ledger.md`', '`docs/fly-lab-validation-results.md`'],
    countRule: 'player connects the record to the reviewer finding'
  },
  {
    issue: '#37',
    evidenceRow: '`P-02` dirty',
    url: '`web-prototype/index.html?fixture=dirty&validation=capture`',
    packet: '`docs/external-validation-session-packets.md` #37 packet',
    targetDocs: ['`docs/fly-lab-external-evidence-ledger.md`', '`docs/fly-lab-validation-results.md`'],
    countRule: 'dirty failure reads as experimental-record weakness'
  },
  {
    issue: '#38',
    evidenceRow: '`P-03` missing-control',
    url: '`web-prototype/index.html?fixture=missing-control&validation=capture`',
    packet: '`docs/external-validation-session-packets.md` #38 packet',
    targetDocs: ['`docs/fly-lab-external-evidence-ledger.md`', '`docs/fly-lab-validation-results.md`'],
    countRule: 'player identifies the missing control as a weak experimental claim'
  },
  {
    issue: '#39',
    evidenceRow: '`SME-01`',
    url: '`web-prototype/index.html?fixture=clean`, `web-prototype/index.html?fixture=dirty`, `web-prototype/index.html?fixture=missing-control`',
    packet: '`docs/external-validation-session-packets.md` #39 packet',
    targetDocs: ['`docs/fly-lab-external-evidence-ledger.md`', '`docs/fly-lab-validation-results.md`'],
    countRule: 'reviewer covers all three fixtures'
  }
];

const requiredTexts = [
  'This matrix is not evidence. It is an execution aid.',
  'Do not raise accepted counts from this document, screenshots, smoke tests, implementer walkthroughs, or packet visibility.',
  'node tools/external-validation-full-check.js --live-issues',
  'node tools/external-validation-session-handoff.js',
  'node tools/external-validation-gap-report.js',
  'Screenshots cannot fill `LE-*`, `P-*`, or `SME-*` rows.',
  'Do not use #27 or #33 as a counted Fix/Cut follow-up issue.',
  'Keep #27, #33, and the thread goal open until the launch matrix produces accepted non-proxy evidence rows and the full check passes.'
];

const requiredSections = [
  '## Preflight',
  '## Launch Matrix',
  '## Moderator Rules',
  '## Intake Handoff',
  '## Current Decision'
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

function parseLaunchRows(markdown) {
  const rows = new Map();
  for (const line of markdown.split(/\r?\n/)) {
    if (!/^\|\s*\d+\s*\|\s*#/.test(line)) continue;
    const row = cells(line);
    if (row.length !== 8) continue;
    rows.set(row[1], {
      order: row[0],
      issue: row[1],
      evidenceRow: row[2],
      participant: row[3],
      url: row[4],
      packet: row[5],
      targetDocs: row[6],
      countRule: row[7]
    });
  }
  return rows;
}

function validateLaunchMatrix(markdown = read('docs/external-validation-launch-matrix.md')) {
  for (const text of requiredTexts) {
    assert(markdown.includes(text), `launch matrix missing required text: ${text}`);
  }

  let previousIndex = -1;
  for (const section of requiredSections) {
    const index = markdown.indexOf(section);
    assert(index !== -1, `launch matrix missing required section: ${section}`);
    assert(index > previousIndex, `launch matrix section out of order: ${section}`);
    previousIndex = index;
  }

  const rows = parseLaunchRows(markdown);
  assert(rows.size === expectedRows.length, `launch matrix expected ${expectedRows.length} rows, got ${rows.size}`);

  expectedRows.forEach((expected, index) => {
    const row = rows.get(expected.issue);
    assert(row, `launch matrix missing issue row: ${expected.issue}`);
    assert(row.order === String(index + 1), `${expected.issue} launch order expected ${index + 1}, got ${row.order}`);
    assert(row.evidenceRow === expected.evidenceRow, `${expected.issue} evidence row expected ${expected.evidenceRow}, got ${row.evidenceRow}`);
    assert(row.url === expected.url, `${expected.issue} launch URL expected ${expected.url}, got ${row.url}`);
    assert(row.packet === expected.packet, `${expected.issue} packet expected ${expected.packet}, got ${row.packet}`);
    expected.targetDocs.forEach(target => {
      assert(row.targetDocs.includes(target), `${expected.issue} target docs missing ${target}`);
    });
    assert(row.countRule.includes(expected.countRule), `${expected.issue} count rule missing ${expected.countRule}`);
  });
}

function main() {
  validateLaunchMatrix();
  console.log('external validation launch matrix check passed: issue, URL, packet, target-doc, and non-proxy rules are present');
}

if (require.main === module) {
  main();
}

module.exports = {
  expectedRows,
  parseLaunchRows,
  requiredSections,
  requiredTexts,
  validateLaunchMatrix
};
