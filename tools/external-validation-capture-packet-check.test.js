const {
  requiredSections,
  requiredTexts,
  validateCapturePacket
} = require('./external-validation-capture-packet-check');

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

const validPacket = [
  '# Fly-Lab Session Capture Packet',
  ...requiredSections,
  ...requiredTexts,
  '#35 #36 #37 #38 #39'
].join('\n');

validateCapturePacket(validPacket);
console.log('pass fixture accepted: capture packet contract');

expectFailure(
  'missing exact phrase rule',
  () => validateCapturePacket(validPacket.replace('Record exact phrases before interpreting them.', '')),
  'capture packet missing required text: Record exact phrases before interpreting them.'
);

expectFailure(
  'missing full live wrapper',
  () => validateCapturePacket(validPacket.replace('node tools/external-validation-full-check.js --live-issues', 'node tools/external-validation-full-check.js')),
  'capture packet missing required text: node tools/external-validation-full-check.js --live-issues'
);

expectFailure(
  'missing issue-specific packet link',
  () => validateCapturePacket(validPacket.replace('Issue-specific packets | `docs/external-validation-session-packets.md` #35 through #39', '')),
  'capture packet missing required text: Issue-specific packets'
);

expectFailure(
  'sections out of order',
  () => validateCapturePacket(validPacket.replace('# Fly-Lab Session Capture Packet\n', '# Fly-Lab Session Capture Packet\n## Closure Warning\n')),
  'capture packet section out of order'
);

console.log('external validation capture packet self-test passed');
