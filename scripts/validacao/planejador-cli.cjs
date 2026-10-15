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
function planRepository(root, input) {
  const repository = gitRepository(root);
  const collected = collectComparison(root, input, repository);
  let manifest, validation;
  const before = provenance(root, repository.git);
  try {
    manifest = readJson(root, MANIFEST);
    validation = validateRepository(root);
  } catch (error) {
    validation = { errors: ['Manifest validation failed: ' + error.message] };
  }
  // validateRepository performs discovery only (--list), never executes test bodies.
  // Reuse a second list for logical identities; any drift is rejected below.
  const cases = validation.errors.length ? [] : discover(root);
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
  return makePlan({ manifest, previousManifest, validation, cases, ...collected });
}
function main(args = process.argv.slice(2), root = ROOT) {
  const command = args.shift();
  if (command === 'plano') {
    const input = options(args, ['mode', 'base', 'target']);
    const plan = planRepository(root, input);
    writeResult(root, 'plano', plan, summarizePlan(plan));
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
