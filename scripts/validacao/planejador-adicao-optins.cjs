'use strict';

// A separate, closed grammar. None of these permissions apply to v3.
const acorn = require('acorn');
const { hash } = require('./identidade.cjs');
const CONTRACT = 'questionarios-adicao-optins-v1';
const COMPOSITION = 'adicao-optins-atestacao-composta-v1';
const BEHAVIOR = 'questionarios-optins-cruzados-v1';
const REPRESENTATIVE = 'tests/questionarios-optins-contrato.spec.js';
const CAPABILITIES = ['desktop-amplo', 'ditado', 'estado-estrito', 'sessoes-auxiliares'];
const COVERAGE = [
  'callbacks',
  'sigilo',
  'salto',
  'desktop-1366',
  'desktop-1920',
  'movel-390',
  'conclusao-auxiliar',
  'auxiliar-adverso',
];
const CONSUMERS = [
  'ambiente_interativo/js/app.entry.js',
  'ambiente_interativo/js/app.js',
  'ambiente_interativo/js/registro-revisoes.js',
  'ambiente_interativo/index.html',
  'ambiente_interativo/css/estilo.css',
  'ambiente_interativo/js/gramatica-questionarios.js',
  'ambiente_interativo/js/questionarios-interacoes.js',
  'ambiente_interativo/js/gramatica-ditado.js',
  'ambiente_interativo/js/audio.js',
  'ambiente_interativo/js/armazenamento.js',
  'ambiente_interativo/js/ingles.js',
  'ambiente_interativo/js/pronuncia.js',
];
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const check = (ok, reason) => {
  if (!ok) throw Error(reason);
};
const parse = (s) => acorn.parse(s, { ecmaVersion: 'latest', sourceType: 'script' });
const clean = (n) =>
  JSON.stringify(n, (k, v) => (['start', 'end', 'raw'].includes(k) ? undefined : v));
function walk(n, fn, ancestors = []) {
  if (!n || typeof n !== 'object') return;
  if (n.type) fn(n, ancestors);
  for (const v of Object.values(n)) {
    if (Array.isArray(v)) v.forEach((x) => walk(x, fn, [...ancestors, n]));
    else if (v && typeof v === 'object') walk(v, fn, [...ancestors, n]);
  }
}
function exact(o, fields) {
  check(
    o && !Array.isArray(o) && same(Object.keys(o).sort(), [...fields].sort()),
    'Opt-ins fields incomplete/extra'
  );
}
function validateConfig(c) {
  check(
    c.materia === 'Gramática' && c.id.startsWith(c.aluno + '-gramatica-'),
    'Opt-ins only supports Gramática'
  );
  exact(c.layout, ['desktopAmplo']);
  check(c.layout.desktopAmplo === true, 'Desktop Amplo required');
  exact(c.modoResponsavel, ['habilitado', 'sessoes']);
  check(
    c.modoResponsavel.habilitado === true &&
      Array.isArray(c.modoResponsavel.sessoes) &&
      c.modoResponsavel.sessoes.length === 2,
    'Exactly two enabled sessions required'
  );
  const [main, aux] = c.modoResponsavel.sessoes;
  for (const s of [main, aux]) exact(s, ['id', 'nome', 'principal', 'chaveArmazenamento']);
  check(
    main.id === c.aluno &&
      main.nome === c.nome &&
      main.principal === true &&
      main.chaveArmazenamento === c.chave,
    'Invalid principal session'
  );
  check(
    aux.id === 'responsavel' &&
      aux.nome === 'Responsável' &&
      aux.principal === false &&
      aux.chaveArmazenamento !== c.chave,
    'Invalid auxiliary session'
  );
  check(
    /^revisoesEscolares\.(alice|mariana)\.gramatica\.[a-zA-Z0-9.]+\.v[1-9][0-9]*$/.test(c.chave),
    'Invalid opt-ins primary key'
  );
  check(
    aux.chaveArmazenamento === c.chave.replace(/\.v([1-9][0-9]*)$/, '.responsavel.v$1'),
    'Auxiliary key outside revision namespace'
  );
  const units = new Set();
  for (const q of c.questoes) {
    const present = ['ditado', 'unidadeDitado', 'cancelarAoTrocarCampo'].filter((k) =>
      Object.hasOwn(q, k)
    );
    if (!present.length) continue;
    check(
      present.length === 3 &&
        q.tipo === 'campos' &&
        q.ditado === true &&
        q.cancelarAoTrocarCampo === true &&
        ['palavra', 'frase'].includes(q.unidadeDitado),
      'Unsupported dictation flags/type'
    );
    check(
      q.itens.every((i) => i.respostas.length === 1),
      'Dictation needs one unambiguous answer per field'
    );
    units.add(q.unidadeDitado);
  }
  check(units.has('palavra') && units.has('frase'), 'Word and phrase dictations required');
  return c;
}
function sessions(c) {
  return c.modoResponsavel.sessoes.map((s) => ({
    id: s.id,
    key: s.chaveArmazenamento,
    principal: s.principal,
  }));
}
function validateDescriptor(r, c, oldKeys) {
  check(
    same(r.sessions, sessions(c)) && same(r.capabilities, CAPABILITIES),
    'Opt-ins session/capability metadata differs'
  );
  check(
    sessions(c).every((s) => !oldKeys.includes(s.key)),
    'Opt-ins key collision'
  );
}
// This only dispatches to a stricter grammar; it cannot authorize a batch.
function claimsOptins(source) {
  let claimed = false;
  try {
    walk(parse(source), (n) => {
      if (
        n.type === 'Property' &&
        ['modoResponsavel', 'layout', 'ditado', 'unidadeDitado', 'cancelarAoTrocarCampo'].includes(
          n.key?.name ?? n.key?.value
        )
      )
        claimed = true;
    });
  } catch {
    /* The v3 parser still rejects malformed input before observation. */
  }
  return claimed;
}
const IMPORTS = [
  "const AxeBuilder = require('@axe-core/playwright').default;",
  "const path = require('node:path');",
  "const { pathToFileURL } = require('node:url');",
];
const IMPORT_AST = IMPORTS.map((s) => clean(parse(s).body[0]));
const AXE = clean(
  parse("new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()").body[0]
    .expression
);
const FILE = clean(
  parse("pathToFileURL(path.resolve(__dirname, '../ambiente_interativo/index.html')).href").body[0]
    .expression
);
const RESERVED = new Set(['AxeBuilder', 'path', 'pathToFileURL', '__dirname']);
function prepareSpec(source) {
  const tree = parse(source),
    imports = [],
    uses = [];
  for (const n of tree.body) {
    const index = IMPORT_AST.indexOf(clean(n));
    if (index >= 0) {
      check(!imports.some((x) => x.index === index), 'Duplicate canonical import');
      imports.push({ index, node: n });
    }
  }
  walk(tree, (n, ancestors) => {
    if (n.type === 'CallExpression' && clean(n) === AXE) uses.push({ kind: 'axe', node: n });
    if (n.type === 'MemberExpression' && clean(n) === FILE) {
      const p = ancestors.at(-1);
      check(
        p?.type === 'CallExpression' &&
          p.callee?.type === 'MemberExpression' &&
          !p.callee.computed &&
          p.callee.object?.name === 'page' &&
          p.callee.property.name === 'goto' &&
          p.arguments.length === 1 &&
          p.arguments[0] === n,
        'Canonical file URL only allowed as page.goto destination'
      );
      uses.push({ kind: 'file', node: n });
    }
  });
  const ranges = [...imports.map((x) => x.node), ...uses.map((x) => x.node)];
  walk(tree, (n) => {
    if (n.type === 'Identifier' && RESERVED.has(n.name))
      check(
        ranges.some((r) => n.start >= r.start && n.end <= r.end),
        'Reserved import binding escaped/rebound/shadowed'
      );
  });
  for (const u of uses)
    check(
      imports.some((x) => x.index === (u.kind === 'axe' ? 0 : 1)) &&
        (u.kind !== 'file' || imports.some((x) => x.index === 2)),
      'Canonical use missing direct import'
    );
  for (const i of imports)
    check(
      uses.some((u) => u.kind === (i.index === 0 ? 'axe' : 'file')),
      'Unused canonical import'
    );
  let stripped = source;
  for (const { node } of imports.sort((a, b) => b.node.start - a.node.start))
    stripped = stripped.slice(0, node.start) + stripped.slice(node.end);
  return stripped;
}
function reviewConsumers(read, revisionFile, specFile) {
  return [
    ...CONSUMERS,
    revisionFile,
    specFile,
    REPRESENTATIVE,
    'scripts/validacao/planejador-adicao-optins.cjs',
  ]
    .sort()
    .map((path) => {
      const bytes = read('after', path);
      check(bytes !== null, 'Unresolved opt-ins consumer: ' + path);
      return { path, sha256: hash(bytes) };
    });
}
function validateReview(review, read, addition) {
  exact(review, [
    'contract',
    'compositionContract',
    'schemaVersion',
    'representatives',
    'consumers',
    'rationale',
  ]);
  check(
    review.contract === CONTRACT &&
      review.compositionContract === COMPOSITION &&
      review.schemaVersion === 1,
    'Opt-ins review discriminant differs'
  );
  const prose = (x) => typeof x === 'string' && x.trim().length >= 30;
  check(prose(review.rationale), 'Opt-ins review rationale missing');
  check(
    same(review.representatives, [
      {
        path: REPRESENTATIVE,
        sha256: hash(read('after', REPRESENTATIVE) || ''),
        contractId: BEHAVIOR,
      },
    ]),
    'Opt-ins representative review differs'
  );
  const content = addition.claimedChanges.find((e) =>
    /^ambiente_interativo\/revisoes\//.test(e.path)
  );
  const spec = addition.claimedChanges.find((e) => /^tests\//.test(e.path));
  const expected = reviewConsumers(read, content.path, spec.path);
  check(
    Array.isArray(review.consumers) &&
      same(
        review.consumers.map(({ rationale: _r, ...e }) => e),
        expected
      ) &&
      review.consumers.every((e) => prose(e.rationale)),
    'Opt-ins consumer closure incomplete/unknown'
  );
}
function validateTestCoverage(titles) {
  check(
    COVERAGE.every((tag) => titles.some((s) => s.startsWith('[optins:' + tag + '] '))),
    'Insufficient declared opt-ins coverage'
  );
}
function validateTestMetadata(test) {
  check(
    same(test.engines, ['questionarios']) && same(test.capabilities, CAPABILITIES),
    'Opt-ins spec engine/capability metadata differs'
  );
  check(
    same(test.fixtures, []) || same(test.fixtures, ['tests/confirmar-servidor-local.cjs']),
    'Unknown opt-ins spec fixture dependency'
  );
}
module.exports = {
  CONTRACT,
  COMPOSITION,
  BEHAVIOR,
  REPRESENTATIVE,
  CAPABILITIES,
  COVERAGE,
  CONSUMERS,
  validateConfig,
  validateDescriptor,
  claimsOptins,
  prepareSpec,
  validateReview,
  reviewConsumers,
  validateTestCoverage,
  validateTestMetadata,
};
