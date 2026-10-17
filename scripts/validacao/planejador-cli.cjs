'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {
  ROOT,
  readJson,
  MANIFEST,
  validateRepository,
  discover,
  digest,
} = require('./manifesto.cjs');
const { provenance } = require('./identidade.cjs');
const { collectComparison, gitRepository } = require('./planejador-git.cjs');
const { makePlan } = require('./planejador.cjs');
const { comparePlan } = require('./planejador-comparacao.cjs');
const { composeAddition, loadReview, reviewStable } = require('./planejador-composicao.cjs');

function options(args, names) {
  const result = {};
  for (let i = 0; i < args.length; i += 2) {
    const name = args[i]?.replace(/^--/, '');
    if (!args[i]?.startsWith('--') || !names.includes(name) || !args[i + 1] || result[name])
      throw new Error('Unknown, duplicate or incomplete option: ' + args[i]);
    result[name] = args[i + 1];
  }
  return result;
}
function writeResult(root, kind, result, summary) {
  const id = new Date().toISOString().replace(/[:.]/g, '-') + '-' + crypto.randomUUID();
  const directory = path.join(root, 'tmp/validacao/planejador', id);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, kind + '.json'), JSON.stringify(result, null, 2) + '\n');
  fs.writeFileSync(path.join(directory, kind + '.md'), summary + '\n');
  console.log(summary + '\n\nArquivo: ' + path.join(directory, kind + '.json'));
  return directory;
}
function summarizePlan(plan) {
  return [
    '# Plano observacional de testes',
    '',
    '**Resultado: ' + plan.result + '**. Execução real permanece global.',
    'Manifesto: ' +
      (plan.manifest?.version || 'indisponível') +
      '; planejador: ' +
      plan.plannerVersion +
      '.',
    'Comparação: ' + plan.comparison.mode + '; base: ' + plan.comparison.base.commit + '.',
    'Disponíveis: ' +
      (plan.available?.caseCount ?? 'indisponível') +
      '; propostos: ' +
      (plan.proposed?.caseCount ?? 'inválido') +
      '; omitidos: ' +
      plan.omitted.length +
      '.',
    '',
    ...plan.changes.map(
      (c) =>
        '- ' +
        (c.previousPath || '(novo)') +
        ' → ' +
        (c.currentPath || '(excluído)') +
        ': ' +
        c.risk +
        ', ' +
        c.rule +
        '. ' +
        c.basis
    ),
    '',
    ...[...(plan.errors || []), ...(plan.fallbackReasons || [])].map(
      (reason) => '- Diagnóstico: ' + reason
    ),
    '',
    ...(plan.warnings || []).map((warning) => '- ' + warning),
  ].join('\n');
}
function planRepository(root, input, onAdditionEvidence = () => {}, compositionOptions = {}) {
  const repository = gitRepository(root);
  const collected = collectComparison(root, input, repository);
  // Reject candidate sources AND test declarations before VM observation/discovery.
  // This guard is not a sandbox and never changes the existing risk rules.
  const baseInfo = {
    kind: 'git-commit',
    commit: collected.comparison.base.commit,
    tree: repository.git('rev-parse', collected.comparison.base.commit + '^{tree}').trim(),
  };
  const composed = composeAddition(collected, compositionOptions.review || null, baseInfo);
  const { addition, composition } = composed;
  const blockedAddition = composed.blockObservation;
  let manifest, validation;
  const beforeExecutableRead = () => {
    if (compositionOptions.review && !reviewStable(root, compositionOptions.review))
      throw new Error('Attestation review changed before executable observation');
  };
  const before = provenance(root, repository.git);
  try {
    manifest = readJson(root, MANIFEST);
    validation = blockedAddition
      ? {
          errors: [
            'Integrated addition rejected before executable observation: ' +
              addition.reasons.join('; '),
            ...composition.maintenance.reasons.map(
              (reason) => 'Attestation composition rejected: ' + reason
            ),
          ],
        }
      : validateRepository(root, { beforeExecutableRead });
  } catch (error) {
    validation = { errors: ['Manifest validation failed: ' + error.message] };
  }
  // validateRepository performs discovery only (--list), never executes test bodies.
  // Reuse a second list for logical identities; any drift is rejected below.
  let cases = [];
  if (!validation.errors.length) {
    try {
      beforeExecutableRead();
      cases = discover(root);
    } catch (error) {
      validation.errors.push('Discovery refused: ' + error.message);
    }
  }
  let previousManifest = null;
  try {
    const candidate = JSON.parse(collected.read('before', MANIFEST));
    // Old maps are evidence for diagnostics only; renames/deletions always fall back.
    if (candidate.revisions && candidate.engines && candidate.capabilities)
      previousManifest = candidate;
  } catch {
    /* unavailable historical map is explicit for rename/deletion */
  }
  const after = provenance(root, repository.git);
  if (
    before.sourceFingerprint !== after.sourceFingerprint ||
    before.sourceFingerprint !== collected.comparison.worktree.source.sourceFingerprint
  )
    validation.errors.push('Sources changed while collecting/validating the plan');
  if (
    manifest &&
    digest(JSON.stringify(readJson(root, MANIFEST))) !== digest(JSON.stringify(manifest))
  )
    validation.errors.push('Manifest changed while planning');
  if (addition.structuralStatus === 'proven' && validation.errors.length) {
    addition.structuralStatus = 'rejected';
    addition.reasons.push('Existing manifest/discovery/stability validation failed');
  }
  if (compositionOptions.review && !reviewStable(root, compositionOptions.review)) {
    validation.errors.push('Attestation review changed during planning');
  }
  if (composition.status === 'compatible' && validation.errors.length) {
    composition.status = 'rejected';
    composition.compatibility.status = 'not-established';
    composition.compatibility.reasons.push('Existing validation/stability gate failed');
    composition.effectiveIdentity = 'blocked';
  }
  const plan = makePlan({ manifest, previousManifest, validation, cases, ...collected });
  onAdditionEvidence(addition);
  compositionOptions.onCompositionEvidence?.(composition);
  return plan;
}
function main(args = process.argv.slice(2), root = ROOT) {
  const command = args.shift();
  if (command === 'plano') {
    const input = options(args, ['mode', 'base', 'target', 'attestation-review']);
    const review = input['attestation-review']
      ? loadReview(root, input['attestation-review'])
      : null;
    let addition, composition;
    const plan = planRepository(
      root,
      input,
      (evidence) => {
        addition = evidence;
      },
      {
        review,
        onCompositionEvidence: (evidence) => {
          composition = evidence;
        },
      }
    );
    const directory = writeResult(root, 'plano', plan, summarizePlan(plan));
    fs.writeFileSync(
      path.join(directory, 'adicao-integrada.json'),
      JSON.stringify(addition, null, 2) + '\n'
    );
    fs.writeFileSync(
      path.join(directory, 'composicao-atestacao.json'),
      JSON.stringify(composition, null, 2) + '\n'
    );
    if (review) fs.writeFileSync(path.join(directory, 'revisao-atestacao.json'), review.bytes);
    return plan.valid ? 0 : 1;
  }
  if (command === 'comparar') {
    const input = options(args, ['plan', 'run']);
    if (!input.plan || !input.run) throw new Error('Use --plan FILE --run FILE');
    const result = comparePlan(
      JSON.parse(fs.readFileSync(input.plan)),
      JSON.parse(fs.readFileSync(input.run))
    );
    writeResult(
      root,
      'comparacao',
      result,
      [
        '# Comparação observacional',
        '',
        '**Resultado: ' + result.result + '**.',
        '',
        ...result.reasons.map((r) => '- ' + r),
        '',
        'Projeção de custo disponível: ' + result.costProjection.available + '.',
        '',
        ...result.warnings.map((w) => '- ' + w),
      ].join('\n')
    );
    return result.comparable ? 0 : 2;
  }
  throw new Error('Use plano or comparar; no test execution command exists in this planner');
}
if (require.main === module) {
  try {
    process.exitCode = main();
  } catch (error) {
    console.error('FAIL planejador: ' + error.message);
    process.exitCode = 1;
  }
}
module.exports = { main, options, planRepository, summarizePlan, writeResult };
