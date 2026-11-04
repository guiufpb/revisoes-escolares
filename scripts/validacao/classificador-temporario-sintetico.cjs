'use strict';

const { validateEvidence, validTime } = require('./evidencia-organizacao.cjs');
const {
  CLASS_ID,
  PRODUCER_ID,
  SCENARIO_ID,
  identity,
  generateCounter,
  digest,
} = require('./harness-temporario-sintetico.cjs');
const FACTS = ['resource-exists', 'resource-type', 'resource-git'];
const UNKNOWN = [
  'working-tree-changes',
  'stashes',
  'consumers',
  'directory-contents',
  'regenerability',
  'redundancy',
  'history-completeness',
];
const REASONS = Object.freeze({
  'evidence-missing': 'Faltam evidências obrigatórias; a lacuna permanece desconhecida.',
  'evidence-incompatible': 'O conjunto de evidências não corresponde ao contrato conhecido.',
  'context-incompatible': 'O contexto independente do harness está ausente ou incompatível.',
  'outside-class': 'A finalidade ou classe informada está fora da única classe reconhecida.',
  'producer-unknown': 'O produtor não é o produtor previsto no cenário fechado.',
  'identity-mismatch': 'A identidade ou o escopo diverge do contexto independente.',
  'artifact-integrity-mismatch': 'Conteúdo ou digest diverge da receita sintética conhecida.',
  'regeneration-not-demonstrated': 'As duas regenerações da receita não foram demonstradas.',
  'lifecycle-incompatible': 'O histórico do harness contém eventos conflitantes ou desconhecidos.',
  'dependency-unresolved': 'Há consumidor ativo ou liberação não comprovada no cenário fechado.',
  'lifecycle-incomplete': 'A execução e o encerramento do cenário não estão completos.',
  'inspection-blocked': 'A inspeção foi recusada, parcial ou incompatível.',
  'inspection-incomplete': 'Faltam observações necessárias do recurso.',
  'inspection-conflict': 'Há conflito de identidade, integridade ou procedência na inspeção.',
  'outside-resource-kind': 'O recurso observado não é um arquivo presente da classe sintética.',
  'resource-tracked': 'O índice indica recurso rastreado; reconhecimento favorável bloqueado.',
  'closed-synthetic-class-recognized':
    'Todas as provas coincidem no cenário sintético fechado; isso não autoriza exclusão.',
});
function shape(value, keys) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype &&
    Object.keys(value).every((key) => keys.includes(key))
  );
}
function sameArray(a, b) {
  return Array.isArray(a) && a.length === b.length && a.every((v, i) => v === b[i]);
}

function classifySynthetic(input, context) {
  const result = {
    classificationVersion: 1,
    status: 'indeterminate',
    targetClass: CLASS_ID,
    subjectId: null,
    codes: [],
    explanations: [],
    basis: [],
    unknown: [...UNKNOWN, 'real-world-origin', 'external-consumers', 'current-filesystem-state'],
    cleanupAuthorization: 'none',
  };
  const finish = (status, code) => {
    result.status = status;
    result.codes = [code];
    result.explanations = [REASONS[code]];
    return result;
  };
  if (
    !shape(context, ['scenarioId', 'runId', 'observedAt']) ||
    context.scenarioId !== SCENARIO_ID ||
    typeof context.observedAt !== 'string' ||
    context.observedAt.length !== 20 ||
    !validTime(context.observedAt)
  )
    return finish('blocked', 'context-incompatible');
  let ids;
  try {
    ids = identity(context.runId);
  } catch {
    return finish('blocked', 'context-incompatible');
  }
  result.subjectId = ids.resourceId;
  if (input === null || input === undefined) return finish('indeterminate', 'evidence-missing');
  if (!shape(input, ['proof', 'inspection'])) return finish('blocked', 'evidence-incompatible');
  const proof = input.proof;
  if (proof === null || proof === undefined) return finish('indeterminate', 'evidence-missing');
  const fields = [
    'harnessVersion',
    'scenarioId',
    'classId',
    'producerId',
    'runId',
    'scopeId',
    'resourceId',
    'purpose',
    'artifact',
    'regeneration',
    'lifecycle',
  ];
  if (!shape(proof, fields)) return finish('blocked', 'evidence-incompatible');
  if (fields.some((field) => proof[field] === undefined || proof[field] === null))
    return finish('indeterminate', 'evidence-missing');
  if (
    !['scenarioId', 'classId', 'producerId', 'runId', 'scopeId', 'resourceId', 'purpose'].every(
      (key) => typeof proof[key] === 'string' && proof[key].length <= 100
    )
  )
    return finish('blocked', 'evidence-incompatible');
  if (proof.harnessVersion !== 1) return finish('blocked', 'evidence-incompatible');
  if (proof.classId !== CLASS_ID || proof.purpose !== 'test-only-ephemeral')
    return finish('not-recognized', 'outside-class');
  if (proof.producerId !== PRODUCER_ID) return finish('blocked', 'producer-unknown');
  if (
    proof.scenarioId !== SCENARIO_ID ||
    !['runId', 'scopeId', 'resourceId'].every((key) => proof[key] === ids[key])
  )
    return finish('blocked', 'identity-mismatch');
  result.basis.push(
    'known-synthetic-producer',
    'exact-scope-and-identity',
    'predefined-temporary-purpose'
  );
  const artifact = proof.artifact;
  if (
    !shape(artifact, ['content', 'sha256']) ||
    typeof artifact.content !== 'string' ||
    artifact.content.length > 256 ||
    typeof artifact.sha256 !== 'string'
  )
    return finish('blocked', 'evidence-incompatible');
  const expectedContent = generateCounter(context.runId);
  const expectedHash = digest(expectedContent);
  if (artifact.content !== expectedContent || artifact.sha256 !== expectedHash)
    return finish('blocked', 'artifact-integrity-mismatch');
  result.basis.push('recipe-and-content-integrity');
  const regen = proof.regeneration;
  if (
    !shape(regen, ['recipeId', 'attempts']) ||
    regen.recipeId !== 'counter-sequence-v1' ||
    !Array.isArray(regen.attempts) ||
    regen.attempts.length !== 2 ||
    !regen.attempts.every((v) => v === expectedHash)
  )
    return finish('blocked', 'regeneration-not-demonstrated');
  result.basis.push('two-matching-regenerations');
  const events = proof.lifecycle;
  if (!Array.isArray(events) || events.length > 8)
    return finish('blocked', 'lifecycle-incompatible');
  const steps = ['produce', 'acquire', 'release', 'finish'];
  let active = false;
  for (const [i, event] of events.entries()) {
    if (
      !shape(event, ['actor', 'step', 'resourceId']) ||
      event.resourceId !== ids.resourceId ||
      event.step !== steps[i] ||
      event.actor !== (i === 1 || i === 2 ? 'verifier' : 'producer')
    ) {
      if (active && event && event.step === 'finish')
        return finish('blocked', 'dependency-unresolved');
      return finish('blocked', 'lifecycle-incompatible');
    }
    if (event.step === 'acquire') active = true;
    if (event.step === 'release') active = false;
  }
  if (active) return finish('blocked', 'dependency-unresolved');
  if (events.length !== steps.length) return finish('indeterminate', 'lifecycle-incomplete');
  result.basis.push('closed-consumer-universe-replayed', 'verifier-released', 'scope-finished');
  const inspection = input.inspection;
  if (inspection === null || inspection === undefined)
    return finish('indeterminate', 'inspection-incomplete');
  if (
    !shape(inspection, [
      'adapterVersion',
      'source',
      'status',
      'sourceStatus',
      'sourceExitCode',
      'diagnostics',
      'resources',
      'unknown',
    ]) ||
    inspection.adapterVersion !== 1 ||
    inspection.source !== 'ORG.4D'
  )
    return finish('blocked', 'evidence-incompatible');
  if (
    inspection.status !== 'complete' ||
    inspection.sourceStatus !== 'complete' ||
    inspection.sourceExitCode !== 0
  )
    return finish('blocked', 'inspection-blocked');
  if (
    !sameArray(inspection.diagnostics, []) ||
    !sameArray(inspection.unknown, UNKNOWN) ||
    !Array.isArray(inspection.resources) ||
    inspection.resources.length > 100
  )
    return finish('blocked', 'evidence-incompatible');
  if (inspection.resources.length > 1) return finish('blocked', 'inspection-conflict');
  const matches = inspection.resources.filter((r) => r && r.subjectId === ids.resourceId);
  if (!matches.length) return finish('indeterminate', 'inspection-incomplete');
  if (matches.length !== 1) return finish('blocked', 'inspection-conflict');
  const row = matches[0];
  if (
    !shape(row, ['slot', 'subjectId', 'provenance', 'inspection', 'diagnostics', 'evidence']) ||
    row.slot !== 1 ||
    !sameArray(row.diagnostics, []) ||
    !sameArray(row.provenance, ['filesystem', 'git-index-or-ignore']) ||
    !shape(row.inspection, ['type', 'git', 'exists', 'bytes']) ||
    !Array.isArray(row.evidence) ||
    row.evidence.length !== 3
  )
    return finish('blocked', 'inspection-conflict');
  const byFact = new Map();
  for (const evidence of row.evidence) {
    if (
      !validateEvidence(evidence) ||
      evidence.source !== 'resource-observation' ||
      evidence.subject.id !== ids.resourceId ||
      !FACTS.includes(evidence.fact) ||
      byFact.has(evidence.fact)
    )
      return finish('blocked', 'inspection-conflict');
    byFact.set(evidence.fact, evidence);
  }
  if ([...byFact.values()].some((e) => e.knowledge !== 'observed' || e.value === null))
    return finish('indeterminate', 'inspection-incomplete');
  if ([...byFact.values()].some((e) => e.observedAt !== context.observedAt))
    return finish('blocked', 'inspection-conflict');
  const values = FACTS.map((fact) => byFact.get(fact).value);
  const meta = row.inspection;
  if (values[0] !== meta.exists || values[1] !== meta.type || values[2] !== meta.git)
    return finish('blocked', 'inspection-conflict');
  if (meta.exists !== true || meta.type !== 'file')
    return finish('not-recognized', 'outside-resource-kind');
  if (meta.git === 'tracked') return finish('blocked', 'resource-tracked');
  if (
    !['ignored', 'untracked'].includes(meta.git) ||
    meta.bytes !== Buffer.byteLength(expectedContent, 'utf8')
  )
    return finish('blocked', 'inspection-conflict');
  result.basis.push('complete-compatible-inspection', 'exact-observed-file-size');
  return finish('recognized', 'closed-synthetic-class-recognized');
}
module.exports = { classifySynthetic, REASONS };
