'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const {
  optinsFixture,
  maintained,
  additionPlan,
  explicitIntegrationBase,
} = require('./helpers/optins-fixture.cjs');
const {
  proveAddition,
  proveOptinsAddition,
} = require('../../scripts/validacao/planejador-adicao.cjs');
const { composeAddition } = require('../../scripts/validacao/planejador-composicao.cjs');
const O = require('../../scripts/validacao/planejador-adicao-optins.cjs');
const { selection } = require('../../scripts/validacao/executor-local.cjs');
const { hash, captureIdentity, identityUsable } = require('../../scripts/validacao/identidade.cjs');
function source(f) {
  f.files.set(
    f.file,
    "(function(){'use strict';window.QuestionariosRevisoes.registrar(" +
      JSON.stringify(f.config) +
      ');})();'
  );
}
function compose(f, review = f.seal()) {
  return composeAddition(f.input, review, f.baseInfo);
}
for (const profile of ['alice', 'mariana'])
  test('opt-ins: literal integral ' + profile + ' e recusa diferencial v3', () => {
    const f = optinsFixture(profile),
      r = proveOptinsAddition(f.input);
    assert.equal(r.contract, O.CONTRACT);
    assert.equal(r.structuralStatus, 'proven', JSON.stringify(r.reasons));
    assert.equal(r.identityStatus, 'blocked');
    assert.equal(proveAddition(f.input).structuralStatus, 'rejected');
    assert.ok(r.requiredTestFiles.includes(O.REPRESENTATIVE));
  });
const mutations = [
  ['sem desktop', (c) => delete c.layout],
  ['desktop false', (c) => (c.layout.desktopAmplo = false)],
  ['layout extra', (c) => (c.layout.mobile = true)],
  ['sem responsável', (c) => delete c.modoResponsavel],
  ['habilitado false', (c) => (c.modoResponsavel.habilitado = false)],
  ['uma sessão', (c) => c.modoResponsavel.sessoes.pop()],
  [
    'três sessões',
    (c) => c.modoResponsavel.sessoes.push(structuredClone(c.modoResponsavel.sessoes[1])),
  ],
  ['ID duplicado', (c) => (c.modoResponsavel.sessoes[1].id = c.aluno)],
  ['chave duplicada', (c) => (c.modoResponsavel.sessoes[1].chaveArmazenamento = c.chave)],
  ['duas principais', (c) => (c.modoResponsavel.sessoes[1].principal = true)],
  ['nenhuma principal', (c) => (c.modoResponsavel.sessoes[0].principal = false)],
  ['principal omitida', (c) => delete c.modoResponsavel.sessoes[1].principal],
  ['sessões invertidas', (c) => c.modoResponsavel.sessoes.reverse()],
  ['nome errado', (c) => (c.modoResponsavel.sessoes[1].nome = 'Outro')],
  [
    'chave outro perfil',
    (c) => (c.modoResponsavel.sessoes[1].chaveArmazenamento = c.chave.replace('alice', 'mariana')),
  ],
  ['sem versão', (c) => (c.chave = c.chave.replace('.v1', ''))],
  ['matéria extra', (c) => (c.materia = 'História')],
  ['estado não estrito', (c) => (c.validacaoEstritaEstado = false)],
  ['tentativas', (c) => (c.registrarTentativas = true)],
  ['asset', (c) => (c.imagem = '../assets/a.svg')],
  ['tipo arbitrário', (c) => (c.questoes[0].tipo = 'ordenacao')],
  ['sem frase', (c) => (c.questoes[2].unidadeDitado = 'palavra')],
  ['sem palavra', (c) => (c.questoes[1].unidadeDitado = 'frase')],
  ['unidade desconhecida', (c) => (c.questoes[1].unidadeDitado = 'texto')],
  [
    'ditado em opções',
    (c) =>
      Object.assign(c.questoes[0], {
        ditado: true,
        unidadeDitado: 'palavra',
        cancelarAoTrocarCampo: true,
      }),
  ],
  ['ditado false', (c) => (c.questoes[1].ditado = false)],
  ['cancelamento false', (c) => (c.questoes[1].cancelarAoTrocarCampo = false)],
  ['flag parcial', (c) => delete c.questoes[1].cancelarAoTrocarCampo],
  ['resposta ambígua', (c) => c.questoes[1].itens[0].respostas.push('outra')],
  ['texto ditado extra', (c) => (c.questoes[1].itens[0].textoDitado = 'outra')],
  ['acentos extra', (c) => (c.questoes[1].acentosObrigatorios = true)],
  ['campo sem pergunta', (c) => delete c.questoes[1].itens[0].pergunta],
  ['bloco sem conteúdo', (c) => (c.questoes[0].bloco = 'undefined')],
];
for (const [name, mutate] of mutations)
  test('opt-ins negativo e diferencial v3: ' + name, () => {
    const f = optinsFixture();
    mutate(f.config);
    source(f);
    assert.equal(proveOptinsAddition(f.input).structuralStatus, 'rejected');
    assert.equal(proveAddition(f.input).structuralStatus, 'rejected');
  });
for (const [name, mutate] of [
  ['sessão omitida', (r) => r.sessions.pop()],
  ['capacidade omitida', (r) => (r.capabilities = ['estado-estrito'])],
  ['dependente desconhecido', (r) => r.contentDependencies.push('desconhecido')],
  ['asset declarado', (r) => r.assets.push('assets/a.svg')],
  ['chave histórica extra', (r) => r.historicalKeys.push({ key: 'antiga' })],
])
  test('opt-ins metadados: ' + name, () => {
    const f = optinsFixture();
    mutate(f.manifest.revisions.find((r) => r.id === f.id));
    f.save();
    assert.equal(proveOptinsAddition(f.input).structuralStatus, 'rejected');
  });
test('opt-ins recusa colisão auxiliar com chave histórica/principal existente', () => {
  const f = optinsFixture();
  const before = JSON.parse(f.before.get('validacao/manifesto.json'));
  const target = f.manifest;
  before.revisions[0].primaryKey = f.config.modoResponsavel.sessoes[1].chaveArmazenamento;
  target.revisions[0].primaryKey = before.revisions[0].primaryKey;
  f.before.set('validacao/manifesto.json', JSON.stringify(before));
  f.save();
  assert.match(proveOptinsAddition(f.input).reasons.join(' '), /collision/);
});
test('opt-ins recusa metadados omitidos da spec e dependência desconhecida', () => {
  for (const field of ['engines', 'capabilities', 'fixtures']) {
    const f = optinsFixture(),
      t = f.manifest.tests.find((t) => t.file === f.spec);
    t[field] = field === 'fixtures' ? ['output/entrada-privada.json'] : [];
    f.save();
    assert.equal(proveOptinsAddition(f.input).structuralStatus, 'rejected');
  }
});
test('scanner v3 permanece byte a byte e REVIEWED conserva dez superfícies', () => {
  const fs = require('node:fs'),
    path = require('node:path'),
    acorn = require('acorn');
  const { execFileSync } = require('node:child_process');
  const root = path.resolve(__dirname, '../..');
  const file = 'scripts/validacao/planejador-composicao.cjs';
  const base = execFileSync('git', ['show', 'HEAD:' + file], { cwd: root, encoding: 'utf8' });
  const current = fs.readFileSync(path.join(root, file), 'utf8');
  const extract = (s) => {
    const n = acorn
      .parse(s, { ecmaVersion: 'latest' })
      .body.find((n) => n.type === 'FunctionDeclaration' && n.id.name === 'scanNewTest');
    return s.slice(n.start, n.end);
  };
  assert.equal(extract(current), extract(base));
  const surface = require('../../scripts/validacao/planejador-adicao.cjs').reviewedSurfaces;
  const expected = surface((_side, p) =>
    execFileSync('git', ['show', 'HEAD:' + p], { cwd: root, encoding: 'utf8' })
  );
  assert.equal(expected.length, 10);
  assert.ok(expected.slice(4).every((e) => e.baseSha256 === e.expectedSha256));
});
test('opt-ins recusa lote incompleto, compartilhado e conteúdo executável', () => {
  for (const mode of ['incomplete', 'shared', 'function']) {
    const f = optinsFixture();
    if (mode === 'incomplete') f.input.changes.pop();
    if (mode === 'shared')
      f.input.changes.push({
        type: 'M',
        currentPath: 'ambiente_interativo/js/audio.js',
        previousPath: null,
      });
    if (mode === 'function')
      f.files.set(
        f.file,
        f.files
          .get(f.file)
          .replace('"titulo":', '"titulo":(()=>{throw Error("UNEXECUTED")})(),"extra":')
      );
    assert.equal(proveOptinsAddition(f.input).structuralStatus, 'rejected');
  }
});
const canonical =
  "const {test,expect}=require('@playwright/test');\nconst AxeBuilder=require('@axe-core/playwright').default;\nconst path=require('node:path');\nconst {pathToFileURL}=require('node:url');\ntest('canonical',async({page})=>{await page.goto(pathToFileURL(path.resolve(__dirname,'../ambiente_interativo/index.html')).href);const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations.filter(v=>['serious','critical'].includes(v.impact))).toEqual([]);});";
test('scanner opt-ins aceita somente os imports e usos canônicos', () => {
  const s = O.prepareSpec(canonical);
  assert.ok(!s.includes("require('node:path')"));
  assert.ok(s.includes('pathToFileURL'));
});
for (const [name, mutate] of [
  ['alias', (s) => s.replace('const path=', 'const outro=')],
  ['shadow', (s) => s.replace('const result=', 'const path={};const result=')],
  [
    'file arbitrário',
    (s) => s.replace('../ambiente_interativo/index.html', '../output/secreto.json'),
  ],
  ['segmento dinâmico', (s) => s.replace("'../ambiente_interativo/index.html'", 'destino')],
  ['uso extra', (s) => s.replace('const result=', 'path.resolve("outro");const result=')],
  ['file URL armazenada', (s) => s.replace('await page.goto(', 'const destino=(')],
  ['axe exclude', (s) => s.replace('.analyze()', '.exclude("body").analyze()')],
  ['axe tags parciais', (s) => s.replace(",'wcag21aa'", '')],
  [
    'binding escapado',
    (s) => s.replace('const result=', 'const outra=pathToFileURL;const result='),
  ],
  ['import alternativo', (s) => s.replace("require('node:path')", "require('path')")],
  [
    'unused',
    (s) =>
      s.replace(
        "await page.goto(pathToFileURL(path.resolve(__dirname,'../ambiente_interativo/index.html')).href);",
        ''
      ),
  ],
])
  test('scanner opt-ins recusa ' + name, () =>
    assert.throws(() => O.prepareSpec(mutate(canonical)))
  );
test('composição opt-ins só emite R1 com revisão integral e identidade utilizável', () => {
  const f = maintained(),
    r = compose(f);
  assert.equal(r.composition.status, 'compatible', JSON.stringify(r.composition.maintenance));
  assert.equal(r.composition.contract, O.COMPOSITION);
  const plan = additionPlan(f, r.selectionEvidence);
  assert.equal(plan.result, 'candidate', JSON.stringify(plan.errors));
  assert.ok(plan.changes.every((c) => c.risk === 'R1' && c.rule === O.CONTRACT));
  assert.deepEqual(plan.proposed.files, r.addition.requiredTestFiles);
  assert.equal(plan.proposed.caseCount, 130);
  selection(plan, r.composition, 'targeted');
  const original = JSON.parse(JSON.stringify(r));
  const forged = additionPlan(f, original.selectionEvidence || {});
  assert.notEqual(forged.result, 'candidate');
  // No caller-supplied "usable" flag can override the full identity gates.
  f.input.comparison.identityErrors.push('inconclusive');
  assert.equal(compose(f).composition.status, 'rejected');
});
test('identidade preserva semântica literal dos opt-ins e recusa deriva de bundle', () => {
  const f = maintained();
  assert.equal(identityUsable(f.identity), true);
  const original = f.files.get('ambiente_interativo/js/app.bundle.js');
  const content = f.files.get(f.file);
  assert.ok(original.includes(content));
  f.files.set(
    'ambiente_interativo/js/app.bundle.js',
    original.replace(content, content.replace('"desktopAmplo":true', '"desktopAmplo":false'))
  );
  const drift = captureIdentity({
    paths: [...f.files.keys()],
    policy: f.policy,
    readBytes: (p) => (f.files.has(p) ? Buffer.from(f.files.get(p)) : null),
  });
  assert.equal(identityUsable(drift), false);
  assert.notEqual(drift.inputFingerprint, f.identity.inputFingerprint);
});
test('scanner canônico integra a composição; v3 continua recusando esses imports', () => {
  const f = maintained();
  f.files.set(f.spec, f.files.get(f.spec) + '\n' + canonical.slice(canonical.indexOf('\n') + 1));
  const own = f.manifest.tests.find((t) => t.file === f.spec);
  own.expectedCases++;
  f.manifest.discovery.caseCount++;
  f.save();
  f.refresh();
  f.data.target.manifestFingerprint = hash(JSON.stringify(f.manifest));
  f.data.optinsReview.consumers = O.reviewConsumers(f.input.read, f.file, f.spec).map((e) => ({
    ...e,
    rationale: 'Canonical imports and their exclusive use were deliberately reviewed.',
  }));
  assert.equal(proveAddition(f.input).structuralStatus, 'rejected');
  const r = compose(f);
  assert.equal(r.composition.status, 'compatible', JSON.stringify(r.composition.maintenance));
});
for (const [name, mutate] of [
  ['bloco ausente', (f) => delete f.data.optinsReview],
  ['contrato trocado', (f) => (f.data.optinsReview.contract = 'questionarios-adicao-integrada-v3')],
  ['extra', (f) => (f.data.optinsReview.extra = true)],
  ['consumidor omitido', (f) => f.data.optinsReview.consumers.pop()],
  [
    'consumidor desconhecido',
    (f) =>
      f.data.optinsReview.consumers.push({
        path: 'outro',
        sha256: 'a'.repeat(64),
        rationale: 'Rationale descriptive and synthetic only.',
      }),
  ],
  [
    'hash do representante',
    (f) => (f.data.optinsReview.representatives[0].sha256 = 'f'.repeat(64)),
  ],
  ['snapshot anterior', (f) => (f.data.target.inputFingerprint = 'f'.repeat(64))],
  ['representante ausente na base', (f) => f.before.delete(O.REPRESENTATIVE)],
])
  test('composição opt-ins recusa ' + name, () => {
    const f = maintained();
    mutate(f);
    const r = compose(f);
    assert.equal(r.composition.status, 'rejected');
    assert.equal(r.selectionEvidence, null);
  });
test('token opt-ins revoga após alteração tardia de consumidor ou representante', () => {
  for (const path of [O.REPRESENTATIVE, 'ambiente_interativo/js/ingles.js']) {
    const f = maintained(),
      r = compose(f);
    assert.equal(r.composition.status, 'compatible');
    f.files.set(path, f.files.get(path) + '\n// changed after review');
    assert.notEqual(additionPlan(f, r.selectionEvidence).result, 'candidate');
  }
});
test('duas adições sintéticas sucessivas exigem revisões e bases próprias', () => {
  const first = maintained('alice'),
    r1 = compose(first);
  assert.equal(r1.composition.status, 'compatible');
  const second = maintained('mariana', first.files);
  second.baseInfo.commit = 'd'.repeat(40);
  second.baseInfo.tree = 'e'.repeat(40);
  second.input.comparison.base.commit = second.baseInfo.commit;
  Object.assign(second.data.base, { commit: second.baseInfo.commit, tree: second.baseInfo.tree });
  Object.assign(second.input.comparison.worktree.source, {
    commit: second.baseInfo.commit,
    tree: second.baseInfo.tree,
  });
  Object.assign(second.data.target, { commit: second.baseInfo.commit, tree: second.baseInfo.tree });
  explicitIntegrationBase(second);
  assert.equal(compose(second, first.seal()).composition.status, 'rejected');
  const r2 = compose(second);
  assert.equal(r2.composition.status, 'compatible', JSON.stringify(r2.composition.maintenance));
  assert.equal(additionPlan(second, r2.selectionEvidence).result, 'candidate');
  assert.notEqual(first.data.target.inputFingerprint, second.data.target.inputFingerprint);
  assert.notEqual(hash(first.seal().bytes), hash(second.seal().bytes));
});
