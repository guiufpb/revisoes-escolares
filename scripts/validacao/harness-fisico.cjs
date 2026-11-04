'use strict';
// Owned synthetic fixtures only. No entry point accepts a root/source/target path.
const { spawn } = require('node:child_process');
const path = require('node:path');
const readline = require('node:readline');
const { setTimeout, clearTimeout } = require('node:timers');
const { inspect } = require('./inventario-seguro.cjs');
const { adaptInventory } = require('./inventario-evidencias.cjs');
const {
  runHarness,
  generateCounter,
  identity,
  SCENARIO_ID,
} = require('./harness-temporario-sintetico.cjs');
const { simulateSyntheticBatch } = require('./simulador-sintetico.cjs');
const ROOT = path.resolve(__dirname, '../..');
const BACKEND = path.join(__dirname, 'harness-fisico-win.py');

async function createHarness(runId, assisted) {
  const ids = identity(runId),
    proof = runHarness(runId);
  if (process.platform !== 'win32') return { supported: false, issue: 'platform-unsupported' };
  const backend = assisted ? path.join(__dirname, 'harness-recuperacao-win.py') : BACKEND;
  const child = spawn('python', ['-I', '-B', '-u', backend], {
    cwd: ROOT,
    windowsHide: true,
    shell: false,
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  let pending = null,
    ended = false,
    closing = false,
    lost = false,
    transportIssue = null;
  const events = [];
  const lines = readline.createInterface({ input: child.stdout });
  const stop = (issue) => {
    if (!closing) lost = true;
    ended = true;
    transportIssue = issue;
    if (pending) {
      pending.resolve({ ok: false, issue, state: 'indeterminate' });
      clearTimeout(pending.timer);
      pending = null;
    }
  };
  const closed = new Promise((resolve) => child.once('close', resolve));
  child.on('error', () => stop('backend-unavailable'));
  child.on('close', () => stop('backend-session-lost'));
  child.stdin.on('error', () => stop('backend-session-lost'));
  child.stderr.resume(); // Native exception text/paths never enter diagnostics.
  lines.on('line', (line) => {
    if (!pending) return;
    const current = pending;
    pending = null;
    clearTimeout(current.timer);
    try {
      current.resolve(
        line.length <= 8192 ? JSON.parse(line) : { ok: false, issue: 'response-limit' }
      );
    } catch {
      current.resolve({ ok: false, issue: 'response-invalid' });
    }
  });
  async function request(data) {
    if (ended) return { ok: false, issue: transportIssue, state: 'indeterminate' };
    if (pending) return { ok: false, issue: 'concurrent-request-refused' };
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        stop('backend-timeout');
        child.kill();
      }, 10000);
      pending = { resolve, timer };
      child.stdin.write(JSON.stringify(data) + '\n', (error) => {
        if (error) stop('backend-session-lost');
      });
    });
  }
  const receipt = await request({
    op: 'create',
    runId,
    content: proof.artifact.content,
    regenerations: [generateCounter(runId), generateCounter(runId)],
  });
  if (!receipt.ok) {
    child.stdin.end();
    await closed;
    return { supported: false, issue: receipt.issue };
  }
  let simulation = null,
    grant = false;
  const operation = async (op, extra = {}) => {
    const result = await request({ op, ...extra });
    events.push({
      operation: op,
      ok: result.ok,
      issue: result.issue || null,
      state: result.state || null,
      identity: result.identity ? structuredClone(result.identity) : null,
      sha256: result.sha256 || null,
      nativeCode: result.nativeCode || null,
      ...(assisted
        ? {
            executorExitCode: result.executorExitCode ?? null,
            anchorAlive: result.anchorAlive ?? null,
          }
        : {}),
    });
    return result;
  };
  const refuse = (op, issue) => {
    events.push({
      operation: op,
      ok: false,
      issue,
      state: null,
      identity: null,
      sha256: null,
      nativeCode: null,
    });
    return { ok: false, issue };
  };
  // A live capability over backend-created handles; cannot be reconstructed from a marker.
  return {
    supported: true,
    fixtureRoot: receipt.root, // For harness tests only; public report below omits absolute paths.
    descriptor: Object.freeze({ ...ids, rootId: receipt.rootId }),
    ...(assisted
      ? {
          creationReceipt: Object.freeze(structuredClone(receipt.recoveryReceipt)),
          async identifyRecovery(candidateReceipt) {
            return operation('identify-recovery', { receipt: candidateReceipt });
          },
          async authorizeRecovery(selection) {
            return operation('authorize-recovery', { selection });
          },
          async restoreAfterExit(fault) {
            if (![undefined, 'before-rename', 'after-rename', 'process-exit'].includes(fault))
              return refuse('restore-assisted', 'fault-refused');
            return operation('restore-assisted', { fault });
          },
          async endAnchorForTest() {
            return operation('anchor-exit');
          },
        }
      : {}),
    async simulate(options = {}) {
      grant = false;
      simulation = null;
      const invalidated = await operation('invalidate-simulation');
      if (!invalidated.ok) return { status: 'rejected', cleanupAuthorization: 'none' };
      if (
        Object.keys(options).some((k) => !['activeConsumer', 'duplicate', 'wrongScope'].includes(k))
      )
        return { status: 'rejected', cleanupAuthorization: 'none' };
      const verified = await operation('verify');
      if (
        !verified.ok ||
        receipt.sha256 !== proof.artifact.sha256 ||
        receipt.size !== Buffer.byteLength(proof.artifact.content) ||
        receipt.attempts.length !== 2 ||
        !receipt.attempts.every((hash) => hash === proof.artifact.sha256)
      )
        return { status: 'rejected', cleanupAuthorization: 'none' };
      if (!['source', 'quarantine'].includes(verified.state))
        return { status: 'rejected', cleanupAuthorization: 'none' };
      const relative = path.relative(
        ROOT,
        path.join(
          receipt.root,
          'source',
          verified.state === 'source' ? 'counter.bin' : 'quarantined.bin'
        )
      );
      const inventory = inspect(ROOT, [relative]);
      const observedAt = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
      const inspection = adaptInventory(inventory, { observedAt, resourceIds: [ids.resourceId] });
      const physicalProof = structuredClone(proof);
      physicalProof.regeneration.attempts = [...receipt.attempts];
      if (options.activeConsumer) physicalProof.lifecycle.splice(2, 1);
      const row = {
        resourceId: ids.resourceId,
        scopeId: options.wrongScope ? 'different' : ids.scopeId,
        input: { proof: physicalProof, inspection },
        context: { scenarioId: SCENARIO_ID, runId, observedAt },
      };
      simulation = simulateSyntheticBatch({
        batchVersion: 1,
        resources: options.duplicate ? [row, structuredClone(row)] : [row],
      });
      if (simulation.resources.length === 1 && simulation.resources[0].status === 'recognized')
        await operation('bind-simulation', {
          ...ids,
          fileId: receipt.identity.fileId,
          result: 'recognized',
          cleanupAuthorization: simulation.cleanupAuthorization,
        });
      return structuredClone(simulation);
    },
    async authorize(authorization) {
      if (
        !authorization ||
        typeof authorization !== 'object' ||
        Object.keys(authorization).some(
          (key) => !['runId', 'rootId', 'scopeId', 'resourceId', 'intent'].includes(key)
        ) ||
        authorization.intent !== 'quarantine-and-restore-owned-synthetic' ||
        authorization.resourceId !== ids.resourceId ||
        authorization.scopeId !== ids.scopeId ||
        authorization.rootId !== receipt.rootId ||
        !simulation ||
        simulation.resources.length !== 1 ||
        simulation.resources[0].status !== 'recognized'
      )
        return refuse('authorize', 'authorization-refused');
      const result = await operation('authorize', authorization);
      grant = result.ok;
      return result;
    },
    async quarantine(fault) {
      if (![undefined, 'before-rename', 'after-rename', 'process-exit'].includes(fault))
        return refuse('quarantine', 'fault-refused');
      return operation('quarantine', { fault });
    },
    async restore(fault) {
      if (![undefined, 'before-rename', 'after-rename', 'process-exit'].includes(fault))
        return refuse('restore', 'fault-refused');
      return operation('restore', { fault });
    },
    async recover() {
      return operation('recover');
    },
    async verify() {
      return operation('verify');
    },
    async injectFault(kind) {
      if (
        !['tamper', 'hardlink', 'collision', 'identity', 'consumer'].includes(kind) &&
        !(assisted && ['same-size', 'executor-start'].includes(kind))
      )
        return refuse('inject-fault', 'fault-refused');
      return operation('fault-' + kind);
    },
    async probeLink(name) {
      return operation('probe-link', { name });
    },
    report() {
      return {
        physicalPilotVersion: 1,
        ...(assisted
          ? {
              assistedRecoveryVersion: 1,
              trustAnchor: 'live-creation-handles',
              recoveryAfterAnchorExit: 'blocked',
            }
          : {}),
        perimeter: path.basename(receipt.root),
        rootId: receipt.rootId,
        resourceId: ids.resourceId,
        scopeId: ids.scopeId,
        identity: structuredClone(receipt.identity),
        sha256: receipt.sha256,
        size: receipt.size,
        physicalRegenerations: [...receipt.attempts],
        explicitTestAuthorization: grant,
        simulation: simulation ? structuredClone(simulation) : null,
        events: structuredClone(events),
        sessionLost: lost,
        limits: [
          assisted
            ? 'A separate live anchor retains creation handles across executor death.'
            : 'Only this live harness owns the created handles.',
          'Lost sessions require explicit verified recovery; never trust a marker alone.',
          'Not a general maintenance or permanent deletion tool.',
        ],
      };
    },
    async close() {
      closing = true;
      if (!ended) child.stdin.end();
      await closed;
      lines.close();
    },
  };
}
const createPhysicalHarness = (runId) => createHarness(runId, false);
const createAssistedPhysicalHarness = (runId) => createHarness(runId, true);
module.exports = { createPhysicalHarness, createAssistedPhysicalHarness };
