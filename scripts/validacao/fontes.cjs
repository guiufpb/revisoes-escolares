'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ENTRY = 'ambiente_interativo/js/app.entry.js';
const REGISTRY = 'ambiente_interativo/js/registro-revisoes.js';
const slash = (value) => value.split(path.sep).join('/');

// Observa os registradores reais, sem inicializar UI, armazenamento, áudio ou navegador.
// Não é um sandbox para código não confiável: lê apenas fontes desta checkout.
function observarFontes(root) {
  const window = {};
  const context = vm.createContext({ window });
  const provenance = new Map();
  const loaded = new Set();
  let current;
  function load(file) {
    current = file;
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, {
      filename: file,
      timeout: 5000,
    });
    loaded.add(file);
  }
  const loaders = {
    RegistroIngles: 'registro-ingles.js',
    MatematicaRevisoes: 'matematica.js',
    MatematicaOperacoes: 'matematica-operacoes.js',
    GramaticaQuestionarios: 'gramatica-questionarios.js',
  };
  load(REGISTRY);
  load('ambiente_interativo/js/registro-leituras.js');
  for (const [global, name] of Object.entries(loaders)) {
    load('ambiente_interativo/js/' + name);
    const registrar = window[global].registrar;
    window[global].registrar = function (config) {
      provenance.set(global + ':' + config.id, current);
      return registrar(config);
    };
  }
  const entry = fs.readFileSync(path.join(root, ENTRY), 'utf8');
  const imports = [...entry.matchAll(/^import\s+'([^']+)';/gm)].map((m) =>
    slash(path.normalize(path.join(path.dirname(ENTRY), m[1])))
  );
  const revisions = imports.filter((file) => file.startsWith('ambiente_interativo/revisoes/'));
  for (const file of revisions) load(file);
  const records = window.RegistroRevisoes.listar();
  const observations = records.map((record) => {
    const id = record.id;
    let engine;
    let config;
    let source;
    let configFiles;
    if (window.GramaticaQuestionarios.obterRevisao(id)) {
      engine = 'questionarios';
      config = window.GramaticaQuestionarios.obterRevisao(id);
      source = provenance.get('GramaticaQuestionarios:' + id);
    } else if (window.MatematicaOperacoes.obterRevisao(id)) {
      engine = 'operacoes';
      config = window.MatematicaOperacoes.obterRevisao(id);
      source = provenance.get('MatematicaOperacoes:' + id);
    } else if (window.MatematicaRevisoes.listar().find((r) => r.id === id)) {
      engine = 'cena-matematica';
      config = window.MatematicaRevisoes.listar().find((r) => r.id === id);
      source = provenance.get('MatematicaRevisoes:' + id);
    } else if (record.controladorCompartilhado === 'ingles') {
      engine = 'ingles';
      const session = Object.values(window.ConfiguracoesIngles).find((c) => c.revisaoId === id);
      if (!session) throw new Error('Configuração de Inglês ausente: ' + id);
      config = window.RegistroIngles.obter(session.unidadeId);
      source =
        provenance.get('RegistroIngles:' + session.unidadeId) ||
        'ambiente_interativo/js/registro-ingles.js';
      configFiles = revisions.filter((f) =>
        fs.readFileSync(path.join(root, f), 'utf8').includes(id)
      );
    } else if (record.controladorCompartilhado === 'biblioteca-leituras') {
      engine = 'leitura';
      const session = Object.values(window.ConfiguracoesLeitura[record.aluno]).find(
        (c) => c.chaveArmazenamento === record.chaveArmazenamento
      );
      config = window.RegistroLeituras.obter(session.livroId);
      source = 'ambiente_interativo/js/registro-leituras.js';
      configFiles = revisions.filter((f) =>
        fs.readFileSync(path.join(root, f), 'utf8').includes(record.chaveArmazenamento)
      );
    } else {
      engine = id === 'alice-ciencias-origem-materiais' ? 'ciencias-legado' : 'matematica-legado';
      if (id === 'mariana-gramatica-revisao-ampla') engine = 'gramatica-legado';
      source =
        engine === 'ciencias-legado'
          ? 'ambiente_interativo/js/atividades.js'
          : `ambiente_interativo/revisoes/mariana/${engine === 'gramatica-legado' ? 'gramatica' : 'matematica'}-revisao-ampla.js`;
      config = {};
    }
    const capabilities = new Set();
    const flags = {
      desktopAmplo: 'desktop-amplo',
      validacaoEstritaEstado: 'estado-estrito',
      registrarTentativas: 'tentativas',
      ditado: 'ditado',
      opcoesReversiveis: 'opcoes-reversiveis',
      conferenciaPorSubitem: 'conferencia-subitem',
    };
    const nodes = [];
    function walk(value) {
      if (!value || typeof value !== 'object') return;
      nodes.push(value);
      for (const [key, child] of Object.entries(value)) {
        if (flags[key] && child === true) capabilities.add(flags[key]);
        if (key === 'mapaVisual') capabilities.add('mapa-visual');
        if (key === 'tipo' && ['selecao', 'ordenacao', 'misto', 'mosaico'].includes(child))
          capabilities.add(child);
        walk(child);
      }
    }
    walk(config);
    const opts = {
      modoResponsavel: ['habilitado', 'sessoes-auxiliares'],
      praticaEscrita: ['habilitada', 'escrita-estudo'],
      revisaoPosResposta: ['obrigatoria', 'consolidacao'],
      pronuncia: ['habilitada', 'pronuncia-opcional'],
      ditadoOculto: ['habilitado', 'ditado-oculto'],
      interacoes: ['habilitadas', 'subitens-ingles'],
    };
    for (const [key, [flag, capability]] of Object.entries(opts)) {
      if (config[key] && config[key][flag]) capabilities.add(capability);
    }
    if (config.exigirAudioPerguntaAntesDeResponder) capabilities.add('audio-pergunta');
    if (config.historia) capabilities.add('historia-interna');
    if (config.estudoTabuada) capabilities.add('bloqueio-tabuada');
    if (engine === 'leitura') {
      capabilities.add('pdf-local');
      if (config.glossarioPorPagina) capabilities.add('glossario');
      if (config.correcaoObjetivas === 'ao-final') capabilities.add('correcao-final');
      if (nodes.some((n) => n.textoDitado)) capabilities.add('ditado-leitura');
    }
    const assets = new Set();
    for (const node of nodes) {
      for (const value of Object.values(node)) {
        if (
          typeof value === 'string' &&
          /^(?:\.\.\/assets\/|leituras\/)[a-zA-Z0-9_./-]+\.(?:svg|png|jpg|jpeg|webp)$/.test(value)
        ) {
          assets.add(slash(path.normalize(path.join('ambiente_interativo', value))));
        }
      }
    }
    const sessions = ((config.modoResponsavel && config.modoResponsavel.sessoes) || []).map(
      (s) => ({
        id: s.id,
        key: s.chaveArmazenamento,
        principal: s.principal === true,
      })
    );
    return {
      id,
      profile: record.aluno,
      subject: id.split('-')[1],
      declaredEngine: record.controladorCompartilhado || null,
      engine,
      primaryKey: record.chaveArmazenamento,
      configFiles: configFiles || [source],
      contentSources: [source],
      configPrimaryKey: config.chave || config.chaveArmazenamento || record.chaveArmazenamento,
      capabilities: [...capabilities].sort(),
      sessions,
      assets: [...assets].sort(),
    };
  });
  return { revisions: observations, imports, loaded: [...loaded] };
}

module.exports = { observarFontes, slash };
