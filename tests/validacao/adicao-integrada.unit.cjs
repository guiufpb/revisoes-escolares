'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { execFileSync } = require('node:child_process');
const { planRepository, main } = require('../../scripts/validacao/planejador-cli.cjs');
const { captureIdentity, identityUsable } = require('../../scripts/validacao/identidade.cjs');
const { proveAddition, COVERAGE } = require('../../scripts/validacao/planejador-adicao.cjs');
const ROOT = path.resolve(__dirname, '../..');
const ENTRY = 'ambiente_interativo/js/app.entry.js';
const APP = 'ambiente_interativo/js/app.js';
const REGISTRY = 'ambiente_interativo/js/registro-revisoes.js';
const HTML = 'ambiente_interativo/index.html';
const MANIFEST = 'validacao/manifesto.json';

// In-memory synthetic additions only. No module, spec, VM or browser is executed.
const { fixture } = require('./helpers/adicao-fixture.cjs');
const { historicalCliFixture } = require('./helpers/cli-historico-fixture.cjs');
function check(f) {
  return proveAddition(f.input);
}
function mutate(f, p, old, replacement) {
  assert.ok(f.files.get(p).includes(old));
  f.files.set(p, f.files.get(p).replace(old, replacement));
}
function rejected(f, pattern) {
  const result = check(f);
  assert.equal(result.structuralStatus, 'rejected', JSON.stringify(result));
  if (pattern) assert.match(result.reasons.join(' '), pattern);
  return result;
}

for (const [index, type] of ['opcoes', 'campos'].entries()) {
  test('adição v3: ' + type + ' exige bloco válido com pergunta preservada', () => {
    const f = fixture();
    assert.equal(f.config.questoes[index].tipo, type);
    assert.ok(f.config.questoes[index].bloco.trim());
    assert.ok(f.config.questoes[index].itens[0].pergunta.trim());
    const result = check(f);
    assert.equal(result.contract, 'questionarios-adicao-integrada-v3');
    assert.equal(result.structuralStatus, 'proven');
  });
  for (const [name, value] of [
    ['ausente', undefined],
    ['vazio', ''],
    ['espaços', '   '],
    ['null', null],
    ['número', 7],
    ['booleano', true],
    ['array', []],
    ['objeto', {}],
    ['undefined literal', 'undefined'],
    ['null literal', 'null'],
    ['HTML', '<b>Bloco</b>'],
  ])
    test('adição v3: ' + type + ' recusa bloco ' + name, () => {
      const f = fixture();
      if (value === undefined) delete f.config.questoes[index].bloco;
      else f.config.questoes[index].bloco = value;
      f.files.set(
        f.file,
        "(function(){'use strict';window.QuestionariosRevisoes.registrar(" +
          JSON.stringify(f.config) +
          ');})();'
      );
      rejected(f);
    });
  test('adição v3: ' + type + ' mantém recusa de propriedade extra', () => {
    const f = fixture();
    f.config.questoes[index].blocoAlternativo = 'Não admitido';
    f.files.set(
      f.file,
      "(function(){'use strict';window.QuestionariosRevisoes.registrar(" +
        JSON.stringify(f.config) +
        ');})();'
    );
    rejected(f, /Unsupported field/);
  });
  test('adição v3: ' + type + ' recusa bloco executável sem executá-lo', () => {
    const f = fixture();
    const literal = JSON.stringify(f.config.questoes[index].bloco);
    mutate(
      f,
      f.file,
      '"bloco":' + literal,
      '"bloco":(()=>{throw new Error("UNSAFE_BLOCK_SENTINEL");})()'
    );
    const result = rejected(f, /Non-static data/);
    assert.ok(result.reasons.every((reason) => !reason.includes('UNSAFE_BLOCK_SENTINEL')));
  });
}

test('adição: base sem manifesto é recusada explicitamente, sem TypeError', () => {
  const f = fixture();
  f.before.delete(MANIFEST);
  rejected(f, /Addition requires a manifest in the comparison base/);
});

test('adição: CLI histórica com módulo novo continua recusada antes de VM/discovery', (t) => {
  const historical = historicalCliFixture(ROOT);
  t.after(() => historical.dispose());
  const f = fixture();
  for (const [file, bytes] of [
    [f.file, f.files.get(f.file)],
    [f.spec, "throw new Error('UNSAFE_HISTORICAL_DISCOVERY_SENTINEL');"],
  ]) {
    const target = path.join(historical.root, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, bytes);
  }
  let addition;
  const plan = planRepository(
    historical.root,
    { mode: 'worktree', base: historical.base },
    (result) => {
      addition = result;
    }
  );
  assert.equal(plan.valid, false);
  assert.equal(plan.result, 'invalid');
  assert.equal(plan.proposed, null);
  assert.equal(addition.structuralStatus, 'rejected');
  assert.match(addition.reasons.join(' '), /Addition requires a manifest in the comparison base/);
  assert.ok(plan.errors.every((error) => !error.includes('SENTINEL')));
  assert.equal(
    main(['plano', '--mode', 'worktree', '--base', historical.base], historical.root),
    1
  );
});

for (const profile of ['alice', 'mariana'])
  test(
    'adição: ' + profile + ' aceita lote estático completo, sem certificar função/pedagogia',
    () => {
      const f = fixture(profile),
        result = check(f);
      assert.equal(result.structuralStatus, 'proven', JSON.stringify(result));
      assert.equal(result.identityStatus, 'blocked');
      assert.equal(result.runtimeEvidence, 'not-collected');
      assert.equal(result.executionPolicy, 'global');
      assert.equal(result.claimedChanges.length, 7);
      assert.equal(result.coverage.functional, 'not-proven');
      assert.equal(result.coverage.pedagogical, 'human-review-required');
      assert.deepEqual(result.coverage.declared, COVERAGE);
    }
  );

test('adição: campo exige pergunta renderizável com contexto e resposta estática', () => {
  const f = fixture();
  f.config.questoes[1].itens = [
    {
      id: 'q2-a',
      pergunta: 'Uma foto guarda lembranças. Escreva o plural de foto.',
      respostas: ['fotos'],
    },
  ];
  f.files.set(
    f.file,
    "(function(){'use strict';window.QuestionariosRevisoes.registrar(" +
      JSON.stringify(f.config) +
      ');})();'
  );
  assert.equal(check(f).structuralStatus, 'proven');
});

for (const item of [
  { antes: 'Uma', depois: 'guarda lembranças.' },
  {},
  { pergunta: '' },
  { pergunta: '   ' },
  { pergunta: null },
  { pergunta: 42 },
  { pergunta: 'undefined' },
  { pergunta: 'null' },
  { pergunta: 'Uma foto.', antes: 'Uma', depois: 'foto.' },
])
  test('adição: recusa campo sem rótulo consumido pelo motor: ' + JSON.stringify(item), () => {
    const f = fixture();
    f.config.questoes[1].itens = [{ id: 'q2-a', respostas: ['foto'], ...item }];
    f.files.set(
      f.file,
      "(function(){'use strict';window.QuestionariosRevisoes.registrar(" +
        JSON.stringify(f.config) +
        ');})();'
    );
    rejected(f);
  });

for (const kind of ['primary', 'auxiliary', 'historical'])
  test('adição: recusa colisão de chave ' + kind, () => {
    const f = fixture();
    const m = JSON.parse(f.before.get(MANIFEST));
    const old = m.revisions[0];
    if (kind === 'primary') old.primaryKey = f.key;
    if (kind === 'auxiliary') old.sessions.push({ id: 'extra', key: f.key, principal: false });
    if (kind === 'historical') old.historicalKeys.push({ key: f.key, reason: 'synthetic' });
    f.before.set(MANIFEST, JSON.stringify(m));
    f.manifest.revisions[0] = old;
    f.save();
    rejected(f, /Key collision/);
  });
test('adição: recusa ID duplicado', () => {
  const f = fixture();
  f.manifest.revisions[0].id = f.id;
  f.save();
  rejected(f);
});
test('adição: recusa import reordenado mesmo com contagem igual', () => {
  const f = fixture();
  mutate(
    f,
    ENTRY,
    "import './glossario.js';\nimport './armazenamento.js';",
    "import './armazenamento.js';\nimport './glossario.js';"
  );
  rejected(f, /Old nodes/);
});
test('adição: recusa import novo duplicado', () => {
  const f = fixture();
  mutate(
    f,
    ENTRY,
    "import '../revisoes/alice/historia-synthetic.js';",
    "import '../revisoes/alice/historia-synthetic.js';\nimport '../revisoes/alice/historia-synthetic.js';"
  );
  rejected(f, /ambiguous/);
});
test('adição: recusa ordem motor/conteúdo inválida', () => {
  const f = fixture();
  const line = "import '../revisoes/alice/historia-synthetic.js';\n";
  f.files.set(ENTRY, line + f.files.get(ENTRY).replace(line, ''));
  rejected(f, /order/);
});
test('adição: recusa alteração em revisão antiga', () => {
  const f = fixture();
  f.input.changes.push({ type: 'M', currentPath: 'ambiente_interativo/revisoes/alice/old.js' });
  rejected(f, /outside/);
});
test('adição: recusa substituição de handler antigo sem mudar contagem', () => {
  const f = fixture();
  mutate(f, APP, "mostrarTela('inicial');", "mostrarTela('trilhas');");
  rejected(f, /Old nodes/);
});
test('adição: recusa substituição de registro antigo sem mudar contagem', () => {
  const f = fixture();
  mutate(f, REGISTRY, "titulo: 'Moving Around · Transport & Safety'", "titulo: 'Outro título'");
  rejected(f, /Old nodes/);
});
test('adição: recusa handler novo em função errada', () => {
  const f = fixture();
  mutate(f, APP, 'function registrarEventos()', 'function eventosAlterados()');
  rejected(f, /anchor/);
});
test('adição: recusa listener adicional', () => {
  const f = fixture();
  f.files.set(APP, f.files.get(APP) + "\ndocument.addEventListener('click', function () {});\n");
  rejected(f, /Old nodes/);
});
for (const payload of [
  '(function () { process.exit(9); })();',
  'window.QuestionariosRevisoes.registrar({id: (() => 1)()});',
  "(function(){'use strict';window.QuestionariosRevisoes.registrar({get id(){return 'x';}});})();",
  "(function(){'use strict';window.QuestionariosRevisoes.registrar({...x});})();",
])
  test('adição: recusa código indevido sem executá-lo: ' + payload.slice(0, 50), () => {
    const f = fixture();
    f.files.set(f.file, payload);
    rejected(f);
  });
test('adição: recusa propriedade duplicada em conteúdo', () => {
  const f = fixture();
  mutate(f, f.file, '"aluno":"alice"', '"aluno":"alice","aluno":"mariana"');
  rejected(f, /Duplicate/);
});
for (const [old, replacement] of [
  ['type="button" hidden', 'type="button" onclick="alert(1)" hidden'],
  ['<small>História</small>', '<small><span>História</small>'],
  ['type="button" hidden', 'type="button" type="submit" hidden'],
  ['<small>História</small>', '<small data-aluno="alice">História</small>'],
])
  test('adição: recusa HTML inválido/ambíguo: ' + replacement, () => {
    const f = fixture();
    mutate(f, HTML, old, replacement);
    rejected(f);
  });
test('adição: recusa ID HTML duplicado', () => {
  const f = fixture();
  mutate(f, HTML, '<small>História</small>', '<small id="titulo-trilhas">História</small>');
  rejected(f, /Duplicate HTML ID/);
});
test('adição: recusa substituição de texto HTML antigo com contagem igual', () => {
  const f = fixture();
  mutate(f, HTML, 'O que vamos revisar?', 'Qual atividade abrir?');
  rejected(f, /Old HTML/);
});
for (const change of [
  (f) => {
    f.manifest.discovery.caseCount++;
  },
  (f) => {
    f.manifest.tests.at(-1).expectedCases++;
  },
  (f) => {
    f.manifest.revisions[0].primaryKey += 'x';
  },
  (f) => {
    f.manifest.engines[0].consumers.reverse();
  },
  (f) => {
    f.manifest.capabilities.find((c) => c.id === 'estado-estrito').consumers.pop();
  },
  (f) => {
    f.manifest.version = '1.0.0';
  },
])
  test(
    'adição: recusa delta inconsistente do manifesto: ' + change.toString().slice(10, 70),
    () => {
      const f = fixture();
      change(f);
      f.save();
      rejected(f);
    }
  );
test('adição: recusa JSON com propriedade duplicada', () => {
  const f = fixture();
  mutate(f, MANIFEST, '"version": "1.2.0"', '"version": "1.2.0", "version": "1.3.0"');
  rejected(f, /Duplicate/);
});
test('adição: recusa cobertura declarada insuficiente', () => {
  const f = fixture();
  mutate(f, f.spec, '[adicao:offline]', '[outra]');
  rejected(f, /coverage/);
});
test('adição: recusa oráculo dependente no percurso', () => {
  const f = fixture();
  f.manifest.tests.at(-1).cases[0].metadata.oracle = 'application';
  f.save();
  rejected(f, /Independent/);
});
test('adição: recusa código executável no topo da spec antes de descoberta', () => {
  const f = fixture();
  f.files.set(f.spec, 'process.exit(9);\n' + f.files.get(f.spec));
  rejected(f, /Unsafe test declaration/);
});
test('adição: recusa inicializador executável na spec', () => {
  const f = fixture();
  f.files.set(f.spec, 'const x = (() => process.exit(9))();\n' + f.files.get(f.spec));
  rejected(f, /Unsafe test import/);
});
test('adição: recusa testes filtrados', () => {
  const f = fixture();
  mutate(f, f.spec, 'test(', 'test.only(');
  rejected(f, /Unsafe test declaration/);
});
for (const field of ['assets', 'sessions', 'capabilities', 'contentDependencies'])
  test('adição: recusa extensão não suportada: ' + field, () => {
    const f = fixture();
    f.manifest.revisions.at(-1)[field].push('unsupported');
    f.save();
    rejected(f, /Unsupported/);
  });
test('adição: recusa campo desconhecido mesmo estático', () => {
  const f = fixture();
  mutate(f, f.file, '"validacaoEstritaEstado":true', '"validacaoEstritaEstado":true,"ditado":true');
  rejected(f, /Unsupported field/);
});
test('adição: recusa alteração externa ao lote', () => {
  const f = fixture();
  f.input.changes.push({ type: 'M', currentPath: 'package.json' });
  rejected(f, /outside/);
});
test('adição: recusa Markdown arbitrário e mudança de política temática', () => {
  for (const file of [
    'documentacao/private.md',
    'documentacao/ambiente-interativo/infraestrutura/ARMAZENAMENTO_E_PROGRESSO.md',
  ]) {
    const f = fixture();
    f.input.changes.push({ type: 'M', currentPath: file });
    rejected(f, /outside/);
  }
});
test('adição: aceita somente nota fechada aditiva no inventário', () => {
  const f = fixture(),
    p = 'documentacao/ambiente-interativo/INVENTARIO_IMPLEMENTACOES.md';
  f.before.set(p, '# Inventário sintético\n');
  f.files.set(
    p,
    f.before.get(p) + `\n\n## Nova revisão: ${f.id}\n\n${f.config.titulo}\n\nConteúdo: ${f.file}\n`
  );
  f.input.changes.push({ type: 'M', currentPath: p });
  const result = check(f);
  assert.equal(result.structuralStatus, 'proven', JSON.stringify(result));
  assert.equal(result.claimedChanges.length, 8);
  f.files.set(p, f.files.get(p).replace('# Inventário sintético', '# Substituído'));
  rejected(f, /inventory/);
});
test('adição: recusa duas revisões novas', () => {
  const f = fixture();
  f.input.changes.push({ type: 'A', currentPath: 'ambiente_interativo/revisoes/alice/other.js' });
  rejected(f, /Exactly one/);
});
test('adição: recusa base consumidora não revisada', () => {
  const f = fixture();
  f.before.set(APP, f.before.get(APP) + '\n');
  rejected(f, /Unreviewed/);
});
test('adição: sem revisão nova é diagnóstico não aplicável', () => {
  const f = fixture();
  f.input.changes = [];
  assert.equal(check(f).structuralStatus, 'unsupported');
});
test('adição: identidade sintética compatível é separada de evidência funcional', () => {
  const f = fixture();
  // A synthetic policy without diagnostics does NOT reattest the real repository.
  const identity = captureIdentity({
    paths: [...f.files.keys()],
    readBytes: (p) =>
      f.files.has(p)
        ? Buffer.from(f.files.get(p))
        : /\.(svg|png|jpg)$/.test(p)
          ? Buffer.from('synthetic immutable asset')
          : null,
    policy: {
      schemaVersion: 1,
      identityFormat: 2,
      version: '1.1.0',
      rootInputs: [],
      inputRoots: ['ambiente_interativo/', 'validacao/', 'tests/'],
      inputExtensions: ['.js', '.cjs', '.html', '.css', '.json'],
      forcedInputs: [],
      syntheticInputs: [],
      diagnosticProducers: [],
      diagnosticAudit: {},
    },
  });
  assert.equal(identityUsable(identity), true, JSON.stringify(identity.unknown));
  f.input.comparison.target.identity = identity;
  f.input.comparison.target.sourceFingerprint = identity.inputFingerprint;
  f.input.comparison.worktree = {
    source: {
      available: true,
      commit: 'a'.repeat(40),
      tree: 'b'.repeat(40),
      sourceFingerprint: identity.inputFingerprint,
      identity,
    },
  };
  assert.equal(check(f).identityStatus, 'usable');
  assert.equal(check(f).runtimeEvidence, 'not-collected');
  f.input.comparison.identityErrors.push('incompatible');
  assert.equal(check(f).identityStatus, 'blocked');
  f.input.comparison.identityErrors = [];
  f.input.comparison.target.sourceFingerprint = 'c'.repeat(64);
  assert.equal(check(f).identityStatus, 'blocked');
});

test('adição: CLI real rejeita antes de VM/discovery e emite evidência separada', () => {
  const f = fixture();
  const parent = path.join(ROOT, 'tmp/validacao');
  fs.mkdirSync(parent, { recursive: true });
  const root = fs.mkdtempSync(path.join(parent, 'adicao-unit-'));
  const git = (...args) =>
    execFileSync('git', ['-C', root, ...args], {
      encoding: 'utf8',
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  const put = (p, value) => {
    const target = path.join(root, p);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, value);
  };
  try {
    for (const [p, value] of f.before) put(p, value);
    git('init', '-q');
    git('add', '--', ...f.before.keys());
    const tree = git('write-tree');
    const base = git(
      '-c',
      'user.name=Synthetic fixture',
      '-c',
      'user.email=fixture@example.invalid',
      'commit-tree',
      tree,
      '-m',
      'In-memory fixture materialized only for guard test'
    );
    git('update-ref', 'HEAD', base);
    for (const [p, value] of f.files) put(p, value);
    // If VM/discovery run, they encounter this sentinel. Neither may be reached.
    put(f.file, "throw new Error('UNSAFE_OBSERVATION_SENTINEL');\n");
    put(f.spec, "throw new Error('UNSAFE_DISCOVERY_SENTINEL');\n");
    let evidence;
    const plan = planRepository(root, { mode: 'worktree', base }, (e) => {
      evidence = e;
    });
    assert.equal(plan.valid, false);
    assert.equal(evidence.structuralStatus, 'rejected');
    assert.ok(plan.errors.some((e) => e.includes('rejected before executable observation')));
    assert.ok(plan.errors.every((e) => !e.includes('UNSAFE_')));
    assert.equal(main(['plano', '--mode', 'worktree', '--base', base], root), 1);
    const output = path.join(root, 'tmp/validacao/planejador');
    const directories = fs.readdirSync(output);
    assert.equal(directories.length, 1);
    const companion = JSON.parse(
      fs.readFileSync(path.join(output, directories[0], 'adicao-integrada.json'))
    );
    const official = JSON.parse(fs.readFileSync(path.join(output, directories[0], 'plano.json')));
    assert.equal(companion.executionPolicy, 'global');
    assert.equal(companion.structuralStatus, 'rejected');
    assert.equal(Object.hasOwn(official, 'structuralStatus'), false);
    assert.equal(official.proposed, null);
  } finally {
    // Only the dedicated synthetic fixture; never a project checkout/worktree.
    assert.equal(path.dirname(root), parent);
    fs.rmSync(root, { recursive: true, force: true });
  }
});
