'use strict';

// Independent evidence contract. Does not load lifecycle records or their schema.
const Ajv = require('ajv');
const schema = require('../../validacao/evidencia-organizacao.schema.json');
const checkEvidence = new Ajv({ allErrors: false, ownProperties: true }).compile(schema);
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;

// This small envelope is also usable by independent resource collectors. It does
// not accept arbitrary record objects, cleanup permissions or free-form values.
function validateEvidence(value) {
  if (!checkEvidence(value)) return false;
  if (value.observedAt !== null && !validTime(value.observedAt)) return false;
  const lifecycle = ['purpose', 'task', 'phase', 'declaredState', 'location'];
  if (value.source === 'lifecycle-record') {
    if (
      value.subject.kind !== 'worktree' ||
      !UUID.test(value.subject.id) ||
      !lifecycle.includes(value.fact)
    )
      return false;
    if (value.value !== null) {
      const allowed =
        value.fact === 'phase'
          ? ['planning', 'implementation', 'validation', 'delivery', 'integration', 'closed']
          : value.fact === 'declaredState'
            ? ['active', 'paused', 'completed']
            : ['present'];
      if (!allowed.includes(value.value)) return false;
    }
  } else {
    if (value.subject.kind !== 'resource' || !value.fact.startsWith('resource-')) return false;
    const allowed = {
      'resource-exists': [true, false],
      'resource-type': ['file', 'directory', 'absent', 'other'],
      'resource-git': [
        'tracked',
        'ignored',
        'untracked',
        'indeterminate',
        'directory-contents-unverified',
      ],
    }[value.fact];
    if (value.value !== null && !allowed.includes(value.value)) return false;
  }
  if (value.knowledge === 'unknown') return value.value === null && value.observedAt === null;
  if (value.value === null || value.observedAt === null) return false;
  if (value.source === 'lifecycle-record')
    return value.knowledge === 'declared' && value.subject.kind === 'worktree';
  return value.knowledge === 'observed';
}

function validTime(value) {
  const time = new Date(value);
  return Number.isFinite(time.getTime()) && time.toISOString().replace('.000Z', 'Z') === value;
}

module.exports = { validateEvidence, validTime };
