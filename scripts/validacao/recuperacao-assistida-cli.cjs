'use strict';
const readline = require('node:readline');
const { createAssistedPhysicalHarness } = require('./harness-fisico.cjs');
const INTENT = 'restore-owned-synthetic-after-worker-exit';
const START = 'CRIAR E INTERROMPER CENARIO SINTETICO';
const CHECKS = Object.freeze([
  'handles de criação e volume/file ID',
  'conteúdo, tamanho e SHA-256',
  'identidade e localização do perímetro',
  'ausência de reparse points e hardlinks no recurso',
  'duas regenerações físicas e sentinela íntegra',
  'consumidores liberados no universo sintético',
  'destino de restauração livre',
]);
const id = (value) =>
  typeof value === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(value) ? value : null;
const fileId = (value) =>
  typeof value === 'string' && /^[a-f0-9]{8}:[a-f0-9]{16}$/.test(value) ? value : null;
const issue = (value) =>
  typeof value === 'string' && /^[a-z][a-z0-9-]{0,79}$/.test(value)
    ? value
    : 'diagnostic-unavailable';
const state = (value) =>
  ['source', 'quarantine', 'indeterminate'].includes(value) ? value : 'unknown';

function openConsole({ input = process.stdin, output = process.stdout } = {}) {
  const interactive = input.isTTY === true && output.isTTY === true;
  let ended = !interactive,
    waiting = null;
  const rl = interactive
    ? readline.createInterface({ input, output, terminal: true, historySize: 0 })
    : null;
  const stop = () => {
    ended = true;
    if (waiting) {
      const resolve = waiting;
      waiting = null;
      resolve(null);
    }
  };
  const close = () => {
    stop();
    rl?.close();
  };
  rl?.on('line', (line) => {
    // Never queue prefilled/pasted answers for a future confirmation prompt.
    if (!waiting) return;
    const resolve = waiting;
    waiting = null;
    resolve(line.length <= 256 ? line : null);
  });
  rl?.on('close', stop);
  rl?.on('SIGINT', close);
  rl?.on('error', close);
  input.on('error', close);
  output.on('error', close);
  return {
    interactive,
    get active() {
      return !ended && !input.destroyed && !input.readableEnded && !output.destroyed;
    },
    write(text) {
      if (!output.destroyed) output.write(text + '\n');
    },
    ask(prompt) {
      if (!this.active) return Promise.resolve(null);
      // Some consoles (including TERM=dumb) ignore synthetic editing keys.
      // Never attempt to erase/reuse a partial answer: cancel the interaction.
      if (rl.line.length > 0) {
        this.write('Cancelado: resposta parcial recebida antes do próximo prompt.');
        close();
        return Promise.resolve(null);
      }
      return new Promise((resolve) => {
        waiting = resolve;
        output.write(prompt + '\n> ');
      });
    },
    cancel: close,
    close() {
      close();
      input.off('error', close);
      output.off('error', close);
    },
  };
}

async function performRecovery(h, terminal) {
  let resourceId = null,
    observedState = 'unknown',
    attempted = false,
    authorized = false;
  const finish = (status, code, checks = []) => {
    const result = {
      flowVersion: 1,
      status,
      resourceId,
      observedState,
      code,
      authorizationAccepted: authorized,
      restorationAttempted: attempted,
      checks: [...checks],
      cleanupAuthorization: 'none',
    };
    terminal.write(`Resultado: ${status}; estado observado: ${observedState}; código: ${code}.`);
    return result;
  };
  if (!terminal.interactive) return finish('blocked', 'interactive-terminal-required');
  try {
    const pending = await h.identifyRecovery(h.creationReceipt);
    observedState = state(pending.state);
    if (pending.ok !== true) return finish('blocked', issue(pending.issue));
    resourceId = id(h.descriptor.resourceId);
    if (pending.recoveryNeeded === false && pending.state === 'source')
      return finish('observed-restored', 'no-restoration-needed');
    const selection = pending.selection;
    if (
      !resourceId ||
      pending.recoveryNeeded !== true ||
      pending.state !== 'quarantine' ||
      !selection ||
      selection.resourceId !== resourceId ||
      !id(selection.scopeId) ||
      !fileId(selection.rootId) ||
      !fileId(pending.identity?.fileId) ||
      !/^[a-f0-9]{64}$/.test(selection.selectionId) ||
      !/^[a-f0-9]{64}$/.test(pending.sha256) ||
      !Number.isSafeInteger(pending.identity.size) ||
      pending.identity.size < 0 ||
      pending.identity.size > 256 ||
      pending.sentinelUnchanged !== true
    )
      return finish('blocked', 'recovery-response-incompatible');
    terminal.write(`Única pendência da âncora viva: ${resourceId}; escopo: ${selection.scopeId}.`);
    terminal.write(
      `Raiz: ${selection.rootId}; arquivo: ${pending.identity.fileId}; estado: quarantine.`
    );
    terminal.write(
      `Tamanho sintético: ${pending.identity.size} bytes; SHA-256: ${pending.sha256}.`
    );
    terminal.write('Verificações ORG.8B aprovadas: ' + CHECKS.join('; ') + '.');
    terminal.write(
      'Somente restauração no mesmo recipiente. Autorização de limpeza: none. Consumidores reais externos: não avaliados.'
    );
    const chosen = await terminal.ask(`SELEÇÃO: digite exatamente ${resourceId}, ou cancelar.`);
    if (!terminal.active || chosen !== resourceId)
      return finish('cancelled', 'selection-cancelled', CHECKS);
    const phrase = `RESTAURAR ${resourceId} ${selection.selectionId.slice(0, 12)}`;
    const answer = await terminal.ask(
      `CONFIRMAÇÃO: restaurar somente ${resourceId} na raiz ${selection.rootId}, sem sobrescrever.\nDigite exatamente: ${phrase}\nQualquer outra resposta cancela.`
    );
    if (!terminal.active || answer !== phrase)
      return finish('cancelled', 'confirmation-cancelled', CHECKS);
    // ORG.8B revalidates on authorization AND immediately before the rename.
    // No confirmation flag, default answer or previous authorization is reused.
    const grant = await h.authorizeRecovery({ ...selection, intent: INTENT });
    observedState = state(grant.state || observedState);
    if (grant.ok !== true) return finish('blocked', issue(grant.issue));
    authorized = true;
    if (!terminal.active) {
      await h.identifyRecovery(h.creationReceipt); // Invalidate the unused grant.
      return finish('cancelled', 'cancelled-before-operation');
    }
    attempted = true;
    observedState = 'indeterminate';
    const restored = await h.restoreAfterExit();
    observedState = state(restored.state);
    if (restored.ok === true && restored.state === 'source' && restored.sentinelUnchanged === true)
      return finish('restored', 'restoration-verified', CHECKS);
    // A failed operation is never relabeled a success from a later observation.
    // Report actual location separately; no retry, new grant, or move is automatic.
    const observed = await h.verify();
    observedState = state(observed.state);
    terminal.write(
      observed.ok === true
        ? 'Reinspeção da localização concluída; a operação anterior não teve confirmação de sucesso.'
        : `Reinspeção bloqueada: ${issue(observed.issue)}.`
    );
    return finish('indeterminate', issue(restored.issue));
  } catch {
    return finish(attempted ? 'indeterminate' : 'blocked', 'assisted-flow-unavailable');
  }
}

// Trusted embedding: receives the live capability, never a path/receipt from disk.
// Stream injection exists for explicit scripted terminal tests, not automatic approval.
async function runRecoveryFlow(h, streams) {
  const terminal = openConsole(streams);
  try {
    return await performRecovery(h, terminal);
  } finally {
    terminal.close();
  }
}

async function main(argv = process.argv.slice(2), streams) {
  const terminal = openConsole(streams);
  let h;
  const interrupt = () => terminal.cancel();
  process.on('SIGINT', interrupt);
  try {
    if (argv.length !== 1 || argv[0] !== '--demo') {
      terminal.write('Uso: node scripts/validacao/recuperacao-assistida-cli.cjs --demo');
      terminal.write('Somente cenário sintético novo; sem --yes, importação ou caminhos.');
      return argv.length === 1 && argv[0] === '--help' ? 0 : 2;
    }
    if (!terminal.interactive) {
      terminal.write('Bloqueado: interactive-terminal-required. Nenhum cenário criado.');
      return 2;
    }
    terminal.write(
      'Piloto ORG.8C: cria um único cenário próprio, simula e coloca o arquivo sintético em quarentena com morte do executor.'
    );
    terminal.write(
      'A restauração exige seleção e nova confirmação. Cancelar/fechar preserva o arquivo e encerra a âncora: não será possível reabrir este cenário.'
    );
    if (
      (await terminal.ask(`Para iniciar, digite exatamente: ${START}`)) !== START ||
      !terminal.active
    ) {
      terminal.write('Cancelado; nenhum cenário criado.');
      return 0;
    }
    h = await createAssistedPhysicalHarness('assisted-cli');
    if (!h.supported) {
      terminal.write(`Bloqueado: ${issue(h.issue)}.`);
      return 2;
    }
    const simulation = await h.simulate();
    if (
      !terminal.active ||
      simulation.resources?.length !== 1 ||
      simulation.summary?.counts.recognized !== 1 ||
      simulation.cleanupAuthorization !== 'none'
    ) {
      terminal.write('Bloqueado: synthetic-simulation-not-bound.');
      return 2;
    }
    const grant = await h.authorize({
      ...h.descriptor,
      intent: 'quarantine-and-restore-owned-synthetic',
    });
    if (!grant.ok || !terminal.active) {
      terminal.write('Bloqueado: initial-authorization-refused.');
      return 2;
    }
    const stopped = await h.quarantine('process-exit');
    if (
      stopped.ok !== false ||
      stopped.issue !== 'executor-session-lost' ||
      stopped.executorExitCode !== 7 ||
      stopped.anchorAlive !== true
    ) {
      terminal.write(
        `Bloqueado: ${issue(stopped.issue)}. Operação inicial sem estado confirmado; sem restauração automática.`
      );
      return 2;
    }
    const result = await performRecovery(h, terminal);
    return ['restored', 'observed-restored', 'cancelled'].includes(result.status) ? 0 : 2;
  } catch {
    terminal.write('Bloqueado: assisted-demo-unavailable. Não se presume conclusão física.');
    return 2;
  } finally {
    try {
      if (h?.supported) await h.close();
    } finally {
      terminal.close();
      process.off('SIGINT', interrupt);
    }
  }
}

if (require.main === module)
  main()
    .then((code) => {
      process.exitCode = code;
    })
    .catch(() => {
      process.stderr.write('Bloqueado: assisted-demo-unavailable.\n');
      process.exitCode = 2;
    });
module.exports = { runRecoveryFlow, main };
