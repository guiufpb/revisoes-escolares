'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { execFileSync, spawnSync } = require('node:child_process');
const { makePlan } = require('../../scripts/validacao/planejador.cjs');
const { logicalId } = require('../../scripts/validacao/catalogo.cjs');
const { captureIdentity } = require('../../scripts/validacao/identidade.cjs');
const { digest, ROOT } = require('../../scripts/validacao/manifesto.cjs');
const {
  parse,
  selection,
  stable,
  exactCases,
  verifyRun,
  execute,
} = require('../../scripts/validacao/executor-local.cjs');

// Independent synthetic map: actual makePlan proofs/closure, not a hand-approved plan.
function fixture(risk = 'R1') {
  const source = 'ambiente_interativo/revisoes/alice/exemplo.js';
  const asset = 'assets/exemplo.svg';
  const file = 'tests/ação (a)+[1]$.spec.js';
  const contractFile = 'tests/contratos.spec.js';
  const contracts = ['cadastro', 'recuperacao', 'limpeza-sessoes', 'acessibilidade'].map((id) => ({
    id,
    representatives: [{ file: contractFile, pattern: '^' + id + '$' }],
    limits: [],
  }));
  const cases = [
    [file, 'percurso'],
    ...contracts.map((c) => [contractFile, c.id]),
    ['tests/outro.spec.js', 'outro'],
  ].map(([f, title]) => ({
    file: f,
    titles: [title],
    fullTitle: title,
    id: logicalId(f, [title]),
    project: '',
    repeatEachIndex: 0,
  }));
  const manifest = {
    schemaVersion: 1,
    version: '1.0.0',
    gaps: [],
    capabilities: [],
    contracts,
    revisions: [
      {
        id: 'alice-fixture',
        engine: 'questionarios',
        capabilities: [],
        configFiles: [source],
        contentSources: [source],
        assets: [asset],
        gaps: [],
        tests: [file],
        contentDependencies: [],
      },
    ],
    engines: [
      {
        id: 'questionarios',
        sources: ['shared.js'],
        dependencies: [],
        consumers: ['alice-fixture'],
      },
    ],
    tests: [...new Set(cases.map((c) => c.file))].map((f) => ({
      file: f,
      cases: [],
      defaults: {},
      revisions: ['alice-fixture'],
      engines: ['questionarios'],
      capabilities: [],
      contracts: [],
    })),
    discovery: { caseCount: cases.length },
  };
  const identity = captureIdentity({
    paths: [source, asset],
    readBytes: () => Buffer.from('synthetic'),
    policy: {
      schemaVersion: 1,
      identityFormat: 2,
      version: '1.0.0',
      rootInputs: [source, asset],
      inputRoots: [],
      inputExtensions: [],
      forcedInputs: [],
      syntheticInputs: [],
      diagnosticProducers: [],
      diagnosticAudit: {},
    },
  });
  const current = {
    available: true,
    commit: 'a'.repeat(40),
    tree: 'b'.repeat(40),
    statusFingerprint: 'c'.repeat(64),
    sourceFingerprint: identity.inputFingerprint,
    identity,
  };
  const before =
    'window.QuestionariosRevisoes.registrar({id:"alice-fixture",titulo:"Antes",questoes:[]});';
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="#112233"/></svg>';
  const changed = risk === 'R2' ? asset : source;
  const plan = makePlan({
    manifest,
    validation: { errors: [] },
    cases,
    comparison: {
      target: { identity, sourceFingerprint: identity.inputFingerprint },
      worktree: { source: current },
      identityErrors: [],
    },
    changes: [{ type: 'M', currentPath: changed, previousPath: changed }],
    read: (side) =>
      risk === 'R2'
        ? side === 'before'
          ? svg
          : svg.replace('#112233', '#445566')
        : side === 'before'
          ? before
          : before.replace('Antes', 'Depois'),
  });
  const run = {
    schemaVersion: 2,
    complete: true,
    status: 'passed',
    errors: [],
    manifest: plan.manifest,
    source: current,
    sourceAtEnd: current,
    sourcesChangedDuringRun: false,
    artifactsChangedDuringRun: false,
    counts: {
      discovered: plan.proposed.caseCount,
      expected: plan.proposed.caseCount,
      executed: plan.proposed.caseCount,
      passed: plan.proposed.caseCount,
      failed: 0,
      flaky: 0,
      skipped: 0,
      notExecuted: 0,
      interruptedAttempts: 0,
      timedOutAttempts: 0,
    },
    cases: plan.proposed.cases.map((c) => ({
      ...c,
      outcome: 'expected',
      attempts: [{ status: 'passed' }],
    })),
  };
  return { plan, current, manifest, run, file, composition: { status: 'not-requested' } };
}

test('opções: execução explícita, comparação e política local obrigatórias', () => {
  assert.equal(
    parse(['--dry-run', '--mode', 'worktree', '--base', 'HEAD', '--policy', 'targeted']).execute,
    false
  );
  for (const args of [
    [],
    ['--dry-run', '--execute'],
    ['--execute', '--mode', 'worktree', '--base', 'HEAD'],
    ['--dry-run', '--grep', '.*'],
    ['--dry-run', '--policy', 'targeted', '--mode', 'refs', '--base', 'HEAD'],
  ])
    assert.throws(() => parse(args));
});

for (const risk of ['R1', 'R2'])
  test(`${risk}: makePlan preserva arquivos completos, contratos e omissões`, () => {
    const f = fixture(risk);
    assert.equal(f.plan.result, 'candidate');
    assert.equal(f.plan.changes[0].risk, risk);
    assert.ok(f.plan.omitted.length);
    const filters = selection(f.plan, f.composition, 'targeted');
    assert.equal(filters.length, 2);
    assert.ok(f.plan.proposed.files.includes('tests/contratos.spec.js'));
    stable(f.plan, f.current);
    verifyRun(f.plan, f.run);
  });

test('regex ancorada escapa caracteres especiais em caminhos Windows/POSIX', () => {
  const f = fixture();
  const filter = new RegExp(selection(f.plan, f.composition, 'targeted')[0]);
  const absolute = path.resolve(ROOT, f.file);
  assert.ok(filter.test(absolute));
  assert.ok(filter.test(absolute.replaceAll('\\', '/')));
  assert.equal(filter.test(path.join(ROOT, 'tests', f.file)), false);
  assert.equal(filter.test('/tmp/' + f.file + '.outro'), false);
  assert.equal(filter.test('/tmp/x' + f.file), false);
  assert.equal(filter.test('/tmp/' + f.file.replace('(a)+[1]$', 'a1')), false);
});

test('bloqueios reais: global, composição, identidade, representante e seleção parcial', () => {
  const f = fixture();
  assert.throws(() => selection(f.plan, f.composition, 'global'), /global-required/);
  assert.throws(
    () => selection({ ...f.plan, result: 'global' }, f.composition, 'targeted'),
    /global-required/
  );
  assert.throws(
    () => selection(f.plan, { status: 'rejected' }, 'targeted'),
    /candidate-not-authorized/
  );
  assert.throws(
    () => stable(f.plan, { ...f.current, identity: { ...f.current.identity, complete: false } }),
    /identity/
  );
  assert.throws(() => stable(f.plan, { ...f.current, commit: 'd'.repeat(40) }), /identity/);
  const partial = structuredClone(f.plan);
  partial.proposed.cases.pop();
  partial.proposed.caseCount--;
  assert.throws(() => selection(partial, f.composition, 'targeted'), /selection-mismatch/);
  const missing = structuredClone(f.plan);
  missing.contracts.represented[0].representatives.push('absent');
  assert.throws(() => selection(missing, f.composition, 'targeted'), /required-contract/);
});

test('identidades: projetos, repetições, duplicação e relatório incompleto não são equivalentes', () => {
  const f = fixture();
  for (const property of ['project', 'repeatEachIndex']) {
    const other = structuredClone(f.plan.proposed.cases);
    other[0][property] = property === 'project' ? 'mobile' : 1;
    assert.throws(() => exactCases(f.plan.proposed.cases, other), /selection-mismatch/);
  }
  assert.throws(
    () => exactCases(f.plan.proposed.cases, [...f.plan.proposed.cases, f.plan.proposed.cases[0]]),
    /duplicate/
  );
  assert.throws(() => verifyRun(f.plan, { ...f.run, complete: false }), /report-incomplete/);
  const failed = structuredClone(f.run);
  failed.cases[0].attempts.unshift({ status: 'failed' });
  assert.throws(() => verifyRun(f.plan, failed), /test-run-not-clean/);
  for (const field of ['skipped', 'notExecuted', 'interruptedAttempts', 'timedOutAttempts']) {
    assert.throws(
      () => verifyRun(f.plan, { ...f.run, counts: { ...f.run.counts, [field]: 1 } }),
      /test-run-not-clean/
    );
  }
});

async function harness(input = {}, mutate = () => {}) {
  const f = fixture();
  const root = fs.mkdtempSync(path.join(ROOT, 'tmp/executor-unit-'));
  fs.mkdirSync(path.join(root, 'validacao'));
  fs.writeFileSync(path.join(root, 'validacao/manifesto.json'), JSON.stringify(f.manifest));
  assert.equal(digest(JSON.stringify(f.manifest)), f.plan.manifest.fingerprint);
  let executions = 0,
    preparations = 0,
    lists = 0;
  const services = {
    env: {}, // Synthetic services model a local process, even when Node tests run in CI.
    prepare: async () => {
      preparations++;
    },
    plan: (_root, _input, _addition, composition) => {
      composition.onCompositionEvidence(f.composition);
      return f.plan;
    },
    current: () => f.current,
    runFiles: () => (executions ? ['tmp/validacao/synthetic/run.json'] : []),
    child: async (_root, args) => {
      if (args.includes('--list')) {
        lists++;
        return {
          status: 0,
          stdout: JSON.stringify({
            config: { projects: [{ repeatEach: 1 }] },
            suites: f.plan.proposed.cases.map((c) => ({
              title: '',
              specs: [{ file: c.file, title: c.titles[0], tests: [{ projectName: '' }] }],
            })),
          }),
        };
      }
      executions++;
      fs.mkdirSync(path.join(root, 'tmp/validacao/synthetic'), { recursive: true });
      fs.writeFileSync(path.join(root, 'tmp/validacao/synthetic/run.json'), JSON.stringify(f.run));
      return { status: 0, signal: null };
    },
  };
  mutate(f, services);
  const result = await execute(
    root,
    { mode: 'worktree', base: 'HEAD', policy: 'targeted', execute: true, ...input },
    services
  );
  return { ...result, root, executions, preparations, lists };
}

test('ambiente injetado: cada sinal de CI bloqueia antes de preparar, planejar ou executar', async () => {
  for (const env of [{ CI: 'true' }, { CI: 'false' }, { VALIDACAO_CI_OBSERVACIONAL: '1' }]) {
    let planned = false;
    const result = await harness({}, (_f, services) => {
      services.env = env;
      services.plan = () => {
        planned = true;
        assert.fail('CI must not plan');
      };
    });
    assert.equal(result.code, 1);
    assert.equal(result.summary.status, 'blocked');
    assert.deepEqual(result.summary.failure, { stage: 'preparation', code: 'local-only' });
    assert.equal(result.summary.selectiveSuccess, false);
    assert.equal(result.summary.fallback, null);
    assert.equal(result.preparations, 0);
    assert.equal(planned, false);
    assert.equal(result.lists, 0);
    assert.equal(result.executions, 0);
  }
});

test('CLI real sem injeção recusa ambos os sinais de CI em dry-run e execução', () => {
  const inherited = { ...process.env };
  const childEnv = { ...inherited };
  delete childEnv.CI;
  delete childEnv.VALIDACAO_CI_OBSERVACIONAL;
  for (const env of [{ CI: 'true' }, { VALIDACAO_CI_OBSERVACIONAL: '1' }]) {
    for (const mode of ['--dry-run', '--execute']) {
      const result = spawnSync(
        process.execPath,
        [
          path.join(ROOT, 'scripts/validacao/executor-local.cjs'),
          mode,
          '--mode',
          'worktree',
          '--base',
          'HEAD',
          '--policy',
          'targeted',
        ],
        { cwd: ROOT, encoding: 'utf8', env: { ...childEnv, ...env } }
      );
      assert.ifError(result.error);
      assert.equal(result.status, 1);
      assert.equal(result.signal, null);
      const match = result.stdout.match(/Executor local: blocked; resumo: (.+)/);
      assert.ok(match, result.stdout);
      const summaryFile = path.resolve(ROOT, match[1].trim(), 'resumo.json');
      const summary = JSON.parse(fs.readFileSync(summaryFile, 'utf8'));
      assert.deepEqual(summary.failure, { stage: 'preparation', code: 'local-only' });
      assert.equal(summary.selectiveSuccess, false);
      assert.equal(summary.run, null);
      assert.equal(summary.fallback, null);
      for (const stage of ['preparation', 'planning', 'discovery', 'execution'])
        assert.equal(summary.durationsMs[stage], 0);
      assert.equal(fs.existsSync(path.join(path.dirname(summaryFile), 'plano.json')), false);
    }
  }
  assert.deepEqual({ ...process.env }, inherited);
});

test('dry-run não prepara nem executa corpos; execução mede etapas e associa um único run novo', async () => {
  const dry = await harness({ execute: false });
  assert.equal(dry.summary.status, 'ready');
  assert.equal(dry.preparations, 0);
  assert.equal(dry.executions, 0);
  const real = await harness();
  assert.equal(real.code, 0);
  assert.equal(real.executions, 1);
  assert.equal(real.summary.selectiveSuccess, true);
  assert.equal(real.summary.run, 'tmp/validacao/synthetic/run.json');
  assert.ok(real.summary.durationsMs.total > 0);
  for (const stage of ['preparation', 'planning', 'discovery', 'execution'])
    assert.ok(real.summary.durationsMs[stage] > 0);
});

test('fallback é explícito e nunca inicia execução global ou seletiva', async () => {
  const result = await harness({ execute: false, policy: 'global' });
  assert.equal(result.code, 2);
  assert.equal(result.summary.fallback, 'npm test');
  assert.equal(result.executions, 0);
  assert.equal(result.lists, 0);
  assert.equal(result.summary.selectiveSuccess, false);
});

test('divergência na discovery e identidade instável impedem os corpos', async () => {
  const divergent = await harness({}, (_f, s) => {
    s.child = async () => ({ status: 0, stdout: '{"suites":[]}' });
  });
  assert.equal(divergent.summary.failure.code, 'selection-mismatch');
  assert.equal(divergent.executions, 0);
  const unstable = await harness({}, (f, s) => {
    s.current = () => ({ ...f.current, sourceFingerprint: 'changed' });
  });
  assert.equal(unstable.summary.failure.code, 'identity-unusable-or-unstable');
  assert.equal(unstable.lists, 0);
});

for (const signal of [null, 'SIGINT'])
  test(`falha/interrupção (${signal}) não vira sucesso nem fallback`, async () => {
    const result = await harness({}, (_f, s) => {
      const original = s.child;
      s.child = async (root, args) =>
        args.includes('--list') ? original(root, args) : { status: signal ? null : 1, signal };
    });
    assert.equal(result.code, 1);
    assert.equal(result.summary.status, 'failed');
    assert.equal(result.summary.failure.code, signal ? 'interrupted' : 'test-process-failed');
    assert.equal(result.summary.fallback, null);
  });

test('zero/múltiplos relatórios novos não são aceitos; erros livres não vazam no resumo', async () => {
  for (const reports of [[], ['a/run.json', 'b/run.json']]) {
    let called = false;
    const result = await harness({}, (_f, s) => {
      s.runFiles = () => {
        if (!called) {
          called = true;
          return [];
        }
        return reports;
      };
    });
    assert.equal(result.summary.failure.code, 'new-report-missing-or-ambiguous');
  }
  const result = await harness({}, (_f, s) => {
    s.prepare = () => {
      throw new Error('PRIVATE SENTINEL');
    };
  });
  assert.equal(
    fs
      .readFileSync(path.join(result.directory, 'resumo.json'), 'utf8')
      .includes('PRIVATE SENTINEL'),
    false
  );
});

test('Playwright instalado: filtros reais listam somente os arquivos exatos sem executar corpos', () => {
  const root = fs.mkdtempSync(path.join(ROOT, 'tmp/executor-playwright-'));
  fs.mkdirSync(path.join(root, 'tests'));
  const f = fixture();
  const declaration = `const {test}=require(${JSON.stringify(require.resolve('@playwright/test'))}); test('sentinela',()=>{throw Error('BODY EXECUTED')});`;
  for (const file of [
    f.file,
    'tests/contratos.spec.js',
    'tests/ação aaa1.spec.js',
    'tests/outro.spec.js',
  ])
    fs.writeFileSync(path.join(root, file), declaration);
  fs.writeFileSync(
    path.join(root, 'playwright.config.cjs'),
    'module.exports={testDir:"./tests",workers:1};'
  );
  const cli = path.join(path.dirname(require.resolve('playwright/package.json')), 'cli.js');
  const result = JSON.parse(
    execFileSync(
      process.execPath,
      [
        cli,
        'test',
        ...selection(f.plan, f.composition, 'targeted', root),
        '--list',
        '--reporter=json',
      ],
      { cwd: root, encoding: 'utf8' }
    )
  );
  assert.equal(result.suites.length, 2);
  assert.deepEqual(
    result.suites.map((s) => s.file).sort(),
    [path.basename(f.file), 'contratos.spec.js'].sort()
  );
});
