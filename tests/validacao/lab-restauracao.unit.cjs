/* global window, document, localStorage, Storage, navigator, indexedDB */
'use strict';
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../..');
const A = 'a'.repeat(64),
  B = 'b'.repeat(64);
function pacote() {
  return {
    formato: 'lab-questionarios-v1',
    id: 'sintetico',
    versao: 1,
    perfil: 'alice',
    materia: 'ciencias',
    titulo: 'Fixture LAB',
    questoes: [
      {
        id: 'q1',
        bloco: 'Exemplo',
        titulo: 'O dia',
        instrucao: 'Escolha.',
        tipo: 'opcoes',
        dica: 'Observe.',
        itens: [
          { id: 'i1', pergunta: 'Qual ilumina o dia?', opcoes: ['Sol', 'Lua'], respostas: ['Sol'] },
        ],
      },
      {
        id: 'q2',
        bloco: 'Banco',
        titulo: 'Complete',
        instrucao: 'Use o banco: água, pedra.',
        tipo: 'campos',
        dica: 'Pense no que bebemos.',
        itens: [{ id: 'i2', pergunta: 'Bebemos qual item?', respostas: ['água'] }],
      },
    ],
  };
}
let server, browser, origem, copyId, status;
before(async () => {
  copyId = A;
  status = 200;
  server = http.createServer((req, res) => {
    if (req.url === '/__revisoes_local__/identity') {
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId }));
      return;
    }
    if (req.url.endsWith('.svg')) {
      res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
      res.end('<svg xmlns="http://www.w3.org/2000/svg"/>');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(
      '<!doctype html><section id="tela-gramatica-mariana"><nav class="migalhas"><strong>Gramática</strong></nav><span id="gramatica-nome-perfil"></span><div id="gramatica-progresso"><div id="gramatica-barra"></div></div><span id="gramatica-contador"></span><span id="gramatica-pontos"></span><div id="gramatica-conteudo"></div><button id="gramatica-voltar">Voltar</button><button id="gramatica-proxima">Próxima</button><div id="gramatica-modo-responsavel" hidden></div><div id="gramatica-faixa-modo-responsavel" hidden></div><button id="botao-inicio">Início</button></section>'
    );
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  origem = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ headless: true });
});
after(async () => {
  if (browser) await browser.close();
  if (server) {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});
async function carregar(page, url = origem) {
  await page.goto(url);
  await page.evaluate(() => {
    window.QuestionariosInteracoes = { aceita: () => false };
    window.GramaticaDitado = { parar() {}, configurar() {} };
  });
  for (const s of [
    'lab-validador.js',
    'lab-identidade.js',
    'lab-repositorio.js',
    'lab-progresso.js',
    'lab-coordenador.js',
    'armazenamento.js',
    'gramatica-questionarios.js',
    'lab-backup.js',
    'lab-restauracao.js',
  ])
    await page.addScriptTag({ path: path.join(ROOT, 'ambiente_interativo/js', s) });
}
async function preparar(page, temporario = false, entrada = pacote()) {
  return page.evaluate(
    async ({ p, temporario }) => {
      window.pacote = p;
      window.sessao = window.LabCoordenador.criarSessao();
      if (temporario) {
        Object.defineProperty(navigator, 'locks', { configurable: true, value: undefined });
        const r = await window.sessao.preparar();
        if (r.codigo !== 'CONSENTIMENTO_NECESSARIO') throw new Error(r.codigo);
        window.sessao.decidirTemporario(true);
        await window.sessao.carregarTemporario(JSON.stringify(p));
      } else {
        const banco = await window.LabRepositorio.abrirRepositorio();
        try {
          const r = await banco.repositorio.cadastrar(JSON.stringify(p));
          if (!r.ok) throw new Error(r.codigo);
        } finally {
          banco.repositorio.fechar();
        }
        const r = await window.sessao.preparar();
        if (!r.ok) throw new Error(r.codigo);
      }
      const adquirido = await window.sessao.adquirir({
        perfil: p.perfil,
        id: p.id,
        versao: p.versao,
      });
      if (!adquirido.ok) throw new Error(adquirido.codigo);
      window.config = {
        id: 'lab-runtime',
        chave: null,
        aluno: p.perfil,
        nome: 'Fixture',
        materia: 'Ciências',
        titulo: p.titulo,
        questoes: p.questoes.map((q) => ({ ...q, sucesso: 'Conferiu.' })),
      };
      const registro = window.QuestionariosRevisoes.registrarLab(() => window.config);
      if (!registro.ok) throw new Error(registro.codigo);
      window.h = registro.handle;
      return window.sessao.abrirProgresso('principal').canal.chave;
    },
    { p: entrada, temporario }
  );
}
async function contexto(t, temporario = false) {
  copyId = A;
  status = 200;
  const ctx = await browser.newContext();
  t.after(() => ctx.close());
  const page = await ctx.newPage();
  await carregar(page);
  const chave = await preparar(page, temporario);
  return { ctx, page, chave };
}
const abrir = (page, sessao = 'principal') =>
  page.evaluate((s) => window.h.abrir(window.sessao, s), sessao);
const consultar = (page) => page.evaluate(() => window.h.consultar());
const persistir = (page) => page.evaluate(() => window.h.persistir());
const opcao = (page, valor) => page.locator(`[data-opcao-gramatica="${valor}"]`).click();
const conferir = (page) => page.locator('[data-conferir-gramatica]').click();
const raw = (page, key) => page.evaluate((k) => localStorage.getItem(k), key);

function inicial() {
  return {
    questaoAtual: 0,
    respostas: {},
    corrigidas: {},
    pontuadas: {},
    pontos: 0,
    finalizada: false,
    versao: 1,
    conferidas: {},
  };
}
async function contextoVazio(t) {
  copyId = A;
  status = 200;
  const ctx = await browser.newContext();
  t.after(() => ctx.close());
  const page = await ctx.newPage();
  await carregar(page);
  return { ctx, page };
}
async function textoBackup(
  page,
  p = pacote(),
  estados = { principal: inicial() },
  situacao = 'ativa'
) {
  return page.evaluate(
    async ({ p, estados, situacao }) => {
      const v = await window.LabValidador.validarPacote(JSON.stringify(p));
      if (!v.valido) throw new Error('Fixture inválida');
      return JSON.stringify({
        formato: 'lab-backup-v1',
        versao: 1,
        entradas: [
          {
            pacote: p,
            digest: v.digest,
            situacaoAdministrativa: situacao,
            sessoes: estados,
          },
        ],
      });
    },
    { p, estados, situacao }
  );
}
async function backupDoMotor(page) {
  return page.evaluate(async () => {
    const c = window.LabBackup.capturar(window.h);
    if (!c.ok) throw new Error(c.codigo);
    const b = await window.LabBackup.construirBackup([
      { situacaoAdministrativa: 'ativa', capturas: [c.captura] },
    ]);
    if (!b.valido) throw new Error(JSON.stringify(b.erros));
    return b.json;
  });
}
const planejar = (page, texto) =>
  page.evaluate((s) => window.LabRestauracao.prepararPlano(s), texto);
async function fecharFluxo(page) {
  await page.evaluate(async () => {
    const r = await window.h.liberar();
    if (!r.ok) throw new Error(r.codigo);
    await window.sessao.encerrar();
  });
}
async function chavePara(page, p, sessao = 'principal', copia = A) {
  return page.evaluate(
    async ({ p, sessao, copia }) => {
      const v = await window.LabValidador.validarPacote(JSON.stringify(p));
      const c = window.LabProgresso.criarArmazenamento();
      try {
        return c.abrir({
          modo: 'persistente',
          sessao,
          identidade: {
            copyId: copia,
            perfil: p.perfil,
            materia: p.materia,
            id: p.id,
            versao: p.versao,
            digest: v.digest,
          },
          vigente: () => false,
          autorizar: () => Promise.resolve({ ok: false }),
        }).canal.chave;
      } finally {
        c.encerrar();
      }
    },
    { p, sessao, copia }
  );
}
async function banco(page, copia = A) {
  return page.evaluate(async (copia) => {
    const nome = 'revisoesEscolares.lab.' + copia + '.v1';
    if (!(await indexedDB.databases()).some((b) => b.name === nome)) return null;
    return new Promise((resolve, reject) => {
      const r = indexedDB.open(nome, 1);
      r.onerror = () => reject(new Error('Fixture IDB'));
      r.onsuccess = () => {
        const db = r.result;
        const tx = db.transaction(['pacotes', 'administracao', 'operacoes'], 'readonly');
        const saida = {};
        for (const n of ['pacotes', 'administracao', 'operacoes']) {
          const q = tx.objectStore(n).getAll();
          q.onsuccess = () => {
            saida[n] = q.result;
          };
        }
        tx.oncomplete = () => {
          db.close();
          resolve(saida);
        };
      };
    });
  }, copia);
}
async function adulterar(page, store, mudar) {
  await page.evaluate(
    async ({ store, mudar, copia }) =>
      new Promise((resolve, reject) => {
        const r = indexedDB.open('revisoesEscolares.lab.' + copia + '.v1', 1);
        r.onerror = () => reject(new Error('Fixture IDB'));
        r.onsuccess = () => {
          const db = r.result;
          const tx = db.transaction([store], 'readwrite');
          const s = tx.objectStore(store);
          const q = s.get(['alice', 'sintetico', 1]);
          q.onsuccess = () => {
            s.put({ ...q.result, ...mudar });
          };
          tx.oncomplete = () => {
            db.close();
            resolve();
          };
        };
      }),
    { store, mudar, copia: A }
  );
}

test('vazia: diagnostica ausência e possível schema vazio sem cadastrar ou gravar dados', async (t) => {
  const { page } = await contextoVazio(t);
  const texto = await textoBackup(page);
  assert.equal(await banco(page), null);
  await page.evaluate(() => {
    window.escritas = 0;
    for (const nome of ['setItem', 'removeItem', 'clear'])
      Storage.prototype[nome] = () => {
        ++window.escritas;
        throw new Error('Não escrever');
      };
    for (const nome of ['add', 'put', 'delete', 'clear'])
      window.IDBObjectStore.prototype[nome] = () => {
        ++window.escritas;
        throw new Error('Não escrever');
      };
    navigator.locks.request = () => {
      throw new Error('Não adquirir');
    };
  });
  const r = await planejar(page, texto);
  assert.equal(r.ok, true, JSON.stringify(r));
  const e = r.previa.entradas[0];
  assert.equal(e.conteudo.estado, 'ausente');
  assert.equal(e.progresso[0].estado, 'ausente-no-storage');
  assert.ok(e.operacoesPotenciais.includes('cadastrar-pacote-futuramente'));
  assert.ok(e.bloqueios.includes('MEMORIA_NAO_INSPECIONADA'));
  assert.equal(e.bloqueada, true);
  assert.equal(r.previa.destino.copyId, A);
  assert.equal(r.previa.restauracaoAutorizada, false);
  assert.equal(r.previa.associacaoDestinoConfirmada, false);
  assert.equal(r.previa.efeitosTecnicos.aberturaPodeCriarSchemaVazio, true);
  assert.deepEqual(await banco(page), { pacotes: [], administracao: [], operacoes: [] });
  assert.equal(await page.evaluate(() => window.escritas), 0);
});

test('pacote idêntico é candidato a preservação sem regravar metadados', async (t) => {
  const { page } = await contexto(t);
  const texto = await textoBackup(page);
  await fecharFluxo(page);
  const antes = await banco(page);
  const r = await planejar(page, texto);
  assert.equal(r.ok, true);
  assert.equal(r.previa.entradas[0].conteudo.estado, 'identico');
  assert.ok(r.previa.entradas[0].operacoesPotenciais.includes('preservar-pacote'));
  assert.deepEqual(await banco(page), antes);
});

test('mesma identidade com digest divergente é bloqueada sem sobrescrita', async (t) => {
  const { page } = await contexto(t);
  await fecharFluxo(page);
  const p = pacote();
  p.titulo = 'Outro conteúdo';
  const texto = await textoBackup(page, p);
  const antes = await banco(page);
  const r = await planejar(page, texto);
  assert.equal(r.previa.entradas[0].conteudo.estado, 'conflito-digest');
  assert.ok(r.previa.entradas[0].bloqueios.includes('CONFLITO_DIGEST'));
  assert.deepEqual(await banco(page), antes);
});

test('igualdade lógica e textual são independentes e leitura repetida não reescreve progresso', async (t) => {
  const { page, chave } = await contexto(t);
  await abrir(page);
  await opcao(page, 'Sol');
  await conferir(page);
  await persistir(page);
  const texto = await backupDoMotor(page);
  await fecharFluxo(page);
  const exato = await planejar(page, texto);
  const estado = exato.previa.entradas[0].progresso[0];
  assert.equal(estado.igualdadeLogica, true);
  assert.equal(estado.igualdadeTextual, true);
  assert.equal(estado.candidatoIdempotente, true);
  const pretty = JSON.stringify(JSON.parse(await raw(page, chave)), null, 2);
  await page.evaluate(({ chave, pretty }) => localStorage.setItem(chave, pretty), {
    chave,
    pretty,
  });
  const outro = await planejar(page, texto);
  const s = outro.previa.entradas[0].progresso[0];
  assert.equal(s.estado, 'logicamente-identico');
  assert.equal(s.igualdadeLogica, true);
  assert.equal(s.igualdadeTextual, false);
  assert.equal(s.baseTextualEstavel, true);
  assert.deepEqual((await planejar(page, texto)).previa, outro.previa);
  assert.equal(await raw(page, chave), pretty);
});

test('progresso divergente permanece intacto e sem opção de sobrescrita', async (t) => {
  const { page, chave } = await contexto(t);
  await abrir(page);
  await opcao(page, 'Sol');
  await conferir(page);
  await persistir(page);
  const texto = await backupDoMotor(page);
  await opcao(page, 'Lua');
  await persistir(page);
  await fecharFluxo(page);
  const antes = await raw(page, chave);
  const r = await planejar(page, texto);
  const e = r.previa.entradas[0];
  assert.equal(e.progresso[0].estado, 'divergente');
  assert.equal(e.progresso[0].candidatoIdempotente, false);
  assert.ok(e.bloqueios.includes('PROGRESSO_DIVERGENTE'));
  assert.equal(await raw(page, chave), antes);
});

test('corrupção, null JSON e vazio textual nunca equivalem a chave ausente', async (t) => {
  const { page, chave } = await contexto(t);
  const texto = await textoBackup(page);
  await fecharFluxo(page);
  const adulterado = inicial();
  adulterado.finalizada = true;
  for (const bruto of [
    '{',
    'null',
    '{}',
    '',
    JSON.stringify(adulterado),
    '{"versao":1,"vers\\u0061o":1}',
  ]) {
    await page.evaluate(({ chave, bruto }) => localStorage.setItem(chave, bruto), { chave, bruto });
    const r = await planejar(page, texto);
    assert.equal(r.previa.entradas[0].progresso[0].estado, 'corrompido', bruto);
    assert.equal(await raw(page, chave), bruto);
  }
});

test('pontuação histórica após edição errada é validada pelo contrato existente', async (t) => {
  const { page, chave } = await contexto(t);
  await abrir(page);
  await opcao(page, 'Sol');
  await conferir(page);
  await opcao(page, 'Lua');
  await persistir(page);
  const texto = await backupDoMotor(page);
  await fecharFluxo(page);
  const antes = await raw(page, chave);
  const r = await planejar(page, texto);
  assert.equal(r.previa.entradas[0].progresso[0].estado, 'logicamente-identico');
  assert.equal(JSON.parse(antes).pontos, 1);
  assert.equal(JSON.parse(antes).corrigidas.q1, undefined);
  assert.equal(await raw(page, chave), antes);
});

test('Alice/Mariana e principal/responsável são comparadas em namespaces independentes', async (t) => {
  const { page } = await contextoVazio(t);
  const a = pacote();
  const m = pacote();
  m.perfil = 'mariana';
  const ea = JSON.parse(
    await textoBackup(page, a, { principal: inicial(), responsavel: inicial() })
  ).entradas[0];
  const em = JSON.parse(
    await textoBackup(page, m, { principal: inicial(), responsavel: inicial() })
  ).entradas[0];
  const texto = JSON.stringify({ formato: 'lab-backup-v1', versao: 1, entradas: [em, ea] });
  const chaves = [
    await chavePara(page, a),
    await chavePara(page, a, 'responsavel'),
    await chavePara(page, m),
    await chavePara(page, m, 'responsavel'),
  ];
  const divergente = inicial();
  divergente.respostas.q1 = ['Lua'];
  await page.evaluate(
    ({ chaves, igual, diferente }) => {
      localStorage.setItem(chaves[0], igual);
      localStorage.setItem(chaves[1], diferente);
      localStorage.setItem(chaves[3], igual);
    },
    { chaves, igual: JSON.stringify(inicial()), diferente: JSON.stringify(divergente) }
  );
  const r = await planejar(page, texto);
  assert.deepEqual(
    r.previa.entradas.map((e) => e.progresso.map((s) => s.estado)),
    [
      ['logicamente-identico', 'divergente'],
      ['ausente-no-storage', 'logicamente-identico'],
    ]
  );
  assert.equal(await raw(page, chaves[2]), null);
});

test('arquivada declarada bloqueia dependência administrativa sem converter o destino ativo', async (t) => {
  const { page } = await contexto(t);
  await fecharFluxo(page);
  const texto = await textoBackup(page, pacote(), {}, 'arquivada');
  const antes = await banco(page);
  const r = await planejar(page, texto);
  const e = r.previa.entradas[0];
  assert.equal(e.conteudo.estado, 'identico');
  assert.equal(e.administracaoCompativel, false);
  assert.ok(e.bloqueios.includes('ADMINISTRACAO_ARQUIVADA_NAO_SUPORTADA'));
  assert.ok(e.dependencias.includes('SUPORTE_A_ADMINISTRACAO_ARQUIVADA'));
  assert.deepEqual(await banco(page), antes);
});

test('administração persistida incompatível é bloqueada sem adivinhar a causa de DADOS_INVALIDOS', async (t) => {
  const { page } = await contexto(t);
  await fecharFluxo(page);
  await adulterar(page, 'administracao', { situacao: 'arquivada' });
  const texto = await textoBackup(page);
  const antes = await banco(page);
  const r = await planejar(page, texto);
  const c = r.previa.entradas[0].conteudo;
  assert.equal(c.estado, 'dados-ou-administracao-invalidos');
  assert.equal(c.codigo, 'DADOS_INVALIDOS');
  assert.equal(c.administracaoDestino, 'nao-confirmada');
  assert.deepEqual(await banco(page), antes);
});

test('conteúdo persistido inválido não é reparado ou recadastrado', async (t) => {
  const { page } = await contexto(t);
  await fecharFluxo(page);
  await adulterar(page, 'pacotes', { conteudo: '{}' });
  const antes = await banco(page);
  const r = await planejar(page, await textoBackup(page));
  assert.equal(r.previa.entradas[0].conteudo.estado, 'dados-ou-administracao-invalidos');
  assert.deepEqual(await banco(page), antes);
});

test('duas cópias na mesma origem não compartilham pacote ou progresso', async (t) => {
  const { page, chave } = await contexto(t);
  await abrir(page);
  await opcao(page, 'Sol');
  await persistir(page);
  const texto = await backupDoMotor(page);
  await fecharFluxo(page);
  const anterior = await banco(page);
  const bruto = await raw(page, chave);
  copyId = B;
  const r = await planejar(page, texto);
  assert.equal(r.previa.destino.copyId, B);
  assert.equal(r.previa.entradas[0].conteudo.estado, 'ausente');
  assert.equal(r.previa.entradas[0].progresso[0].estado, 'ausente-no-storage');
  assert.equal(r.previa.associacaoDestinoConfirmada, false);
  assert.deepEqual(await banco(page, A), anterior);
  assert.equal(await raw(page, chave), bruto);
});

test('backup levado a outra origem sempre exige associação explícita futura', async (t) => {
  const { page } = await contextoVazio(t);
  const texto = await textoBackup(page);
  const outraOrigem = origem.replace('127.0.0.1', 'localhost');
  await carregar(page, outraOrigem);
  const r = await planejar(page, texto);
  assert.equal(r.ok, true);
  assert.equal(r.previa.destino.origem, outraOrigem);
  assert.equal(r.previa.associacaoDestinoConfirmada, false);
  assert.equal(r.previa.confirmacaoExplicitaNecessaria, true);
});

test('identidade ausente não abre repositório nem inventa modo temporário', async (t) => {
  const { page } = await contextoVazio(t);
  const texto = await textoBackup(page);
  status = 503;
  const r = await planejar(page, texto);
  assert.equal(r.ok, false);
  assert.equal(r.codigo, 'IDENTIDADE_INDISPONIVEL');
  assert.equal(await banco(page), null);
});

for (const causa of ['mudou', 'sumiu'])
  test(`identidade que ${causa} durante o planejamento recusa o plano inteiro`, async (t) => {
    const { page } = await contexto(t);
    const texto = await textoBackup(page);
    await fecharFluxo(page);
    const antes = await banco(page);
    let n = 0;
    await page.route(origem + '/__revisoes_local__/identity', (route) => {
      ++n;
      const alterada = n >= 3;
      return route.fulfill({
        status: alterada && causa === 'sumiu' ? 503 : 200,
        contentType: 'application/json',
        body: JSON.stringify({
          application: 'revisoes-escolares',
          schema: 1,
          copyId: alterada ? B : A,
        }),
      });
    });
    const r = await planejar(page, texto);
    assert.equal(r.ok, false);
    assert.equal(Object.hasOwn(r, 'previa'), false);
    assert.deepEqual(await banco(page), antes);
  });

test('troca textual durante a última confirmação invalida a base observada', async (t) => {
  const { page, chave } = await contexto(t);
  const texto = await textoBackup(page);
  await fecharFluxo(page);
  let n = 0;
  const diferente = inicial();
  diferente.respostas.q1 = ['Lua'];
  await page.route(origem + '/__revisoes_local__/identity', async (route) => {
    ++n;
    if (n === 5)
      await page.evaluate(({ chave, bruto }) => localStorage.setItem(chave, bruto), {
        chave,
        bruto: JSON.stringify(diferente),
      });
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId: A }),
    });
  });
  const r = await planejar(page, texto);
  const s = r.previa.entradas[0].progresso[0];
  assert.equal(s.estado, 'alterado-durante-planejamento');
  assert.equal(s.baseTextualEstavel, false);
  assert.equal(s.candidatoIdempotente, false);
  assert.equal(await raw(page, chave), JSON.stringify(diferente));
});

test('mudança de metadados durante a consulta bloqueia o conteúdo mesmo com digest igual', async (t) => {
  const { page } = await contexto(t);
  const texto = await textoBackup(page);
  await fecharFluxo(page);
  let n = 0;
  await page.route(origem + '/__revisoes_local__/identity', async (route) => {
    ++n;
    if (n === 4) await adulterar(page, 'administracao', { criadoEm: '2026-01-01T00:00:00.000Z' });
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId: A }),
    });
  });
  const r = await planejar(page, texto);
  assert.equal(r.previa.entradas[0].conteudo.estado, 'alterado-durante-planejamento');
  assert.ok(r.previa.entradas[0].bloqueios.includes('CONTEUDO_ALTERADO_DURANTE_PLANEJAMENTO'));
});

test('sessão ativa é observada sem fechar handle, soltar lock ou modificar memória', async (t) => {
  const { page, chave } = await contexto(t);
  await abrir(page);
  const texto = await textoBackup(page);
  const antes = await consultar(page);
  const r = await page.evaluate(
    (s) =>
      window.LabRestauracao.prepararPlano(s, {
        handlesLab: [window.h],
      }),
    texto
  );
  const e = r.previa.entradas[0];
  assert.equal(e.concorrencia.locks, 'em-uso');
  assert.equal(e.concorrencia.memoria, 'observada-em-uso');
  assert.ok(e.bloqueios.includes('ATIVIDADE_EM_USO'));
  assert.ok(e.bloqueios.includes('LOCK_OU_PEDIDO_ATIVO'));
  assert.equal(e.progresso[0].estado, 'ausente-no-storage');
  assert.equal(await raw(page, chave), null);
  assert.deepEqual(await consultar(page), antes);
  assert.equal((await page.evaluate(() => navigator.locks.query())).held.length, 1);
  await opcao(page, 'Sol');
  assert.equal((await persistir(page)).ok, true);
});

test('gravação pendente continua sob posse do outro fluxo e não é confundida com ausência de progresso', async (t) => {
  const { page, chave } = await contexto(t);
  await abrir(page);
  const texto = await textoBackup(page);
  let chegou;
  const aguardando = new Promise((resolve) => {
    chegou = resolve;
  });
  let primeira = true;
  await page.route(origem + '/__revisoes_local__/identity', (route) => {
    if (primeira) {
      primeira = false;
      chegou(route);
    } else return route.continue();
  });
  await opcao(page, 'Sol');
  const req = await aguardando;
  const r = await page.evaluate(
    (s) =>
      window.LabRestauracao.prepararPlano(s, {
        handlesLab: [window.h],
      }),
    texto
  );
  const e = r.previa.entradas[0];
  assert.equal(e.concorrencia.gravacaoPendente, true);
  assert.equal(e.concorrencia.memoriaNaoDuravel, true);
  assert.ok(e.bloqueios.includes('GRAVACAO_PENDENTE'));
  assert.equal(await raw(page, chave), null);
  assert.deepEqual((await consultar(page)).progresso.estado.respostas.q1, ['Sol']);
  assert.equal((await page.evaluate(() => navigator.locks.query())).held.length, 1);
  await req.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId: A }),
  });
  await page.unrouteAll();
  assert.equal((await persistir(page)).ok, true);
});

test('quota mantém memória recente e o planejador não tenta salvá-la ou liberar a execução', async (t) => {
  const { page, chave } = await contexto(t);
  await abrir(page);
  const texto = await textoBackup(page);
  await page.evaluate(() => {
    window.escritas = 0;
    Storage.prototype.setItem = () => {
      ++window.escritas;
      throw new window.DOMException('Fixture', 'QuotaExceededError');
    };
  });
  await opcao(page, 'Lua');
  await persistir(page);
  const n = await page.evaluate(() => window.escritas);
  const r = await page.evaluate(
    (s) => window.LabRestauracao.prepararPlano(s, { handlesLab: [window.h] }),
    texto
  );
  assert.ok(r.previa.entradas[0].bloqueios.includes('MEMORIA_NAO_DURAVEL'));
  assert.equal(await page.evaluate(() => window.escritas), n);
  assert.equal(await raw(page, chave), null);
  assert.deepEqual((await consultar(page)).progresso.estado.respostas.q1, ['Lua']);
});

test('falha de abertura ou leitura IDB produz consulta inconclusiva sem banco alternativo', async (t) => {
  const { page } = await contexto(t);
  const texto = await textoBackup(page);
  await fecharFluxo(page);
  const antes = await banco(page);
  await page.evaluate(() => {
    window.openOriginal = indexedDB.open.bind(indexedDB);
    indexedDB.open = () => {
      throw new window.DOMException('Fixture', 'SecurityError');
    };
  });
  const r = await planejar(page, texto);
  assert.equal(r.ok, true);
  assert.equal(r.previa.entradas[0].conteudo.estado, 'consulta-inconclusiva');
  await page.evaluate(() => {
    indexedDB.open = window.openOriginal;
  });
  assert.deepEqual(await banco(page), antes);
});

test('falha de leitura localStorage não é ausência e não altera nenhuma chave', async (t) => {
  const { page, chave } = await contexto(t);
  const texto = await textoBackup(page);
  await fecharFluxo(page);
  await page.evaluate((k) => {
    localStorage.setItem(k, '{"preservar":true}');
    window.getOriginal = Storage.prototype.getItem;
    Storage.prototype.getItem = () => {
      throw new window.DOMException('Fixture', 'SecurityError');
    };
  }, chave);
  const r = await planejar(page, texto);
  assert.equal(r.previa.entradas[0].progresso[0].estado, 'indisponivel');
  await page.evaluate(() => {
    Storage.prototype.getItem = window.getOriginal;
  });
  assert.equal(await raw(page, chave), '{"preservar":true}');
});

test('locks indisponíveis ou observações não verificáveis bloqueiam sem executar getters', async (t) => {
  const { page } = await contextoVazio(t);
  const texto = await textoBackup(page);
  const r = await page.evaluate(async (s) => {
    let acessos = 0;
    navigator.locks.query = async () => {
      throw new Error('Fixture');
    };
    const falso = Object.defineProperty({}, 'obterSituacao', {
      get() {
        ++acessos;
        throw new Error('Não executar');
      },
    });
    const resultado = await window.LabRestauracao.prepararPlano(s, {
      handlesLab: [{}],
    });
    const recusado = await window.LabRestauracao.prepararPlano(s, { coordenadores: [falso] });
    return { resultado, recusado, acessos };
  }, texto);
  assert.equal(r.acessos, 0);
  const e = r.resultado.previa.entradas[0];
  assert.equal(e.concorrencia.locks, 'indeterminado');
  assert.equal(r.recusado.codigo, 'OBSERVACOES_INVALIDAS');
  assert.ok(e.bloqueios.includes('HANDLE_SEM_VINCULO_CONFIRMADO'));
});

test('backup inválido e objeto valido:true não provocam nem abertura de banco ou consulta de identidade', async (t) => {
  const { page } = await contextoVazio(t);
  const texto = await textoBackup(page);
  const d = JSON.parse(texto);
  d.entradas.push(structuredClone(d.entradas[0]));
  d.entradas[1].sessoes.principal.finalizada = true;
  await page.evaluate(() => {
    window.consultas = 0;
    window.fetch = () => {
      ++window.consultas;
      throw new Error('Não consultar');
    };
  });
  for (const dado of [
    JSON.stringify(d),
    '{',
    { valido: true, backupNormalizado: JSON.parse(texto) },
  ]) {
    const r = await planejar(page, dado);
    assert.equal(r.ok, false);
    assert.equal(r.codigo, 'BACKUP_INVALIDO');
  }
  assert.equal(await page.evaluate(() => window.consultas), 0);
  assert.equal(await banco(page), null);
});

test('opções não aceitam copyId, chave ou dados vindos do backup e não executam acessores', async (t) => {
  const { page } = await contextoVazio(t);
  const texto = await textoBackup(page);
  const r = await page.evaluate(async (s) => {
    let acessos = 0;
    const opcoes = Object.defineProperty({}, 'handlesLab', {
      enumerable: true,
      get() {
        ++acessos;
        return [];
      },
    });
    return {
      recusas: [
        await window.LabRestauracao.prepararPlano(s, { copyId: 'a'.repeat(64) }),
        await window.LabRestauracao.prepararPlano(s, { chave: 'x' }),
        await window.LabRestauracao.prepararPlano(s, opcoes),
      ],
      acessos,
    };
  }, texto);
  assert.equal(r.acessos, 0);
  assert.ok(r.recusas.every((e) => e.codigo === 'OBSERVACOES_INVALIDAS'));
  assert.equal(await banco(page), null);
});

test('prévia independente não contém respostas, chaves ou permissão de aplicação', async (t) => {
  const { page, chave } = await contexto(t);
  const texto = await textoBackup(page);
  await fecharFluxo(page);
  const r = await page.evaluate(async (s) => {
    const preparado = await window.LabRestauracao.prepararPlano(s);
    window.plano = preparado.plano;
    preparado.previa.entradas[0].conteudo.estado = 'forjado';
    return {
      inspecao: window.LabRestauracao.inspecionarPlano(window.plano),
      falso: window.LabRestauracao.inspecionarPlano({}),
      apis: Object.keys(window.LabRestauracao),
    };
  }, texto);
  assert.equal(r.inspecao.previa.entradas[0].conteudo.estado, 'identico');
  assert.equal(r.falso.ok, false);
  assert.deepEqual(r.apis, ['prepararPlano', 'inspecionarPlano']);
  const serializado = JSON.stringify(r.inspecao);
  assert.equal(serializado.includes(chave), false);
  assert.equal(serializado.includes('respostas'), false);
  assert.equal(serializado.includes('Sol'), false);
  assert.equal(r.inspecao.previa.restauracaoAutorizada, false);
});

test('revisão oficial ativa e todas as chaves vizinhas permanecem intactas após preparações', async (t) => {
  const { page } = await contexto(t);
  const texto = await textoBackup(page);
  await fecharFluxo(page);
  await page.evaluate(() => {
    window.QuestionariosRevisoes.registrar({
      ...window.config,
      id: 'oficial',
      chave: 'fixture-oficial',
    });
    localStorage.setItem('fixture-vizinha', '{"preservar":true}');
    window.QuestionariosRevisoes.abrir('oficial');
  });
  await opcao(page, 'Lua');
  const ler = () =>
    page.evaluate(() => ({
      ativa: window.QuestionariosRevisoes.obterAtiva().id,
      html: document.getElementById('gramatica-conteudo').innerHTML,
      estado: window.QuestionariosRevisoes.obterEstado('oficial'),
      storage: Object.entries(localStorage),
    }));
  const antes = await ler();
  const dbAntes = await banco(page);
  assert.equal((await planejar(page, texto)).ok, true);
  assert.equal((await planejar(page, texto)).ok, true);
  assert.deepEqual(await ler(), antes);
  assert.deepEqual(await banco(page), dbAntes);
});

test('Unicode isolado legítimo no motor gera comparação inconclusiva, sem chamar de vazio ou reparar', async (t) => {
  const { page, chave } = await contexto(t);
  await abrir(page);
  await opcao(page, 'Sol');
  await conferir(page);
  await page.locator('#gramatica-proxima').click();
  await persistir(page);
  const texto = await backupDoMotor(page);
  await page.locator('[data-resposta-gramatica]').fill('x' + '😀'.repeat(500));
  await persistir(page);
  await fecharFluxo(page);
  const antes = await raw(page, chave);
  const r = await planejar(page, texto);
  assert.equal(r.previa.entradas[0].progresso[0].estado, 'inconclusivo');
  assert.equal(r.previa.entradas[0].progresso[0].codigo, 'UNICODE_INVALIDO');
  assert.equal(await raw(page, chave), antes);
});

test('snapshot válido maior que o transporte atual gera dependência, sem tentativa de gravar', async (t) => {
  const { page } = await contextoVazio(t);
  const p = pacote();
  p.questoes = Array.from({ length: 30 }, (_, i) => ({
    ...p.questoes[1],
    id: 'q' + i,
    itens: Array.from({ length: 6 }, (_, j) => ({
      id: 'i' + i + '-' + j,
      pergunta: 'Campo',
      respostas: ['sim'],
    })),
  }));
  const estado = inicial();
  for (const q of p.questoes) estado.respostas[q.id] = q.itens.map(() => '\u0000'.repeat(1000));
  const texto = await textoBackup(page, p, { principal: estado });
  const r = await planejar(page, texto);
  assert.equal(r.ok, true, JSON.stringify(r));
  const e = r.previa.entradas[0];
  assert.equal(e.progresso[0].compativelComTransporteAtual, false);
  assert.ok(e.bloqueios.includes('SNAPSHOT_EXCEDE_TRANSPORTE_ATUAL'));
  assert.ok(e.dependencias.includes('SUPORTE_A_PROGRESSO_MAIOR_QUE_256KIB'));
});

test('troca de identidade observada e depois revertida nunca é aceita como plano válido', async (t) => {
  const { page } = await contexto(t);
  const texto = await textoBackup(page);
  await fecharFluxo(page);
  const antes = await banco(page);
  let n = 0;
  await page.route(origem + '/__revisoes_local__/identity', (route) => {
    ++n;
    return route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        application: 'revisoes-escolares',
        schema: 1,
        copyId: n === 3 ? B : A,
      }),
    });
  });
  const r = await planejar(page, texto);
  assert.equal(r.ok, false);
  assert.equal(r.codigo, 'DESTINO_ALTERADO');
  assert.equal(Object.hasOwn(r, 'previa'), false);
  assert.deepEqual(await banco(page), antes);
});

test('coordenador ou callback arbitrário não é executado para obter uma observação', async (t) => {
  const { page } = await contextoVazio(t);
  const texto = await textoBackup(page);
  const r = await page.evaluate(async (s) => {
    let chamadas = 0;
    const coordenador = {
      obterSituacao() {
        ++chamadas;
        throw new Error('Não executar');
      },
    };
    const resultado = await window.LabRestauracao.prepararPlano(s, {
      coordenadores: [coordenador],
    });
    return { resultado, chamadas };
  }, texto);
  assert.equal(r.resultado.codigo, 'OBSERVACOES_INVALIDAS');
  assert.equal(r.chamadas, 0);
  assert.equal(await banco(page), null);
});

test('backup vazio identifica destino e não precisa abrir schema', async (t) => {
  const { page } = await contextoVazio(t);
  const r = await planejar(page, '{"formato":"lab-backup-v1","versao":1,"entradas":[]}');
  assert.equal(r.ok, true);
  assert.equal(r.previa.totalAtividades, 0);
  assert.equal(r.previa.efeitosTecnicos.aberturaPodeCriarSchemaVazio, false);
  assert.equal(r.previa.restauracaoAutorizada, false);
  assert.equal(await banco(page), null);
});

test('falha de get em transação readonly é inconclusiva e preserva os pares existentes', async (t) => {
  const { page } = await contexto(t);
  const texto = await textoBackup(page);
  await fecharFluxo(page);
  const antes = await banco(page);
  await page.evaluate(() => {
    window.getIdbOriginal = window.IDBObjectStore.prototype.get;
    window.IDBObjectStore.prototype.get = () => {
      throw new window.DOMException('Fixture', 'SecurityError');
    };
  });
  const r = await planejar(page, texto);
  const c = r.previa.entradas[0].conteudo;
  assert.equal(c.estado, 'consulta-inconclusiva');
  assert.equal(c.baseReconferida, false);
  assert.ok(r.previa.entradas[0].bloqueios.includes('CONTEUDO_NAO_CONFIRMADO'));
  await page.evaluate(() => {
    window.IDBObjectStore.prototype.get = window.getIdbOriginal;
  });
  assert.deepEqual(await banco(page), antes);
});

test('coordenador ainda preparando, sem handle aberto, permanece indeterminado e não é encerrado', async (t) => {
  const { page } = await contextoVazio(t);
  const texto = await textoBackup(page);
  // Preservar a condição "ainda preparando" independentemente da carga da suíte.
  // O cenário de expiração do mesmo prazo é verificado separadamente abaixo.
  await page.clock.install();
  await page.clock.pauseAt(await page.evaluate(() => Date.now()));
  let chegou;
  const aguardando = new Promise((resolve) => {
    chegou = resolve;
  });
  let primeira = true;
  await page.route(origem + '/__revisoes_local__/identity', (route) => {
    if (primeira) {
      primeira = false;
      chegou(route);
    } else return route.continue();
  });
  await page.evaluate(() => {
    window.sessao = window.LabCoordenador.criarSessao();
    window.preparacao = window.sessao.preparar();
  });
  const req = await aguardando;
  const r = await planejar(page, texto);
  assert.equal(r.previa.entradas[0].concorrencia.memoria, 'nao-comprovada');
  assert.ok(r.previa.entradas[0].bloqueios.includes('MEMORIA_NAO_INSPECIONADA'));
  assert.equal(await page.evaluate(() => window.sessao.obterSituacao().estado), 'preparando');
  await req.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId: A }),
  });
  const preparacao = await page.evaluate(() => window.preparacao);
  assert.equal(preparacao.ok, true, JSON.stringify(preparacao));
  assert.equal(await page.evaluate(() => window.sessao.obterSituacao().estado), 'pronta');
  await page.unrouteAll();
  await page.clock.resume();
});

test('preparação expirada exige consentimento e resposta tardia não habilita persistência', async (t) => {
  const { page } = await contextoVazio(t);
  const texto = await textoBackup(page);
  await page.clock.install();
  await page.clock.pauseAt(await page.evaluate(() => Date.now()));
  let chegou;
  const aguardando = new Promise((resolve) => {
    chegou = resolve;
  });
  let primeira = true;
  await page.route(origem + '/__revisoes_local__/identity', (route) => {
    if (primeira) {
      primeira = false;
      chegou(route);
    } else return route.continue();
  });
  await page.evaluate(() => {
    window.sessao = window.LabCoordenador.criarSessao();
    window.preparacao = window.sessao.preparar();
  });
  const req = await aguardando;
  const r = await planejar(page, texto);
  assert.equal(r.previa.entradas[0].concorrencia.memoria, 'nao-comprovada');
  assert.ok(r.previa.entradas[0].bloqueios.includes('MEMORIA_NAO_INSPECIONADA'));
  const antes = await banco(page);
  await page.clock.runFor(2999);
  assert.equal(await page.evaluate(() => window.sessao.obterSituacao().estado), 'preparando');
  await page.clock.runFor(1);
  const preparacao = await page.evaluate(() => window.preparacao);
  assert.equal(preparacao.ok, false);
  assert.equal(preparacao.codigo, 'CONSENTIMENTO_NECESSARIO');
  const situacao = await page.evaluate(() => window.sessao.obterSituacao());
  assert.equal(situacao.estado, 'aguarda-consentimento');
  assert.equal(situacao.motivo, 'IDENTIDADE_TIMEOUT');
  assert.notEqual(situacao.modo, 'persistente');
  await req.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ application: 'revisoes-escolares', schema: 1, copyId: A }),
  });
  await page.unrouteAll();
  await page.clock.resume();
  assert.equal(
    await page.evaluate(() => window.sessao.obterSituacao().estado),
    'aguarda-consentimento'
  );
  assert.equal(await page.evaluate(() => window.sessao.obterSituacao().pacotesTemporarios), 0);
  assert.deepEqual(await banco(page), antes);
});
