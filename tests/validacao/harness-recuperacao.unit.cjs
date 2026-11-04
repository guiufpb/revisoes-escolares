'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createAssistedPhysicalHarness } = require('../../scripts/validacao/harness-fisico.cjs');
const {
  generateCounter,
  digest,
} = require('../../scripts/validacao/harness-temporario-sintetico.cjs');
const INITIAL = 'quarantine-and-restore-owned-synthetic';
const RECOVERY = 'restore-owned-synthetic-after-worker-exit';
let sequence = 0;
async function fixture(body) {
  const run = 'assisted-test-' + ++sequence;
  const h = await createAssistedPhysicalHarness(run);
  assert.equal(h.supported, true, h.issue);
  try {
    await body(h, run);
  } finally {
    await h.close();
  }
}
async function interrupt(h, fault = 'process-exit') {
  assert.equal((await h.simulate()).cleanupAuthorization, 'none');
  assert.equal((await h.authorize({ ...h.descriptor, intent: INITIAL })).ok, true);
  const stopped = await h.quarantine(fault);
  assert.equal(stopped.ok, false);
  assert.equal(stopped.issue, 'executor-session-lost');
  assert.equal(stopped.executorExitCode, fault === 'before-rename' ? 8 : 7);
  assert.equal(stopped.state, 'indeterminate');
  assert.equal(stopped.anchorAlive, true);
  assert.equal(h.report().sessionLost, false);
}
async function select(h) {
  const identified = await h.identifyRecovery(h.creationReceipt);
  assert.equal(identified.ok, true, identified.issue);
  assert.equal(identified.state, 'quarantine');
  assert.equal(identified.recoveryNeeded, true);
  return { ...identified.selection, intent: RECOVERY };
}
async function readyRecovery(h) {
  const selection = await select(h);
  assert.equal((await h.authorizeRecovery(selection)).ok, true);
  return selection;
}
function read(root, name) {
  return fs.readFileSync(path.join(root, 'source', name), 'utf8');
}

if (process.platform !== 'win32') {
  test('assisted recovery refuses unsupported platforms without touching disk', async () => {
    assert.deepEqual(await createAssistedPhysicalHarness('unsupported'), {
      supported: false,
      issue: 'platform-unsupported',
    });
  });
} else {
  test('live independent anchor permits verified restoration after actual executor death', async () => {
    let root, run, receipt;
    await fixture(async (h, runId) => {
      root = h.fixtureRoot;
      run = runId;
      receipt = structuredClone(h.creationReceipt);
      assert.equal(receipt.fileId, h.report().identity.fileId);
      assert.equal(receipt.rootId, h.descriptor.rootId);
      assert.equal(receipt.sha256, digest(generateCounter(run)));
      assert.equal(JSON.stringify(receipt).includes(root), false);
      await interrupt(h);
      assert.equal((await h.restore()).issue, 'recovery-authorization-required');
      const originalSelection = await readyRecovery(h);
      const restored = await h.restoreAfterExit();
      assert.equal(restored.ok, true, restored.issue);
      assert.equal(restored.state, 'source');
      assert.equal(restored.identity.fileId, receipt.fileId);
      assert.equal(restored.sha256, receipt.sha256);
      assert.equal(restored.sentinelUnchanged, true);
      assert.equal(restored.executorExitCode, 0);
      assert.equal((await h.restoreAfterExit()).issue, 'recovery-authorization-required');
      assert.equal(
        (await h.authorizeRecovery(originalSelection)).issue,
        'recovery-authorization-refused'
      );
      const report = h.report();
      assert.equal(report.simulation.cleanupAuthorization, 'none');
      assert.equal(report.simulation.resources[0].cleanupAuthorization, 'none');
      assert.equal(JSON.stringify(report).includes(root), false);
      assert.ok(report.events.some((e) => e.executorExitCode === 7 && e.anchorAlive));
    });
    assert.equal(read(root, 'counter.bin'), generateCounter(run));
    assert.equal(fs.existsSync(path.join(root, 'source/quarantined.bin')), false);
    const events = fs
      .readFileSync(path.join(root, 'journal.jsonl'), 'utf8')
      .trim()
      .split('\n')
      .map(JSON.parse);
    const names = events.map((e) => e.event);
    assert.ok(names.includes('independent-live-anchor-established'));
    assert.ok(
      names.indexOf('quarantine-intent') < names.indexOf('executor-ended-without-confirmation')
    );
    assert.ok(
      names.indexOf('new-limited-recovery-authorization') < names.indexOf('restore-intent')
    );
    assert.ok(names.includes('restore-verified'));
    assert.ok(!names.includes('quarantine-verified'));
  });

  for (const [label, mutate] of [
    ['absent', () => undefined],
    ['empty', () => ({})],
    ['false version', (r) => ({ ...r, receiptVersion: true })],
    ['future version', (r) => ({ ...r, receiptVersion: 2 })],
    ['forged anchor', (r) => ({ ...r, anchorId: '0'.repeat(64) })],
    ['divergent file', (r) => ({ ...r, fileId: 'other' })],
    ['divergent volume/root', (r) => ({ ...r, rootId: 'other' })],
    [
      'divergent directory',
      (r) => ({ ...r, directoryIds: { ...r.directoryIds, source: 'other' } }),
    ],
    ['divergent content', (r) => ({ ...r, sha256: '0'.repeat(64) })],
    ['unknown field/path', (r) => ({ ...r, path: '../external' })],
  ]) {
    test('untrusted receipt blocks recovery without moving data: ' + label, async () =>
      fixture(async (h, run) => {
        await interrupt(h);
        const candidate = mutate(structuredClone(h.creationReceipt));
        const before = candidate === undefined ? undefined : structuredClone(candidate);
        assert.equal((await h.identifyRecovery(candidate)).issue, 'creation-receipt-untrusted');
        assert.deepEqual(candidate, before);
        assert.equal((await h.restoreAfterExit()).issue, 'recovery-authorization-required');
        assert.equal((await h.verify()).state, 'quarantine');
        await h.close();
        assert.equal(read(h.fixtureRoot, 'quarantined.bin'), generateCounter(run));
      })
    );
  }

  test('no pending operation, recognized status and old initial grant never authorize recovery', async () =>
    fixture(async (h) => {
      assert.equal((await h.identifyRecovery(h.creationReceipt)).issue, 'no-pending-recovery');
      await h.simulate();
      assert.equal(
        (await h.authorize({ ...h.descriptor, runId: 'other', intent: INITIAL })).issue,
        'authorization-refused'
      );
      assert.equal((await h.restoreAfterExit()).issue, 'recovery-authorization-required');
      await interrupt(h);
      assert.equal(
        (await h.authorize({ ...h.descriptor, intent: INITIAL })).issue,
        'recovery-authorization-required'
      );
      const selection = await select(h);
      assert.equal((await h.restoreAfterExit()).issue, 'recovery-authorization-required');
      for (const invalid of [
        null,
        { ...selection, intent: INITIAL },
        { ...selection, resourceId: 'other' },
        { ...selection, path: 'counter.bin' },
      ]) {
        assert.equal((await h.authorizeRecovery(invalid)).issue, 'recovery-authorization-refused');
      }
      assert.equal((await h.verify()).state, 'quarantine');
    }));

  test('new selection invalidates previous selection and bad receipt revokes a grant', async () =>
    fixture(async (h) => {
      await interrupt(h);
      const first = await select(h);
      const second = await select(h);
      assert.notEqual(first.selectionId, second.selectionId);
      assert.equal((await h.authorizeRecovery(first)).issue, 'recovery-authorization-refused');
      assert.equal((await h.authorizeRecovery(second)).ok, true);
      assert.equal((await h.identifyRecovery({})).ok, false);
      assert.equal((await h.restoreAfterExit()).issue, 'recovery-authorization-required');
      await readyRecovery(h);
      assert.equal((await h.restoreAfterExit()).ok, true);
    }));

  for (const fault of ['tamper', 'same-size', 'identity', 'hardlink', 'consumer']) {
    test('recovery revalidation refuses compromised scenario: ' + fault, async () =>
      fixture(async (h) => {
        await interrupt(h);
        await readyRecovery(h);
        assert.equal((await h.injectFault(fault)).ok, true);
        const attempt = await h.restoreAfterExit();
        assert.equal(attempt.ok, false);
        assert.ok(
          [
            'resource-identity-or-size-mismatch',
            'content-mismatch',
            'location-indeterminate',
            'hardlink-refused',
            'consumer-active',
          ].includes(attempt.issue),
          attempt.issue
        );
        assert.equal((await h.restoreAfterExit()).issue, 'recovery-authorization-required');
        assert.equal((await h.identifyRecovery(h.creationReceipt)).ok, false);
        assert.ok(!h.report().events.some((e) => e.operation === 'restore-assisted' && e.ok));
      })
    );
  }

  test('occupied restoration destination is preserved and authorization cannot be reused', async () =>
    fixture(async (h, run) => {
      await interrupt(h);
      await readyRecovery(h);
      await h.injectFault('collision');
      const refused = await h.restoreAfterExit();
      assert.equal(refused.ok, false);
      assert.equal(refused.issue, 'destination-exists');
      assert.equal((await h.verify()).state, 'quarantine');
      assert.equal((await h.restoreAfterExit()).issue, 'recovery-authorization-required');
      assert.equal((await h.identifyRecovery(h.creationReceipt)).issue, 'destination-exists');
      await h.close();
      assert.equal(read(h.fixtureRoot, 'counter.bin'), 'owned destination sentinel');
      assert.equal(read(h.fixtureRoot, 'quarantined.bin'), generateCounter(run));
    }));

  for (const fault of ['before-rename', 'after-rename', 'process-exit']) {
    test(
      'interrupted restoration is reconciled from anchor, with no grant replay: ' + fault,
      async () =>
        fixture(async (h) => {
          await interrupt(h);
          const previous = await readyRecovery(h);
          const result = await h.restoreAfterExit(fault);
          assert.equal(result.issue, 'executor-session-lost');
          assert.equal(result.executorExitCode, fault === 'before-rename' ? 8 : 7);
          assert.equal((await h.restoreAfterExit()).issue, 'recovery-authorization-required');
          assert.equal(
            (await h.authorizeRecovery(previous)).issue,
            'recovery-authorization-refused'
          );
          const observation = await h.identifyRecovery(h.creationReceipt);
          assert.equal(observation.ok, true);
          if (fault === 'before-rename') {
            assert.equal(observation.state, 'quarantine');
            assert.equal(
              (await h.authorizeRecovery({ ...observation.selection, intent: RECOVERY })).ok,
              true
            );
            assert.equal((await h.restoreAfterExit()).ok, true);
          } else {
            assert.equal(observation.state, 'source');
            assert.equal(observation.recoveryNeeded, false);
            assert.equal(observation.selection, null);
          }
        })
    );
  }

  test('quarantine interrupted before rename is diagnosed as still source, never moved for recovery', async () =>
    fixture(async (h) => {
      await interrupt(h, 'before-rename');
      const observed = await h.identifyRecovery(h.creationReceipt);
      assert.equal(observed.ok, true);
      assert.equal(observed.state, 'source');
      assert.equal(observed.recoveryNeeded, false);
      assert.equal((await h.restoreAfterExit()).issue, 'recovery-authorization-required');
    }));

  test('failure to start restoration consumes grant, retains data, and requires a new explicit selection', async () =>
    fixture(async (h) => {
      await interrupt(h);
      const old = await readyRecovery(h);
      await h.injectFault('executor-start');
      const failure = await h.restoreAfterExit();
      assert.equal(failure.issue, 'anchor-operation-unavailable');
      assert.equal(failure.state, 'indeterminate');
      assert.equal((await h.verify()).state, 'quarantine');
      assert.equal((await h.restoreAfterExit()).issue, 'recovery-authorization-required');
      assert.equal((await h.authorizeRecovery(old)).issue, 'recovery-authorization-refused');
      await readyRecovery(h);
      assert.equal((await h.restoreAfterExit()).ok, true);
    }));

  test('actual external writes, replacement and directory rename stay blocked across worker death', async () =>
    fixture(async (h) => {
      await interrupt(h);
      await readyRecovery(h);
      const source = path.join(h.fixtureRoot, 'source');
      assert.throws(() => fs.openSync(path.join(source, 'quarantined.bin'), 'r+'));
      assert.throws(() =>
        fs.renameSync(path.join(source, 'quarantined.bin'), path.join(source, 'swapped.bin'))
      );
      assert.throws(() => fs.renameSync(source, path.join(h.fixtureRoot, 'swapped-source')));
      assert.throws(() => fs.openSync(source, 'r+'));
      assert.equal((await h.restoreAfterExit()).ok, true);
    }));

  test('anchor death blocks receipt adoption by any new scenario; all fixtures remain intact', async () => {
    let receipt, root, run;
    await fixture(async (h, id) => {
      await interrupt(h);
      receipt = structuredClone(h.creationReceipt);
      root = h.fixtureRoot;
      run = id;
      assert.equal((await h.endAnchorForTest()).issue, 'backend-session-lost');
      assert.equal((await h.identifyRecovery(receipt)).issue, 'backend-session-lost');
      assert.equal((await h.restoreAfterExit()).issue, 'backend-session-lost');
    });
    const original = read(root, 'quarantined.bin');
    await fixture(async (h) => {
      assert.notEqual(h.fixtureRoot, root);
      assert.notEqual(h.creationReceipt.anchorId, receipt.anchorId);
      assert.equal((await h.identifyRecovery(receipt)).issue, 'creation-receipt-untrusted');
      assert.equal((await h.verify()).state, 'source');
      // A target-supplied marker/journal/receipt has no discovery/import path.
      fs.writeFileSync(
        path.join(h.fixtureRoot, 'untrusted-receipt.json'),
        JSON.stringify(receipt),
        { flag: 'wx' }
      );
      assert.equal((await h.identifyRecovery(receipt)).issue, 'creation-receipt-untrusted');
    });
    assert.equal(read(root, 'quarantined.bin'), original);
    assert.equal(original, generateCounter(run));
  });

  test('a physically replaced file after anchor death is never adopted, even with identical content', async () => {
    let root, receipt, run;
    await fixture(async (h, id) => {
      await interrupt(h);
      root = h.fixtureRoot;
      run = id;
      receipt = structuredClone(h.creationReceipt);
      await h.endAnchorForTest();
    });
    // Only this test's freshly created synthetic fixture. Preserve the original;
    // no file deletion or use of preexisting scenarios to manufacture the fault.
    const original = path.join(root, 'source/quarantined.bin');
    const preserved = path.join(root, 'source/test-preserved-original.bin');
    fs.renameSync(original, preserved);
    fs.writeFileSync(original, generateCounter(run), { flag: 'wx' });
    const actualOriginalId = fs.statSync(preserved, { bigint: true }).ino;
    assert.notEqual(fs.statSync(original, { bigint: true }).ino, actualOriginalId);
    await fixture(async (h) => {
      assert.equal((await h.identifyRecovery(receipt)).issue, 'creation-receipt-untrusted');
      assert.equal((await h.restoreAfterExit()).issue, 'recovery-authorization-required');
    });
    assert.equal(fs.readFileSync(original, 'utf8'), generateCounter(run));
    assert.equal(fs.readFileSync(preserved, 'utf8'), generateCounter(run));
  });

  test('a pending receipt cannot be selected in a different live anchor with the same runId', async () =>
    fixture(async (h, run) => {
      await interrupt(h);
      const other = await createAssistedPhysicalHarness(run);
      assert.equal(other.supported, true);
      try {
        await interrupt(other);
        const before = await other.verify();
        assert.equal(
          (await other.identifyRecovery(h.creationReceipt)).issue,
          'creation-receipt-untrusted'
        );
        assert.deepEqual(await other.verify(), before);
        await readyRecovery(h);
        assert.equal((await h.restoreAfterExit()).ok, true);
        assert.deepEqual(await other.verify(), before);
      } finally {
        await other.close();
      }
    }));

  test('other fresh scenario, external sentinel and junction target stay untouched', async () =>
    fixture(async (outside) => {
      const before = await outside.verify();
      await fixture(async (h) => {
        await interrupt(h);
        fs.symlinkSync(
          path.join(outside.fixtureRoot, 'sentinel'),
          path.join(h.fixtureRoot, 'junction.bin'),
          'junction'
        );
        assert.equal((await h.probeLink('junction.bin')).issue, 'reparse-refused');
        assert.equal(
          (await h.identifyRecovery(outside.creationReceipt)).issue,
          'creation-receipt-untrusted'
        );
        await readyRecovery(h);
        assert.equal((await h.restoreAfterExit()).ok, true);
        assert.equal((await h.verify()).sentinelUnchanged, true);
      });
      assert.deepEqual(await outside.verify(), before);
    }));
}
