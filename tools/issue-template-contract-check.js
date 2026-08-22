const fs = require('fs');
const path = require('path');

const contracts = {
  '.github/ISSUE_TEMPLATE/fly_lab_validation_finding.yml': [
    ['source', 'Finding source'],
    ['route', 'Route or fixture'],
    ['evidence', 'Observed evidence'],
    ['affected_mechanic', 'Affected mechanic'],
    ['severity', 'Severity'],
    ['goal', 'Goal'],
    ['final_implementation_scope', 'Final Implementation Scope'],
    ['success_criteria', 'Success Criteria'],
    ['verification_method', 'Verification Method'],
    ['guardrails', 'Guardrails'],
    ['explicit_non_goals', 'Explicit Non-Goals'],
    ['implementation_approach', 'Implementation Approach'],
    ['pr_decomposition', 'PR Decomposition'],
    ['over_engineering_checklist', 'Over-Engineering Checklist'],
    ['drift_prevention_checklist', 'Drift-Prevention Checklist'],
    ['definition_of_done', 'Definition of Done']
  ],
  '.github/ISSUE_TEMPLATE/fly_lab_lived_experience.yml': [
    ['provenance', 'Provenance'],
    ['incident', 'Concrete incident'],
    ['game_verb', 'Game verb'],
    ['failure_consequence', 'Failure mode and delayed consequence'],
    ['sme_risk', 'SME risk'],
    ['map_update', 'Proposed update to docs/fly-lab-experience-map.md'],
    ['implementation_scope', 'Final Implementation Scope'],
    ['goal', 'Goal'],
    ['success_criteria', 'Success Criteria'],
    ['verification_method', 'Verification Method'],
    ['guardrails', 'Guardrails'],
    ['explicit_non_goals', 'Explicit Non-Goals'],
    ['implementation_approach', 'Implementation Approach'],
    ['pr_decomposition', 'PR Decomposition'],
    ['over_engineering_checklist', 'Over-Engineering Checklist'],
    ['drift_prevention_checklist', 'Drift-Prevention Checklist'],
    ['definition_of_done', 'Definition of Done']
  ]
};

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function parseFields(markdown) {
  const fields = [];
  let current = null;

  for (const line of markdown.split(/\r?\n/)) {
    if (/^  - type: /.test(line)) {
      if (current) fields.push(current);
      current = { id: null, label: null, required: false };
      continue;
    }

    if (!current) continue;

    const id = line.match(/^    id: (.+)$/);
    if (id) {
      current.id = id[1].trim();
      continue;
    }

    const label = line.match(/^      label: (.+)$/);
    if (label) {
      current.label = label[1].trim();
      continue;
    }

    if (/^      required: true$/.test(line)) {
      current.required = true;
    }
  }

  if (current) fields.push(current);
  return fields.filter(field => field.id);
}

function validateTemplate(rel, requiredFields) {
  const fullPath = path.join(process.cwd(), rel);
  const fields = parseFields(fs.readFileSync(fullPath, 'utf8'));
  const byId = new Map();

  for (const field of fields) {
    assert(!byId.has(field.id), `${rel} has duplicate issue-form id: ${field.id}`);
    byId.set(field.id, field);
  }

  for (const [id, label] of requiredFields) {
    const field = byId.get(id);
    assert(field, `${rel} missing required issue-form id: ${id}`);
    assert(field.label === label, `${rel} issue-form id ${id} must have label "${label}", got "${field.label}"`);
    assert(field.required, `${rel} issue-form id ${id} must be required`);
  }
}

function runCli() {
  for (const [rel, requiredFields] of Object.entries(contracts)) {
    validateTemplate(rel, requiredFields);
  }
  console.log('issue template contract check passed: evidence follow-up forms require scoped implementation fields');
}

if (require.main === module) {
  runCli();
}

module.exports = {
  parseFields,
  validateTemplate
};
