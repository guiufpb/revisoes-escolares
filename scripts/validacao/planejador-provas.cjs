'use strict';

const acorn = require('acorn');

const REGISTRARS = {
  questionarios: [
    'window.QuestionariosRevisoes.registrar',
    'window.GramaticaQuestionarios.registrar',
  ],
  operacoes: ['window.MatematicaOperacoes.registrar'],
  'cena-matematica': ['window.MatematicaRevisoes.registrar'],
};
const CONTENT_FIELDS = new Set(['titulo', 'subtitulo', 'resumoFinal', 'questoes']);
const PROTECTED = new Set([
  'id',
  'aluno',
  'nome',
  'materia',
  'chave',
  'tipo',
  'parte',
  'layout',
  'desktopAmplo',
  'validacaoEstritaEstado',
  'ilustracao',
  'ilustracaoLeitura',
  'icone',
  'src',
  'url',
]);
const cleanAst = (node) =>
  JSON.parse(
    JSON.stringify(node, (key, value) =>
      ['start', 'end', 'raw'].includes(key) ? undefined : value
    )
  );
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const keyOf = (p) => !p.computed && (p.key.name || p.key.value);
const member = (n) =>
  n?.type === 'Identifier'
    ? n.name
    : n?.type === 'MemberExpression' && !n.computed
      ? member(n.object) + '.' + n.property.name
      : '';
function walk(node, visit) {
  if (!node || typeof node !== 'object') return;
  if (node.type) visit(node);
  Object.values(node).forEach((value) => {
    if (Array.isArray(value)) value.forEach((child) => walk(child, visit));
    else if (value && typeof value === 'object') walk(value, visit);
  });
}
function data(node) {
  if (node?.type === 'Literal')
    return !node.regex && ['string', 'number', 'boolean', 'object'].includes(typeof node.value);
  if (node?.type === 'ArrayExpression') return node.elements.every(data);
  return (
    node?.type === 'ObjectExpression' &&
    node.properties.every(
      (p) =>
        p.type === 'Property' &&
        p.kind === 'init' &&
        !p.method &&
        !p.computed &&
        !p.shorthand &&
        keyOf(p) !== '__proto__' &&
        data(p.value)
    )
  );
}
function permittedDataChange(a, b, key) {
  if (same(a, b)) return true;
  if (PROTECTED.has(key) || !data(a) || !data(b) || a.type !== b.type) return false;
  if (a.type === 'Literal') return typeof a.value === typeof b.value;
  if (a.type === 'ArrayExpression')
    return (
      a.elements.length === b.elements.length &&
      a.elements.every((item, i) => permittedDataChange(item, b.elements[i], key))
    );
  return (
    a.properties.length === b.properties.length &&
    a.properties.every(
      (p, i) =>
        keyOf(p) === keyOf(b.properties[i]) &&
        permittedDataChange(p.value, b.properties[i].value, keyOf(p))
    )
  );
}

// Proof of a narrow delta, not a claim that the whole module is declarative.
// All executable structure must remain identical; no eval/VM/source execution here.
function proveDeclarative(before, after, revisions) {
  try {
    const trees = [before, after].map((source) =>
      cleanAst(acorn.parse(source, { ecmaVersion: 'latest', sourceType: 'script' }))
    );
    const payloads = trees.map((tree) => {
      const result = [];
      walk(tree, (node) => {
        if (node.type !== 'CallExpression' || node.arguments.length !== 1) return;
        const object = node.arguments[0];
        if (object.type !== 'ObjectExpression') return;
        const id = object.properties.find((p) => p.type === 'Property' && keyOf(p) === 'id')?.value
          ?.value;
        const revision = revisions.find(
          (r) => r.id === id && REGISTRARS[r.engine]?.includes(member(node.callee))
        );
        if (revision) result.push({ object, revision });
      });
      return result;
    });
    if (!payloads[0].length || payloads[0].length !== payloads[1].length) return false;
    let changed = false;
    for (let i = 0; i < payloads[0].length; i++) {
      const a = payloads[0][i],
        b = payloads[1][i];
      if (
        a.revision.id !== b.revision.id ||
        a.object.properties.length !== b.object.properties.length
      )
        return false;
      for (let j = 0; j < a.object.properties.length; j++) {
        const x = a.object.properties[j],
          y = b.object.properties[j];
        if (same(x, y)) continue;
        const key = keyOf(x);
        if (
          !CONTENT_FIELDS.has(key) ||
          key !== keyOf(y) ||
          !same(x.key, y.key) ||
          !permittedDataChange(x.value, y.value, key)
        )
          return false;
        changed = true;
        // Mask only the proven data subtree; everything else must compare exactly.
        x.value = y.value = { type: 'ProvenDataDelta' };
      }
    }
    return changed && same(trees[0], trees[1]);
  } catch {
    return false;
  }
}

// A deliberately closed SVG grammar: shapes only, no text, CSS, entities, links,
// namespaces other than xmlns, scripts or computed assets. Reject every unknown token.
function svgTree(source) {
  const tags = new Set([
    'svg',
    'g',
    'rect',
    'circle',
    'ellipse',
    'line',
    'path',
    'polygon',
    'polyline',
  ]);
  const attrs = new Set([
    'xmlns',
    'viewBox',
    'width',
    'height',
    'x',
    'y',
    'x1',
    'x2',
    'y1',
    'y2',
    'cx',
    'cy',
    'rx',
    'ry',
    'r',
    'd',
    'points',
    'fill',
    'stroke',
    'stroke-width',
  ]);
  const stack = [],
    tokens = [];
  let rest = source.trim(),
    rootClosed = false;
  while (rest) {
    const match = /^<(\/?)([a-z]+)([^<>]*?)(\/?)>/.exec(rest);
    if (!match || rootClosed || !tags.has(match[2])) throw new Error('SVG outside closed grammar');
    const [, closing, name, raw, selfClosing] = match;
    const values = {};
    let attributes = raw.trim();
    while (attributes) {
      const attribute = /^([A-Za-z][A-Za-z0-9-]*)="([^"<&]*)"(?:\s+|$)/.exec(attributes);
      if (!attribute || !attrs.has(attribute[1]) || Object.hasOwn(values, attribute[1]))
        throw new Error('Unknown SVG attribute');
      if (attribute[1] === 'xmlns' && attribute[2] !== 'http://www.w3.org/2000/svg')
        throw new Error('Unknown namespace');
      if (
        ['fill', 'stroke'].includes(attribute[1]) &&
        !/^(?:#[a-fA-F0-9]{6}|none)$/.test(attribute[2])
      )
        throw new Error('Unsupported paint');
      values[attribute[1]] = attribute[2];
      attributes = attributes.slice(attribute[0].length);
    }
    if (closing) {
      if (raw.trim() || selfClosing || stack.pop() !== name) throw new Error('Unbalanced SVG');
      if (!stack.length) rootClosed = true;
    } else {
      if ((!stack.length && name !== 'svg') || (stack.length && name === 'svg'))
        throw new Error('Invalid SVG root');
      if (!selfClosing) stack.push(name);
      else if (!stack.length) rootClosed = true;
    }
    tokens.push({ closing, name, values, selfClosing });
    rest = rest.slice(match[0].length).trimStart();
  }
  if (!rootClosed || stack.length) throw new Error('Incomplete SVG');
  return tokens;
}
function proveLocalVisual(before, after) {
  try {
    const a = svgTree(before),
      b = svgTree(after);
    if (a.length !== b.length) return false;
    let changed = false;
    for (let i = 0; i < a.length; i++) {
      for (const field of ['fill', 'stroke']) {
        if (a[i].values[field] === b[i].values[field]) continue;
        if (
          ![a[i].values[field], b[i].values[field]].every((v) => /^#[a-fA-F0-9]{6}$/.test(v || ''))
        )
          return false;
        a[i].values[field] = b[i].values[field] = '#proven';
        changed = true;
      }
    }
    return changed && same(a, b);
  } catch {
    return false;
  }
}
module.exports = { proveDeclarative, proveLocalVisual };
