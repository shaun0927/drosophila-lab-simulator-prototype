const fs = require('fs');
const path = require('path');

const root = process.cwd();

const expectedHandoffs = [
  {
    issue: '#35',
    row: '`LE-01` through `LE-05`',
    packet: '`docs/external-validation-session-packets.md` #35 section',
    targetDocs: ['`docs/fly-lab-external-evidence-ledger.md`', '`docs/fly-lab-experience-map.md`'],
    packetHeading: '## #35 Packet: EV1 Lived-Experience Interview',
    missingProof: 'Real lived-experience answers'
  },
  {
    issue: '#36',
    row: '`P-01` clean',
    packet: '`docs/external-validation-session-packets.md` #36 section',
    targetDocs: ['`docs/fly-lab-external-evidence-ledger.md`', '`docs/fly-lab-validation-results.md`'],
    packetHeading: '## #36 Packet: EV2 P-01 Clean Route',
    missingProof: 'Real fresh-player clean-route session'
  },
  {
    issue: '#37',
    row: '`P-02` dirty',
    packet: '`docs/external-validation-session-packets.md` #37 section',
    targetDocs: ['`docs/fly-lab-external-evidence-ledger.md`', '`docs/fly-lab-validation-results.md`'],
    packetHeading: '## #37 Packet: EV3 P-02 Dirty Route',
    missingProof: 'Real fresh-player dirty-route session'
  },
  {
    issue: '#38',
    row: '`P-03` missing-control',
    packet: '`docs/external-validation-session-packets.md` #38 section',
    targetDocs: ['`docs/fly-lab-external-evidence-ledger.md`', '`docs/fly-lab-validation-results.md`'],
    packetHeading: '## #38 Packet: EV4 P-03 Missing-Control Route',
    missingProof: 'Real fresh-player missing-control session'
  },
  {
    issue: '#39',
    row: '`SME-01`',
    packet: '`docs/external-validation-session-packets.md` #39 section',
    targetDocs: ['`docs/fly-lab-external-evidence-ledger.md`', '`docs/fly-lab-validation-results.md`'],
    packetHeading: '## #39 Packet: EV5 SME-01 Biology-Aware Review',
    missingProof: 'Real biology-aware review'
  }
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

function parseTrackerHandoffs(markdown) {
  const rows = new Map();
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.startsWith('| #') || line.includes('---')) continue;
    const row = cells(line);
    if (row.length !== 6 || row[0] === 'Issue') continue;
    rows.set(row[0], {
      issue: row[0],
      row: row[1],
      packet: row[2],
      targetDocs: row[3],
      currentProof: row[4],
      missingProof: row[5]
    });
  }
  return rows;
}

function buildSessionHandoff({
  tracker = read('docs/external-validation-execution-tracker.md'),
  packets = read('docs/external-validation-session-packets.md')
} = {}) {
  const trackerRows = parseTrackerHandoffs(tracker);
  const rows = [];

  for (const expected of expectedHandoffs) {
    const row = trackerRows.get(expected.issue);
    assert(row, `session handoff missing tracker row: ${expected.issue}`);
    assert(row.row === expected.row, `${expected.issue} handoff row expected ${expected.row}, got ${row.row}`);
    assert(row.packet === expected.packet, `${expected.issue} handoff packet expected ${expected.packet}, got ${row.packet}`);
    for (const target of expected.targetDocs) {
      assert(row.targetDocs.includes(target), `${expected.issue} handoff target docs missing ${target}`);
    }
    assert(row.missingProof.includes(expected.missingProof), `${expected.issue} handoff missing proof phrase: ${expected.missingProof}`);
    assert(packets.includes(expected.packetHeading), `${expected.issue} handoff packet heading missing: ${expected.packetHeading}`);
    rows.push({
      issue: expected.issue,
      row: expected.row,
      packet: expected.packet,
      targetDocs: row.targetDocs,
      missingProof: row.missingProof
    });
  }

  const markdown = [
    '# External Validation Session Handoff',
    '',
    '| Issue | Evidence row | Packet source | Target docs | Missing proof |',
    '|---|---|---|---|---|',
    ...rows.map(row => `| ${row.issue} | ${row.row} | ${row.packet} | ${row.targetDocs} | ${row.missingProof} |`),
    '',
    'Decision: use this handoff only to run sessions; it is not evidence and must not raise accepted counts.'
  ].join('\n');

  return { rows, markdown };
}

function main() {
  const handoff = buildSessionHandoff();
  console.log(handoff.markdown);
  console.log('');
  console.log(`external validation session handoff passed: ${handoff.rows.length} execution issue handoff row(s) verified`);
}

if (require.main === module) {
  main();
}

module.exports = {
  buildSessionHandoff,
  expectedHandoffs,
  parseTrackerHandoffs
};
