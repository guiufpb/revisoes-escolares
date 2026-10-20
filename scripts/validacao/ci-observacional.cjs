'use strict';

// This adapter observes npm test. It never invokes or filters the runner.
const fs = require('node:fs');
const path = require('node:path');
const { ROOT } = require('./manifesto.cjs');
const { gitRepository } = require('./planejador-git.cjs');
const { planRepository, summarizePlan } = require('./planejador-cli.cjs');
const { comparePlan } = require('./planejador-comparacao.cjs');
const { identityUsable } = require('./identidade.cjs');
const { prepareFixtures } = require('../../tests/fixtures/pdfs.cjs');

const DIRECTORY = 'tmp/validacao/ci-observacional';
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const referenceCodes = [
  'REFERENCE_SHA_INVALID',
  'REFERENCE_COMMIT_UNAVAILABLE',
  'REFERENCE_SHALLOW',
  'REFERENCE_BASE_UNSUPPORTED',
  'REFERENCE_ANCESTRY_MISMATCH',
  'REFERENCE_PUSH_SHA_MISMATCH',
  'REFERENCE_EVENT_UNSUPPORTED',
  'REFERENCE_CHECKOUT_MISMATCH',
];
const referenceFailure = (code, message) => Object.assign(new Error(message), { code });
// Never serialize exception messages/stacks: filesystem/JSON errors may contain private bytes.
function stageFailure(stage, error) {
  return {
    stage,
    code: referenceCodes.includes(error?.code) ? error.code : 'observation-stage-failed',
    systemCode: ['ENOENT', 'ENOTDIR', 'EACCES', 'EPERM', 'EIO'].includes(error?.code)
      ? error.code
      : null,
  };
}
function write(root, name, value) {
  const file = path.join(root, DIRECTORY, name);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n');
}

function eventReferences(root, env, event, repository = gitRepository(root)) {
  const sha = (value) => {
    if (!/^[a-f0-9]{40}$/.test(value || '') || /^0+$/.test(value))
      throw referenceFailure(
        'REFERENCE_SHA_INVALID',
        'SHA ausente ou inválido no evento; nenhuma base substituta foi escolhida.'
      );
    try {
      return repository.resolve(value);
    } catch {
      throw referenceFailure(
        'REFERENCE_COMMIT_UNAVAILABLE',
        'Commit do evento indisponível no histórico local.'
      );
    }
  };
  if (repository.git('rev-parse', '--is-shallow-repository').trim() !== 'false')
    throw referenceFailure(
      'REFERENCE_SHALLOW',
      'Histórico raso: referências não atestadas; fetch-depth: 0 é obrigatório.'
    );
  let base, target;
  if (env.GITHUB_EVENT_NAME === 'pull_request') {
    if (event.pull_request?.base?.ref !== 'main')
      throw referenceFailure('REFERENCE_BASE_UNSUPPORTED', 'PR fora da base main.');
    base = sha(event.pull_request.base.sha);
    // GITHUB_SHA is the integrated commit actually checked out, not the source branch HEAD.
    target = sha(env.GITHUB_SHA);
    const head = sha(event.pull_request.head?.sha);
    try {
      repository.git('merge-base', '--is-ancestor', base, target);
      repository.git('merge-base', '--is-ancestor', head, target);
    } catch {
      throw referenceFailure(
        'REFERENCE_ANCESTRY_MISMATCH',
        'Base/HEAD da PR não pertencem à versão integrada validada.'
      );
    }
  } else if (env.GITHUB_EVENT_NAME === 'push' && event.ref === 'refs/heads/main') {
    base = sha(event.before);
    target = sha(event.after);
    if (target !== sha(env.GITHUB_SHA))
      throw referenceFailure('REFERENCE_PUSH_SHA_MISMATCH', 'Push e GITHUB_SHA divergentes.');
  } else {
    throw referenceFailure(
      'REFERENCE_EVENT_UNSUPPORTED',
      'Evento não suportado para comparação; execução obrigatória permanece global.'
    );
  }
  if (target !== repository.resolve('HEAD'))
    throw referenceFailure(
      'REFERENCE_CHECKOUT_MISMATCH',
      'Destino do evento difere da checkout validada.'
    );
  return { mode: 'refs', base, target };
}

// Only immediate reporter directories are considered; nested unit-test/CLI examples are excluded.
function runFiles(root) {
  const directory = path.join(root, 'tmp/validacao');
  if (!fs.existsSync(directory)) return [];
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.isSymbolicLink())
    .map((entry) => 'tmp/validacao/' + entry.name + '/run.json')
    .filter((file) => fs.existsSync(path.join(root, file)))
    .sort();
}

function prepareObservation(root, env, event, services = {}) {
  const state = {
    schemaVersion: 1,
    observational: true,
    invocation: [env.GITHUB_RUN_ID || null, env.GITHUB_RUN_ATTEMPT || null],
    event: env.GITHUB_EVENT_NAME || 'indisponível',
    requested: {
      base: event.pull_request?.base?.sha || event.before || null,
      target: env.GITHUB_SHA || null,
    },
    references: null,
    previousRuns: runFiles(root),
    plan: null,
    diagnostics: [],
    stage: 'references',
  };
  // Persist before experimental work, including invalid references/preparation failure.
  write(root, 'estado.json', state);
  try {
    state.references = (services.references || eventReferences)(root, env, event);
    state.stage = 'fixtures';
    (services.fixtures || prepareFixtures)(root);
    state.stage = 'planning';
    const plan = (services.plan || planRepository)(root, state.references, (evidence) => {
      write(root, 'adicao-integrada.json', evidence);
    });
    state.stage = 'plan-serialization';
    write(root, 'plano.json', plan);
    write(root, 'plano.md', summarizePlan(plan) + '\n');
    state.plan = DIRECTORY + '/plano.json';
    state.stage = 'identity';
    const identity = plan.comparison?.target?.identity;
    if (!identityUsable(identity)) {
      state.diagnostics.push('Identidade do plano incompleta; valid=true isolado não resolve A3.');
      for (const entry of identity?.unknown || [])
        state.diagnostics.push('Identidade: ' + entry.path + ' — ' + entry.reason);
      for (const entry of identity?.inputs || [])
        if (entry.state !== 'present')
          state.diagnostics.push('Entrada obrigatória ' + entry.path + ': ' + entry.state);
    }
    state.stage = 'prepared';
  } catch (error) {
    state.failure = stageFailure(state.stage, error);
    state.diagnostics.push(
      '[' +
        state.stage +
        '] ' +
        (state.references
          ? 'Preparação/planejamento falhou; causa segura registrada em failure.'
          : 'Referências inconclusivas; causa segura registrada em failure.')
    );
  }
  write(root, 'estado.json', state);
  return state;
}

function evaluateObservation(state, plan, run, globalOutcome) {
  const diagnostics = [...(state?.diagnostics || [])];
  if (!state) diagnostics.push('Planejamento não iniciado; uma etapa anterior pode ter falhado.');
  if (!plan) diagnostics.push('Plano indisponível.');
  if (!run)
    diagnostics.push(
      'Relatório real único da invocação indisponível; execução completa não presumida.'
    );
  const comparison = plan && run ? comparePlan(plan, run) : null;
  const completeIdentity =
    !!plan &&
    !!run &&
    [plan.comparison?.target?.identity, run.source?.identity, run.sourceAtEnd?.identity].every(
      identityUsable
    );
  const comparable = !!comparison?.comparable && diagnostics.length === 0;
  const inventoryAvailable =
    plan?.valid === true &&
    Array.isArray(plan.available?.cases) &&
    Array.isArray(plan.proposed?.cases);
  // Preserve both results: even an analyzable failed global never becomes a successful check.
  return {
    schemaVersion: 1,
    observational: true,
    executionPolicy: 'global',
    event: state?.event || 'indisponível',
    requested: state?.requested || null,
    references: state?.references || null,
    global: {
      outcome: globalOutcome || 'indisponível',
      reportStatus: run?.status || null,
      counts: run?.counts || null,
    },
    planValid: plan?.valid ?? null,
    planResult: plan?.result || 'indisponível',
    identity: completeIdentity ? 'completa' : 'incompleta/indisponível',
    comparisonResult: comparable ? comparison.result : 'inconclusive',
    comparable,
    diagnostics: [...diagnostics, ...(comparison?.reasons || [])],
    preparation: { stage: state?.stage || null, failure: state?.failure || null },
    changes: plan?.changes || [],
    counts: {
      available: inventoryAvailable ? plan.available.cases.length : null,
      proposed: inventoryAvailable ? plan.proposed.cases.length : null,
      potentiallyOmitted: inventoryAvailable ? (plan.omitted?.length ?? null) : null,
      actuallyExecuted: run?.counts?.executed ?? null,
    },
    fallbackReasons: plan?.fallbackReasons || [],
    omittedFailures: comparison?.omittedFailures ?? null,
    costProjection: comparable ? comparison.costProjection : { available: false },
    comparison,
    limitations: [
      'A execução efetiva permanece npm test integral; propostas nunca filtram o Playwright.',
      'Somas de durações de tentativas não estimam tempo seletivo; hooks, preparação e concorrência diferem. selectiveWallMs permanece nulo.',
      'A meta de 10–15 minutos é experimental e não foi demonstrada.',
      'A1: qualquer mudança no corpus exige revisão deliberada da atestação dos 29 diagnósticos.',
    ],
  };
}

const text = (value) =>
  String(value ?? 'indisponível')
    .replace(/[&<>]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[character])
    .replace(/[\\`*_[\]#|]/g, '\\$&')
    .replace(/[\r\n]/g, ' ');
function summary(result) {
  return [
    '# CI observacional — Etapa 3',
    '',
    'Execução obrigatória: **global**. Resultado da etapa npm test: **' +
      text(result.global.outcome) +
      '**.',
    'Relatório Playwright: ' + text(result.global.reportStatus) + '.',
    'Evento: ' +
      text(result.event) +
      '; base: ' +
      text(result.references?.base || result.requested?.base) +
      '; destino: ' +
      text(result.references?.target || result.requested?.target) +
      '.',
    'Plano sintaticamente válido: ' +
      text(result.planValid) +
      '; resultado: ' +
      text(result.planResult) +
      '.',
    'Identidade: **' +
      text(result.identity) +
      '**; comparação: **' +
      text(result.comparisonResult) +
      '**.',
    'Testes disponíveis: ' +
      text(result.counts.available) +
      '; propostos: ' +
      text(result.counts.proposed) +
      '; potencialmente omitidos: ' +
      text(result.counts.potentiallyOmitted) +
      '; realmente executados: ' +
      text(result.counts.actuallyExecuted) +
      '.',
    'Projeção: **' +
      (result.costProjection.available
        ? 'disponível (somente soma de tentativas)'
        : 'indisponível') +
      '**.',
    ...(result.costProjection.available
      ? [
          'Tentativas em ms — global: ' +
            result.costProjection.globalAttemptsMs +
            '; propostas: ' +
            result.costProjection.proposedAttemptsMs +
            '; omitidas: ' +
            result.costProjection.omittedAttemptsMs +
            '.',
        ]
      : []),
    '',
    '## Arquivos e classificação',
    '',
    ...result.changes.map(
      (change) =>
        '- ' +
        text(change.previousPath || '(novo)') +
        ' → ' +
        text(change.currentPath || '(excluído)') +
        ': ' +
        text(change.risk) +
        ' / ' +
        text(change.rule) +
        '. ' +
        text(change.basis)
    ),
    '',
    '## Fallback e diagnósticos',
    '',
    ...[...result.fallbackReasons, ...result.diagnostics].map((reason) => '- ' + text(reason)),
    'Falhas não contempladas: ' + (result.omittedFailures?.length ?? 'indisponível') + '.',
    ...(result.omittedFailures || []).map(
      (failure) =>
        '- ' + text(failure.file) + ': ' + text(failure.id) + ' / ' + text(failure.outcome)
    ),
    '',
    ...result.limitations.map((reason) => '- ' + text(reason)),
    '',
  ].join('\n');
}

function finishObservation(root, env) {
  const stateFile = path.join(root, DIRECTORY, 'estado.json');
  let state = fs.existsSync(stateFile) ? read(stateFile) : null;
  if (
    JSON.stringify(state?.invocation) !==
    JSON.stringify([env.GITHUB_RUN_ID || null, env.GITHUB_RUN_ATTEMPT || null])
  )
    state = null;
  const candidates = state
    ? runFiles(root).filter((file) => !state.previousRuns.includes(file))
    : [];
  if (state && candidates.length !== 1)
    state.diagnostics.push(
      'Relatórios novos encontrados: ' + candidates.length + '; associação única exigida.'
    );
  const runFile = candidates.length === 1 ? candidates[0] : null;
  const plan = state?.plan ? read(path.join(root, state.plan)) : null;
  const result = evaluateObservation(
    state,
    plan,
    runFile ? read(path.join(root, runFile)) : null,
    env.GLOBAL_OUTCOME
  );
  write(
    root,
    'comparacao.json',
    result.comparison || {
      comparable: false,
      result: 'inconclusive',
      reasons: result.diagnostics,
      costProjection: { available: false },
    }
  );
  write(root, 'observacao.json', result);
  write(root, 'indice.json', {
    plan: state?.plan || null,
    run: runFile,
    comparison: DIRECTORY + '/comparacao.json',
    observation: DIRECTORY + '/observacao.json',
    summary: DIRECTORY + '/resumo.md',
  });
  const markdown = summary(result);
  write(root, 'resumo.md', markdown);
  if (env.GITHUB_STEP_SUMMARY) fs.appendFileSync(env.GITHUB_STEP_SUMMARY, markdown);
  if (!result.comparable)
    console.log(
      '::warning::Observação inconclusiva; consulte resumo e artefatos. O resultado obrigatório permanece separado.'
    );
  return result;
}

function main(command, root = ROOT, env = process.env) {
  if (env.VALIDACAO_CI_OBSERVACIONAL !== '1') return;
  let stage = 'dispatch';
  try {
    if (command === 'planejar') {
      stage = 'event-read';
      const event = read(env.GITHUB_EVENT_PATH);
      stage = 'prepare';
      prepareObservation(root, env, event);
    } else if (command === 'concluir') {
      stage = 'finish';
      finishObservation(root, env);
    } else throw new Error('Comando observacional desconhecido.');
  } catch (error) {
    // Experimental failures are visible, never replace npm test's exit status.
    const diagnostic =
      'Instrumentação observacional falhou; comparação inconclusiva e projeção indisponível. Global preservada.';
    console.log('::warning::[' + stage + '] ' + diagnostic);
    try {
      write(root, 'erro.json', {
        result: 'inconclusive',
        costProjection: { available: false },
        diagnostic,
        failure: stageFailure(stage, error),
      });
      if (env.GITHUB_STEP_SUMMARY)
        fs.appendFileSync(env.GITHUB_STEP_SUMMARY, '\n' + diagnostic + '\n');
    } catch {
      console.log('::warning::Não foi possível gravar o diagnóstico experimental.');
    }
  }
}
if (require.main === module) main(process.argv[2]);
module.exports = {
  DIRECTORY,
  eventReferences,
  runFiles,
  prepareObservation,
  evaluateObservation,
  finishObservation,
  summary,
  main,
};
