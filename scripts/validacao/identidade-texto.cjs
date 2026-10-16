'use strict';

// Projection ONLY for the reviewed diagnostic corpus. Raw input hashes never use it.
const acorn = require('acorn');
const crypto = require('node:crypto');
const BUNDLE = 'ambiente_interativo/js/app.bundle.js';
const CONTRACT = 'questionarios-dica-literal-v1';
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const key = (p) => !p.computed && (p.key?.name || p.key?.value);
const member = (n) =>
  n?.type === 'Identifier'
    ? n.name
    : n?.type === 'MemberExpression' && !n.computed
      ? member(n.object) + '.' + n.property.name
      : '';
const registrars = new Set([
  'window.QuestionariosRevisoes.registrar',
  'window.GramaticaQuestionarios.registrar',
]);
const clean = (n) =>
  JSON.stringify(n, (k, v) => (['start', 'end', 'raw'].includes(k) ? undefined : v));
function walk(n, visit) {
  if (!n || typeof n !== 'object') return;
  if (n.type) visit(n);
  for (const v of Object.values(n)) {
    if (Array.isArray(v)) v.forEach((c) => walk(c, visit));
    else if (v && typeof v === 'object') walk(v, visit);
  }
}
function staticData(n) {
  if (n?.type === 'Literal')
    return !n.regex && ['string', 'number', 'boolean', 'object'].includes(typeof n.value);
  if (n?.type === 'ArrayExpression') return n.elements.every(staticData);
  return (
    n?.type === 'ObjectExpression' &&
    new Set(n.properties.map(key)).size === n.properties.length &&
    n.properties.every(
      (p) =>
        p.type === 'Property' &&
        p.kind === 'init' &&
        !p.method &&
        !p.computed &&
        !p.shorthand &&
        key(p) !== '__proto__' &&
        staticData(p.value)
    )
  );
}
function property(n, name) {
  return n.properties.find((p) => key(p) === name)?.value;
}
function calls(text) {
  const result = [];
  walk(acorn.parse(text, { ecmaVersion: 'latest', sourceType: 'script' }), (n) => {
    if (
      n.type === 'CallExpression' &&
      registrars.has(member(n.callee)) &&
      n.arguments.length === 1 &&
      n.arguments[0].type === 'ObjectExpression'
    )
      result.push({ registrar: member(n.callee), object: n.arguments[0] });
  });
  return result;
}
function utf8(bytes) {
  if (!bytes || !Buffer.from(bytes.toString('utf8'), 'utf8').equals(bytes))
    throw Error('Missing/non-UTF8 textual input');
  return bytes.toString('utf8');
}
function literalText(n) {
  // Refuse reference-like text: fontes.cjs recursively inspects strings for assets.
  return (
    n?.type === 'Literal' &&
    typeof n.value === 'string' &&
    n.value.trim().length > 0 &&
    !/[\\/\u0000-\u001f\u007f]/.test(n.value) &&
    !/[a-z][a-z0-9+.-]*:/i.test(n.value) &&
    /^(['"])[^\r\n]*\1$/.test(n.raw)
  );
}
function mask(text, ranges) {
  let end = text.length;
  for (const r of [...ranges].sort((a, b) => b.start - a.start)) {
    if (r.end > end || r.start >= r.end) throw Error('Ambiguous literal ranges');
    text = text.slice(0, r.start) + JSON.stringify(r.token) + text.slice(r.end);
    end = r.start;
  }
  return Buffer.from(text);
}
function projectHintCorpus({ surfaces, read }) {
  const representations = new Map(),
    bindings = [];
  try {
    const manifest = JSON.parse(utf8(read('validacao/manifesto.json')));
    const revisions = manifest.revisions;
    if (!Array.isArray(revisions) || new Set(revisions.map((r) => r.id)).size !== revisions.length)
      throw Error('Ambiguous revision manifest');
    const bundleBytes = read(BUNDLE),
      bundleText = utf8(bundleBytes),
      bundled = calls(bundleText);
    const bundleRanges = [];
    const sources = [
      ...new Set(
        revisions.filter((r) => r.engine === 'questionarios').flatMap((r) => r.contentSources)
      ),
    ];
    for (const source of sources) {
      if (
        typeof source !== 'string' ||
        !source.startsWith('ambiente_interativo/revisoes/') ||
        !surfaces.includes(source)
      )
        throw Error('Unrecognized configuration source');
      const bytes = read(source),
        text = utf8(bytes),
        registered = calls(text),
        ranges = [];
      for (const c of registered) {
        // Non-static payloads stay byte-for-byte protected; no partial object masking.
        if (!staticData(c.object)) continue;
        const id = property(c.object, 'id')?.value;
        const matches = revisions.filter(
          (r) =>
            r.id === id &&
            r.engine === 'questionarios' &&
            r.contentSources?.length === 1 &&
            r.contentSources[0] === source &&
            r.configFiles?.includes(source)
        );
        if (matches.length !== 1) throw Error('Unrecognized registrar/revision binding');
        const r = matches[0];
        if (
          property(c.object, 'chave')?.value !== r.primaryKey ||
          property(c.object, 'aluno')?.value !== r.profile ||
          registered.filter((x) => property(x.object, 'id')?.value === id).length !== 1
        )
          throw Error('Ambiguous revision identity');
        const twins = bundled.filter((b) => property(b.object, 'id')?.value === id);
        if (
          twins.length !== 1 ||
          twins[0].registrar !== c.registrar ||
          clean(twins[0].object) !== clean(c.object)
        )
          throw Error('Source/bundle configuration mismatch');
        const questions = property(c.object, 'questoes'),
          builtQuestions = property(twins[0].object, 'questoes');
        if (questions?.type !== 'ArrayExpression') throw Error('Unrecognized questions array');
        const ids = questions.elements.map(
          (q) => q?.type === 'ObjectExpression' && property(q, 'id')?.value
        );
        if (ids.some((q) => typeof q !== 'string' || !q) || new Set(ids).size !== ids.length)
          throw Error('Ambiguous question identity');
        const hints = [];
        questions.elements.forEach((q, i) => {
          const tip = property(q, 'dica');
          if (!tip) return;
          if (!literalText(tip)) return; // This leaf remains protected by its exact bytes.
          const twin = property(builtQuestions.elements[i], 'dica');
          const token = CONTRACT + ':' + JSON.stringify([id, ids[i], 'dica']);
          ranges.push({ start: tip.start, end: tip.end, token });
          bundleRanges.push({ start: twin.start, end: twin.end, token });
          hints.push(ids[i]);
        });
        if (hints.length)
          bindings.push({
            id,
            source,
            sourceSha256: hash(bytes),
            bundleSha256: hash(bundleBytes),
            questions: hints,
          });
      }
      if (ranges.length) representations.set(source, mask(text, ranges));
    }
    if (!bindings.length) throw Error('No proven textual configuration');
    representations.set(BUNDLE, mask(bundleText, bundleRanges));
    return { valid: true, contract: CONTRACT, representations, bindings };
  } catch (error) {
    return {
      valid: false,
      contract: CONTRACT,
      representations: new Map(),
      bindings: [],
      reason: error.message,
    };
  }
}
module.exports = { projectHintCorpus, CONTRACT, BUNDLE };
