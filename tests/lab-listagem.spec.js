/* global indexedDB, IDBDatabase, IDBObjectStore */
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const COPIA = 'a'.repeat(64);
const BANCO = 'revisoesEscolares.lab.' + COPIA + '.v1';
const ENDPOINT = '**/__revisoes_local__/identity';
const URL_APP = '/ambiente_interativo/index.html';
const identidade = (copyId = COPIA) => ({ application: 'revisoes-escolares', schema: 1, copyId });
function pacote(perfil = 'alice', titulo = 'Experiência local') {
  return {
    formato: 'lab-questionarios-v1',
    id: 'sintetico-listagem',
    versao: 1,
    perfil,
    materia: 'ciencias',
    titulo,
    questoes: [
      {
        id: 'q1',
        bloco: 'Fixture',
        titulo: 'Enunciado reservado',
        instrucao: 'Pergunta reservada',
        tipo: 'opcoes',
        dica: 'Dica reservada',
        itens: [
          {
            id: 'i1',
            pergunta: 'Pergunta secreta',
            opcoes: ['Resposta secreta', 'Alternativa secreta'],
            respostas: ['Resposta secreta'],
          },
        ],
      },
    ],
  };
}
async function iniciar(page) {
  await page.route(ENDPOINT, (route) => route.fulfill({ json: identidade() }));
  await page.goto(URL_APP);
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
}
async function entrar(page, perfil = 'alice') {
  await page.locator(`[data-aluno="${perfil}"]`).click();
  await page.locator('#abrir-laboratorio').click();
}
async function terminou(page) {
  await expect(page.locator('#lab-conteudo')).toHaveAttribute('aria-busy', 'false');
}
async function semear(page, pacotes = [pacote()]) {
  await page.evaluate(async (entradas) => {
    const a = await window.LabRepositorio.abrirRepositorio();
    if (!a.ok) throw new Error(a.codigo);
    try {
      for (const p of entradas) {
        const r = await a.repositorio.cadastrar(JSON.stringify(p));
        if (!r.ok) throw new Error(r.codigo);
      }
    } finally {
      a.repositorio.fechar();
    }
  }, pacotes);
}
// Apenas fixtures: toda mutação ocorre antes de entrar na tela sob teste.
async function alterarBanco(page, store, valor) {
  await page.evaluate(
    async ({ nome, store, valor }) => {
      const db = await new Promise((resolve, reject) => {
        const q = indexedDB.open(nome);
        q.onsuccess = () => resolve(q.result);
        q.onerror = () => reject(q.error);
      });
      try {
        await new Promise((resolve, reject) => {
          const tx = db.transaction(store, 'readwrite');
          if (store === 'operacoes') tx.objectStore(store).put(valor);
          else {
            const q = tx.objectStore(store).openCursor();
            q.onsuccess = () => {
              const cursor = q.result;
              cursor.update({ ...cursor.value, ...valor });
            };
          }
          tx.oncomplete = resolve;
          tx.onabort = () => reject(tx.error);
        });
      } finally {
        db.close();
      }
    },
    { nome: BANCO, store, valor }
  );
}
async function journal(page, estado = 'intencao-registrada') {
  return page.evaluate(
    async ({ p, copia, estado }) => {
      const v = await window.LabValidador.validarPacote(JSON.stringify(p));
      if (!v.valido) throw new Error('Fixture inválida');
      const encerrada = estado === 'cancelada-sem-aplicacao';
      const concluida = estado === 'aplicacao-concluida';
      return {
        formato: 'lab-journal-v1',
        versao: 1,
        id: window.crypto.randomUUID(),
        destino: { copyId: copia, origem: window.location.origin },
        estado,
        revisao: concluida ? 4 : encerrada ? 5 : 0,
        atividades: [
          {
            perfil: p.perfil,
            materia: p.materia,
            id: p.id,
            versao: p.versao,
            digest: v.digest,
            conteudo: {
              intencao: 'criar',
              baseDigest: null,
              pacote: v.canonico,
              etapa: concluida ? 'resultado-confirmado' : 'nao-iniciada',
              resultado: concluida ? 'criacao-observada' : 'nao-comprovado',
            },
            sessoes: {},
          },
        ],
        marcadores: {
          intencao: 'registrada',
          aplicacao: concluida ? 'concluida' : 'nao-iniciada',
          efeitos: concluida ? 'verificados-por-leitura' : 'nao-comprovados',
        },
        ...(encerrada
          ? { encerramento: { versao: 1, efeito: 'sem-aplicacao', pacote: v.canonico } }
          : {}),
      };
    },
    { p: pacote(), copia: COPIA, estado }
  );
}
async function observarEscritas(page) {
  await page.evaluate(() => {
    window.__labEscritas = [];
    for (const [proto, nomes] of [
      [Storage.prototype, ['setItem', 'removeItem', 'clear']],
      [IDBObjectStore.prototype, ['add', 'put', 'delete', 'clear']],
      [IDBDatabase.prototype, ['createObjectStore', 'deleteObjectStore']],
    ])
      for (const nome of nomes) {
        const original = proto[nome];
        proto[nome] = function (...args) {
          window.__labEscritas.push(nome);
          return original.apply(this, args);
        };
      }
    const tx = IDBDatabase.prototype.transaction;
    IDBDatabase.prototype.transaction = function (...args) {
      if (args[1] && args[1] !== 'readonly') window.__labEscritas.push(args[1]);
      return tx.apply(this, args);
    };
    const abrir = window.indexedDB.open.bind(window.indexedDB);
    window.indexedDB.open = (...args) => {
      const r = abrir(...args);
      r.addEventListener('upgradeneeded', () => window.__labEscritas.push('upgradeneeded'));
      return r;
    };
    const proibida = (nome) => () => {
      window.__labEscritas.push(nome);
      throw new Error('Operação proibida na consulta');
    };
    window.indexedDB.deleteDatabase = proibida('deleteDatabase');
    window.LabCoordenador = { criarSessao: proibida('criarSessao') };
    const abrirExistente = window.LabRepositorio.abrirRepositorioExistente;
    window.LabRepositorio = {
      ...window.LabRepositorio,
      abrirRepositorio: proibida('abrirRepositorio'),
      async abrirRepositorioExistente() {
        const a = await abrirExistente();
        if (!a.ok) return a;
        const repo = { ...a.repositorio };
        for (const nome of [
          'cadastrar',
          'registrarIntencaoJournal',
          'executarAplicacaoJournal',
          'confirmarReconciliacaoJournal',
        ])
          repo[nome] = proibida(nome);
        return { ...a, repositorio: repo };
      },
    };
    const journal = { ...window.LabJournal };
    for (const nome of Object.keys(journal))
      if (nome !== 'inspecionarPendenciasExistentes') journal[nome] = proibida(nome);
    window.LabJournal = journal;
  });
}
async function retrato(page) {
  return page.evaluate(async (nome) => {
    const local = Object.entries(localStorage).sort();
    if (!(await indexedDB.databases()).some((b) => b.name === nome)) return { local, banco: null };
    const db = await new Promise((resolve, reject) => {
      const q = indexedDB.open(nome);
      q.onsuccess = () => resolve(q.result);
      q.onerror = () => reject(q.error);
    });
    try {
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(['pacotes', 'administracao', 'operacoes'], 'readonly');
        const banco = {};
        for (const nome of ['pacotes', 'administracao', 'operacoes']) {
          const q = tx.objectStore(nome).getAll();
          q.onsuccess = () => {
            banco[nome] = q.result;
          };
        }
        tx.oncomplete = () => resolve({ local, banco });
        tx.onabort = () => reject(tx.error);
      });
    } finally {
      db.close();
    }
  }, BANCO);
}

for (const perfil of ['alice', 'mariana'])
  test(`entrada de ${perfil}: vazio legítimo sem criar banco`, async ({ page }) => {
    await iniciar(page);
    await observarEscritas(page);
    await entrar(page, perfil);
    await terminou(page);
    await expect(page.locator('#lab-perfil')).toHaveText(perfil === 'alice' ? 'Alice' : 'Mariana');
    await expect(page.locator('#lab-status')).toContainText('Ainda não há');
    expect(await page.evaluate(() => indexedDB.databases())).toEqual([]);
    expect(await page.evaluate(() => window.__labEscritas)).toEqual([]);
  });

test('IndexedDB real: metadados, isolamento, zero escrita e catálogo oficial intacto', async ({
  page,
}) => {
  await iniciar(page);
  const oficial = await page.evaluate(() => window.RegistroRevisoes.listar());
  await semear(page, [pacote(), pacote('mariana', 'Lista de Mariana')]);
  const antes = await retrato(page);
  await observarEscritas(page);
  await entrar(page);
  await terminou(page);
  await expect(page.locator('#lab-lista li')).toHaveCount(1);
  await expect(page.locator('#lab-lista')).toContainText('Experiência local');
  await expect(page.locator('#lab-lista')).toContainText('Ciências · Versão 1');
  await expect(page.locator('#lab-lista')).toContainText('Atividade cadastrada');
  await expect(page.locator('#lab-lista')).not.toContainText('Mariana');
  expect(await retrato(page)).toEqual(antes);
  expect(await page.evaluate(() => window.__labEscritas)).toEqual([]);
  expect(await page.evaluate(() => window.RegistroRevisoes.listar())).toEqual(oficial);
  await page.locator('#botao-inicio').click();
  await entrar(page, 'mariana');
  await terminou(page);
  await expect(page.locator('#lab-lista')).toContainText('Lista de Mariana');
  await expect(page.locator('#lab-lista')).not.toContainText('Experiência local');
});

test('payload e respostas nunca entram no DOM, datasets, logs ou eventos da interface', async ({
  page,
}) => {
  await iniciar(page);
  await semear(page);
  const logs = [];
  page.on('console', (m) => logs.push(m.text()));
  await page.evaluate(() => {
    window.__labEventos = [];
    const original = window.EventTarget.prototype.dispatchEvent;
    window.EventTarget.prototype.dispatchEvent = function (evento) {
      if (evento instanceof window.CustomEvent)
        window.__labEventos.push(JSON.stringify(evento.detail));
      return original.call(this, evento);
    };
  });
  await entrar(page);
  await terminou(page);
  const html = await page.locator('html').innerHTML();
  for (const segredo of [
    'Resposta secreta',
    'Alternativa secreta',
    'Pergunta secreta',
    'Enunciado reservado',
    'Pergunta reservada',
    'Dica reservada',
  ]) {
    expect(html).not.toContain(segredo);
    expect(logs.join('')).not.toContain(segredo);
    expect(await page.evaluate(() => window.__labEventos.join(''))).not.toContain(segredo);
  }
  expect(await page.evaluate(() => Object.keys(window.LabListagem))).toEqual(['abrir', 'fechar']);
  await expect(page.locator('#tela-laboratorio button')).toHaveText([
    'Voltar às matérias',
    'Confirmar importação',
    'Cancelar',
  ]);
  await expect(page.locator('#lab-lista button')).toHaveCount(0);
  await expect(page.locator('#limpar-progresso')).toBeHidden();
});

test('voltar preserva perfil, painel, rolagem e foco; reabrir não duplica consultas', async ({
  page,
}) => {
  await iniciar(page);
  await semear(page);
  await page.locator('[data-aluno="alice"]').click();
  const painel = await page.locator('#grade-materias').innerHTML();
  await page.locator('#abrir-laboratorio').focus();
  const scroll = await page.evaluate(() => window.scrollY);
  await page.locator('#abrir-laboratorio').click();
  await terminou(page);
  await page.locator('#lab-voltar').click();
  await expect(page.locator('#abrir-laboratorio')).toBeFocused();
  expect(await page.evaluate(() => window.scrollY)).toBe(scroll);
  expect(await page.locator('#grade-materias').innerHTML()).toBe(painel);
  await expect(page.locator('#limpar-progresso')).toBeVisible();
  await page.evaluate(() => {
    const abrir = window.LabRepositorio.abrirRepositorioExistente;
    window.__labConsultas = 0;
    window.LabRepositorio = {
      ...window.LabRepositorio,
      abrirRepositorioExistente() {
        ++window.__labConsultas;
        return abrir();
      },
    };
  });
  for (let i = 0; i < 3; ++i) {
    await page.locator('#abrir-laboratorio').click();
    await terminou(page);
    await expect(page.locator('#lab-lista li')).toHaveCount(1);
    await page.locator('#lab-voltar').click();
  }
  // Uma consulta da interface por entrada; o journal conserva sua dependência interna.
  expect(await page.evaluate(() => window.__labConsultas)).toBe(3);
});

test('consulta atrasada de Alice não preenche Mariana após trocar perfil', async ({ page }) => {
  await iniciar(page);
  await semear(page, [pacote(), pacote('mariana', 'Só Mariana')]);
  await page.evaluate(() => {
    const abrir = window.LabListagem.abrir;
    let n = 0;
    window.__labPrimeiraConcluida = false;
    window.LabListagem = {
      ...window.LabListagem,
      async abrir(perfil) {
        const primeira = ++n === 1;
        try {
          return await abrir(perfil);
        } finally {
          if (primeira) window.__labPrimeiraConcluida = true;
        }
      },
    };
  });
  let liberar;
  let retida = false;
  const pendente = new Promise((resolve) => {
    liberar = resolve;
  });
  await page.route(ENDPOINT, async (route) => {
    if (!retida) {
      retida = true;
      await pendente;
    }
    await route.fulfill({ json: identidade() });
  });
  await entrar(page);
  await expect.poll(() => retida).toBe(true);
  await expect(page.locator('#lab-status')).toContainText('Consultando');
  await page.locator('#botao-inicio').click();
  await entrar(page, 'mariana');
  await terminou(page);
  liberar();
  await expect.poll(() => page.evaluate(() => window.__labPrimeiraConcluida)).toBe(true);
  await expect(page.locator('#lab-lista')).toContainText('Só Mariana');
  await expect(page.locator('#lab-lista')).not.toContainText('Experiência local');
});

test('inspeção de journal existente não cria banco ausente', async ({ page }) => {
  await iniciar(page);
  await observarEscritas(page);
  expect(
    await page.evaluate(() => window.LabJournal.inspecionarPendenciasExistentes())
  ).toMatchObject({ ok: false, codigo: 'BANCO_LAB_AUSENTE' });
  expect(await page.evaluate(() => indexedDB.databases())).toEqual([]);
  expect(await page.evaluate(() => window.__labEscritas)).toEqual([]);
});

test('mudança de origem ao concluir invalida a consulta', async ({ page }) => {
  await iniciar(page);
  await semear(page);
  await page.evaluate(() => {
    const resolver = window.LabIdentidade.resolverIdentidade;
    window.LabIdentidade = {
      async resolverIdentidade(esperado) {
        const r = await resolver(esperado);
        return esperado ? { ...r, origem: 'http://localhost:9999' } : r;
      },
    };
  });
  await entrar(page);
  await terminou(page);
  await expect(page.locator('#lab-status')).toContainText('cópia local mudou');
  await expect(page.locator('#lab-lista li')).toHaveCount(0);
});

test('módulo LAB ausente antes da inicialização mantém aplicativo utilizável', async ({ page }) => {
  await page.addInitScript(() =>
    document.addEventListener(
      'DOMContentLoaded',
      () => {
        window.LabListagem = undefined;
      },
      { once: true }
    )
  );
  await iniciar(page);
  await entrar(page);
  await expect(page.locator('#lab-status')).toContainText('indisponível');
  await page.locator('#lab-voltar').click();
  await page.locator('[data-materia="ciencias"]').click();
  await expect(page.locator('#tela-revisao')).toBeVisible();
});

test('mudança de copyId antes da abertura bloqueia em vez de misturar cópias', async ({ page }) => {
  await iniciar(page);
  await semear(page);
  let n = 0;
  await page.route(ENDPOINT, (route) =>
    route.fulfill({ json: identidade(++n === 1 ? COPIA : 'b'.repeat(64)) })
  );
  await entrar(page);
  await terminou(page);
  await expect(page.locator('#lab-status')).toContainText('cópia local mudou');
  await expect(page.locator('#lab-lista li')).toHaveCount(0);
});

test('mudança de copyId no fim da consulta suspende metadados', async ({ page }) => {
  await iniciar(page);
  await semear(page);
  let mudar = false;
  await page.evaluate(() => {
    const original = window.LabJournal.inspecionarPendenciasExistentes;
    window.LabJournal = {
      ...window.LabJournal,
      async inspecionarPendenciasExistentes() {
        const r = await original();
        await window.fetch('/__lab_teste_mudar__');
        return r;
      },
    };
  });
  await page.route('**/__lab_teste_mudar__', (route) => {
    mudar = true;
    return route.fulfill({ body: 'ok' });
  });
  await page.route(ENDPOINT, (route) =>
    route.fulfill({ json: identidade(mudar ? 'b'.repeat(64) : COPIA) })
  );
  await entrar(page);
  await terminou(page);
  await expect(page.locator('#lab-status')).toContainText('cópia local mudou');
  await expect(page.locator('#lab-lista li')).toHaveCount(0);
});

for (const caso of ['identidade', 'indexedDB', 'inspecao', 'bloqueado'])
  test(`indisponibilidade de ${caso} é erro, nunca vazio`, async ({ page }) => {
    await iniciar(page);
    if (caso === 'identidade')
      await page.route(ENDPOINT, (route) => route.fulfill({ status: 503, body: '' }));
    else
      await page.evaluate((tipo) => {
        if (tipo === 'indexedDB') Object.defineProperty(window, 'indexedDB', { value: undefined });
        else
          Object.defineProperty(indexedDB, 'databases', {
            value:
              tipo === 'inspecao'
                ? undefined
                : () => Promise.reject(new DOMException('bloqueado', 'SecurityError')),
          });
      }, caso);
    await entrar(page);
    await terminou(page);
    await expect(page.locator('#lab-status')).toContainText('indisponível');
    await expect(page.locator('#lab-status')).not.toContainText('Ainda não há');
    await page.locator('#lab-voltar').click();
    await expect(page.locator('#grade-materias')).toBeVisible();
  });

test('banco incompatível não é atualizado nem recriado', async ({ page }) => {
  await iniciar(page);
  await page.evaluate(
    (nome) =>
      new Promise((resolve, reject) => {
        const q = indexedDB.open(nome, 2);
        q.onsuccess = () => {
          q.result.close();
          resolve();
        };
        q.onerror = () => reject(q.error);
      }),
    BANCO
  );
  await observarEscritas(page);
  await entrar(page);
  await terminou(page);
  await expect(page.locator('#lab-status')).toContainText('incompatível');
  expect(await page.evaluate(() => window.__labEscritas)).toEqual([]);
  expect(await page.evaluate(() => indexedDB.databases())).toEqual([{ name: BANCO, version: 2 }]);
});

for (const store of ['pacotes', 'administracao'])
  test(`${store} corrompidos: erro sem reconstrução`, async ({ page }) => {
    await iniciar(page);
    await semear(page);
    await alterarBanco(
      page,
      store,
      store === 'pacotes' ? { conteudo: '{' } : { situacao: 'inventada' }
    );
    const antes = await retrato(page);
    await observarEscritas(page);
    await entrar(page);
    await terminou(page);
    await expect(page.locator('#lab-status')).toContainText('dados locais inválidos');
    await expect(page.locator('#lab-lista li')).toHaveCount(0);
    expect(await retrato(page)).toEqual(antes);
    expect(await page.evaluate(() => window.__labEscritas)).toEqual([]);
  });

for (const caso of ['pendente', 'corrompido', 'futuro', 'concluida', 'encerrada'])
  test(`journal ${caso}: parser existente e consulta sem mutação`, async ({ page }) => {
    await iniciar(page);
    await semear(page);
    const r = await journal(
      page,
      caso === 'concluida'
        ? 'aplicacao-concluida'
        : caso === 'encerrada'
          ? 'cancelada-sem-aplicacao'
          : 'intencao-registrada'
    );
    if (caso === 'corrompido') delete r.marcadores;
    if (caso === 'futuro') r.versao = 2;
    await alterarBanco(page, 'operacoes', r);
    const antes = await retrato(page);
    await observarEscritas(page);
    await entrar(page);
    await terminou(page);
    await expect(page.locator('#lab-lista li')).toHaveCount(1);
    if (['concluida', 'encerrada'].includes(caso))
      await expect(page.locator('#lab-aviso')).toBeEmpty();
    else await expect(page.locator('#lab-aviso')).toContainText('bloqueadas');
    expect(await retrato(page)).toEqual(antes);
    expect(await page.evaluate(() => window.__labEscritas)).toEqual([]);
  });

test('falha ao ler pendências é inconclusiva; nunca libera execução', async ({ page }) => {
  await iniciar(page);
  await semear(page);
  await page.evaluate(() => {
    window.LabJournal = {
      inspecionarPendenciasExistentes: async () => ({ ok: false, codigo: 'ARMAZENAMENTO_TIMEOUT' }),
    };
  });
  await entrar(page);
  await terminou(page);
  await expect(page.locator('#lab-aviso')).toContainText('inconclusiva');
  await expect(page.locator('#tela-laboratorio button')).toHaveText([
    'Voltar às matérias',
    'Confirmar importação',
    'Cancelar',
  ]);
  await expect(page.locator('#lab-lista button')).toHaveCount(0);
});

test('título hostil é texto literal, sem elemento ou evento injetado', async ({ page }) => {
  await iniciar(page);
  const titulo = '<img src=x onerror="window.injetado=1"> & <script>segredo</script>';
  await semear(page);
  // O schema real recusa HTML. Exercitar também a defesa da camada de apresentação,
  // simulando uma dependência defeituosa, sem ampliar o formato nem contornar o banco.
  expect(
    await page.evaluate(
      async (p) => (await window.LabValidador.validarPacote(JSON.stringify(p))).valido,
      pacote('alice', titulo)
    )
  ).toBe(false);
  await page.evaluate((titulo) => {
    const original = window.LabRepositorio.abrirRepositorioExistente;
    window.LabRepositorio = {
      ...window.LabRepositorio,
      async abrirRepositorioExistente() {
        const a = await original();
        const listar = a.repositorio.listar;
        return {
          ...a,
          repositorio: {
            ...a.repositorio,
            async listar(perfil) {
              const r = await listar(perfil);
              return {
                ...r,
                pacotes: r.pacotes.map((p) => ({ ...p, pacote: { ...p.pacote, titulo } })),
              };
            },
          },
        };
      },
    };
  }, titulo);
  await entrar(page);
  await terminou(page);
  await expect(page.locator('#lab-lista h2')).toHaveText(titulo);
  await expect(page.locator('#lab-lista img, #lab-lista script')).toHaveCount(0);
  expect(await page.evaluate(() => window.injetado)).toBeUndefined();
});

for (const modulo of ['LabListagem', 'LabRepositorio', 'LabJournal', 'LabIdentidade'])
  test(`ausência de ${modulo} não bloqueia revisões escolares`, async ({ page }) => {
    await iniciar(page);
    await page.evaluate((nome) => {
      window[nome] = undefined;
    }, modulo);
    await entrar(page);
    await terminou(page);
    await expect(page.locator('#lab-status')).toContainText('indisponível');
    await page.locator('#lab-voltar').click();
    await page.locator('[data-materia="ciencias"]').click();
    await expect(page.locator('#tela-revisao')).toBeVisible();
  });

test('teclado, foco visível, estados acessíveis e retorno pelo botão', async ({ page }) => {
  await iniciar(page);
  await page.locator('[data-aluno="alice"]').focus();
  await page.keyboard.press('Enter');
  await page.locator('#abrir-laboratorio').focus();
  await page.keyboard.press('Enter');
  await terminou(page);
  await expect(page.locator('#lab-titulo')).toBeFocused();
  await expect(page.locator('#lab-status')).toHaveAttribute('aria-live', 'polite');
  await page.keyboard.press('Tab');
  await expect(page.locator('#lab-voltar')).toBeFocused();
  expect(
    await page.locator('#lab-voltar').evaluate((b) => window.getComputedStyle(b).outlineStyle)
  ).not.toBe('none');
  const a11y = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(a11y.violations.filter((v) => ['serious', 'critical'].includes(v.impact))).toEqual([]);
  await page.keyboard.press('Enter');
  await expect(page.locator('#abrir-laboratorio')).toBeFocused();
});

for (const [width, height] of [
  [390, 844],
  [1366, 768],
  [1920, 1080],
])
  test(`layout ${width}×${height} sem overflow e captura`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height });
    await iniciar(page);
    await semear(page, [pacote('alice', 'Atividade ' + 'm'.repeat(105))]);
    await entrar(page);
    await terminou(page);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    ).toBe(true);
    const botao = await page.locator('#lab-voltar').boundingBox();
    expect(botao.height).toBeGreaterThanOrEqual(44);
    expect(botao.width).toBeGreaterThanOrEqual(44);
    await page.screenshot({
      path: testInfo.outputPath(`lab-${width}.png`),
      fullPage: true,
      animations: 'disabled',
    });
  });

test('toque abre e volta às matérias', async ({ browser, baseURL }) => {
  const contexto = await browser.newContext({
    baseURL,
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  try {
    const page = await contexto.newPage();
    await iniciar(page);
    await page.locator('[data-aluno="mariana"]').tap();
    await page.locator('#abrir-laboratorio').tap();
    await terminou(page);
    await page.locator('#lab-voltar').tap();
    await expect(page.locator('#saudacao-aluno')).toContainText('Mariana');
  } finally {
    await contexto.close();
  }
});

test('recarregar retorna ao seletor tradicional sem alterar pacote ou progresso', async ({
  page,
}) => {
  await iniciar(page);
  await semear(page);
  const antes = await retrato(page);
  await entrar(page);
  await terminou(page);
  await page.reload();
  await expect(page.locator('#tela-inicial')).toBeVisible();
  await expect(page.locator('#tela-laboratorio')).toBeHidden();
  expect(await retrato(page)).toEqual(antes);
  await entrar(page);
  await terminou(page);
  await expect(page.locator('#lab-lista li')).toHaveCount(1);
});

test('revisão oficial restaura progresso depois de entrar e sair do LAB', async ({ page }) => {
  await iniciar(page);
  await page.locator('[data-aluno="alice"]').click();
  await page.locator('[data-materia="ciencias"]').click();
  const seletores = page.locator('#tela-revisao [data-opcao]');
  await expect(seletores.first()).toBeVisible();
  await seletores.first().click();
  const antes = await page.evaluate(() =>
    localStorage.getItem('revisoesEscolares.alice.ciencias.origemMateriais')
  );
  expect(antes).not.toBeNull();
  await page.locator('#botao-inicio').click();
  await entrar(page);
  await terminou(page);
  await page.locator('#lab-voltar').click();
  await page.locator('[data-materia="ciencias"]').click();
  await expect(seletores.first()).toHaveAttribute('aria-pressed', 'true');
  expect(
    await page.evaluate(() =>
      localStorage.getItem('revisoesEscolares.alice.ciencias.origemMateriais')
    )
  ).toBe(antes);
});

test('file:// mantém aplicativo oficial e explica ausência de listagem persistente', async ({
  page,
}) => {
  await page.goto(pathToFileURL(path.resolve(__dirname, '../ambiente_interativo/index.html')).href);
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
  await entrar(page);
  await terminou(page);
  await expect(page.locator('#lab-status')).toContainText('servidor deste computador');
  await page.locator('#lab-voltar').click();
  await page.locator('[data-materia="ciencias"]').click();
  await expect(page.locator('#tela-revisao')).toBeVisible();
});
