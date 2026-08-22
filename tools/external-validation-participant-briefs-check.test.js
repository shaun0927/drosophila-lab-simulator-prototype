const {
  validateParticipantBriefs
} = require('./external-validation-participant-briefs-check');

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

const validBriefs = [
  '# External Validation Participant Briefs',
  '',
  'These briefs are not evidence. Do not raise accepted counts from invitations, screenshots, smoke tests, implementer walkthroughs, or packet visibility.',
  '',
  '## Global Moderator Rules',
  '',
  '- Do not explain the goal, correct causal interpretation, or name clean/dirty/missing-control during the first 30 seconds of player sessions.',
  '- Do preserve exact phrases before paraphrasing.',
  '- Do not ask participants to validate screenshots; ask them to play, review, or answer from experience.',
  '- Do not count any row until `node tools/external-validation-full-check.js --live-issues` passes after the target docs are updated.',
  '',
  '## #35 Lived-Experience Invitation',
  '',
  'Use for: `LE-01` through `LE-05`.',
  'If you have no relevant firsthand or observed experience, saying that explicitly is also useful.',
  'Do not suggest Light-Induced Swarm Dance, optogenetics, or broad spectacle unless the participant brings it up as a real experience.',
  '',
  '## #36-#38 Fresh-Player Invitation',
  '',
  'Use for: `P-01` clean, `P-02` dirty, and `P-03` missing-control.',
  'Do not send the route meaning or answer key.',
  '',
  '| Issue | Row | URL | Do not reveal |',
  '|---|---|---|---|',
  '| #36 | `P-01` clean | `web-prototype/index.html?fixture=clean&validation=capture` | That this is the clean route |',
  '| #37 | `P-02` dirty | `web-prototype/index.html?fixture=dirty&validation=capture` | That CO2/dirty handling is the intended weakness |',
  '| #38 | `P-03` missing-control | `web-prototype/index.html?fixture=missing-control&validation=capture` | That missing control is the intended weakness |',
  '',
  'What caused the reviewer attack?',
  'What would you do differently in a second run?',
  '',
  '## #39 SME Reviewer Invitation',
  '',
  'Use for: `SME-01`.',
  '`web-prototype/index.html?fixture=clean`',
  '`web-prototype/index.html?fixture=dirty`',
  '`web-prototype/index.html?fixture=missing-control`',
  'stock/vial/calendar, virgin/cross timing, CO2/sorting, negative geotaxis, and record/reviewer logic',
  '`Accurate enough`',
  '`Acceptable simplification`',
  '`Misleading`',
  '`Unsafe/ethically wrong`',
  '',
  '## Drift Checks',
  '',
  'Do not close #27, #33, or the thread goal from completed invitations.'
].join('\n');

validateParticipantBriefs(validBriefs);
console.log('pass fixture accepted: participant briefs contract');

expectFailure(
  'missing non-evidence warning',
  () => validateParticipantBriefs(validBriefs.replace('These briefs are not evidence.', 'These briefs count as evidence.')),
  'participant briefs missing required text'
);

expectFailure(
  'answer key leaked',
  () => validateParticipantBriefs(validBriefs.replace('Do not send the route meaning or answer key.', 'Send the route meaning.')),
  'participant briefs missing required text'
);

expectFailure(
  'wrong dirty URL',
  () => validateParticipantBriefs(validBriefs.replace('`web-prototype/index.html?fixture=dirty&validation=capture`', '`web-prototype/index.html?fixture=dirty`')),
  '#37 player URL expected'
);

expectFailure(
  'missing player route row',
  () => validateParticipantBriefs(validBriefs.replace('| #38 | `P-03` missing-control | `web-prototype/index.html?fixture=missing-control&validation=capture` | That missing control is the intended weakness |', 'That missing control is the intended weakness')),
  'participant briefs expected three player route rows'
);

expectFailure(
  'missing SME fixture URL',
  () => validateParticipantBriefs(validBriefs.replace('`web-prototype/index.html?fixture=missing-control`', '`web-prototype/index.html?fixture=control`')),
  'participant briefs missing SME fixture URL'
);

console.log('external validation participant briefs self-test passed');
