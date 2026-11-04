'use strict';
const { classifySynthetic } = require('./classificador-temporario-sintetico.cjs');
const { identity } = require('./harness-temporario-sintetico.cjs');
const STATUSES = ['recognized', 'not-recognized', 'indeterminate', 'blocked'];
const CHECKS = Object.freeze([
  'authenticate-physical-producer',
  'bind-physical-identity-and-content',
  'revalidate-current-state-without-links',
  'prove-physical-regeneration',
  'resolve-external-consumers',
  'verify-reversible-recovery',
  'obtain-explicit-maintenance-authorization',
]);
const MESSAGES = Object.freeze({
  'batch-incompatible': 'Lote ausente, incompatível ou além do limite de 100 recursos.',
  'resource-incompatible': 'A entrada do recurso não corresponde ao contrato do simulador.',
  'resource-binding-conflict':
    'Identidade ou escopo diverge entre manifesto, contexto e evidências.',
  'duplicate-identity-or-scope': 'Mais de uma entrada reivindica a mesma identidade ou escopo.',
  'classification-incompatible': 'O resultado do classificador não é compatível com a simulação.',
});
function shape(value, keys) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype &&
    Object.keys(value).every((k) => keys.includes(k))
  );
}
function id(value) {
  return typeof value === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(value);
}

function simulateSyntheticBatch(batch) {
  const report = {
    simulationVersion: 1,
    status: 'rejected',
    cleanupAuthorization: 'none',
    diagnostics: [],
    resources: [],
    summary: {
      submittedCount: null,
      assessedCount: 0,
      counts: Object.fromEntries(STATUSES.map((s) => [s, 0])),
      knownSyntheticBytes: 0,
      resourcesWithKnownSize: 0,
      resourcesWithUnknownSize: 0,
      realReclaimableBytes: null,
    },
    requiredChecks: [...CHECKS],
  };
  const diagnostic = (code) => ({ code, explanation: MESSAGES[code] });
  if (
    !shape(batch, ['batchVersion', 'resources']) ||
    batch.batchVersion !== 1 ||
    !Array.isArray(batch.resources) ||
    batch.resources.length > 100
  ) {
    report.diagnostics.push(diagnostic('batch-incompatible'));
    return report;
  }
  report.summary.submittedCount = batch.resources.length;
  const aliases = new Map();
  const claim = (kind, value, slot) => {
    if (!id(value)) return;
    const key = kind + ':' + value,
      owners = aliases.get(key) || new Set();
    owners.add(slot);
    aliases.set(key, owners);
  };
  for (const [index, item] of batch.resources.entries()) {
    const row = {
      slot: index + 1,
      resourceId: null,
      scopeId: null,
      status: 'blocked',
      classification: null,
      diagnostics: [],
      syntheticBytes: null,
      cleanupAuthorization: 'none',
    };
    report.resources.push(row);
    const fail = (code) => {
      row.status = 'blocked';
      row.syntheticBytes = null;
      row.diagnostics.push(diagnostic(code));
    };
    // Reserve aliases even for invalid entries; malformed duplicates cannot validate peers.
    if (item && typeof item === 'object') {
      claim('resource', item.resourceId, index);
      claim('scope', item.scopeId, index);
      const proof = item.input && item.input.proof;
      if (proof && typeof proof === 'object') {
        claim('resource', proof.resourceId, index);
        claim('scope', proof.scopeId, index);
        if (Array.isArray(proof.lifecycle) && proof.lifecycle.length <= 8)
          for (const event of proof.lifecycle)
            if (event) claim('resource', event.resourceId, index);
      }
      const observed = item.input && item.input.inspection && item.input.inspection.resources;
      if (Array.isArray(observed) && observed.length <= 100)
        for (const r of observed)
          if (r) {
            claim('resource', r.subjectId, index);
            if (Array.isArray(r.evidence) && r.evidence.length <= 3)
              for (const e of r.evidence)
                if (e && e.subject) claim('resource', e.subject.id, index);
          }
      for (const source of [item.context, proof]) {
        try {
          const expected = identity(source && source.runId);
          claim('resource', expected.resourceId, index);
          claim('scope', expected.scopeId, index);
        } catch {
          /* Identity remains unknown; the classifier handles invalid context. */
        }
      }
    }
    if (
      !shape(item, ['resourceId', 'scopeId', 'input', 'context']) ||
      !id(item.resourceId) ||
      !id(item.scopeId)
    ) {
      fail('resource-incompatible');
      continue;
    }
    row.resourceId = item.resourceId;
    row.scopeId = item.scopeId;
    const classification = classifySynthetic(item.input, item.context);
    if (
      !classification ||
      classification.classificationVersion !== 1 ||
      !STATUSES.includes(classification.status) ||
      classification.cleanupAuthorization !== 'none'
    ) {
      fail('classification-incompatible');
      continue;
    }
    row.classification = classification;
    row.status = classification.status;
    let expected;
    try {
      expected = identity(item.context && item.context.runId);
    } catch {
      continue;
    }
    const proof = item.input && item.input.proof;
    if (
      item.resourceId !== expected.resourceId ||
      item.scopeId !== expected.scopeId ||
      (proof &&
        ['resourceId', 'scopeId', 'runId'].some(
          (k) => proof[k] !== undefined && proof[k] !== null && proof[k] !== expected[k]
        ))
    ) {
      fail('resource-binding-conflict');
      continue;
    }
    // Size is trusted only after the existing classifier has proved content/metadata
    // agreement. Negative/ambiguous evidence never contributes to byte totals.
    if (row.status === 'recognized')
      row.syntheticBytes = item.input.inspection.resources[0].inspection.bytes;
  }
  const duplicated = new Set();
  for (const owners of aliases.values())
    if (owners.size > 1) for (const owner of owners) duplicated.add(owner);
  for (const index of duplicated) {
    const row = report.resources[index];
    row.status = 'blocked';
    row.syntheticBytes = null;
    row.diagnostics.push(diagnostic('duplicate-identity-or-scope'));
  }
  for (const row of report.resources) {
    report.summary.counts[row.status]++;
    if (row.syntheticBytes === null) report.summary.resourcesWithUnknownSize++;
    else {
      report.summary.knownSyntheticBytes += row.syntheticBytes;
      report.summary.resourcesWithKnownSize++;
    }
  }
  report.summary.assessedCount = report.resources.length;
  report.status = report.summary.counts.blocked ? 'with-blocks' : 'evaluated';
  return report;
}
module.exports = { simulateSyntheticBatch };
