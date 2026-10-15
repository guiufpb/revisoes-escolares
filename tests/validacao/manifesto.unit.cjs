'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test, after } = require('node:test');
const {
  validate,
  readJson,
  ROOT,
  SCHEMA,
  MANIFEST,
  BASELINE,
  BASELINE_DIGEST,
  digest,
  discover,
} = require('../../scripts/validacao/manifesto.cjs');
const { observarFontes } = require('../../scripts/validacao/fontes.cjs');
const { logicalId } = require('../../scripts/validacao/catalogo.cjs');

const parent = path.join(ROOT, 'tmp');
fs.mkdirSync(parent, { recursive: true });
const root = fs.mkdtempSync(path.join(parent, 'manifesto-unit-'));
fs.mkdirSync(path.join(root, 'tests'));
fs.writeFileSync(path.join(root, 'source.js'), 'referencia deliberada');
fs.writeFileSync(path.join(root, 'tests/a.spec.js'), 'fixture');
after(() => {
  assert.ok(path.resolve(root).startsWith(path.resolve(parent) + path.sep));
  fs.rmSync(root, { recursive: true });
});
const schema = readJson(ROOT, SCHEMA);

function fixture() {
  const ids = ['alice-ciencias-fixture', 'mariana-ciencias-fixture'];
  const revisions = ids.map((id) => ({
    id,
    profile: id.split('-')[0],
    subject: 'ciencias',
    declaredEngine: null,
    engine: 'fixture',
    primaryKey: `revisoesEscolares.${id.split('-')[0]}.ciencias.fixture.v1`,
    configFiles: ['source.js'],
    contentSources: ['source.js'],
    capabilities: [],
    sessions: [],
    contentDependencies: [],
    historicalKeys: [],
    assets: [],
    tests: ['tests/a.spec.js'],
    evidence: [{ path: 'source.js', anchor: 'referencia' }],
    evidenceAvailable: [],
    gaps: [],
    maturity: {
      assessment: 'not-evaluated',
      historicalCollection: 'not-configured',
      futureCandidate: false,
    },
  }));
  const cases = ['caso um', 'caso dois'].map((title) => ({
    file: 'tests/a.spec.js',
    titles: [title],
    fullTitle: title,
    project: '',
    repeatEachIndex: 0,
  }));
  const metadata = {
    coverage: ['behavioral-contract'],
    oracle: 'not-applicable',
    journeyScope: 'contract',
    limitations: [],
  };
  const manifest = {
    schemaVersion: 1,
    version: '1.0.0',
    basis: { commit: 'a'.repeat(40), tree: 'b'.repeat(40) },
    discovery: { fileCount: 1, caseCount: 2 },
    evidenceCatalog: [],
    revisions,
    engines: [
      {
        id: 'fixture',
        sources: ['source.js'],
        consumers: [...ids],
        dependencies: [],
        contracts: [],
        limits: [],
      },
    ],
    capabilities: [],
    contracts: [],
    keyExceptions: [],
    gaps: [],
    tests: [
      {
        file: 'tests/a.spec.js',
        expectedCases: 2,
        revisions: [...ids],
        engines: ['fixture'],
        capabilities: [],
        contracts: [],
        platforms: ['windows', 'linux'],
        fixtures: [],
        defaults: metadata,
        cases: [{ id: 'um', pattern: '^caso um$', expectedMatches: 1, metadata }],
        gaps: [],
      },
    ],
  };
  const baseline = {
    revisions: revisions.map((r) => ({ id: r.id, primaryKey: r.primaryKey })),
    testFiles: ['tests/a.spec.js'],
    caseCount: 2,
  };
  const observed = {
    revisions: structuredClone(revisions).map((r) => ({ ...r, configPrimaryKey: r.primaryKey })),
  };
  return {
    manifest,
    options: { root, baseline, schema, observed, cases, specFiles: [...baseline.testFiles] },
  };
}

function check(change) {
  const data = fixture();
  change(data.manifest, data.options);
  return validate(data.manifest, data.options).errors.join('\n');
}

test('fixture válida; lacuna explícita não é erro de integridade', () => {
  assert.equal(
    check((m) => {
      m.gaps.push({ id: 'pendente', description: 'Sem certificação.', blocksCompleteness: true });
    }),
    ''
  );
});
test('rejeita schema/versão e campos desconhecidos', () => {
  assert.match(
    check((m) => {
      m.schemaVersion = 2;
      m.extra = true;
    }),
    /schema/
  );
});
test('detecta ID duplicado', () => {
  assert.match(
    check((m) => {
      m.revisions.push(structuredClone(m.revisions[0]));
    }),
    /ID de revisão duplicado/
  );
});
test('detecta chave auxiliar conflitante', () => {
  assert.match(
    check((m) => {
      m.revisions[0].sessions.push({ id: 'aux', principal: false, key: m.revisions[1].primaryKey });
    }),
    /Colisão de chave/
  );
});
test('detecta revisão ausente e preserva expectativa independente', () => {
  assert.match(
    check((m) => {
      m.revisions.pop();
    }),
    /referência independente/
  );
  assert.match(
    check((m) => {
      m.revisions[0].primaryKey += '.alterada';
    }),
    /Chave principal diverge/
  );
});
test('detecta teste ausente e fonte inexistente', () => {
  assert.match(
    check((m) => {
      m.tests = [];
    }),
    /Playwright sem classificação/
  );
  assert.match(
    check((m) => {
      m.revisions[0].contentSources.push('ausente.js');
    }),
    /Caminho inexistente/
  );
});
test('detecta referência de caso inválida e ambiguidades', () => {
  assert.match(
    check((m) => {
      m.tests[0].cases[0].pattern = '^inexistente$';
    }),
    /Padrão sem correspondência/
  );
  assert.match(
    check((m) => {
      m.tests[0].cases.push({ ...m.tests[0].cases[0], id: 'outra' });
    }),
    /ambígua/
  );
});
test('detecta títulos completos duplicados e classificações conflitantes', () => {
  assert.match(
    check((_m, o) => {
      o.cases[1] = { ...o.cases[0] };
    }),
    /Título completo duplicado/
  );
  assert.match(
    check((m) => {
      m.tests[0].cases[0].metadata.coverage = ['complete-journey', 'prepared-state'];
    }),
    /Classificações conflitantes/
  );
});
test('aceita somente exceção histórica deliberada e válida', () => {
  const historical = 'revisoesEscolares.comum.historico.v1';
  assert.equal(
    check((m) => {
      m.revisions.forEach((r) =>
        r.historicalKeys.push({ key: historical, reason: 'histórico sintético compartilhado' })
      );
      m.keyExceptions.push({
        key: historical,
        revisions: m.revisions.map((r) => r.id),
        reason: 'Exceção deliberada, exclusivamente histórica.',
        evidence: { path: 'source.js', anchor: 'deliberada' },
      });
    }),
    ''
  );
  assert.match(
    check((m) => {
      m.keyExceptions.push({
        key: historical,
        revisions: [],
        reason: 'não existe',
        evidence: { path: 'source.js', anchor: 'referencia' },
      });
    }),
    /Exceção de chave/
  );
});
test('valida consumidores recíprocos, âncoras e alias principal', () => {
  assert.match(
    check((m) => {
      m.engines[0].consumers.pop();
    }),
    /Consumidores não recíprocos/
  );
  assert.match(
    check((m) => {
      m.revisions[0].evidence[0].anchor = 'ausente';
    }),
    /Âncora ausente/
  );
  assert.match(
    check((m) => {
      m.revisions[0].sessions.push({
        id: 'principal',
        principal: true,
        key: m.revisions[1].primaryKey,
      });
    }),
    /Alias principal inválido/
  );
});
test('identificação lógica independe da linha; arquivo e título são significativos', () => {
  assert.equal(logicalId('tests/a.spec.js', ['caso']), logicalId('tests/a.spec.js', ['caso']));
  assert.notEqual(logicalId('tests/a.spec.js', ['caso']), logicalId('tests/b.spec.js', ['caso']));
  assert.notEqual(logicalId('tests/a.spec.js', ['caso']), logicalId('tests/a.spec.js', ['outro']));
});

function addRevision(m, o) {
  const revision = structuredClone(m.revisions[0]);
  revision.id = 'alice-ciencias-acrescimo';
  revision.primaryKey = 'revisoesEscolares.alice.ciencias.acrescimo.v1';
  m.revisions.push(revision);
  m.engines[0].consumers.push(revision.id);
  m.tests[0].revisions.push(revision.id);
  o.observed.revisions.push({
    ...structuredClone(revision),
    configPrimaryKey: revision.primaryKey,
  });
}

function addTestFile(m, o) {
  const file = 'tests/novo.spec.js';
  fs.writeFileSync(path.join(root, file), 'fixture sintetica adicional');
  const entry = structuredClone(m.tests[0]);
  entry.file = file;
  entry.expectedCases = 1;
  entry.cases = [];
  m.tests.push(entry);
  m.revisions.forEach((r) => r.tests.push(file));
  m.discovery.fileCount += 1;
  m.discovery.caseCount += 1;
  o.specFiles.push(file);
  o.cases.push({ ...o.cases[0], file, titles: ['novo caso'], fullTitle: 'novo caso' });
}

test('rejeita registro observado extra, ausente, duplicado e troca de conjuntos', () => {
  assert.match(
    check((m, o) => {
      o.observed.revisions.push({ ...o.observed.revisions[0], id: 'alice-ciencias-extra' });
    }),
    /Revisão observada sem manifesto: alice-ciencias-extra/
  );
  assert.match(
    check((_m, o) => {
      o.observed.revisions.pop();
    }),
    /Revisão ausente no cadastro observado/
  );
  assert.match(
    check((_m, o) => {
      o.observed.revisions.push(structuredClone(o.observed.revisions[0]));
    }),
    /ID de revisão observado duplicado/
  );
  assert.match(
    check((_m, o) => {
      o.observed.revisions[1].id = 'alice-ciencias-substituida';
    }),
    /Conjuntos completos de revisões observadas e manifesto divergem/
  );
});

test('reproduz 67 observadas e 66 mapeadas somente em memória', () => {
  const manifest = readJson(ROOT, MANIFEST);
  const observed = observarFontes(ROOT);
  const currentCount = manifest.revisions.length;
  assert.ok(currentCount >= 66);
  assert.equal(observed.revisions.length, currentCount);
  observed.revisions.push({
    ...structuredClone(observed.revisions[0]),
    id: 'alice-ciencias-extra-sintetica',
  });
  assert.equal(observed.revisions.length, currentCount + 1);
  const result = validate(manifest, {
    root: ROOT,
    schema,
    baseline: readJson(ROOT, BASELINE),
    observed,
    cases: discover(ROOT),
    specFiles: manifest.tests.map((t) => t.file),
  });
  assert.deepEqual(result.errors, [
    'Revisão observada sem manifesto: alice-ciencias-extra-sintetica',
    'Conjuntos completos de revisões observadas e manifesto divergem',
  ]);
});

test('aceita revisão adicional coerente preservando toda a referência histórica', () => {
  const { manifest, options } = fixture();
  const historical = JSON.stringify(options.baseline);
  addRevision(manifest, options);
  assert.equal(manifest.revisions.length, 3);
  assert.equal(options.observed.revisions.length, 3);
  assert.equal(options.baseline.revisions.length, 2);
  assert.deepEqual(validate(manifest, options).errors, []);
  assert.equal(JSON.stringify(options.baseline), historical);
});

test('aceita arquivo adicional classificado e expectativas explícitas atuais', () => {
  const { manifest, options } = fixture();
  const historical = JSON.stringify(options.baseline);
  addTestFile(manifest, options);
  assert.deepEqual(validate(manifest, options).errors, []);
  assert.equal(manifest.discovery.caseCount, 3);
  assert.equal(options.baseline.caseCount, 2);
  assert.equal(JSON.stringify(options.baseline), historical);
});

test('rejeita arquivo/caso novo sem classificação ou manutenção das expectativas', () => {
  assert.match(
    check((_m, o) => {
      o.specFiles.push('tests/nao-mapeado.spec.js');
      o.cases.push({ ...o.cases[0], file: 'tests/nao-mapeado.spec.js' });
    }),
    /Playwright sem classificação/
  );
  assert.match(
    check((m, o) => {
      addTestFile(m, o);
      delete m.tests[1].expectedCases;
    }),
    /schema.*expectedCases/
  );
  assert.match(
    check((m, o) => {
      o.cases.push({ ...o.cases[0], titles: ['extra'], fullTitle: 'extra' });
      m.discovery.caseCount += 1;
    }),
    /Expectativa atual de casos diverge em tests\/a.spec.js/
  );
  assert.match(
    check((m, o) => {
      addTestFile(m, o);
      m.discovery.fileCount -= 1;
      m.discovery.caseCount -= 1;
    }),
    /Total atual de (arquivos|casos) diverge/
  );
  assert.match(
    check((m, o) => {
      addTestFile(m, o);
      m.tests[0].expectedCases = 1;
      m.tests[1].expectedCases = 2;
    }),
    /Expectativa atual de casos diverge/
  );
});

test('aceita caso adicional com manutenção explícita das expectativas atuais', () => {
  assert.equal(
    check((m, o) => {
      o.cases.push({ ...o.cases[0], titles: ['extra'], fullTitle: 'extra' });
      m.tests[0].expectedCases += 1;
      m.discovery.caseCount += 1;
    }),
    ''
  );
});

test('rejeita remoção/renome histórico mesmo com catálogo atual coerente', () => {
  assert.match(
    check((m, o) => {
      m.revisions.pop();
      o.observed.revisions.pop();
      m.engines[0].consumers.pop();
      m.tests[0].revisions.pop();
    }),
    /Revisão histórica ausente no manifesto/
  );
  assert.match(
    check((m, o) => {
      addTestFile(m, o);
      m.tests.shift();
      o.specFiles.shift();
      o.cases = o.cases.filter((c) => c.file !== 'tests/a.spec.js');
      m.revisions.forEach((r) => {
        r.tests = ['tests/novo.spec.js'];
      });
      m.discovery = { fileCount: 1, caseCount: 1 };
    }),
    /Arquivo histórico ausente/
  );
  assert.match(
    check((m, o) => {
      m.revisions[0].primaryKey += '.indevida';
      o.observed.revisions[0].primaryKey = m.revisions[0].primaryKey;
      o.observed.revisions[0].configPrimaryKey = m.revisions[0].primaryKey;
    }),
    /Chave principal diverge da base/
  );
});

test('referência histórica mantém bytes e digest semântico congelados', () => {
  const raw = fs.readFileSync(path.join(ROOT, BASELINE));
  assert.equal(digest(raw), 'e92bf07a3f5cbff84fbcd4a671b317ed3137a84757ace3e8f9eeb5f58b56033c');
  assert.equal(BASELINE_DIGEST, 'b2786102b3e31fd925ff3e0ef6cb65cc44e6049dbeab431d144934e5c7f934ba');
  assert.equal(digest(JSON.stringify(JSON.parse(raw))), BASELINE_DIGEST);
  const changed = JSON.parse(raw);
  changed.caseCount += 1;
  assert.notEqual(digest(JSON.stringify(changed)), BASELINE_DIGEST);
});
