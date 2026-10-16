'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { COVERAGE } = require('../../../scripts/validacao/planejador-adicao.cjs');
const ROOT = path.resolve(__dirname, '../../..');
const ENTRY = 'ambiente_interativo/js/app.entry.js';
const APP = 'ambiente_interativo/js/app.js';
const REGISTRY = 'ambiente_interativo/js/registro-revisoes.js';
const HTML = 'ambiente_interativo/index.html';
const MANIFEST = 'validacao/manifesto.json';
function fixture(profile = 'alice') {
  const files = new Map();
  for (const file of [
    ENTRY,
    APP,
    REGISTRY,
    HTML,
    MANIFEST,
    'ambiente_interativo/css/estilo.css',
    'ambiente_interativo/js/gramatica-questionarios.js',
    'ambiente_interativo/js/questionarios-interacoes.js',
    'ambiente_interativo/js/gramatica-ditado.js',
    'ambiente_interativo/js/audio.js',
    'ambiente_interativo/js/armazenamento.js',
  ])
    files.set(file, fs.readFileSync(path.join(ROOT, file), 'utf8'));
  const before = new Map(files),
    id = profile + '-historia-synthetic',
    key = 'revisoesEscolares.' + profile + '.historia.synthetic.v1';
  const file = 'ambiente_interativo/revisoes/' + profile + '/historia-synthetic.js';
  const spec = 'tests/' + profile + '-historia-synthetic.spec.js';
  const cardId = 'abrir-' + profile + '-synthetic';
  const config = {
    id,
    aluno: profile,
    nome: profile === 'alice' ? 'Alice' : 'Mariana',
    materia: 'História',
    titulo: 'Histórias sintéticas',
    subtitulo: 'Texto original sintético',
    chave: key,
    validacaoEstritaEstado: true,
    resumoFinal: 'Você concluiu as questões.',
    questoes: [
      {
        id: 'q1',
        titulo: 'Uma lembrança',
        instrucao: 'Escolha uma opção.',
        tipo: 'opcoes',
        dica: 'Pense no texto.',
        sucesso: 'Vamos continuar.',
        itens: [
          {
            id: 'q1-a',
            pergunta: 'Qual objeto é uma lembrança?',
            opcoes: ['Foto', 'Nuvem'],
            respostas: ['Foto'],
          },
        ],
      },
      {
        id: 'q2',
        titulo: 'Uma palavra',
        instrucao: 'Complete o texto.',
        tipo: 'campos',
        dica: 'Pense no texto.',
        sucesso: 'Vamos continuar.',
        itens: [{ id: 'q2-a', antes: 'Uma', depois: 'guarda lembranças.', respostas: ['foto'] }],
      },
    ],
  };
  const record = {
    id,
    aluno: profile,
    titulo: config.titulo,
    cartaoId: cardId,
    painelId: 'tela-gramatica-mariana',
    chaveArmazenamento: key,
    totalEtapas: 2,
    controladorCompartilhado: 'gramatica-questionarios',
  };
  files.set(
    file,
    "(function () {\n  'use strict';\n  window.QuestionariosRevisoes.registrar(" +
      JSON.stringify(config) +
      ');\n})();\n'
  );
  files.set(
    ENTRY,
    files
      .get(ENTRY)
      .replace(
        "import './app.js';",
        "import '../revisoes/" + profile + "/historia-synthetic.js';\nimport './app.js';"
      )
  );
  files.set(
    REGISTRY,
    files
      .get(REGISTRY)
      .replace('var revisoes = [\n', 'var revisoes = [\n    ' + JSON.stringify(record) + ',\n')
  );
  files.set(
    APP,
    files
      .get(APP)
      .replace(
        'function escolherAluno(aluno) {\n',
        'function escolherAluno(aluno) {\n    ' +
          `document.getElementById('${cardId}').hidden = aluno !== '${profile}';\n`
      )
      .replace(
        'function registrarEventos() {\n',
        'function registrarEventos() {\n    ' +
          `document.getElementById('${cardId}').addEventListener('click', function () { if (alunoAtual !== '${profile}') return; window.QuestionariosRevisoes.abrir('${id}'); atualizarResumo(); });\n`
      )
  );
  files.set(
    HTML,
    files
      .get(HTML)
      .replace(
        '<div class="grade-materias" id="grade-materias">\n',
        '<div class="grade-materias" id="grade-materias">\n          ' +
          `<button class="cartao-materia historia" id="${cardId}" type="button" hidden><span>${config.titulo}</span><small>História</small><strong>Começar</strong></button>\n`
      )
  );
  const titles = COVERAGE.map((tag) => '[adicao:' + tag + '] synthetic');
  files.set(
    spec,
    "const { test, expect } = require('@playwright/test');\n" +
      titles
        .map(
          (title) =>
            `test(${JSON.stringify(title)}, async ({ page }) => { expect(page).toBeDefined(); });`
        )
        .join('\n') +
      '\n'
  );
  const manifest = JSON.parse(files.get(MANIFEST));
  manifest.version = '1.2.0';
  const revision = structuredClone(
    manifest.revisions.find((r) => r.id === 'alice-historia-objetos-memorias-outubro-2026')
  );
  Object.assign(revision, {
    id,
    profile,
    primaryKey: key,
    configFiles: [file],
    contentSources: [file],
    capabilities: ['estado-estrito'],
    sessions: [],
    assets: [],
    tests: [spec, 'tests/ambiente-interativo.spec.js'],
    evidence: [{ path: REGISTRY, anchor: id }],
  });
  manifest.revisions.push(revision);
  const newTest = structuredClone(
    manifest.tests.find(
      (t) => t.file === 'tests/historia-alice-objetos-memorias-outubro-2026.spec.js'
    )
  );
  Object.assign(newTest, {
    file: spec,
    revisions: [id],
    capabilities: ['estado-estrito'],
    expectedCases: titles.length,
    cases: [
      {
        id: 'independent',
        pattern: '^' + titles.at(-1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$',
        expectedMatches: 1,
        metadata: {
          coverage: ['complete-journey'],
          oracle: 'independent',
          journeyScope: 'questions',
          limitations: ['Synthetic declaration only'],
        },
      },
    ],
  });
  manifest.tests.push(newTest);
  manifest.tests.find((t) => t.file === 'tests/ambiente-interativo.spec.js').revisions.push(id);
  manifest.engines.find((e) => e.id === 'questionarios').consumers.push(id);
  manifest.capabilities.find((e) => e.id === 'estado-estrito').consumers.push(id);
  manifest.discovery.fileCount++;
  manifest.discovery.caseCount += titles.length;
  const save = () => files.set(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
  save();
  const changes = [...files.keys()]
    .filter((p) => before.get(p) !== files.get(p))
    .map((p) => ({ type: before.has(p) ? 'M' : 'A', previousPath: null, currentPath: p }));
  const comparison = {
    base: { commit: 'a'.repeat(40) },
    target: { kind: 'working-tree', sourceFingerprint: null },
    identityErrors: [],
  };
  const input = {
    changes,
    comparison,
    read: (side, p) => (side === 'before' ? before : files).get(p) ?? null,
  };
  return { input, files, before, manifest, save, file, spec, id, key, cardId, config };
}
module.exports = { fixture };
