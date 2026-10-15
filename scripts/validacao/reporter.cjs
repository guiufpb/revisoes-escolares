'use strict';

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const { ROOT, MANIFEST, BASELINE, readJson, digest } = require('./manifesto.cjs');
const { provenance } = require('./identidade.cjs');
const { slash } = require('./fontes.cjs');
const { fromTest, classify } = require('./catalogo.cjs');

// Não inclui mensagem/stack, stdout, anotações livres ou attachments: podem conter dados privados.
function safeError(error, kind = 'runner-error') {
  return {
    kind,
    fingerprint: digest(String(error.message || error.value || 'unknown')),
    reason: 'Details omitted; use existing local Playwright diagnostics.',
  };
}

class ValidationReporter {
  constructor(options = {}) {
    this.root = options.root || ROOT;
    this.records = new Map();
    this.errors = [];
    this.runId = new Date().toISOString().replace(/[:.]/g, '-') + '-' + crypto.randomUUID();
    this.directory = path.join(this.root, 'tmp', 'validacao', this.runId);
    fs.mkdirSync(this.directory, { recursive: true });
    this.events = path.join(this.directory, 'attempts.jsonl');
  }

  printsToStdio() {
    return false;
  }

  onBegin(config, suite) {
    this.config = config;
    this.suite = suite;
    const manifest = readJson(this.root, MANIFEST);
    const baseline = readJson(this.root, BASELINE);
    this.manifest = manifest;
    const all = suite.allTests();
    const instances = new Set();
    for (const test of all) {
      const identity = fromTest(test, this.root);
      const key = JSON.stringify([identity.id, identity.project, identity.repeatEachIndex]);
      let association;
      try {
        if (instances.has(key)) throw new Error('Duplicate logical case in project/repetition');
        instances.add(key);
        association = classify(manifest, identity);
      } catch (error) {
        this.errors.push(safeError(error, 'manifest-association'));
        association = { unresolved: true };
      }
      this.records.set(test.id, {
        ...identity,
        association,
        attempts: [],
        outcome: 'not-executed',
      });
    }
    let browsers = [];
    try {
      browsers = JSON.parse(
        fs.readFileSync(
          path.join(path.dirname(require.resolve('playwright-core/package.json')), 'browsers.json'),
          'utf8'
        )
      ).browsers;
    } catch {
      /* versão do runtime permanece explicitamente desconhecida */
    }
    this.report = {
      schemaVersion: 2,
      runId: this.runId,
      status: 'running',
      complete: false,
      source: provenance(this.root),
      manifest: {
        version: manifest.version,
        schemaVersion: manifest.schemaVersion,
        fingerprint: digest(JSON.stringify(manifest)),
      },
      environment: {
        platform: os.platform(),
        architecture: os.arch(),
        node: process.version,
        playwright: require('playwright/package.json').version,
        workers: config.workers,
        fullyParallel: config.fullyParallel,
        retries: config.projects.map((p) => p.retries),
        projects: config.projects.map((p) => ({
          name: p.name,
          browserName: p.use.browserName || 'chromium',
          packageBrowserVersion: p.use.launchOptions?.executablePath
            ? null
            : browsers.find((b) => b.name === (p.use.browserName || 'chromium'))?.browserVersion ||
              null,
          browserVersionEvidence: 'package metadata; runtime version not observed',
          baseURL: p.use.baseURL || null,
          viewport: p.use.viewport || null,
        })),
        configuration: config.configFile
          ? slash(path.relative(this.root, config.configFile))
          : null,
        shard: config.shard,
        repeatEach: config.projects.map((p) => p.repeatEach),
      },
      timing: {
        startedAt: new Date().toISOString(),
        finishedAt: null,
        durationMs: null,
        scope: 'Playwright FullResult; excludes npm pretest/build; no hook/body decomposition',
      },
      scope: {
        inventoryBaseCount: baseline.caseCount,
        discoveredForInvocation: [...this.records.values()].map((r) => ({
          id: r.id,
          nativeId: r.nativeId,
          project: r.project,
          repeatEachIndex: r.repeatEachIndex,
        })),
        expectedBasis:
          'runner suite after invocation filters; not an independent global-coverage assertion',
        expectedForInvocation: [...this.records.keys()],
        executed: [],
      },
      counts: null,
      errors: this.errors,
      cases: [...this.records.values()],
      privacy:
        'No progress, audio, answers, credentials, free-form errors, stdout or attachments collected.',
    };
    this.write();
  }

  onTestEnd(test, result) {
    const record = this.records.get(test.id);
    if (!record) {
      this.errors.push({
        kind: 'undiscovered-case',
        reason: 'Runner emitted an undiscovered case.',
      });
      return;
    }
    const attempt = {
      retry: result.retry,
      status: result.status,
      expectedStatus: test.expectedStatus,
      durationMs: result.duration,
      startedAt: result.startTime.toISOString(),
      workerIndex: result.workerIndex,
      parallelIndex: result.parallelIndex,
      errors: result.errors.map((error) =>
        safeError(error, result.status === 'timedOut' ? 'timeout' : 'test-error')
      ),
      skipReason:
        result.status === 'skipped'
          ? test.annotations.some((a) => a.type === 'skip')
            ? 'runner-skip-annotation; description omitted'
            : 'runner-skipped; description unavailable'
          : null,
    };
    record.attempts.push(attempt);
    record.outcome = test.outcome();
    fs.appendFileSync(
      this.events,
      JSON.stringify({
        id: record.id,
        nativeId: record.nativeId,
        project: record.project,
        repeatEachIndex: record.repeatEachIndex,
        attempt,
      }) + '\n'
    );
  }

  onError(error) {
    this.errors.push(safeError(error));
  }

  onEnd(result) {
    // onBegin pode não ocorrer, por exemplo em erro de configuração/descoberta.
    if (!this.report) {
      this.report = {
        schemaVersion: 2,
        runId: this.runId,
        status: result.status,
        complete: false,
        source: provenance(this.root),
        errors: this.errors,
        cases: [],
        counts: null,
      };
    } else {
      const records = [...this.records.values()];
      const attempts = records.flatMap((r) => r.attempts);
      this.report.scope.executed = records
        .filter((r) => r.attempts.some((a) => a.status !== 'skipped'))
        .map((r) => r.nativeId);
      this.report.counts = {
        discovered: records.length,
        expected: records.length,
        executed: this.report.scope.executed.length,
        passed: records.filter((r) => r.outcome === 'expected').length,
        failed: records.filter((r) => r.outcome === 'unexpected').length,
        flaky: records.filter((r) => r.outcome === 'flaky').length,
        skipped: records.filter((r) => r.outcome === 'skipped').length,
        notExecuted: records.filter((r) => r.attempts.length === 0).length,
        attempts: attempts.length,
        retries: attempts.filter((a) => a.retry > 0).length,
        interruptedAttempts: attempts.filter((a) => a.status === 'interrupted').length,
        timedOutAttempts: attempts.filter((a) => a.status === 'timedOut').length,
      };
      this.report.timing = {
        ...this.report.timing,
        startedAt: result.startTime.toISOString(),
        finishedAt: new Date().toISOString(),
        durationMs: result.duration,
      };
      if (result.status === 'passed' && this.report.counts.notExecuted)
        this.errors.push({ kind: 'missing-execution', reason: 'Expected cases without results.' });
      this.report.status = result.status;
      this.report.complete = true;
      this.report.sourceAtEnd = provenance(this.root);
      this.report.sourcesChangedDuringRun =
        this.report.source.sourceFingerprint !== this.report.sourceAtEnd.sourceFingerprint;
      this.report.artifactsChangedDuringRun =
        this.report.source.identity?.artifacts.fingerprint !==
        this.report.sourceAtEnd.identity?.artifacts.fingerprint;
    }
    if (this.errors.length && result.status === 'passed') this.report.status = 'failed';
    this.write();
    if (this.errors.length && result.status === 'passed') return { status: 'failed' };
  }

  write() {
    const output = path.join(this.directory, 'run.json');
    fs.writeFileSync(output + '.tmp', JSON.stringify(this.report, null, 2) + '\n');
    fs.renameSync(output + '.tmp', output);
  }
}

module.exports = ValidationReporter;
module.exports.provenance = provenance;
module.exports.safeError = safeError;
