'use strict';

// Local adapter only. Classification, proofs and contracts belong to the planner.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawn } = require('node:child_process');
const { performance } = require('node:perf_hooks');
const { ROOT, digest } = require('./manifesto.cjs');
const { planRepository, options } = require('./planejador-cli.cjs');
const { instanceKey } = require('./planejador.cjs');
const { logicalId, flattenDiscovery } = require('./catalogo.cjs');
const { identityUsable, provenance } = require('./identidade.cjs');
const { loadReview, reviewStable } = require('./planejador-composicao.cjs');
const { runFiles } = require('./ci-observacional.cjs');
const { prepareFixtures } = require('../../tests/fixtures/pdfs.cjs');

const fail = (code) => {
  throw Object.assign(new Error(code), { safeCode: code });
};
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const sorted = (values) => [...values].sort();

function parse(args) {
  const flags = args.filter((a) => ['--dry-run', '--execute'].includes(a));
  if (flags.length !== 1) fail('choose-dry-run-or-execute');
  const input = options(
    args.filter((a) => !flags.includes(a)),
    ['mode', 'base', 'target', 'policy', 'attestation-review']
  );
  if (!['targeted', 'global'].includes(input.policy)) fail('explicit-local-policy-required');
  if (
    !input.base ||
    !['worktree', 'refs'].includes(input.mode) ||
    (input.mode === 'refs' ? !input.target : !!input.target)
  )
    fail('explicit-comparison-required');
  return { ...input, execute: flags[0] === '--execute' };
}

function keys(cases) {
  if (!Array.isArray(cases)) fail('case-inventory-unavailable');
  const result = cases.map((c) => {
    if (
      !Array.isArray(c.titles) ||
      c.id !== logicalId(c.file, c.titles) ||
      typeof c.project !== 'string' ||
      !Number.isInteger(c.repeatEachIndex) ||
      c.repeatEachIndex < 0
    )
      fail('invalid-case-identity');
    return instanceKey(c);
  });
  if (new Set(result).size !== result.length) fail('duplicate-case-identity');
  return sorted(result);
}

function exactCases(expected, actual) {
  if (!equal(keys(expected), keys(actual))) fail('selection-mismatch');
}

function selection(plan, composition, policy, root = ROOT) {
  if (policy === 'global' || (plan.valid && plan.result === 'global')) fail('global-required');
  if (
    policy !== 'targeted' ||
    !plan.valid ||
    plan.result !== 'candidate' ||
    plan.errors?.length ||
    plan.fallbackReasons?.length ||
    composition?.status === 'rejected' ||
    composition?.maintenance?.status === 'rejected'
  )
    fail('candidate-not-authorized');
  if (
    !composition ||
    !['not-requested', 'compatible'].includes(composition.status) ||
    !plan.changes?.some((c) => ['R1', 'R2'].includes(c.risk)) ||
    plan.changes.some((c) => !['R0', 'R1', 'R2'].includes(c.risk)) ||
    plan.contracts?.unresolved?.length ||
    plan.identityUncoveredPaths?.length
  )
    fail('evidence-insufficient');
  const files = plan.proposed?.files;
  if (
    !Array.isArray(files) ||
    !files.length ||
    new Set(files).size !== files.length ||
    files.some(
      (f) =>
        typeof f !== 'string' ||
        !/^tests\/.+\.spec\.js$/.test(f) ||
        f.includes('\\') ||
        f.split('/').some((p) => !p || p === '.' || p === '..') ||
        /[\x00-\x1f]/.test(f)
    )
  )
    fail('invalid-selected-files');
  if (
    plan.proposed.caseCount !== plan.proposed.cases?.length ||
    plan.available?.caseCount !== plan.available?.cases?.length ||
    plan.contracts?.represented?.some((c) => !c.representatives?.length)
  )
    fail('evidence-insufficient');
  exactCases(
    plan.proposed.cases,
    plan.available.cases.filter((c) => files.includes(c.file))
  );
  if (!equal(sorted(files), sorted(new Set(plan.proposed.cases.map((c) => c.file)))))
    fail('selection-mismatch');
  if (
    plan.contracts.represented.some((c) =>
      c.representatives.some((id) => !plan.proposed.cases.some((item) => item.id === id))
    )
  )
    fail('required-contract-missing');
  // Playwright treats positional arguments as regular expressions of absolute paths.
  return files.map(
    (f) =>
      '^' +
      path
        .resolve(root, f)
        .split(/[/\\]/)
        .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('[/\\\\]') +
      '$'
  );
}

function stable(plan, current) {
  const planned = plan.comparison?.worktree?.source;
  const identity = plan.comparison?.target?.identity;
  if (
    !planned?.available ||
    !current?.available ||
    !identityUsable(identity) ||
    !identityUsable(current.identity) ||
    identity.inputFingerprint !== plan.comparison.target.sourceFingerprint ||
    current.sourceFingerprint !== current.identity.inputFingerprint ||
    current.sourceFingerprint !== identity.inputFingerprint ||
    ['commit', 'tree', 'statusFingerprint'].some((f) => !planned[f] || current[f] !== planned[f]) ||
    current.identity.artifacts?.fingerprint !== identity.artifacts?.fingerprint
  )
    fail('identity-unusable-or-unstable');
}

function child(root, args, capture = false) {
  return new Promise((resolve) => {
    const proc = spawn(process.execPath, args, {
      cwd: root,
      shell: false,
      windowsHide: true,
      stdio: capture ? ['ignore', 'pipe', 'ignore'] : 'inherit',
    });
    let stdout = '',
      interrupted = null;
    const interrupt = (signal) => {
      interrupted = signal;
      proc.kill(signal);
    };
    const sigint = () => interrupt('SIGINT');
    const sigterm = () => interrupt('SIGTERM');
    process.once('SIGINT', sigint);
    process.once('SIGTERM', sigterm);
    proc.stdout?.on('data', (chunk) => {
      stdout += chunk;
      if (stdout.length > 20 * 1024 * 1024) proc.kill();
    });
    proc.once('error', () => {}); // The close event follows; do not serialize system messages.
    proc.once('close', (status, signal) => {
      process.removeListener('SIGINT', sigint);
      process.removeListener('SIGTERM', sigterm);
      resolve({ status, signal: interrupted || signal, stdout });
    });
  });
}

function successful(result, code) {
  if (result.signal) fail('interrupted');
  if (result.status !== 0) fail(code);
}

async function prepare(root) {
  prepareFixtures(root);
  const npm =
    process.env.npm_execpath ||
    path.join(path.dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js');
  if (!fs.existsSync(npm)) fail('npm-cli-unavailable');
  for (const script of ['validar:manifesto', 'test:validacao', 'build', 'format:check', 'lint'])
    successful(await child(root, [npm, 'run', script]), 'preparation-failed');
}

function verifyRun(plan, run) {
  if (!run.complete || run.schemaVersion !== 2 || run.errors?.length) fail('report-incomplete');
  exactCases(plan.proposed.cases, run.cases);
  if (!equal(plan.manifest, run.manifest)) fail('manifest-mismatch');
  stable(plan, run.source);
  stable(plan, run.sourceAtEnd);
  if (
    run.status !== 'passed' ||
    run.sourcesChangedDuringRun ||
    run.artifactsChangedDuringRun ||
    ['discovered', 'expected', 'executed', 'passed'].some(
      (key) => run.counts?.[key] !== plan.proposed.caseCount
    ) ||
    ['failed', 'flaky', 'skipped', 'notExecuted', 'interruptedAttempts', 'timedOutAttempts'].some(
      (key) => run.counts?.[key] !== 0
    ) ||
    run.cases.some(
      (c) =>
        c.outcome !== 'expected' ||
        !c.attempts?.length ||
        c.attempts.some((a) => a.status !== 'passed')
    )
  )
    fail('test-run-not-clean');
}

async function execute(root, input, services = {}) {
  const started = performance.now();
  const summary = {
    schemaVersion: 1,
    mode: input.execute ? 'execute' : 'dry-run',
    status: 'blocked',
    selectiveSuccess: false,
    policy: input.policy,
    fallback: null,
    failure: null,
    run: null,
    durationsMs: { preparation: 0, planning: 0, discovery: 0, execution: 0, total: 0 },
  };
  const directory = path.join(root, 'tmp/validacao/executor-local', crypto.randomUUID());
  fs.mkdirSync(directory, { recursive: true });
  const timed = async (stage, action) => {
    const start = performance.now();
    try {
      return await action();
    } finally {
      summary.durationsMs[stage] = performance.now() - start;
    }
  };
  let stage = 'preparation',
    plan,
    composition;
  try {
    const env = services.env ?? process.env;
    if (env.CI || env.VALIDACAO_CI_OBSERVACIONAL === '1') fail('local-only');
    if (input.execute && input.policy === 'targeted')
      await timed(stage, () => (services.prepare || prepare)(root));
    const review = input['attestation-review']
      ? loadReview(root, input['attestation-review'])
      : null;
    stage = 'planning';
    plan = await timed(stage, () =>
      (services.plan || planRepository)(root, input, () => {}, {
        review,
        onCompositionEvidence: (value) => {
          composition = value;
        },
      })
    );
    fs.writeFileSync(path.join(directory, 'plano.json'), JSON.stringify(plan, null, 2) + '\n');
    fs.writeFileSync(
      path.join(directory, 'composicao.json'),
      JSON.stringify(composition, null, 2) + '\n'
    );
    if (review) fs.writeFileSync(path.join(directory, 'revisao-atestacao.json'), review.bytes);
    const filters = selection(plan, composition, input.policy, root);
    const check = () => {
      if (review && !reviewStable(root, review)) fail('review-unstable');
      stable(plan, (services.current || provenance)(root));
      const manifest = JSON.parse(
        fs.readFileSync(path.join(root, 'validacao/manifesto.json'), 'utf8')
      );
      if (digest(JSON.stringify(manifest)) !== plan.manifest.fingerprint) fail('manifest-mismatch');
    };
    check();
    const cli = path.join(path.dirname(require.resolve('playwright/package.json')), 'cli.js');
    const args = [cli, 'test', ...filters];
    stage = 'discovery';
    const listed = await timed(stage, () =>
      (services.child || child)(root, [...args, '--list', '--reporter=json'], true)
    );
    successful(listed, 'discovery-failed');
    const discovery = JSON.parse(listed.stdout);
    if (discovery.errors?.length || discovery.config?.projects?.some((p) => p.repeatEach !== 1))
      fail('discovery-unsupported');
    exactCases(plan.proposed.cases, flattenDiscovery(discovery));
    check();
    summary.selection = { files: plan.proposed.files, cases: plan.proposed.caseCount };
    if (!input.execute) {
      summary.status = 'ready';
      return { code: 0, summary, directory };
    }
    const previous = new Set((services.runFiles || runFiles)(root));
    stage = 'execution';
    const result = await timed(stage, () => (services.child || child)(root, args));
    summary.process = { exitCode: result.status, signal: result.signal };
    const reports = (services.runFiles || runFiles)(root).filter((f) => !previous.has(f));
    if (reports.length === 1) summary.run = reports[0];
    successful(result, 'test-process-failed');
    if (reports.length !== 1) fail('new-report-missing-or-ambiguous');
    verifyRun(plan, JSON.parse(fs.readFileSync(path.join(root, summary.run), 'utf8')));
    check();
    summary.status = 'passed';
    summary.selectiveSuccess = true;
    return { code: 0, summary, directory };
  } catch (error) {
    summary.failure = { stage, code: error.safeCode || 'stage-failed' };
    if (error.safeCode === 'global-required') {
      summary.status = 'global-required';
      summary.fallback = 'npm test';
    } else if (stage === 'execution') summary.status = 'failed';
    return { code: summary.status === 'global-required' ? 2 : 1, summary, directory };
  } finally {
    summary.durationsMs.total = performance.now() - started;
    fs.writeFileSync(path.join(directory, 'resumo.json'), JSON.stringify(summary, null, 2) + '\n');
    fs.writeFileSync(
      path.join(directory, 'resumo.md'),
      `Resultado: ${summary.status}\n\nSucesso seletivo: ${summary.selectiveSuccess}\n\n` +
        `Motivo: ${summary.failure?.code || 'none'}\n\nFallback: ${summary.fallback || 'none'}\n\n` +
        `Durações reais (ms): ${JSON.stringify(summary.durationsMs)}\n`
    );
  }
}

if (require.main === module) {
  (async () => {
    try {
      const result = await execute(ROOT, parse(process.argv.slice(2)));
      console.log(
        `Executor local: ${result.summary.status}; resumo: ${path.relative(ROOT, result.directory)}`
      );
      process.exitCode = result.code;
    } catch {
      console.error('Executor local: opções inválidas; consulte validacao/PLANEJADOR.md.');
      process.exitCode = 1;
    }
  })();
}
module.exports = { parse, selection, stable, exactCases, verifyRun, execute };
