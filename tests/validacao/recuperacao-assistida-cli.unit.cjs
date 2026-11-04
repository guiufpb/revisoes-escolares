'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { PassThrough, Writable } = require('node:stream');
const { setImmediate: nextTurn } = require('node:timers/promises');
const { setImmediate } = require('node:timers');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { runRecoveryFlow, main } = require('../../scripts/validacao/recuperacao-assistida-cli.cjs');
const { createAssistedPhysicalHarness } = require('../../scripts/validacao/harness-fisico.cjs');
const { generateCounter } = require('../../scripts/validacao/harness-temporario-sintetico.cjs');
const ROOT = path.resolve(__dirname, '../..');
const CLI = path.join(ROOT, 'scripts/validacao/recuperacao-assistida-cli.cjs');
const START = 'CRIAR E INTERROMPER CENARIO SINTETICO';
const NO_WRITE = Symbol('no additional keystrokes');
const descriptor = {
  resourceId: 'counter-cli-case',
  scopeId: 'scope-cli-case',
  rootId: '12345678:0000000000000001',
};
const selection = {
  ...descriptor,
  runId: 'cli-case',
  anchorId: 'a'.repeat(64),
  receiptId: 'b'.repeat(64),
  selectionId: 'c'.repeat(64),
};
const pending = {
  ok: true,
  state: 'quarantine',
  recoveryNeeded: true,
  selection,
  identity: { fileId: '12345678:0000000000000002', size: 42 },
  sha256: 'd'.repeat(64),
  sentinelUnchanged: true,
};

// Explicit scripted keystrokes over synthetic streams. These are NOT proof of
// human use or an approval bypass in the actual CLI, whose real pipes are refused.
function terminal(script = []) {
  const input = new PassThrough();
  input.isTTY = true;
  input.setRawMode = () => input;
  let text = '',
    index = 0,
    prompts = 0,
    scriptError = null;
  const output = new Writable({
    write(chunk, encoding, callback) {
      const value = chunk.toString();
      text += value;
      callback();
      if (!/^(SELEÇÃO:|CONFIRMAÇÃO:|Para iniciar,)/.test(value)) return;
      prompts++;
      const step = script[index++];
      setImmediate(async () => {
        try {
          if (step === 'hold') return;
          const answer = typeof step === 'function' ? await step(value, input) : step;
          if (answer === NO_WRITE) return;
          if (answer == null) input.end();
          else input.write(answer + '\n');
        } catch (error) {
          scriptError = error;
          input.end();
        }
      });
    },
  });
  output.isTTY = true;
  output.columns = 160;
  return {
    input,
    output,
    get text() {
      return text;
    },
    get prompts() {
      return prompts;
    },
    check() {
      if (scriptError) throw scriptError;
    },
  };
}
const choose = (prompt) => prompt.match(/^SELEÇÃO: digite exatamente ([a-zA-Z0-9_-]+)/)[1];
const confirm = (prompt) => prompt.match(/Digite exatamente: (RESTAURAR [^\n]+)/)[1];
function capability(overrides = {}) {
  const calls = [];
  const h = {
    descriptor,
    creationReceipt: Object.freeze({ synthetic: true }),
    async identifyRecovery(receipt) {
      calls.push(['identify', receipt]);
      return structuredClone(pending);
    },
    async authorizeRecovery(data) {
      calls.push(['authorize', data]);
      return { ok: true };
    },
    async restoreAfterExit() {
      calls.push(['restore']);
      return { ok: true, state: 'source', sentinelUnchanged: true };
    },
    async verify() {
      calls.push(['verify']);
      return { ok: true, state: 'quarantine' };
    },
    ...overrides,
  };
  return { h, calls };
}
function count(calls, operation) {
  return calls.filter((c) => c[0] === operation).length;
}
async function drive(h, script) {
  const t = terminal(script);
  const result = await runRecoveryFlow(h, t);
  t.check();
  return { result, text: t.text, prompts: t.prompts };
}

test('selection AND exact fresh confirmation precede authorization and restoration', async () => {
  const { h, calls } = capability();
  const { result, text, prompts } = await drive(h, [
    choose,
    (prompt) => {
      assert.equal(count(calls, 'authorize'), 0);
      assert.equal(count(calls, 'restore'), 0);
      return confirm(prompt);
    },
  ]);
  assert.equal(prompts, 2);
  assert.deepEqual(
    calls.map((c) => c[0]),
    ['identify', 'authorize', 'restore']
  );
  assert.equal(calls[1][1].intent, 'restore-owned-synthetic-after-worker-exit');
  assert.equal(result.status, 'restored');
  assert.equal(result.authorizationAccepted, true);
  assert.equal(result.cleanupAuthorization, 'none');
  assert.equal(result.checks.length, 7);
  assert.ok(text.includes('consumidores liberados no universo sintético'));
  assert.ok(!text.includes(selection.selectionId));
  assert.deepEqual(calls[1][1], {
    ...selection,
    intent: 'restore-owned-synthetic-after-worker-exit',
  });
});

for (const answer of ['', 'cancelar', 'sim', 'yes', 'true', 'RESTAURAR', null]) {
  test(
    'confirmation is never inferred from defaults or a generic response: ' + JSON.stringify(answer),
    async () => {
      const { h, calls } = capability();
      const { result } = await drive(h, [choose, answer]);
      assert.equal(result.status, 'cancelled');
      assert.equal(result.restorationAttempted, false);
      assert.equal(count(calls, 'authorize'), 0);
      assert.equal(count(calls, 'restore'), 0);
    }
  );
}

for (const answer of ['', 'cancelar', 'other-resource', null]) {
  test('explicit selection cannot be skipped: ' + JSON.stringify(answer), async () => {
    const { h, calls } = capability();
    const { result, prompts } = await drive(h, [answer]);
    assert.equal(result.status, 'cancelled');
    assert.equal(prompts, 1);
    assert.equal(count(calls, 'authorize'), 0);
    assert.equal(count(calls, 'restore'), 0);
  });
}

test('no answer keeps the request pending; EOF then cancels without authorization', async () => {
  const { h, calls } = capability();
  const t = terminal([choose, 'hold']);
  let completed = false;
  const running = runRecoveryFlow(h, t).then((r) => {
    completed = true;
    return r;
  });
  for (let i = 0; i < 20 && t.prompts < 2; i++) await nextTurn();
  assert.equal(t.prompts, 2);
  assert.equal(completed, false);
  assert.equal(count(calls, 'authorize'), 0);
  t.input.end();
  assert.equal((await running).status, 'cancelled');
  assert.equal(count(calls, 'restore'), 0);
});

for (const suffix of ['\n', '']) {
  test(
    'answers pasted before the confirmation prompt are discarded: ' + JSON.stringify(suffix),
    async () => {
      const { h, calls } = capability();
      const t = terminal([
        (prompt, input) => {
          input.write(
            choose(prompt) +
              '\nRESTAURAR ' +
              descriptor.resourceId +
              ' ' +
              selection.selectionId.slice(0, 12) +
              suffix
          );
          return NO_WRITE;
        },
        '',
      ]);
      const result = await runRecoveryFlow(h, t);
      t.check();
      assert.equal(result.status, 'cancelled');
      assert.equal(count(calls, 'authorize'), 0);
      assert.equal(count(calls, 'restore'), 0);
    }
  );
}

test('Ctrl+C cancels while waiting; it is never confirmation', async () => {
  const { h, calls } = capability();
  const { result } = await drive(h, [
    choose,
    (prompt, input) => {
      input.write('\u0003');
      return '';
    },
  ]);
  assert.equal(result.status, 'cancelled');
  assert.equal(count(calls, 'authorize'), 0);
});

test('noninteractive streams are blocked before consulting the capability', async () => {
  const { h, calls } = capability();
  const t = terminal([choose, confirm]);
  t.input.isTTY = false;
  assert.equal((await runRecoveryFlow(h, t)).code, 'interactive-terminal-required');
  assert.equal(calls.length, 0);
});

test('real CLI pipes and automatic flags cannot create a scenario or approve restoration', () => {
  for (const args of [['--demo'], ['--demo', '--yes'], ['--yes'], ['--demo', '../old']]) {
    const p = spawnSync(process.execPath, [CLI, ...args], {
      cwd: ROOT,
      input: START + '\n' + descriptor.resourceId + '\nyes\n',
      encoding: 'utf8',
      windowsHide: true,
      timeout: 5000,
    });
    assert.equal(p.status, 2, p.stderr);
    assert.ok(
      p.stdout.includes(
        args.length === 1 && args[0] === '--demo' ? 'Nenhum cenário criado' : 'Uso:'
      )
    );
    assert.ok(!p.stdout.includes('Única pendência'));
  }
});

test('demo can be cancelled before creating a scenario', async () => {
  const t = terminal(['cancelar']);
  assert.equal(await main(['--demo'], t), 0);
  t.check();
  assert.ok(t.text.includes('nenhum cenário criado'));
  assert.equal(t.prompts, 1);
});

test('blocked and incompatible identification produce sanitized diagnostics and no prompt', async () => {
  for (const response of [
    { ok: false, issue: 'backend-session-lost', state: 'indeterminate' },
    { ok: false, issue: 'C:\\private\\details\u001b[2J', state: 'private-state' },
    { ...pending, state: 'other' },
    { ...pending, selection: { ...selection, resourceId: 'other' } },
  ]) {
    const { h, calls } = capability({
      async identifyRecovery() {
        return response;
      },
    });
    const { result, text, prompts } = await drive(h, []);
    assert.equal(result.status, 'blocked');
    assert.equal(prompts, 0);
    assert.equal(count(calls, 'authorize'), 0);
    assert.ok(!text.includes('private'));
  }
});

test('authorization refusal blocks the operation after exact confirmation', async () => {
  const { h, calls } = capability({
    async authorizeRecovery() {
      return { ok: false, issue: 'recovery-authorization-refused', state: 'quarantine' };
    },
  });
  const { result } = await drive(h, [choose, confirm]);
  assert.equal(result.status, 'blocked');
  assert.equal(result.authorizationAccepted, false);
  assert.equal(result.code, 'recovery-authorization-refused');
  assert.equal(count(calls, 'restore'), 0);
});

test('closure after authorization invalidates the unused grant, without moving', async () => {
  const t = terminal([choose, confirm]);
  const { h, calls } = capability({
    async authorizeRecovery() {
      t.input.end();
      await nextTurn();
      return { ok: true };
    },
  });
  const result = await runRecoveryFlow(h, t);
  assert.equal(result.status, 'cancelled');
  assert.equal(count(calls, 'identify'), 2);
  assert.equal(count(calls, 'restore'), 0);
});

test('already restored is an observation, not another restoration or grant', async () => {
  const { h, calls } = capability({
    async identifyRecovery() {
      return { ok: true, state: 'source', recoveryNeeded: false, selection: null };
    },
  });
  const { result, prompts } = await drive(h, []);
  assert.equal(result.status, 'observed-restored');
  assert.equal(prompts, 0);
  assert.equal(count(calls, 'restore'), 0);
});

test('lost or partially completed restoration reports uncertainty, never a false success or automatic retry', async () => {
  for (const observed of [
    { ok: true, state: 'source' },
    { ok: false, issue: 'backend-session-lost', state: 'indeterminate' },
  ]) {
    const { h, calls } = capability({
      async restoreAfterExit() {
        calls.push(['restore']);
        return { ok: false, issue: 'executor-session-lost', state: 'indeterminate' };
      },
      async verify() {
        return observed;
      },
    });
    const { result } = await drive(h, [choose, confirm]);
    assert.equal(result.status, 'indeterminate');
    assert.equal(result.observedState, observed.state);
    assert.equal(count(calls, 'restore'), 1);
    assert.equal(count(calls, 'authorize'), 1);
  }
});

test('unexpected failure during rename does not reuse an earlier physical observation', async () => {
  const { h } = capability({
    async restoreAfterExit() {
      throw Error('private detail');
    },
  });
  const { result, text } = await drive(h, [choose, confirm]);
  assert.equal(result.status, 'indeterminate');
  assert.equal(result.observedState, 'indeterminate');
  assert.ok(!text.includes('private'));
});

if (process.platform === 'win32') {
  let sequence = 0;
  async function fixture(body) {
    const run = 'cli-physical-' + ++sequence;
    const h = await createAssistedPhysicalHarness(run);
    assert.equal(h.supported, true, h.issue);
    try {
      assert.equal((await h.simulate()).cleanupAuthorization, 'none');
      assert.equal(
        (await h.authorize({ ...h.descriptor, intent: 'quarantine-and-restore-owned-synthetic' }))
          .ok,
        true
      );
      assert.equal((await h.quarantine('process-exit')).executorExitCode, 7);
      await body(h, run);
    } finally {
      await h.close();
    }
  }
  test('scripted terminal integrates actual executor death, confirmation, integrity and replay refusal', async () =>
    fixture(async (h, run) => {
      const { result } = await drive(h, [choose, confirm]);
      assert.equal(result.status, 'restored');
      assert.equal(result.restorationAttempted, true);
      assert.equal((await h.verify()).sentinelUnchanged, true);
      assert.equal(h.report().simulation.cleanupAuthorization, 'none');
      assert.equal((await drive(h, [choose, confirm])).result.status, 'blocked');
      await h.close();
      assert.equal(
        fs.readFileSync(path.join(h.fixtureRoot, 'source/counter.bin'), 'utf8'),
        generateCounter(run)
      );
    }));

  test('cancellation preserves the quarantined physical file and issues no recovery grant', async () =>
    fixture(async (h, run) => {
      const { result } = await drive(h, [choose, 'cancelar']);
      assert.equal(result.status, 'cancelled');
      assert.equal((await h.verify()).state, 'quarantine');
      assert.ok(!h.report().events.some((e) => e.operation === 'authorize-recovery'));
      await h.close();
      assert.equal(
        fs.readFileSync(path.join(h.fixtureRoot, 'source/quarantined.bin'), 'utf8'),
        generateCounter(run)
      );
    }));

  test('partial prefilled confirmation cancels the physical flow before a grant or second prompt', async () =>
    fixture(async (h) => {
      const { result, prompts } = await drive(h, [
        (prompt, input) => {
          input.write(choose(prompt) + '\nRESTAURAR ');
          return NO_WRITE;
        },
      ]);
      assert.equal(result.status, 'cancelled');
      assert.equal(prompts, 1);
      assert.equal((await h.verify()).state, 'quarantine');
      assert.ok(!h.report().events.some((e) => e.operation === 'authorize-recovery'));
      assert.ok(!h.report().events.some((e) => e.operation === 'restore-assisted'));
    }));

  for (const fault of ['same-size', 'consumer', 'collision']) {
    test('real change after selection blocks recovery: ' + fault, async () =>
      fixture(async (h) => {
        const { result } = await drive(h, [
          choose,
          async (prompt) => {
            await h.injectFault(fault);
            return confirm(prompt);
          },
        ]);
        assert.equal(result.status, 'blocked');
        assert.equal(result.restorationAttempted, false);
        assert.ok(!h.report().events.some((e) => e.operation === 'restore-assisted'));
        if (fault === 'collision') {
          await h.close();
          assert.equal(
            fs.readFileSync(path.join(h.fixtureRoot, 'source/counter.bin'), 'utf8'),
            'owned destination sentinel'
          );
          assert.ok(fs.existsSync(path.join(h.fixtureRoot, 'source/quarantined.bin')));
        }
      })
    );
  }

  test('anchor ended after selection blocks all physical recovery', async () =>
    fixture(async (h) => {
      const { result } = await drive(h, [
        choose,
        async (prompt) => {
          await h.endAnchorForTest();
          return confirm(prompt);
        },
      ]);
      assert.equal(result.status, 'blocked');
      assert.equal(result.code, 'backend-session-lost');
      assert.equal(result.restorationAttempted, false);
    }));

  test('confirmation from a previous selection never authorizes the next flow', async () =>
    fixture(async (h) => {
      let previous;
      assert.equal(
        (
          await drive(h, [
            choose,
            (prompt) => {
              previous = confirm(prompt);
              return 'cancelar';
            },
          ])
        ).result.status,
        'cancelled'
      );
      const second = await drive(h, [
        choose,
        (prompt) => {
          assert.notEqual(confirm(prompt), previous);
          return previous;
        },
      ]);
      assert.equal(second.result.status, 'cancelled');
      assert.equal((await h.verify()).state, 'quarantine');
      assert.ok(!h.report().events.some((e) => e.operation === 'authorize-recovery'));
    }));

  test('actual interrupted restoration is reported as indeterminate even when already back at source', async () =>
    fixture(async (h) => {
      const wrapped = { ...h, restoreAfterExit: () => h.restoreAfterExit('process-exit') };
      const { result } = await drive(wrapped, [choose, confirm]);
      assert.equal(result.status, 'indeterminate');
      assert.equal(result.observedState, 'source');
      assert.equal((await drive(h, [])).result.status, 'observed-restored');
      assert.equal(h.report().events.filter((e) => e.operation === 'restore-assisted').length, 1);
    }));

  test('demo entry point uses all three explicit scripted prompts and the actual physical harness', async () => {
    const t = terminal([START, choose, confirm]);
    assert.equal(await main(['--demo'], t), 0);
    t.check();
    assert.equal(t.prompts, 3);
    assert.ok(t.text.includes('restoration-verified'));
  });
}
