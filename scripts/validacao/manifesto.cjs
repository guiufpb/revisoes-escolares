'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const Ajv = require('ajv');
const { observarFontes, slash } = require('./fontes.cjs');
const { flattenDiscovery, classify } = require('./catalogo.cjs');

const ROOT = path.resolve(__dirname, '../..');
const MANIFEST = 'validacao/manifesto.json';
const BASELINE = 'validacao/base-14584b2.json';
const SCHEMA = 'validacao/manifesto.schema.json';
// Referência congelada da árvore auditada, independente das fontes correntes.
const BASELINE_DIGEST = 'b2786102b3e31fd925ff3e0ef6cb65cc44e6049dbeab431d144934e5c7f934ba';
const readJson = (root, file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const digest = (text) => crypto.createHash('sha256').update(text).digest('hex');

function discover(root) {
  const cli = path.join(path.dirname(require.resolve('playwright/package.json')), 'cli.js');
  return flattenDiscovery(
    JSON.parse(
      execFileSync(process.execPath, [cli, 'test', '--list', '--reporter=json'], {
        cwd: root,
        encoding: 'utf8',
        maxBuffer: 20 * 1024 * 1024,
      })
    )
  );
}

function validate(manifest, { root, baseline, schema, observed, cases, specFiles }) {
  const errors = [];
  const error = (message) => errors.push(message);
  const ajv = new Ajv({ allErrors: true, jsonPointers: true });
  const check = ajv.compile(schema);
  if (!check(manifest)) {
    return { errors: check.errors.map((e) => `schema${e.dataPath}: ${e.message}`), gaps: [] };
  }
  const unique = (items, description) => {
    const seen = new Set();
    for (const item of items) {
      if (seen.has(item)) error(description + ' duplicado: ' + item);
      seen.add(item);
    }
  };
  const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const setEqual = (a, b) => equal([...a].sort(), [...b].sort());
  const fileExists = (file) => {
    if (
      path.isAbsolute(file) ||
      file.includes('\\') ||
      file.split('/').includes('..') ||
      !fs.existsSync(path.join(root, file))
    ) {
      error('Caminho inexistente ou não relativo à raiz: ' + file);
      return false;
    }
    return true;
  };
  const reference = (ref) => {
    if (!fileExists(ref.path)) return;
    if (ref.anchor && !fs.readFileSync(path.join(root, ref.path), 'utf8').includes(ref.anchor))
      error('Âncora ausente: ' + ref.path + ' › ' + ref.anchor);
  };
  const ids = new Set(manifest.revisions.map((r) => r.id));
  const engines = new Map(manifest.engines.map((e) => [e.id, e]));
  const caps = new Map(manifest.capabilities.map((c) => [c.id, c]));
  const contracts = new Map(manifest.contracts.map((c) => [c.id, c]));
  const gaps = new Set(manifest.gaps.map((g) => g.id));
  const evidenceIds = new Set(manifest.evidenceCatalog.map((e) => e.id));
  if (
    !equal(manifest.basis, {
      commit: baseline.commit || manifest.basis.commit,
      tree: baseline.tree || manifest.basis.tree,
    })
  )
    error('Base do manifesto diverge da referência independente');
  unique(
    manifest.gaps.map((g) => g.id),
    'Lacuna'
  );
  unique(
    manifest.evidenceCatalog.map((e) => e.id),
    'Evidência'
  );
  unique([...manifest.revisions.map((r) => r.id)], 'ID de revisão');
  unique(
    observed.revisions.map((r) => r.id),
    'ID de revisão observado'
  );
  for (const revision of observed.revisions)
    if (!ids.has(revision.id)) error('Revisão observada sem manifesto: ' + revision.id);
  if (!setEqual(ids, new Set(observed.revisions.map((r) => r.id))))
    error('Conjuntos completos de revisões observadas e manifesto divergem');
  unique(
    manifest.engines.map((e) => e.id),
    'Motor'
  );
  unique(
    manifest.capabilities.map((c) => c.id),
    'Capacidade'
  );
  unique(
    manifest.contracts.map((c) => c.id),
    'Contrato'
  );
  unique(
    manifest.tests.map((t) => t.file),
    'Arquivo de teste'
  );
  for (const revision of baseline.revisions)
    if (!ids.has(revision.id))
      error('Revisão histórica ausente no manifesto (referência independente): ' + revision.id);
  if (
    !setEqual(
      manifest.tests.map((t) => t.file),
      specFiles
    )
  )
    error('Arquivos Playwright sem classificação ou removidos');
  for (const file of baseline.testFiles)
    if (!specFiles.includes(file) || !manifest.tests.some((test) => test.file === file))
      error('Arquivo histórico ausente nas fontes ou no manifesto: ' + file);
  if (manifest.discovery.fileCount !== manifest.tests.length)
    error('Total atual de arquivos diverge do manifesto');
  if (
    manifest.discovery.caseCount !==
    manifest.tests.reduce((sum, test) => sum + test.expectedCases, 0)
  )
    error('Total atual de casos diverge da soma das expectativas por arquivo');
  const keyOwners = new Map();
  function key(key, revision, kind) {
    if (
      !/^revisoesEscolares\.[a-zA-Z0-9.]+$/.test(key) &&
      key !== 'revisoes-escolares-progresso-v1'
    )
      error('Formato de chave inválido: ' + key);
    const owners = keyOwners.get(key) || [];
    owners.push({ revision, kind });
    keyOwners.set(key, owners);
  }
  for (const revision of manifest.revisions) {
    const base = baseline.revisions.find((r) => r.id === revision.id);
    if (base && base.primaryKey !== revision.primaryKey)
      error('Chave principal diverge da base: ' + revision.id);
    if (!engines.has(revision.engine)) error('Motor desconhecido: ' + revision.engine);
    if (!revision.id.startsWith(revision.profile + '-' + revision.subject + '-'))
      error('Perfil/matéria incompatível: ' + revision.id);
    key(revision.primaryKey, revision.id, 'primary');
    unique(
      revision.sessions.map((s) => s.id),
      'Sessão em ' + revision.id
    );
    for (const session of revision.sessions) {
      if (session.principal) {
        if (session.key !== revision.primaryKey) error('Alias principal inválido: ' + revision.id);
      } else key(session.key, revision.id, 'auxiliary');
    }
    for (const historical of revision.historicalKeys)
      key(historical.key, revision.id, 'historical');
    for (const file of [...revision.configFiles, ...revision.contentSources, ...revision.assets])
      fileExists(file);
    for (const ref of revision.evidence) reference(ref);
    for (const gap of revision.gaps) if (!gaps.has(gap)) error('Lacuna desconhecida: ' + gap);
    for (const evidence of revision.evidenceAvailable)
      if (!evidenceIds.has(evidence)) error('Evidência desconhecida: ' + evidence);
    for (const cap of revision.capabilities)
      if (!caps.has(cap)) error('Capacidade desconhecida: ' + cap);
    for (const dep of revision.contentDependencies) {
      if (!ids.has(dep.revision)) error('Dependência de revisão ausente: ' + dep.revision);
      reference(dep.evidence);
      const dependency = manifest.revisions.find((r) => r.id === dep.revision);
      if (dependency && !dependency.contentSources.some((f) => revision.contentSources.includes(f)))
        error('Fonte da dependência não representada: ' + revision.id);
    }
    for (const test of revision.tests)
      if (!manifest.tests.some((t) => t.file === test && t.revisions.includes(revision.id)))
        error('Associação revisão/teste não recíproca: ' + revision.id + ' › ' + test);
    const actual = observed.revisions.find((r) => r.id === revision.id);
    if (!actual) error('Revisão ausente no cadastro observado: ' + revision.id);
    else {
      for (const field of [
        'profile',
        'subject',
        'declaredEngine',
        'engine',
        'primaryKey',
        'sessions',
      ]) {
        if (!equal(actual[field], revision[field]))
          error('Fontes e manifesto divergem em ' + field + ': ' + revision.id);
      }
      for (const field of ['configFiles', 'capabilities', ...(actual.assets ? ['assets'] : [])]) {
        if (!setEqual(actual[field], revision[field]))
          error('Fontes e manifesto divergem em ' + field + ': ' + revision.id);
      }
      if (!actual.contentSources.every((f) => revision.contentSources.includes(f)))
        error('Fonte efetiva de conteúdo ausente: ' + revision.id);
      if (actual.configPrimaryKey !== revision.primaryKey)
        error('Chave da configuração diverge do cadastro: ' + revision.id);
    }
    for (const file of revision.configFiles)
      if (observed.imports && file.includes('/revisoes/') && !observed.imports.includes(file))
        error('Configuração não importada: ' + file);
  }
  for (const [value, owners] of keyOwners) {
    if (owners.length < 2) continue;
    const exception = manifest.keyExceptions.find(
      (e) =>
        e.key === value &&
        setEqual(
          e.revisions,
          owners.map((o) => o.revision)
        )
    );
    if (owners.some((o) => o.kind !== 'historical') || !exception)
      error('Colisão de chave: ' + value);
  }
  for (const exception of manifest.keyExceptions) {
    const owners = keyOwners.get(exception.key) || [];
    if (
      owners.length < 2 ||
      owners.some((o) => o.kind !== 'historical') ||
      !setEqual(
        exception.revisions,
        owners.map((o) => o.revision)
      )
    )
      error('Exceção de chave sem colisão histórica deliberada: ' + exception.key);
    reference(exception.evidence);
  }
  const entries = [...manifest.engines, ...manifest.capabilities];
  for (const entry of entries) {
    entry.sources.forEach(fileExists);
    const consumers = manifest.revisions
      .filter((r) => entry === engines.get(r.engine) || r.capabilities.includes(entry.id))
      .map((r) => r.id);
    if (!setEqual(entry.consumers, consumers)) error('Consumidores não recíprocos: ' + entry.id);
    entry.dependencies.forEach((d) => {
      reference(d.evidence);
      fileExists(d.source);
    });
    for (const contract of entry.contracts)
      if (!contracts.has(contract)) error('Contrato ausente em ' + entry.id + ': ' + contract);
  }
  for (const contract of manifest.contracts) {
    for (const representative of contract.representatives) {
      try {
        const matched = cases.filter(
          (c) =>
            c.file === representative.file &&
            new RegExp(representative.pattern, 'u').test(c.fullTitle)
        );
        if (!matched.length) error('Representante sem correspondência: ' + contract.id);
      } catch {
        error('Padrão de representante inválido: ' + contract.id);
      }
    }
  }
  for (const test of manifest.tests) {
    fileExists(test.file);
    const discoveredCount = cases.filter((item) => item.file === test.file).length;
    if (discoveredCount !== test.expectedCases)
      error(
        'Expectativa atual de casos diverge em ' +
          test.file +
          ': esperado ' +
          test.expectedCases +
          ', descoberto ' +
          discoveredCount
      );
    test.fixtures.forEach(fileExists);
    for (const gap of test.gaps) if (!gaps.has(gap)) error('Lacuna de teste desconhecida: ' + gap);
    for (const revision of test.revisions)
      if (
        !ids.has(revision) ||
        !manifest.revisions.find((r) => r.id === revision)?.tests.includes(test.file)
      )
        error('Associação teste/revisão inválida: ' + test.file + ' › ' + revision);
    for (const engine of test.engines)
      if (!engines.has(engine)) error('Motor de teste desconhecido: ' + engine);
    for (const cap of test.capabilities)
      if (!caps.has(cap)) error('Capacidade de teste desconhecida: ' + cap);
    for (const contract of test.contracts)
      if (!contracts.has(contract)) error('Contrato de teste desconhecido: ' + contract);
    unique(
      test.cases.map((r) => r.id),
      'Regra de caso em ' + test.file
    );
    for (const rule of test.cases) {
      try {
        if (!rule.pattern.startsWith('^') || !rule.pattern.endsWith('$'))
          error('Padrão deve ser ancorado: ' + rule.id);
        const matched = cases.filter(
          (c) => c.file === test.file && new RegExp(rule.pattern, 'u').test(c.fullTitle)
        );
        if (matched.length !== rule.expectedMatches)
          error('Padrão sem correspondência/contagem divergente: ' + test.file + ' › ' + rule.id);
        for (const revision of rule.metadata.revisions || [])
          if (!test.revisions.includes(revision))
            error('Associação de caso fora do arquivo: ' + rule.id);
      } catch (e) {
        error('Padrão inválido: ' + rule.id + ': ' + e.message);
      }
    }
  }
  const instances = new Set();
  for (const item of cases) {
    const identity = JSON.stringify([item.file, item.titles, item.project, item.repeatEachIndex]);
    if (instances.has(identity))
      error('Título completo duplicado/ambíguo: ' + item.file + ' › ' + item.fullTitle);
    instances.add(identity);
    try {
      const result = classify(manifest, item);
      if (
        result.coverage.includes('complete-journey') &&
        result.coverage.some((k) =>
          ['prepared-state', 'administrative-navigation', 'partial-journey'].includes(k)
        )
      )
        error('Classificações conflitantes: ' + item.fullTitle);
    } catch (e) {
      error(e.message);
    }
  }
  if (cases.length !== manifest.discovery.caseCount)
    error('Total descoberto diverge da expectativa atual: ' + cases.length);
  return { errors, gaps: manifest.gaps };
}

function validateRepository(root = ROOT, { beforeExecutableRead = () => {} } = {}) {
  const manifest = readJson(root, MANIFEST);
  const baseline = readJson(root, BASELINE);
  const schema = readJson(root, SCHEMA);
  if (digest(JSON.stringify(baseline)) !== BASELINE_DIGEST)
    throw new Error(
      'Referência independente da base foi alterada; requer atualização deliberada e nova auditoria.'
    );
  const specFiles = fs
    .readdirSync(path.join(root, 'tests'), { recursive: true })
    .filter((f) => f.endsWith('.spec.js'))
    .map((f) => 'tests/' + slash(f));
  beforeExecutableRead();
  const observed = observarFontes(root);
  beforeExecutableRead();
  const cases = discover(root);
  const result = validate(manifest, {
    root,
    baseline,
    schema,
    specFiles,
    observed,
    cases,
  });
  return { ...result, manifest, baseline };
}

if (require.main === module) {
  try {
    const result = validateRepository();
    for (const error of result.errors) console.error('ERRO: ' + error);
    console.log(
      `${result.errors.length ? 'FAIL' : 'PASS'} manifesto: ${result.manifest.revisions.length} revisões; ${result.manifest.tests.length} arquivos; ${result.manifest.discovery.caseCount} casos atuais; ${result.baseline.caseCount} casos da base histórica; ${result.gaps.length} lacunas explícitas.`
    );
    process.exitCode = result.errors.length ? 1 : 0;
  } catch (error) {
    console.error('FAIL manifesto: ' + error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  ROOT,
  MANIFEST,
  BASELINE,
  BASELINE_DIGEST,
  SCHEMA,
  readJson,
  digest,
  discover,
  validate,
  validateRepository,
};
