const {
  requiredCommands,
  requiredLaunchAids,
  requiredWarnings,
  validateExternalValidationPreflight
} = require('./external-validation-preflight-check');

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

const validPlan = [
  '# External Validation Sprint Plan',
  '## Roles',
  requiredWarnings.join('\n'),
  '## Session Order',
  '## Preflight',
  ...requiredCommands,
  ...requiredLaunchAids,
  '## Update Order'
].join('\n');

validateExternalValidationPreflight(validPlan);
console.log('pass fixture accepted: preflight contract');

expectFailure(
  'missing gap report command',
  () => validateExternalValidationPreflight(validPlan.replace('node tools/external-validation-gap-report.js', '')),
  'external validation preflight missing command: node tools/external-validation-gap-report.js'
);

expectFailure(
  'missing capture launch aid',
  () => validateExternalValidationPreflight(validPlan.replace('web-prototype/index.html?validation=capture', '')),
  'external validation preflight missing launch aid: web-prototype/index.html?validation=capture'
);

expectFailure(
  'missing anti-proxy warning',
  () => validateExternalValidationPreflight(validPlan.replace('Do not count screenshots', '')),
  'external validation preflight missing warning: Do not count screenshots'
);

expectFailure(
  'preflight before session order',
  () => validateExternalValidationPreflight(validPlan.replace('## Session Order\n## Preflight', '## Preflight\n## Session Order')),
  'Session Order must appear before Preflight'
);

console.log('external validation preflight self-test passed');
