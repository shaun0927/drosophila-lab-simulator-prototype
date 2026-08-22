const {
  buildSessionHandoff,
  expectedHandoffs
} = require('./external-validation-session-handoff');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function expectFailure(name, fn, expectedMessage) {
  try {
    fn();
  } catch (error) {
    assert(error.message.includes(expectedMessage), `${name} failed with unexpected message: ${error.message}`);
    console.log(`bad fixture rejected: ${name}`);
    return;
  }
  throw new Error(`${name} should have failed`);
}

const tracker = [
  '# Tracker',
  '',
  '| Issue | Required evidence row | Packet source | Target docs | Current proof | Missing proof before resolution |',
  '|---|---|---|---|---|---|',
  '| #35 | `LE-01` through `LE-05` | `docs/external-validation-session-packets.md` #35 section | `docs/fly-lab-external-evidence-ledger.md`, `docs/fly-lab-experience-map.md` | Issue open; packet exists; ledger rows pending | Real lived-experience answers, five accepted rows, at least one design-changing row or explicit no-experience closure path |',
  '| #36 | `P-01` clean | `docs/external-validation-session-packets.md` #36 section | `docs/fly-lab-external-evidence-ledger.md`, `docs/fly-lab-validation-results.md` | Issue open; packet exists; ledger row pending | Real fresh-player clean-route session, exact phrases, decision, any Fix/Cut follow-up disposition |',
  '| #37 | `P-02` dirty | `docs/external-validation-session-packets.md` #37 section | `docs/fly-lab-external-evidence-ledger.md`, `docs/fly-lab-validation-results.md` | Issue open; packet exists; ledger row pending | Real fresh-player dirty-route session, exact phrases, decision, any Fix/Cut follow-up disposition |',
  '| #38 | `P-03` missing-control | `docs/external-validation-session-packets.md` #38 section | `docs/fly-lab-external-evidence-ledger.md`, `docs/fly-lab-validation-results.md` | Issue open; packet exists; ledger row pending | Real fresh-player missing-control session, exact phrases, decision, any Fix/Cut follow-up disposition |',
  '| #39 | `SME-01` | `docs/external-validation-session-packets.md` #39 section | `docs/fly-lab-external-evidence-ledger.md`, `docs/fly-lab-validation-results.md` | Issue open; packet exists; ledger row pending | Real biology-aware review, clean/dirty/missing-control fixture coverage, five core ratings, any Fix/Cut follow-up disposition |'
].join('\n');

const packets = expectedHandoffs.map(item => item.packetHeading).join('\n');

const handoff = buildSessionHandoff({ tracker, packets });
assert(handoff.rows.length === 5, `handoff should have five rows, got ${handoff.rows.length}`);
assert(handoff.markdown.includes('Decision: use this handoff only to run sessions'), 'handoff must preserve non-evidence decision');
console.log('pass fixture accepted: session handoff contract');

expectFailure(
  'missing tracker row',
  () => buildSessionHandoff({ tracker: tracker.replace('| #38 | `P-03` missing-control', '| #40 | `P-03` missing-control'), packets }),
  'session handoff missing tracker row: #38'
);

expectFailure(
  'wrong packet source',
  () => buildSessionHandoff({ tracker: tracker.replace('`docs/external-validation-session-packets.md` #37 section', '`docs/external-validation-session-packets.md` #36 section'), packets }),
  '#37 handoff packet expected'
);

expectFailure(
  'missing target docs',
  () => buildSessionHandoff({ tracker: tracker.replace('`docs/fly-lab-external-evidence-ledger.md`, `docs/fly-lab-experience-map.md`', '`docs/fly-lab-external-evidence-ledger.md`'), packets }),
  '#35 handoff target docs missing'
);

expectFailure(
  'missing packet heading',
  () => buildSessionHandoff({ tracker, packets: packets.replace('## #39 Packet: EV5 SME-01 Biology-Aware Review', '') }),
  '#39 handoff packet heading missing'
);

console.log('external validation session handoff self-test passed');
