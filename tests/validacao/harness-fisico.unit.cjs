'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { createPhysicalHarness } = require('../../scripts/validacao/harness-fisico.cjs');
const {
  generateCounter,
  digest,
} = require('../../scripts/validacao/harness-temporario-sintetico.cjs');
const INTENT = 'quarantine-and-restore-owned-synthetic';
let sequence = 0;
async function fixture(body) {
  const runId = 'physical-test-' + ++sequence;
  const h = await createPhysicalHarness(runId);
  assert.equal(h.supported, true, h.issue);
  assert.match(path.basename(h.fixtureRoot), /^org8a-[a-f0-9]{32}$/);
  try {
    await body(h, runId);
  } finally {
    await h.close();
  }
}
async function ready(h) {
  const simulation = await h.simulate();
  assert.equal(simulation.resources[0].status, 'recognized');
  assert.equal(simulation.cleanupAuthorization, 'none');
  assert.equal((await h.authorize({ ...h.descriptor, intent: INTENT })).ok, true);
}

if (process.platform !== 'win32') {
  test('unsupported platform refuses physical capability rather than falling back to path moves', async () => {
    assert.deepEqual(await createPhysicalHarness('unsupported'), {
      supported: false,
      issue: 'platform-unsupported',
    });
  });
} else {
  test('physical creation, regeneration, simulation, quarantine and exact restoration', async () => {
    let root, run;
    await fixture(async (h, runId) => {
      root = h.fixtureRoot;
      run = runId;
      await ready(h);
      const original = h.report();
      assert.deepEqual(original.physicalRegenerations, [original.sha256, original.sha256]);
      const q = await h.quarantine();
      assert.equal(q.ok, true);
      assert.equal(q.state, 'quarantine');
      assert.equal(q.identity.fileId, original.identity.fileId);
      assert.equal(q.sha256, original.sha256);
      const r = await h.restore();
      assert.equal(r.ok, true);
      assert.equal(r.state, 'source');
      assert.equal(r.identity.fileId, original.identity.fileId);
      assert.equal(r.sha256, original.sha256);
      assert.equal(r.sentinelUnchanged, true);
      const report = h.report();
      assert.ok(!JSON.stringify(report).includes(root));
      assert.equal(report.simulation.cleanupAuthorization, 'none');
    });
    assert.equal(
      fs.readFileSync(path.join(root, 'source/counter.bin'), 'utf8'),
      generateCounter(run)
    );
    const journal = fs
      .readFileSync(path.join(root, 'journal.jsonl'), 'utf8')
      .trim()
      .split('\n')
      .map(JSON.parse);
    assert.ok(
      journal.findIndex((r) => r.event === 'simulation-bound-without-authorization') <
        journal.findIndex((r) => r.event === 'quarantine-intent')
    );
    assert.ok(journal.some((r) => r.event === 'restore-verified'));
  });

  test('recognized and none authorization never grant a physical operation', async () =>
    fixture(async (h) => {
      assert.equal((await h.quarantine()).issue, 'authorization-required');
      assert.equal(
        (await h.authorize({ ...h.descriptor, intent: INTENT })).issue,
        'authorization-refused'
      );
      await h.simulate();
      assert.equal((await h.quarantine()).issue, 'authorization-required');
      for (const data of [
        { ...h.descriptor, intent: 'delete' },
        { ...h.descriptor, intent: INTENT, resourceId: 'other' },
        { ...h.descriptor, intent: INTENT, rootId: 'self-asserted-marker' },
      ])
        assert.equal((await h.authorize(data)).issue, 'authorization-refused');
      assert.equal((await h.verify()).state, 'source');
    }));

  for (const options of [{ activeConsumer: true }, { duplicate: true }, { wrongScope: true }]) {
    test(
      'unresolved consumers/duplicate/scope block and invalidate prior grants: ' +
        JSON.stringify(options),
      async () =>
        fixture(async (h) => {
          await ready(h);
          const simulation = await h.simulate(options);
          assert.equal(simulation.summary.counts.blocked > 0, true);
          assert.equal(
            (await h.authorize({ ...h.descriptor, intent: INTENT })).issue,
            'authorization-refused'
          );
          assert.equal((await h.quarantine()).issue, 'authorization-required');
        })
    );
  }

  for (const fault of ['tamper', 'identity', 'hardlink', 'consumer']) {
    test('immediate revalidation rejects post-inspection change: ' + fault, async () =>
      fixture(async (h) => {
        await ready(h);
        assert.equal((await h.injectFault(fault)).ok, true);
        const attempt = await h.quarantine();
        assert.equal(attempt.ok, false);
        assert.ok(
          [
            'resource-identity-or-size-mismatch',
            'content-mismatch',
            'location-indeterminate',
            'hardlink-refused',
            'consumer-active',
          ].includes(attempt.issue)
        );
        assert.ok(!h.report().events.some((e) => e.operation === 'quarantine' && e.ok));
      })
    );
  }

  test('destination collision never overwrites; source and collision remain intact', async () =>
    fixture(async (h) => {
      await ready(h);
      await h.injectFault('collision');
      assert.equal((await h.quarantine()).issue, 'destination-exists');
      assert.equal((await h.verify()).state, 'source');
      assert.equal((await h.quarantine()).issue, 'destination-exists');
      const expected = h.report().sha256;
      await h.close();
      assert.equal(
        fs.readFileSync(path.join(h.fixtureRoot, 'source/quarantined.bin'), 'utf8'),
        'owned destination sentinel'
      );
      assert.equal(
        digest(fs.readFileSync(path.join(h.fixtureRoot, 'source/counter.bin'), 'utf8')),
        expected
      );
    }));

  test('restoration collision preserves quarantine and does not overwrite source', async () =>
    fixture(async (h) => {
      await ready(h);
      await h.quarantine();
      await h.injectFault('collision');
      assert.equal((await h.restore()).issue, 'destination-exists');
      assert.equal((await h.verify()).state, 'quarantine');
      assert.equal((await h.restore()).issue, 'destination-exists');
      const expected = h.report().sha256;
      await h.close();
      assert.equal(
        fs.readFileSync(path.join(h.fixtureRoot, 'source/counter.bin'), 'utf8'),
        'owned destination sentinel'
      );
      assert.equal(
        digest(fs.readFileSync(path.join(h.fixtureRoot, 'source/quarantined.bin'), 'utf8')),
        expected
      );
    }));

  for (const operation of ['quarantine', 'restore'])
    for (const fault of ['before-rename', 'after-rename']) {
      test(
        'interruption reconciles owned handle without assuming completion: ' +
          operation +
          '/' +
          fault,
        async () =>
          fixture(async (h) => {
            await ready(h);
            if (operation === 'restore') await h.quarantine();
            const attempt = await h[operation](fault);
            assert.equal(attempt.ok, false);
            assert.equal(attempt.issue, 'simulated-' + fault);
            if (fault === 'after-rename') assert.equal(attempt.state, 'indeterminate');
            const recovery = await h.recover();
            assert.equal(recovery.ok, true);
            const expected =
              operation === 'quarantine'
                ? fault === 'after-rename'
                  ? 'quarantine'
                  : 'source'
                : fault === 'after-rename'
                  ? 'source'
                  : 'quarantine';
            assert.equal(recovery.state, expected);
            if (expected === 'quarantine') assert.equal((await h.restore()).ok, true);
            else if (operation === 'quarantine') {
              assert.equal((await h.quarantine()).ok, true);
              assert.equal((await h.restore()).ok, true);
            }
          })
      );
    }

  test('lost process leaves durable intent and data intact, refuses automatic recovery', async () => {
    let root, hash;
    await fixture(async (h) => {
      root = h.fixtureRoot;
      await ready(h);
      hash = h.report().sha256;
      const stopped = await h.quarantine('process-exit');
      assert.equal(stopped.ok, false);
      assert.equal(stopped.state, 'indeterminate');
      assert.equal((await h.recover()).issue, 'backend-session-lost');
      assert.equal(h.report().sessionLost, true);
    });
    assert.equal(digest(fs.readFileSync(path.join(root, 'source/quarantined.bin'), 'utf8')), hash);
    const journal = fs.readFileSync(path.join(root, 'journal.jsonl'), 'utf8');
    assert.ok(journal.includes('quarantine-intent'));
    assert.ok(!journal.includes('quarantine-verified'));
  });

  test('owned directory locks reject replacement/rename while allowing target collisions', async () =>
    fixture(async (h) => {
      assert.throws(() =>
        fs.renameSync(
          path.join(h.fixtureRoot, 'source'),
          path.join(h.fixtureRoot, 'renamed-source')
        )
      );
      assert.throws(() => fs.openSync(path.join(h.fixtureRoot, 'source'), 'r+'));
      assert.throws(() => fs.openSync(path.join(h.fixtureRoot, 'source/counter.bin'), 'r+'));
      await ready(h);
      assert.equal((await h.quarantine()).ok, true);
      assert.equal((await h.restore()).ok, true);
    }));

  test('junctions are refused without reading or changing their sentinel target', async () =>
    fixture(async (h) => {
      fs.symlinkSync(
        path.join(h.fixtureRoot, 'sentinel'),
        path.join(h.fixtureRoot, 'junction.bin'),
        'junction'
      );
      const probe = await h.probeLink('junction.bin');
      assert.equal(probe.ok, false);
      assert.equal(probe.issue, 'reparse-refused');
      assert.equal((await h.verify()).sentinelUnchanged, true);
      assert.equal((await h.probeLink('../outside')).ok, false);
    }));

  test('file symlink fixture is refused or explicitly unavailable without elevation', async (t) =>
    fixture(async (h) => {
      try {
        fs.symlinkSync(
          path.join(h.fixtureRoot, 'sentinel/untouched.bin'),
          path.join(h.fixtureRoot, 'symlink.bin'),
          'file'
        );
        assert.equal((await h.probeLink('symlink.bin')).ok, false);
      } catch (error) {
        assert.equal(error.code, 'EPERM');
        t.diagnostic(
          'OS refused file symlink creation; actual file-symlink coverage unavailable. Reparse guard is tested independently.'
        );
      }
      assert.equal((await h.verify()).sentinelUnchanged, true);
    }));

  test('all reparse tags and unknown hardlinks are rejected at metadata boundary', () => {
    const script = `
import ctypes as C, importlib.util
spec=importlib.util.spec_from_file_location('native', 'scripts/validacao/harness-fisico-win.py')
m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
original=m.k.GetFileInformationByHandle
try:
 for attributes,links,issue in [(0x400,1,'reparse-refused'),(0x410,1,'reparse-refused'),(0,2,'hardlink-refused')]:
  def fake(handle, pointer):
   value=C.cast(pointer,C.POINTER(m.INFO)).contents
   value.attrs=attributes; value.links=links
   return 1
  m.k.GetFileInformationByHandle=fake
  try: m.info(None, bool(attributes & 0x10)); raise AssertionError('accepted')
  except m.Blocked as e: assert str(e)==issue
finally: m.k.GetFileInformationByHandle=original
`;
    const result = spawnSync('python', ['-I', '-B', '-c', script], {
      cwd: path.resolve(__dirname, '../..'),
      encoding: 'utf8',
      windowsHide: true,
    });
    assert.equal(result.status, 0, result.stderr);
  });

  test('replay authorization cannot operate twice and journal remains append-only', async () =>
    fixture(async (h) => {
      await ready(h);
      await h.quarantine();
      await h.restore();
      await h.authorize({ ...h.descriptor, intent: INTENT });
      assert.equal((await h.quarantine()).issue, 'authorization-required');
      assert.equal((await h.restore()).issue, 'authorization-required');
    }));

  test('recovery can reinspect quarantine and requires a fresh exact grant', async () =>
    fixture(async (h) => {
      await ready(h);
      await h.quarantine();
      assert.equal((await h.simulate({ activeConsumer: true })).summary.counts.blocked, 1);
      assert.equal((await h.restore()).issue, 'authorization-required');
      assert.equal((await h.simulate()).summary.counts.recognized, 1);
      assert.equal((await h.authorize({ ...h.descriptor, intent: INTENT })).ok, true);
      assert.equal((await h.restore()).ok, true);
    }));

  test('no arbitrary paths, commands or fault modes can expand the operation scope', async () => {
    await assert.rejects(createPhysicalHarness('../outside'));
    await fixture(async (h) => {
      await h.simulate();
      assert.equal(
        (await h.authorize({ ...h.descriptor, intent: INTENT, op: 'quarantine' })).issue,
        'authorization-refused'
      );
      assert.equal((await h.quarantine('unknown-fault')).issue, 'fault-refused');
      assert.equal((await h.injectFault('../outside')).issue, 'fault-refused');
      assert.equal((await h.probeLink('C:\\outside')).ok, false);
      assert.equal((await h.verify()).sentinelUnchanged, true);
    });
  });

  test('a fresh external fixture remains unchanged across junction refusal and maintenance', async () =>
    fixture(async (outside) => {
      const before = await outside.verify();
      await fixture(async (h) => {
        fs.symlinkSync(
          path.join(outside.fixtureRoot, 'sentinel'),
          path.join(h.fixtureRoot, 'junction.bin'),
          'junction'
        );
        assert.equal((await h.probeLink('junction.bin')).ok, false);
        await ready(h);
        assert.equal((await h.quarantine()).ok, true);
        assert.equal((await h.restore()).ok, true);
      });
      assert.deepEqual(await outside.verify(), before);
    }));
}
