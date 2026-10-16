'use strict';

// A companion diagnostic, never a selector, risk override or identity exception.
const acorn = require('acorn');
const html = require('prettier/plugins/html').parsers.html;
const path = require('node:path');
const { hash, identityUsable } = require('./identidade.cjs');
const { CONTRACT_POLICY } = require('./planejador.cjs');
const CONTRACT = 'questionarios-adicao-integrada-v1';
const ENTRY = 'ambiente_interativo/js/app.entry.js';
const REGISTRY = 'ambiente_interativo/js/registro-revisoes.js';
const APP = 'ambiente_interativo/js/app.js';
const HTML = 'ambiente_interativo/index.html';
const MANIFEST = 'validacao/manifesto.json';
const INVENTORY = 'documentacao/ambiente-interativo/INVENTARIO_IMPLEMENTACOES.md';
const COVERAGE = [
  'cadastro',
  'recuperacao',
  'isolamento',
  'storage-adverso',
  'acessibilidade',
  'offline',
  'gabarito',
];
// Reviewed consumers at 202c304. This is a local proof boundary, NOT an identity pin.
// Deliberate source review is required before changing these values.
const REVIEWED = {
  [ENTRY]: '41083dee5d984052c912a29d476af69afa72aa763820d7c1864a7afb5d1cdae2',
  [APP]: '75456a794ff5e3f260c38a4f43a7916cc7aaa68fdcbfc6954ae2d1678375600d',
  [REGISTRY]: '82b136a83e80385475e215c81617ae63e3444d4467196f6c34991428fa3a3c9c',
  [HTML]: '6139c85299394b5ecc02ac71125ca4b3d09a53bd773c4c11356af79ff2f3d57f',
  'ambiente_interativo/css/estilo.css':
    '855b718be39b39c83af9dbe93ae469574bb0bd054383539ea615fc3d3836fac5',
  'ambiente_interativo/js/gramatica-questionarios.js':
    '202fd9d77c0fc0d50ec1e16ccc6af422d8489ffe7ecef96a7e31c3d2d1409498',
  'ambiente_interativo/js/questionarios-interacoes.js':
    'd7423cac86506bf13b878c55e2e25b3da6838e1a5bb01374803c35aecff79c58',
  'ambiente_interativo/js/gramatica-ditado.js':
    '97c27c2021386193686990d9e4fb84a768c13f5a9bbd78c541becbf6bed27bed',
  'ambiente_interativo/js/audio.js':
    '37dac848900bee37052b472cdd7eedb4cc7630affb73e8ebc9c5e4288b15d481',
  'ambiente_interativo/js/armazenamento.js':
    '5fabf2bd0ed53a16a86a772368f10069e99874f41577d0716c120739f2aaa2a1',
};
const fail = (condition, reason) => {
  if (!condition) throw Error(reason);
};
const parse = (s, module = false) =>
  acorn.parse(s, { ecmaVersion: 'latest', sourceType: module ? 'module' : 'script' });
const clean = (n) =>
  JSON.stringify(n, (k, v) => (['start', 'end', 'raw'].includes(k) ? undefined : v));
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function walk(n, visit) {
  if (!n || typeof n !== 'object') return;
  if (n.type) visit(n);
  for (const v of Object.values(n)) {
    if (Array.isArray(v)) v.forEach((x) => walk(x, visit));
    else if (v && typeof v === 'object') walk(v, visit);
  }
}
function one(tree, predicate) {
  const found = [];
  walk(tree, (n) => {
    if (predicate(n)) found.push(n);
  });
  fail(found.length === 1, 'Missing/ambiguous AST anchor');
  return found[0];
}
function data(n) {
  if (
    n?.type === 'Literal' &&
    !n.regex &&
    (n.value === null || ['string', 'boolean', 'number'].includes(typeof n.value))
  )
    return n.value;
  if (n?.type === 'ArrayExpression') return n.elements.map(data);
  fail(n?.type === 'ObjectExpression', 'Non-static data/executable expression');
  const result = Object.create(null);
  for (const p of n.properties) {
    const k = p.key?.name ?? p.key?.value;
    fail(
      p.type === 'Property' &&
        p.kind === 'init' &&
        !p.computed &&
        !p.method &&
        !p.shorthand &&
        typeof k === 'string' &&
        !['__proto__', 'constructor', 'prototype'].includes(k) &&
        !Object.hasOwn(result, k),
      'Duplicate/unsafe/non-static property'
    );
    result[k] = data(p.value);
  }
  return result;
}
function json(s) {
  const result = JSON.parse(s);
  fail(equal(result, data(parse('(' + s + ')').body[0].expression)), 'Ambiguous JSON');
  return result;
}
function keys(o, allowed) {
  fail(
    o &&
      !Array.isArray(o) &&
      typeof o === 'object' &&
      Object.keys(o).every((k) => allowed.includes(k)),
    'Unsupported field/capability'
  );
}
function text(s) {
  fail(
    typeof s === 'string' &&
      s.trim() &&
      !/[<>\u0000-\u001f]|(?:https?:|data:|javascript:|\.\.\/|leituras\/)/i.test(s),
    'Invalid/non-textual string'
  );
}
function unique(values, reason) {
  fail(new Set(values).size === values.length, reason);
}
function content(source) {
  const tree = parse(source);
  fail(tree.body.length === 1, 'Additional executable content');
  const call = tree.body[0].expression;
  fail(
    call?.type === 'CallExpression' &&
      !call.optional &&
      call.arguments.length === 0 &&
      call.callee.type === 'FunctionExpression' &&
      !call.callee.async &&
      !call.callee.generator &&
      !call.callee.id &&
      call.callee.params.length === 0,
    'Unknown content wrapper'
  );
  const body = call.callee.body.body;
  fail(body.length === 2 && body[0].directive === 'use strict', 'Additional executable content');
  const registration = body[1].expression;
  fail(
    registration?.type === 'CallExpression' &&
      registration.arguments.length === 1 &&
      clean(registration.callee) ===
        clean(parse('window.QuestionariosRevisoes.registrar').body[0].expression),
    'Unknown registrar'
  );
  const config = data(registration.arguments[0]);
  keys(config, [
    'id',
    'aluno',
    'nome',
    'materia',
    'titulo',
    'subtitulo',
    'chave',
    'questoes',
    'resumoFinal',
    'validacaoEstritaEstado',
  ]);
  for (const k of ['id', 'aluno', 'nome', 'materia', 'titulo', 'subtitulo', 'chave', 'resumoFinal'])
    text(config[k]);
  fail(
    ['alice', 'mariana'].includes(config.aluno) &&
      config.nome === (config.aluno === 'alice' ? 'Alice' : 'Mariana') &&
      config.validacaoEstritaEstado === true,
    'Unsupported profile/state contract'
  );
  fail(Array.isArray(config.questoes) && config.questoes.length > 0, 'Empty questions');
  const ids = [];
  for (const q of config.questoes) {
    keys(q, [
      'id',
      'titulo',
      'instrucao',
      'tipo',
      'itens',
      'dica',
      'sucesso',
      'leitura',
      'leituraTitulo',
      'fonteEstudo',
    ]);
    for (const k of ['id', 'titulo', 'instrucao', 'dica', 'sucesso']) text(q[k]);
    for (const k of ['leitura', 'leituraTitulo', 'fonteEstudo']) if (q[k] !== undefined) text(q[k]);
    fail(
      ['opcoes', 'campos'].includes(q.tipo) && Array.isArray(q.itens) && q.itens.length > 0,
      'Unsupported question type/items'
    );
    ids.push(q.id);
    for (const item of q.itens) {
      keys(
        item,
        q.tipo === 'opcoes'
          ? ['id', 'pergunta', 'opcoes', 'respostas']
          : ['id', 'antes', 'depois', 'respostas']
      );
      text(item.id);
      ids.push(item.id);
      fail(Array.isArray(item.respostas) && item.respostas.length > 0, 'Missing answers');
      item.respostas.forEach(text);
      if (q.tipo === 'opcoes') {
        text(item.pergunta);
        fail(
          Array.isArray(item.opcoes) &&
            item.opcoes.length >= 2 &&
            item.respostas.length === 1 &&
            item.opcoes.includes(item.respostas[0]),
          'Invalid option/answer'
        );
        item.opcoes.forEach(text);
        unique(item.opcoes, 'Duplicate option');
      } else {
        fail(
          typeof item.antes === 'string' && typeof item.depois === 'string',
          'Missing field context'
        );
        text(item.antes + item.depois);
      }
    }
  }
  unique(ids, 'Duplicate question/item ID');
  fail(
    ids.every((id) => /^[a-z][a-z0-9-]*$/.test(id) && !['constructor', 'prototype'].includes(id)),
    'Unsafe question/item ID'
  );
  return config;
}
// Remove only approved AST nodes plus whitespace/separating commas. No old bytes may change.
function erase(source, nodes, comma = false) {
  for (const n of [...nodes].sort((a, b) => b.start - a.start)) {
    let start = n.start,
      end = n.end;
    if (comma) {
      const tail = /^\s*,/.exec(source.slice(end));
      if (tail) end += tail[0].length;
      else {
        const head = /,\s*$/.exec(source.slice(0, start));
        fail(head, 'Missing insertion separator');
        start -= head[0].length;
      }
    }
    while (start > 0 && /[\t ]/.test(source[start - 1])) start--;
    if (source[start - 1] === '\n' && source[end] === '\n') end++;
    source = source.slice(0, start) + source.slice(end);
  }
  return source;
}
function preserved(before, after, nodes, comma = false, module = false) {
  const stripped = erase(after, nodes, comma);
  fail(
    stripped === before && clean(parse(stripped, module)) === clean(parse(before, module)),
    'Old nodes/order/bytes changed'
  );
}
function parentOf(tree, node) {
  let parent;
  walk(tree, (n) => {
    if (Object.values(n).some((v) => (Array.isArray(v) ? v.includes(node) : v === node)))
      parent = n;
  });
  return parent;
}
function htmlTree(source) {
  const tree = html.parse(source, {});
  function visit(n) {
    if (n.attrs)
      unique(
        n.attrs.map((a) => a.name),
        'Duplicate HTML attribute'
      );
    for (const c of n.children || []) visit(c);
  }
  visit(tree);
  return tree;
}
function htmlElements(tree) {
  const found = [];
  function visit(n, parent) {
    if (n.kind === 'element') found.push({ n, parent });
    for (const c of n.children || []) visit(c, n);
  }
  visit(tree);
  return found;
}
const attrs = (n) => Object.fromEntries(n.attrs.map((a) => [a.name, a.value]));
function card(before, after, record) {
  htmlTree(before);
  const tree = htmlTree(after),
    elements = htmlElements(tree);
  const allIds = elements.map(({ n }) => attrs(n).id).filter(Boolean);
  unique(allIds, 'Duplicate HTML ID');
  const found = elements.filter(({ n }) => attrs(n).id === record.cartaoId);
  fail(found.length === 1, 'Missing/ambiguous card');
  const { n, parent } = found[0],
    a = attrs(n);
  fail(
    n.name === 'button' &&
      parent.name === 'div' &&
      attrs(parent).id === 'grade-materias' &&
      attrs(parent).class === 'grade-materias',
    'Unsupported HTML insertion anchor'
  );
  fail(
    Object.keys(a).every((k) => ['id', 'type', 'hidden', 'class'].includes(k)) &&
      a.type === 'button' &&
      Object.hasOwn(a, 'hidden') &&
      [null, ''].includes(a.hidden) &&
      a.class === 'cartao-materia ' + record.subject,
    'Unsupported card attributes'
  );
  const children = n.children.filter((c) => c.kind !== 'text' || c.value.trim());
  fail(
    children.length === 3 &&
      equal(
        children.map((c) => c.name),
        ['span', 'small', 'strong']
      ),
    'Unsupported card children'
  );
  for (const c of children) {
    fail(
      c.attrs.length === 0 && c.children.length === 1 && c.children[0].kind === 'text',
      'Executable/ambiguous card child'
    );
    text(c.children[0].value);
  }
  fail(children[0].children[0].value === record.titulo, 'Card title differs');
  fail(
    elements.some(({ n: e }) => attrs(e).id === 'tela-gramatica-mariana'),
    'Missing existing panel'
  );
  preservedHtml(before, after, n);
  return { start: n.sourceSpan.start.offset, end: n.sourceSpan.end.offset };
}
function preservedHtml(before, after, n) {
  fail(n.startSourceSpan && n.endSourceSpan, 'Implicit HTML closure');
  const stripped = erase(after, [
    { start: n.sourceSpan.start.offset, end: n.sourceSpan.end.offset },
  ]);
  fail(stripped === before, 'Old HTML bytes/structure changed');
}
function testDeclarations(source) {
  const tree = parse(source),
    titles = [];
  for (const n of tree.body) {
    if (n.directive === 'use strict') continue;
    if (n.type === 'VariableDeclaration' && n.kind === 'const') {
      for (const d of n.declarations) {
        if (d.init?.type === 'CallExpression') {
          fail(
            d.init.callee.name === 'require' &&
              d.init.arguments.length === 1 &&
              d.init.arguments[0].value === '@playwright/test' &&
              d.id.type === 'ObjectPattern',
            'Unsafe test import/initializer'
          );
          fail(
            d.id.properties.every(
              (p) =>
                !p.computed &&
                p.type === 'Property' &&
                p.value.name === p.key.name &&
                ['test', 'expect'].includes(p.key.name)
            ),
            'Unsafe test binding'
          );
        } else {
          fail(
            d.id.type === 'Identifier' && !['test', 'expect'].includes(d.id.name),
            'Unsafe test binding'
          );
          data(d.init);
        }
      }
      continue;
    }
    const c = n.expression;
    fail(
      n.type === 'ExpressionStatement' &&
        c?.type === 'CallExpression' &&
        c.callee.type === 'Identifier' &&
        c.callee.name === 'test' &&
        c.arguments.length === 2 &&
        c.arguments[0].type === 'Literal' &&
        typeof c.arguments[0].value === 'string' &&
        ['ArrowFunctionExpression', 'FunctionExpression'].includes(c.arguments[1].type),
      'Unsafe test declaration/top-level execution'
    );
    const callback = c.arguments[1];
    fail(
      !callback.generator &&
        callback.params.every(
          (p) =>
            p.type === 'ObjectPattern' &&
            p.properties.every(
              (x) => x.type === 'Property' && !x.computed && x.value.type === 'Identifier'
            )
        ),
      'Unsafe test callback parameters'
    );
    let assertions = 0;
    walk(callback.body, (x) => {
      if (
        x.type === 'CallExpression' &&
        x.callee.type === 'Identifier' &&
        x.callee.name === 'expect'
      )
        assertions++;
    });
    fail(assertions > 0, 'Test has no declared assertion');
    titles.push(c.arguments[0].value);
  }
  unique(titles, 'Duplicate test title');
  fail(
    COVERAGE.every((tag) => titles.some((s) => s.startsWith('[adicao:' + tag + '] '))),
    'Insufficient declared coverage'
  );
  return titles;
}
function validateManifestDelta(before, after, id, testFile) {
  const added = after.revisions.filter((r) => !before.revisions.some((old) => old.id === r.id));
  fail(added.length === 1 && added[0].id === id, 'Expected exactly one new manifest revision');
  const target = structuredClone(after);
  target.revisions = target.revisions.filter((r) => r.id !== id);
  target.tests = target.tests.filter((t) => t.file !== testFile);
  for (const group of ['engines', 'capabilities'])
    for (const e of target[group]) e.consumers = e.consumers.filter((v) => v !== id);
  for (const t of target.tests) t.revisions = t.revisions.filter((v) => v !== id);
  target.discovery = before.discovery;
  target.version = before.version;
  fail(equal(target, before), 'Old manifest entries/order/contracts changed');
  fail(
    /^\d+\.\d+\.\d+$/.test(after.version) && after.version !== before.version,
    'Manifest version must advance'
  );
  const a = after.version.split('.').map(Number),
    b = before.version.split('.').map(Number);
  fail(
    a[0] > b[0] || (a[0] === b[0] && (a[1] > b[1] || (a[1] === b[1] && a[2] > b[2]))),
    'Manifest version decreased'
  );
  return added[0];
}
function proveAddition({ changes, read, comparison }) {
  const result = {
    schemaVersion: 1,
    contract: CONTRACT,
    structuralStatus: 'unsupported',
    identityStatus: 'blocked',
    runtimeEvidence: 'not-collected',
    executionPolicy: 'global',
    revisionId: null,
    baseCommit: comparison?.base?.commit || null,
    targetInputFingerprint: comparison?.target?.sourceFingerprint || null,
    manifestDescriptor: null,
    claimedChanges: [],
    checks: [],
    requiredTestFiles: [],
    reasons: [],
    coverage: { declared: [], functional: 'not-proven', pedagogical: 'human-review-required' },
  };
  const newContent = changes.filter(
    (c) => c.type === 'A' && /^ambiente_interativo\/revisoes\/.*\.js$/.test(c.currentPath)
  );
  if (!newContent.length) {
    result.reasons.push('No added revision module');
    return result;
  }
  try {
    fail(newContent.length === 1, 'Exactly one new content module required');
    const file = newContent[0].currentPath,
      source = read('after', file);
    fail(source && read('before', file) === null, 'Content is not genuinely new');
    const config = content(source);
    result.revisionId = config.id;
    fail(
      new RegExp('^ambiente_interativo/revisoes/' + config.aluno + '/[a-z0-9-]+\\.js$').test(file),
      'Noncanonical content path/profile'
    );
    const before = json(read('before', MANIFEST)),
      manifest = json(read('after', MANIFEST));
    result.manifestDescriptor = {
      schemaVersion: manifest.schemaVersion,
      version: manifest.version,
      fingerprint: hash(JSON.stringify(manifest)),
    };
    const newTests = changes.filter(
      (c) => c.type === 'A' && /^tests\/[a-z0-9-]+\.spec\.js$/.test(c.currentPath)
    );
    fail(newTests.length === 1, 'Exactly one new test required');
    const testFile = newTests[0].currentPath;
    const revision = validateManifestDelta(before, manifest, config.id, testFile);
    fail(
      revision.profile === config.aluno &&
        config.id.startsWith(config.aluno + '-' + revision.subject + '-') &&
        ['historia', 'geografia', 'ciencias', 'gramatica'].includes(revision.subject),
      'Profile/subject mismatch'
    );
    fail(
      config.materia ===
        {
          historia: 'História',
          geografia: 'Geografia',
          ciencias: 'Ciências',
          gramatica: 'Gramática',
        }[revision.subject],
      'Subject label differs'
    );
    fail(
      revision.engine === 'questionarios' &&
        revision.declaredEngine === 'gramatica-questionarios' &&
        revision.primaryKey === config.chave &&
        /^revisoesEscolares\.(alice|mariana)\.[a-zA-Z0-9.]+\.v[1-9][0-9]*$/.test(config.chave) &&
        config.chave.startsWith('revisoesEscolares.' + config.aluno + '.' + revision.subject + '.'),
      'Engine/key mismatch'
    );
    fail(
      equal(revision.configFiles, [file]) &&
        equal(revision.contentSources, [file]) &&
        equal(revision.sessions, []) &&
        equal(revision.contentDependencies, []) &&
        equal(revision.historicalKeys, []) &&
        equal(revision.assets, []) &&
        equal(revision.capabilities, ['estado-estrito']),
      'Unsupported dependencies/assets/capabilities'
    );
    fail(
      revision.maturity?.assessment === 'not-evaluated' &&
        revision.maturity.futureCandidate === false &&
        revision.maturity.historicalCollection === 'not-configured',
      'Unproven maturity'
    );
    const keysBefore = before.revisions.flatMap((r) => [
      r.primaryKey,
      ...r.sessions.map((s) => s.key),
      ...r.historicalKeys.map((h) => h.key),
    ]);
    unique(
      manifest.revisions.map((r) => r.id),
      'ID collision'
    );
    fail(!keysBefore.includes(config.chave), 'Key collision');
    const allowed = new Map([
      [file, 'A'],
      [testFile, 'A'],
      [ENTRY, 'M'],
      [REGISTRY, 'M'],
      [APP, 'M'],
      [HTML, 'M'],
      [MANIFEST, 'M'],
    ]);
    for (const c of changes) {
      if (c.currentPath === INVENTORY && c.type === 'M') {
        fail(!c.previousPath || c.previousPath === INVENTORY, 'Unexpected inventory previous path');
        const note = `\n\n## Nova revisão: ${config.id}\n\n${config.titulo}\n\nConteúdo: ${file}\n`;
        fail(
          read('after', INVENTORY) === read('before', INVENTORY) + note,
          'Unproven inventory/documentation delta'
        );
        continue;
      }
      fail(
        allowed.get(c.currentPath) === c.type &&
          (!c.previousPath || c.previousPath === c.currentPath),
        'Change outside addition batch: ' + c.currentPath
      );
    }
    fail(
      [...allowed].every(([p, t]) => changes.some((c) => c.currentPath === p && c.type === t)),
      'Incomplete integration batch'
    );
    if (changes.some((c) => c.currentPath === INVENTORY)) allowed.set(INVENTORY, 'M');
    for (const [p, digest] of Object.entries(REVIEWED)) {
      fail(hash(read('before', p) || '') === digest, 'Unreviewed consumer/anchor: ' + p);
      if (!allowed.has(p))
        fail(read('after', p) === read('before', p), 'Shared dependency changed: ' + p);
    }
    result.checks.push(
      'reviewed-consumers',
      'closed-batch',
      'static-content',
      'unique-identity-keys'
    );
    const entry = parse(read('after', ENTRY), true);
    const imported = one(
      entry,
      (n) =>
        n.type === 'ImportDeclaration' &&
        path.posix.normalize(path.posix.join(path.posix.dirname(ENTRY), n.source.value)) === file
    );
    fail(
      imported.specifiers.length === 0 &&
        imported.source.value === '../' + file.slice('ambiente_interativo/'.length) &&
        !imported.attributes?.length,
      'Import must be canonical/side-effect only'
    );
    const engine = one(
      entry,
      (n) => n.type === 'ImportDeclaration' && n.source.value === './gramatica-questionarios.js'
    );
    const appImport = one(
      entry,
      (n) => n.type === 'ImportDeclaration' && n.source.value === './app.js'
    );
    fail(imported.start > engine.end && imported.end < appImport.start, 'Import order invalid');
    preserved(read('before', ENTRY), read('after', ENTRY), [imported], false, true);
    const registry = parse(read('after', REGISTRY));
    const list = one(
      registry,
      (n) => n.type === 'VariableDeclarator' && n.id.name === 'revisoes'
    ).init;
    fail(list.type === 'ArrayExpression', 'Unknown registry anchor');
    const nodes = list.elements.filter((n) => data(n).id === config.id);
    fail(nodes.length === 1, 'Duplicate/missing registry ID');
    const record = data(nodes[0]);
    keys(record, [
      'id',
      'aluno',
      'titulo',
      'cartaoId',
      'painelId',
      'chaveArmazenamento',
      'totalEtapas',
      'controladorCompartilhado',
    ]);
    fail(
      record.id === config.id &&
        record.aluno === config.aluno &&
        record.titulo === config.titulo &&
        record.chaveArmazenamento === config.chave &&
        record.totalEtapas === config.questoes.length &&
        record.controladorCompartilhado === 'gramatica-questionarios' &&
        record.painelId === 'tela-gramatica-mariana' &&
        /^abrir-[a-z0-9-]+$/.test(record.cartaoId),
      'Registry/content mismatch'
    );
    fail(
      list.elements.filter((n) => data(n).cartaoId === record.cartaoId).length === 1,
      'Card collision'
    );
    preserved(read('before', REGISTRY), read('after', REGISTRY), nodes, true);
    const range = card(read('before', HTML), read('after', HTML), {
      ...record,
      subject: revision.subject,
    });
    const appSource = read('after', APP),
      appTree = parse(appSource);
    const templates = [
      `document.getElementById('${record.cartaoId}').hidden = aluno !== '${config.aluno}';`,
      `document.getElementById('${record.cartaoId}').addEventListener('click', function () { if (alunoAtual !== '${config.aluno}') return; window.QuestionariosRevisoes.abrir('${config.id}'); atualizarResumo(); });`,
    ];
    const additions = templates.map((t) =>
      one(appTree, (n) => n.type === 'ExpressionStatement' && clean(n) === clean(parse(t).body[0]))
    );
    for (let i = 0; i < additions.length; i++) {
      const fn = one(
        appTree,
        (n) =>
          n.type === 'FunctionDeclaration' &&
          n.id.name === (i === 0 ? 'escolherAluno' : 'registrarEventos')
      );
      fail(parentOf(appTree, additions[i]) === fn.body, 'Wrong handler/visibility anchor');
    }
    preserved(read('before', APP), appSource, additions);
    const titles = testDeclarations(read('after', testFile));
    const test = manifest.tests.find((t) => t.file === testFile);
    fail(
      test &&
        equal(test.revisions, [config.id]) &&
        test.expectedCases === titles.length &&
        (!test.exceptions || test.exceptions.length === 0),
      'New test manifest mismatch'
    );
    const journey = titles.find((s) => s.startsWith('[adicao:gabarito] '));
    fail(
      test.cases?.some(
        (c) =>
          c.expectedMatches === 1 &&
          c.pattern === '^' + journey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$' &&
          c.metadata?.oracle === 'independent' &&
          c.metadata.journeyScope === 'questions'
      ),
      'Independent answer journey not declared'
    );
    fail(
      revision.tests.includes(testFile) &&
        revision.tests.every((f) =>
          manifest.tests.some((t) => t.file === f && t.revisions.includes(config.id))
        ),
      'Test associations not reciprocal'
    );
    fail(
      manifest.discovery.fileCount === before.discovery.fileCount + 1 &&
        manifest.discovery.caseCount === before.discovery.caseCount + titles.length,
      'Discovery expectations inconsistent'
    );
    for (const group of ['engines', 'capabilities'])
      for (const entity of manifest[group]) {
        const relevant =
          group === 'engines'
            ? entity.id === revision.engine
            : revision.capabilities.includes(entity.id);
        fail(
          entity.consumers.includes(config.id) === relevant,
          'Consumer associations inconsistent'
        );
      }
    result.coverage.declared = [...COVERAGE];
    result.requiredContracts = [
      ...CONTRACT_POLICY.questionarios,
      'acessibilidade',
      'file-bundle',
      'identidade',
    ];
    const representatives = result.requiredContracts.flatMap((id) => {
      const contract = manifest.contracts.find((c) => c.id === id);
      fail(contract?.representatives.length, 'Required contract unresolved: ' + id);
      return contract.representatives.map((r) => {
        fail(
          manifest.tests.some((t) => t.file === r.file),
          'Required test unresolved: ' + r.file
        );
        return r.file;
      });
    });
    result.requiredTestFiles = [
      ...new Set([testFile, ...revision.tests, ...representatives]),
    ].sort();
    result.checks.push(
      'preserved-imports-registry-handlers-html',
      'manifest-additive',
      'declared-coverage-only'
    );
    result.claimedChanges = changes
      .filter((c) => allowed.has(c.currentPath))
      .map((c) => ({
        path: c.currentPath,
        type: c.type,
        beforeSha256:
          read('before', c.currentPath) === null ? null : hash(read('before', c.currentPath)),
        afterSha256: hash(read('after', c.currentPath)),
        ...(c.currentPath === HTML ? { insertion: range } : {}),
      }));
    result.structuralStatus = 'proven';
    const identity = comparison?.target?.identity || comparison?.worktree?.source?.identity;
    const provenance = comparison?.worktree?.source;
    const boundInputs =
      identity?.inputs &&
      [...new Set([...allowed.keys(), ...Object.keys(REVIEWED)])].every((p) =>
        identity.inputs.some((e) => e.path === p && e.sha256 === hash(read('after', p) || ''))
      );
    result.identityStatus =
      identityUsable(identity) &&
      identity.inputFingerprint === result.targetInputFingerprint &&
      boundInputs &&
      !comparison?.identityErrors?.length &&
      provenance?.available === true &&
      /^[a-f0-9]{40}$/.test(provenance.commit || '') &&
      /^[a-f0-9]{40}$/.test(provenance.tree || '') &&
      provenance.sourceFingerprint === identity.inputFingerprint &&
      equal(provenance.identity, identity) &&
      (comparison.target.kind === 'working-tree' ||
        (comparison.target.kind === 'git-ref' && comparison.target.commit === provenance.commit))
        ? 'usable'
        : 'blocked';
    if (result.identityStatus === 'blocked')
      result.reasons.push(
        'Existing identity/provenance gate not satisfied; no attestation renewed'
      );
  } catch (error) {
    result.structuralStatus = 'rejected';
    result.reasons.push(error.message);
  }
  return result;
}
function reviewedSurfaces(read) {
  return Object.entries(REVIEWED).map(([file, expectedSha256]) => ({
    path: file,
    expectedSha256,
    baseSha256: hash(read('before', file) || ''),
    targetSha256: hash(read('after', file) || ''),
    maintenance: 'deliberate-review-required; never automatically advanced',
  }));
}
module.exports = { CONTRACT, COVERAGE, proveAddition, reviewedSurfaces, staticJson: json };
