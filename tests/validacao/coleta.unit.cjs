'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { test } = require('node:test');
const { ROOT } = require('../../scripts/validacao/manifesto.cjs');
const { safeError, provenance } = require('../../scripts/validacao/reporter.cjs');

test('coleta real do runner: sucesso, falha sintética e escopo direcionado', () => {
  const parent = path.join(ROOT, 'tmp');
  fs.mkdirSync(parent, { recursive: true });
  const root = fs.mkdtempSync(path.join(parent, 'coleta-fixture-'));
  fs.mkdirSync(path.join(root, 'validacao'));
  fs.mkdirSync(path.join(root, 'tests'));
  const testApi = require.resolve('@playwright/test');
  const reporter = path.join(ROOT, 'scripts/validacao/reporter.cjs');
  fs.writeFileSync(
    path.join(root, 'tests/sintetico.spec.cjs'),
    `const {test,expect}=require(${JSON.stringify(testApi)});
test('sucesso sintético',()=>expect(2+2).toBe(4));
test('falha sintética',()=>{throw new Error('SEGREDO_SINTETICO_NAO_EXPORTAR')});\n`
  );
  fs.writeFileSync(
    path.join(root, 'playwright.config.cjs'),
    `module.exports={testDir:'./tests',workers:1,reporter:[[${JSON.stringify(reporter)},{root:${JSON.stringify(root)}}]],outputDir:'./resultados'};\n`
  );
  fs.writeFileSync(
    path.join(root, 'validacao/base-14584b2.json'),
    JSON.stringify({ caseCount: 571 })
  );
  fs.writeFileSync(
    path.join(root, 'validacao/manifesto.json'),
    JSON.stringify({
      schemaVersion: 1,
      version: 'synthetic-fixture',
      tests: [
        {
          file: 'tests/sintetico.spec.cjs',
          revisions: ['alice-ciencias-fixture'],
          engines: ['fixture'],
          capabilities: [],
          contracts: ['sintetico'],
          defaults: {
            coverage: ['behavioral-contract'],
            oracle: 'not-applicable',
            journeyScope: 'contract',
            limitations: ['Synthetic fixture only.'],
          },
          cases: [],
        },
      ],
    })
  );
  const cli = path.join(path.dirname(require.resolve('playwright/package.json')), 'cli.js');
  const reports = [];
  for (const [grep, exitCode, expected, passed, failed] of [
    ['sucesso', 0, 1, 1, 0],
    ['falha', 1, 1, 0, 1],
    ['sintétic', 1, 2, 1, 1],
  ]) {
    const previous = new Set(
      fs.existsSync(path.join(root, 'tmp/validacao'))
        ? fs.readdirSync(path.join(root, 'tmp/validacao'))
        : []
    );
    const result = spawnSync(
      process.execPath,
      [cli, 'test', '--config', 'playwright.config.cjs', '--grep', grep],
      {
        cwd: root,
        encoding: 'utf8',
        timeout: 60000,
        windowsHide: true,
      }
    );
    assert.equal(result.status, exitCode, result.stderr || result.stdout);
    const folder = fs.readdirSync(path.join(root, 'tmp/validacao')).find((f) => !previous.has(f));
    const raw = fs.readFileSync(path.join(root, 'tmp/validacao', folder, 'run.json'), 'utf8');
    const report = JSON.parse(raw);
    assert.equal(report.complete, true);
    assert.equal(report.counts.expected, expected);
    assert.equal(report.counts.executed, expected);
    assert.equal(report.counts.passed, passed);
    assert.equal(report.counts.failed, failed);
    assert.equal(report.counts.retries, 0);
    assert.equal(report.counts.skipped, 0);
    assert.ok(report.timing.durationMs > 0);
    assert.equal(report.scope.inventoryBaseCount, 571);
    assert.equal(report.cases[0].association.revisions[0], 'alice-ciencias-fixture');
    assert.match(report.cases[0].id, /^case-[a-f0-9]{64}$/);
    assert.ok(report.cases.every((c) => c.nativeId && c.attempts.length === 1));
    assert.ok(!raw.includes('SEGREDO_SINTETICO_NAO_EXPORTAR'));
    assert.ok(!raw.includes(root));
    reports.push({ status: report.status, expected, passed, failed });
  }
  // Guarda apenas exemplos sanitizados para inspeção; fontes/diagnósticos da fixture ficam em tmp.
  fs.writeFileSync(
    path.join(root, 'evidencia-coleta.json'),
    JSON.stringify(reports, null, 2) + '\n'
  );
});

test('erros são minimizados e a checkout modificada não é atribuída ao commit', () => {
  const safe = safeError({ message: 'SEGREDO_SINTETICO' });
  assert.ok(!JSON.stringify(safe).includes('SEGREDO_SINTETICO'));
  const source = provenance(ROOT);
  assert.equal(source.available, true);
  assert.equal(
    source.contentIdentity,
    source.dirty ? 'working-tree-not-identical-to-commit' : 'clean-tracked-tree'
  );
  assert.match(source.sourceFingerprint, /^[a-f0-9]{64}$/);
  const fixtureRoot = fs.mkdtempSync(path.join(ROOT, 'tmp/provenance-fixture-'));
  fs.writeFileSync(path.join(fixtureRoot, 'package.json'), '{}');
  const gitRead = (...args) => {
    if (args[0] === 'status') return ' M package.json\0';
    if (args[0] === 'ls-files') return args.includes('--others') ? '' : 'package.json\0';
    if (args[1] === '--show-toplevel') return fixtureRoot;
    if (args[1] === 'HEAD') return 'a'.repeat(40);
    if (args[1] === 'HEAD^{tree}') return 'b'.repeat(40);
    throw new Error('Unexpected synthetic Git read');
  };
  const dirty = provenance(fixtureRoot, gitRead);
  assert.equal(dirty.available, true);
  assert.equal(dirty.dirty, true);
  assert.equal(dirty.contentIdentity, 'working-tree-not-identical-to-commit');
  assert.equal(dirty.commit, 'a'.repeat(40));
});
