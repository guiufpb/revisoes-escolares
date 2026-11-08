/* global indexedDB, IDBDatabase, IDBObjectStore, File */
const path = require('node:path');
const { Buffer } = require('node:buffer');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const arquivo = (p = pacote()) => ({
  name: 'atividade.json',
  mimeType: 'application/json',
  buffer: Buffer.from(typeof p === 'string' ? p : JSON.stringify(p)),
});
function pacote(perfil = 'alice', titulo = 'Experimento sintético') {
  return {
    formato: 'lab-questionarios-v1',
    id: 'teste-importacao',
    versao: 1,
    perfil,
    materia: 'ciencias',
    titulo,
    questoes: [
      {
        id: 'q1',
        bloco: 'Fixture',
        titulo: 'ENUNCIADO_RESERVADO',
        instrucao: 'Observe.',
        tipo: 'opcoes',
        dica: 'Pense.',
        itens: [
          {
            id: 'i1',
            pergunta: 'PERGUNTA_RESERVADA',
            opcoes: ['GABARITO_RESERVADO', 'ALTERNATIVA_RESERVADA'],
            respostas: ['GABARITO_RESERVADO'],
          },
        ],
      },
    ],
  };
}
const status = (page) => page.locator('#lab-importacao-status');
async function iniciar(page, perfil = 'alice') {
  await page.goto('/ambiente_interativo/index.html');
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
  await page.locator(`[data-aluno="${perfil}"]`).click();
  await page.locator('#abrir-laboratorio').click();
  await expect(page.locator('#lab-conteudo')).toHaveAttribute('aria-busy', 'false');
  await page.locator('#lab-importacao summary').click();
}
async function selecionar(page, p = pacote()) {
  await page.locator('#lab-arquivo').setInputFiles(arquivo(p));
}
async function previa(page, p = pacote()) {
  await selecionar(page, p);
  await expect(status(page)).toContainText('Prévia válida');
  await expect(page.locator('#lab-importar-confirmar')).toBeEnabled();
}
async function importar(page, p = pacote()) {
  await previa(page, p);
  await page.locator('#lab-importar-confirmar').click();
  await expect(status(page)).toContainText('Importação concluída');
  await expect(page.locator('#lab-conteudo')).toHaveAttribute('aria-busy', 'false');
}
async function retrato(page) {
  return page.evaluate(async () => {
    const local = Object.entries(localStorage).sort();
    const escopo = await window.LabIdentidade.resolverIdentidade();
    const nome = 'revisoesEscolares.lab.' + escopo.copyId + '.v1';
    const bancos = await indexedDB.databases();
    if (!bancos.some((b) => b.name === nome)) return { local, bancos, dados: null };
    const db = await new Promise((resolve, reject) => {
      const r = indexedDB.open(nome);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    try {
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(['pacotes', 'administracao', 'operacoes'], 'readonly');
        const dados = {};
        for (const s of ['pacotes', 'administracao', 'operacoes']) {
          const r = tx.objectStore(s).getAll();
          r.onsuccess = () => {
            dados[s] = r.result;
          };
        }
        tx.oncomplete = () => resolve({ local, bancos, dados });
        tx.onabort = () => reject(tx.error);
      });
    } finally {
      db.close();
    }
  });
}
async function semear(page, p = pacote()) {
  await page.evaluate(async (p) => {
    const a = await window.LabRepositorio.abrirRepositorio();
    try {
      const r = await a.repositorio.cadastrar(JSON.stringify(p));
      if (!r.ok) throw new Error(r.codigo);
    } finally {
      a.repositorio.fechar();
    }
  }, p);
}
async function gravarJournal(page, tipo = 'pendente') {
  await page.evaluate(
    async ({ p, tipo }) => {
      const a = await window.LabRepositorio.abrirRepositorio();
      a.repositorio.fechar();
      const v = await window.LabValidador.validarPacote(JSON.stringify(p));
      const registro = {
        formato: 'lab-journal-v1',
        versao: 1,
        id: window.crypto.randomUUID(),
        destino: { copyId: a.copyId, origem: a.origem },
        estado: 'intencao-registrada',
        revisao: 0,
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
              etapa: 'nao-iniciada',
              resultado: 'nao-comprovado',
            },
            sessoes: {},
          },
        ],
        marcadores: {
          intencao: 'registrada',
          aplicacao: 'nao-iniciada',
          efeitos: 'nao-comprovados',
        },
      };
      if (tipo === 'corrompido') delete registro.marcadores;
      const db = await new Promise((resolve) => {
        const r = indexedDB.open('revisoesEscolares.lab.' + a.copyId + '.v1');
        r.onsuccess = () => resolve(r.result);
      });
      try {
        await new Promise((resolve, reject) => {
          const tx = db.transaction('operacoes', 'readwrite');
          tx.objectStore('operacoes').add(registro);
          tx.oncomplete = resolve;
          tx.onabort = () => reject(tx.error);
        });
      } finally {
        db.close();
      }
    },
    { p: pacote(), tipo }
  );
}
async function observar(page) {
  await page.evaluate(() => {
    window.__importWrites = [];
    for (const [proto, nomes] of [
      [Storage.prototype, ['setItem', 'removeItem', 'clear']],
      [IDBObjectStore.prototype, ['add', 'put', 'delete', 'clear']],
      [IDBDatabase.prototype, ['createObjectStore', 'deleteObjectStore']],
    ])
      for (const n of nomes) {
        const original = proto[n];
        proto[n] = function (...args) {
          window.__importWrites.push(n);
          return original.apply(this, args);
        };
      }
    const original = IDBDatabase.prototype.transaction;
    IDBDatabase.prototype.transaction = function (...args) {
      if (args[1] === 'readwrite') window.__importWrites.push('readwrite');
      return original.apply(this, args);
    };
  });
}
async function reterLeitura(page) {
  await page.evaluate(() => {
    const original = File.prototype.arrayBuffer;
    window.__liberarArquivo = null;
    let primeira = true;
    File.prototype.arrayBuffer = function () {
      if (!primeira) return original.call(this);
      primeira = false;
      return new Promise((resolve, reject) => {
        window.__liberarArquivo = () => original.call(this).then(resolve, reject);
      });
    };
  });
}

test('prévia com identidade HTTP real e IndexedDB ausente não escreve nem expõe questões', async ({
  page,
}) => {
  await iniciar(page);
  const observacoes = [];
  page.on('console', (m) => observacoes.push(m.text()));
  page.on('request', (r) => observacoes.push(r.postData() || ''));
  const antes = await retrato(page);
  await observar(page);
  await previa(page);
  await expect(page.locator('#lab-importacao-previa')).toContainText('Experimento sintético');
  await expect(page.locator('#lab-importacao-previa')).toContainText('Alice');
  await expect(page.locator('#lab-importacao-previa')).toContainText('ciencias');
  await expect(page.locator('#lab-importacao-previa')).toContainText('teste-importacao');
  expect(await retrato(page)).toEqual(antes);
  expect(await page.evaluate(() => window.__importWrites)).toEqual([]);
  const html = await page.content();
  for (const segredo of [
    'GABARITO_RESERVADO',
    'PERGUNTA_RESERVADA',
    'ALTERNATIVA_RESERVADA',
    'ENUNCIADO_RESERVADO',
  ]) {
    expect(html).not.toContain(segredo);
    expect(observacoes.join('')).not.toContain(segredo);
  }
  expect(await page.evaluate(() => Object.keys(window.LabImportacao))).toEqual(['abrir', 'fechar']);
  await expect(page.locator('#lab-importar-confirmar')).toBeEnabled();
});

test('cancelar revoga prévia, não cadastra e permite selecionar o mesmo arquivo', async ({
  page,
}) => {
  await iniciar(page);
  await previa(page);
  await page.locator('#lab-importar-cancelar').click();
  await expect(status(page)).toContainText('cancelada antes');
  await expect(page.locator('#lab-importar-confirmar')).toBeDisabled();
  await expect(page.locator('#lab-importacao-previa')).toBeEmpty();
  await expect(page.locator('#lab-arquivo')).toBeFocused();
  expect((await retrato(page)).dados).toBeNull();
  await previa(page);
});

test('primeira importação: conteúdo e administração atômicos, oncomplete e lista atualizada', async ({
  page,
}) => {
  await iniciar(page);
  await previa(page);
  await page.evaluate(() => {
    const abrir = window.LabRepositorio.abrirRepositorio;
    window.__cadastroConcluiu = false;
    window.__entregarCadastro = null;
    window.LabRepositorio = {
      ...window.LabRepositorio,
      async abrirRepositorio() {
        const a = await abrir();
        const cadastrar = a.repositorio.cadastrar;
        return {
          ...a,
          repositorio: {
            ...a.repositorio,
            async cadastrar(bytes) {
              const r = await cadastrar(bytes);
              window.__cadastroConcluiu = r.ok;
              return new Promise((resolve) => {
                window.__entregarCadastro = () => resolve(r);
              });
            },
          },
        };
      },
    };
  });
  await page.locator('#lab-importar-confirmar').click();
  await expect.poll(() => page.evaluate(() => window.__cadastroConcluiu)).toBe(true);
  await expect(status(page)).toContainText('Confirmando');
  const salvo = await retrato(page);
  expect(salvo.dados.pacotes).toHaveLength(1);
  expect(salvo.dados.administracao).toHaveLength(1);
  expect(salvo.dados.operacoes).toEqual([]);
  await page.evaluate(() => window.__entregarCadastro());
  await expect(status(page)).toContainText('Importação concluída');
  await expect(page.locator('#lab-lista li')).toHaveCount(1);
  await expect(page.locator('#lab-importacao-previa')).toBeEmpty();
  await expect(page.locator('#lab-arquivo')).toBeFocused();
});

test('cadastro confirmado é distinto de falha posterior ao atualizar lista', async ({ page }) => {
  await iniciar(page);
  await previa(page);
  await page.evaluate(() => {
    window.LabListagem = { ...window.LabListagem, abrir: async () => ({ ok: false }) };
  });
  await page.locator('#lab-importar-confirmar').click();
  await expect(status(page)).toContainText(
    'Cadastro confirmado, mas a atualização da lista está indisponível'
  );
  expect((await retrato(page)).dados.pacotes).toHaveLength(1);
});

test('idempotência preserva conteúdo, administração e todo progresso local', async ({ page }) => {
  await iniciar(page);
  await importar(page);
  await page.evaluate(() => localStorage.setItem('fixture-progresso-vizinho', '{"pontos":7}'));
  const antes = await retrato(page);
  await previa(page);
  await page.locator('#lab-importar-confirmar').click();
  await expect(status(page)).toContainText('já estava salva');
  expect(await retrato(page)).toEqual(antes);
});

test('digest divergente não sobrescreve e orienta uma nova versão', async ({ page }) => {
  await iniciar(page);
  await importar(page);
  const antes = await retrato(page);
  await selecionar(page, pacote('alice', 'Outra atividade'));
  await expect(status(page)).toContainText('versão nova');
  await expect(page.locator('#lab-importar-confirmar')).toBeDisabled();
  expect(await retrato(page)).toEqual(antes);
});

test('conflito criado depois da prévia é revalidado na confirmação', async ({ page }) => {
  await iniciar(page);
  await previa(page);
  await semear(page, pacote('alice', 'Concorrente'));
  const antes = await retrato(page);
  await page.locator('#lab-importar-confirmar').click();
  await expect(status(page)).toContainText('versão nova');
  expect(await retrato(page)).toEqual(antes);
});

test('perfil divergente exige nova seleção no perfil correto', async ({ page }) => {
  await iniciar(page);
  await selecionar(page, pacote('mariana'));
  await expect(status(page)).toContainText('outro perfil');
  await expect(page.locator('#lab-perfil')).toHaveText('Alice');
  expect((await retrato(page)).dados).toBeNull();
  await page.locator('#botao-inicio').click();
  await page.locator('[data-aluno="mariana"]').click();
  await page.locator('#abrir-laboratorio').click();
  await expect(page.locator('#lab-importar-confirmar')).toBeDisabled();
  await previa(page, pacote('mariana'));
});

for (const acao of ['perfil', 'arquivo', 'sair', 'cancelar'])
  test(`validação atrasada é revogada ao ${acao}`, async ({ page }) => {
    await iniciar(page);
    await reterLeitura(page);
    await selecionar(page);
    await expect.poll(() => page.evaluate(() => !!window.__liberarArquivo)).toBe(true);
    if (acao === 'arquivo') await previa(page, pacote('alice', 'Segunda seleção'));
    else if (acao === 'cancelar') await page.locator('#lab-importar-cancelar').click();
    else {
      await page.locator('#botao-inicio').click();
      if (acao === 'perfil') {
        await page.locator('[data-aluno="mariana"]').click();
        await page.locator('#abrir-laboratorio').click();
      }
    }
    await page.evaluate(() => window.__liberarArquivo());
    if (acao === 'arquivo')
      await expect(page.locator('#lab-importacao-previa')).toContainText('Segunda seleção');
    else await expect(page.locator('#lab-importacao-previa')).toBeEmpty();
    expect((await retrato(page)).dados).toBeNull();
  });

test('duplo clique confirma uma única chamada de cadastro', async ({ page }) => {
  await iniciar(page);
  await previa(page);
  await page.evaluate(() => {
    const abrir = window.LabRepositorio.abrirRepositorio;
    window.__cadastros = 0;
    window.LabRepositorio = {
      ...window.LabRepositorio,
      async abrirRepositorio() {
        const a = await abrir();
        const cadastrar = a.repositorio.cadastrar;
        return {
          ...a,
          repositorio: {
            ...a.repositorio,
            cadastrar(bytes) {
              ++window.__cadastros;
              return cadastrar(bytes);
            },
          },
        };
      },
    };
    const b = document.getElementById('lab-importar-confirmar');
    b.click();
    b.click();
  });
  await expect(status(page)).toContainText('Importação concluída');
  expect(await page.evaluate(() => window.__cadastros)).toBe(1);
});

test('arquivo grande é recusado antes de arrayBuffer e de validar', async ({ page }) => {
  await iniciar(page);
  await page.evaluate(() => {
    File.prototype.arrayBuffer = () => {
      throw new Error('Não deveria ler');
    };
  });
  await page.locator('#lab-arquivo').setInputFiles({
    name: 'grande.json',
    mimeType: 'application/json',
    buffer: Buffer.alloc(262145, 32),
  });
  await expect(status(page)).toContainText('ultrapassa 256 KiB');
  expect((await retrato(page)).dados).toBeNull();
});

for (const [caso, buffer, mensagem] of [
  ['JSON', Buffer.from('{'), 'JSON válido'],
  [
    'duplicatas',
    Buffer.from('{"formato":"lab-questionarios-v1","formato":"lab-questionarios-v1"}'),
    'repete uma propriedade',
  ],
  ['UTF8', Buffer.from([0xc3, 0x28]), 'UTF-8 válido'],
  [
    'BOM',
    Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from(JSON.stringify(pacote()))]),
    'sem BOM',
  ],
  ['propriedade', arquivo({ ...pacote(), copyId: 'forjado' }).buffer, 'contrato'],
  ['HTML', arquivo(pacote('alice', '<img src=x onerror="window.injetado=1">')).buffer, 'contrato'],
  ['backup', Buffer.from('{"formato":"lab-backup-v1","versao":1,"entradas":[]}'), 'contrato'],
  ['JavaScript', Buffer.from('window.injetado=1'), 'JSON válido'],
  ['ZIP', Buffer.from([0x50, 0x4b, 0x03, 0x04]), 'JSON válido'],
])
  test(`arquivo inválido ${caso} é recusado sem efeitos`, async ({ page }) => {
    await iniciar(page);
    await observar(page);
    await page
      .locator('#lab-arquivo')
      .setInputFiles({ name: 'entrada.json', mimeType: 'application/json', buffer });
    await expect(status(page)).toContainText(mensagem);
    await expect(page.locator('#lab-importar-confirmar')).toBeDisabled();
    await expect(page.locator('#lab-importacao-previa')).toBeEmpty();
    expect(await page.evaluate(() => window.injetado)).toBeUndefined();
    expect(await page.evaluate(() => window.__importWrites)).toEqual([]);
  });

test('falha de leitura não reutiliza prévia anterior', async ({ page }) => {
  await iniciar(page);
  await previa(page);
  await page.evaluate(() => {
    File.prototype.arrayBuffer = () => Promise.reject(new Error('Segredo não deve aparecer'));
  });
  await selecionar(page);
  await expect(status(page)).toContainText('Não foi possível ler');
  await expect(page.locator('#lab-importacao-previa')).toBeEmpty();
  await expect(page.locator('#lab-importar-confirmar')).toBeDisabled();
});

for (const fase of ['prévia', 'confirmação'])
  test(`falha de digest na ${fase} bloqueia cadastro`, async ({ page }) => {
    await iniciar(page);
    if (fase === 'confirmação') await previa(page);
    await page.evaluate(() => {
      window.crypto.subtle.digest = () => Promise.reject(new Error('Falha sintética'));
    });
    if (fase === 'confirmação') await page.locator('#lab-importar-confirmar').click();
    else await selecionar(page);
    await expect(status(page)).toContainText('assinatura');
    expect((await retrato(page)).dados).toBeNull();
  });

for (const caso of ['ausente', 'alterada'])
  test(`identidade ${caso} revoga a confirmação`, async ({ page }) => {
    await iniciar(page);
    await previa(page);
    await page.route('**/__revisoes_local__/identity', (r) =>
      caso === 'ausente'
        ? r.fulfill({ status: 503, body: '' })
        : r.fulfill({
            json: { application: 'revisoes-escolares', schema: 1, copyId: 'f'.repeat(64) },
          })
    );
    await page.locator('#lab-importar-confirmar').click();
    await expect(status(page)).toContainText(caso === 'ausente' ? 'indisponível' : 'origem mudou');
    await expect(page.locator('#lab-importacao-previa')).toBeEmpty();
    expect(await page.evaluate(() => indexedDB.databases())).toEqual([]);
  });

for (const erro of ['QuotaExceededError', 'AbortError'])
  test(`${erro}: falha no segundo add aborta conteúdo e administração`, async ({ page }) => {
    await iniciar(page);
    await previa(page);
    await page.evaluate((nome) => {
      const add = IDBObjectStore.prototype.add;
      IDBObjectStore.prototype.add = function (...args) {
        if (this.name === 'administracao') throw new DOMException('Falha sintética', nome);
        return add.apply(this, args);
      };
    }, erro);
    await page.locator('#lab-importar-confirmar').click();
    await expect(status(page)).toContainText(
      erro === 'QuotaExceededError' ? 'sem espaço' : 'não foi confirmado'
    );
    const r = await retrato(page);
    expect(r.dados.pacotes).toEqual([]);
    expect(r.dados.administracao).toEqual([]);
  });

for (const tipo of ['pendente', 'corrompido'])
  test(`journal ${tipo} surgido depois da prévia bloqueia confirmação`, async ({ page }) => {
    await iniciar(page);
    await previa(page);
    await gravarJournal(page, tipo);
    const antes = await retrato(page);
    await page.locator('#lab-importar-confirmar').click();
    await expect(status(page)).toContainText('importação está bloqueada');
    expect(await retrato(page)).toEqual(antes);
  });

test('administração corrompida não é reparada', async ({ page }) => {
  await iniciar(page);
  await importar(page);
  await page.evaluate(async () => {
    const s = await window.LabIdentidade.resolverIdentidade();
    const db = await new Promise((resolve) => {
      const r = indexedDB.open('revisoesEscolares.lab.' + s.copyId + '.v1');
      r.onsuccess = () => resolve(r.result);
    });
    try {
      await new Promise((resolve) => {
        const tx = db.transaction('administracao', 'readwrite');
        const q = tx.objectStore('administracao').openCursor();
        q.onsuccess = () => q.result.update({ ...q.result.value, situacao: 'invalida' });
        tx.oncomplete = resolve;
      });
    } finally {
      db.close();
    }
  });
  const antes = await retrato(page);
  await selecionar(page);
  await expect(status(page)).toContainText('inconsistentes');
  expect(await retrato(page)).toEqual(antes);
});

for (const caso of ['incompatível', 'bloqueado', 'IndexedDB'])
  test(`armazenamento ${caso} impede prévia importável`, async ({ page }) => {
    await iniciar(page);
    await page.evaluate(async (tipo) => {
      if (tipo === 'IndexedDB') {
        Object.defineProperty(window, 'indexedDB', { value: undefined });
        return;
      }
      if (tipo === 'bloqueado') {
        window.indexedDB.databases = () =>
          Promise.reject(new DOMException('Bloqueado', 'SecurityError'));
        return;
      }
      const s = await window.LabIdentidade.resolverIdentidade();
      await new Promise((resolve) => {
        const q = indexedDB.open('revisoesEscolares.lab.' + s.copyId + '.v1', 2);
        q.onsuccess = () => {
          q.result.close();
          resolve();
        };
      });
    }, caso);
    await selecionar(page);
    await expect(page.locator('#lab-importar-confirmar')).toBeDisabled();
    await expect(status(page)).not.toContainText('Validando');
    await expect(status(page)).not.toContainText('Prévia válida');
  });

test('sair durante confirmação revoga callbacks e não promete desfazer commit', async ({
  page,
}) => {
  await iniciar(page);
  await previa(page);
  await page.evaluate(() => {
    const abrir = window.LabRepositorio.abrirRepositorio;
    window.__liberarCadastro = null;
    window.LabRepositorio = {
      ...window.LabRepositorio,
      async abrirRepositorio() {
        const a = await abrir();
        const cadastrar = a.repositorio.cadastrar;
        return {
          ...a,
          repositorio: {
            ...a.repositorio,
            async cadastrar(b) {
              const r = await cadastrar(b);
              return new Promise((resolve) => {
                window.__liberarCadastro = () => resolve(r);
              });
            },
          },
        };
      },
    };
  });
  await page.locator('#lab-importar-confirmar').click();
  await expect.poll(() => page.evaluate(() => !!window.__liberarCadastro)).toBe(true);
  await expect(page.locator('#lab-importar-cancelar')).toBeDisabled();
  await page.locator('#lab-voltar').click();
  await page.locator('#abrir-laboratorio').click();
  await expect(status(page)).toContainText('sair não desfaz');
  await page.evaluate(() => window.__liberarCadastro());
  await expect(status(page)).toContainText('sair não desfaz');
  await expect(page.locator('#lab-lista li')).toHaveCount(1);
});

test('reabertura não duplica listeners, cadastro não executa motor e preserva catálogo/progresso', async ({
  page,
}) => {
  await iniciar(page);
  const oficial = await page.evaluate(() => ({
    registro: window.RegistroRevisoes.listar(),
    local: Object.entries(localStorage).sort(),
  }));
  for (let i = 0; i < 3; ++i) {
    await page.locator('#lab-voltar').click();
    await page.locator('#abrir-laboratorio').click();
  }
  await page.evaluate(() => {
    const validar = window.LabValidador.validarPacote;
    window.__validacoesImportacao = 0;
    window.LabValidador = {
      ...window.LabValidador,
      validarPacote(bytes) {
        ++window.__validacoesImportacao;
        return validar(bytes);
      },
    };
    window.QuestionariosRevisoes.registrarLab = () => {
      throw new Error('Não executar');
    };
    window.LabCoordenador = {
      criarSessao() {
        throw new Error('Não criar sessão');
      },
    };
  });
  await importar(page);
  expect(await page.evaluate(() => window.__validacoesImportacao)).toBe(2);
  expect(
    await page.evaluate(() => ({
      registro: window.RegistroRevisoes.listar(),
      local: Object.entries(localStorage).sort(),
    }))
  ).toEqual(oficial);
  await expect(page.locator('#tela-laboratorio')).toBeVisible();
  await expect(page.locator('#tela-gramatica-mariana')).toBeHidden();
});

for (const [width, height] of [
  [390, 844],
  [1366, 768],
  [1920, 1080],
])
  test(`prévia acessível ${width}×${height} sem overflow`, async ({ page }, info) => {
    await page.setViewportSize({ width, height });
    await iniciar(page);
    await previa(page, pacote('alice', 'Atividade ' + 'm'.repeat(105)));
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    ).toBe(true);
    await expect(status(page)).toHaveAttribute('aria-live', 'polite');
    const resultado = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(resultado.violations.filter((v) => ['serious', 'critical'].includes(v.impact))).toEqual(
      []
    );
    await page.screenshot({
      path: info.outputPath(`previa-${width}.png`),
      fullPage: true,
      animations: 'disabled',
    });
  });

test('teclado confirma e devolve foco ao seletor', async ({ page }) => {
  await iniciar(page);
  await previa(page);
  await page.keyboard.press('Tab');
  await page.locator('#lab-importar-confirmar').focus();
  expect(
    await page
      .locator('#lab-importar-confirmar')
      .evaluate((b) => window.getComputedStyle(b).outlineStyle)
  ).not.toBe('none');
  await page.keyboard.press('Enter');
  await expect(status(page)).toContainText('Importação concluída');
  await expect(page.locator('#lab-arquivo')).toBeFocused();
});

test('toque permite prévia, cancelamento e confirmação', async ({ browser, baseURL }) => {
  const ctx = await browser.newContext({
    baseURL,
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  });
  try {
    const page = await ctx.newPage();
    await iniciar(page);
    await previa(page);
    await page.locator('#lab-importar-cancelar').tap();
    await previa(page);
    await page.locator('#lab-importar-confirmar').tap();
    await expect(status(page)).toContainText('Importação concluída');
  } finally {
    await ctx.close();
  }
});

test('file:// explica indisponibilidade e mantém revisões oficiais', async ({ page }) => {
  await page.goto(pathToFileURL(path.resolve(__dirname, '../ambiente_interativo/index.html')).href);
  await page.locator('[data-aluno="alice"]').click();
  await page.locator('#abrir-laboratorio').click();
  await page.locator('#lab-importacao summary').click();
  await expect(page.locator('#lab-arquivo')).toBeDisabled();
  await expect(status(page)).toContainText('servidor local');
  await page.locator('#lab-voltar').click();
  await page.locator('[data-materia="ciencias"]').click();
  await expect(page.locator('#tela-revisao')).toBeVisible();
});

test('trocar perfil durante confirmação impede cadastro ainda não iniciado', async ({ page }) => {
  await iniciar(page);
  await previa(page);
  let liberar;
  const retida = new Promise((resolve) => {
    liberar = resolve;
  });
  let capturada = false;
  await page.route('**/__revisoes_local__/identity', async (route) => {
    const r = await route.fetch();
    if (!capturada) {
      capturada = true;
      await retida;
    }
    await route.fulfill({ response: r });
  });
  await page.locator('#lab-importar-confirmar').click();
  await expect.poll(() => capturada).toBe(true);
  await page.locator('#botao-inicio').click();
  await page.locator('[data-aluno="mariana"]').click();
  await page.locator('#abrir-laboratorio').click();
  liberar();
  await expect(page.locator('#lab-perfil')).toHaveText('Mariana');
  await expect(page.locator('#lab-importacao-previa')).toBeEmpty();
  await expect(page.locator('#lab-conteudo')).toHaveAttribute('aria-busy', 'false');
  expect((await retrato(page)).dados).toBeNull();
});

test('getter de IndexedDB bloqueado não rompe navegação escolar', async ({ page }) => {
  await page.goto('/ambiente_interativo/index.html');
  await page.evaluate(() =>
    Object.defineProperty(window, 'indexedDB', {
      get() {
        throw new DOMException('Bloqueado', 'SecurityError');
      },
    })
  );
  await page.locator('[data-aluno="alice"]').click();
  await page.locator('#abrir-laboratorio').click();
  await page.locator('#lab-importacao summary').click();
  await expect(status(page)).toContainText('IndexedDB está indisponível');
  await expect(page.locator('#lab-arquivo')).toBeDisabled();
  await page.locator('#lab-voltar').click();
  await page.locator('[data-materia="ciencias"]').click();
  await expect(page.locator('#tela-revisao')).toBeVisible();
});

test('mudança de origem invalida prévia ao confirmar', async ({ page }) => {
  await iniciar(page);
  await previa(page);
  await page.evaluate(() => {
    const resolver = window.LabIdentidade.resolverIdentidade;
    window.LabIdentidade = {
      async resolverIdentidade(esperado) {
        const r = await resolver(esperado);
        return { ...r, origem: 'http://localhost:9999' };
      },
    };
  });
  await page.locator('#lab-importar-confirmar').click();
  await expect(status(page)).toContainText('origem mudou');
  expect(await page.evaluate(() => indexedDB.databases())).toEqual([]);
});

test('inspeção de journal inconclusiva bloqueia importação', async ({ page }) => {
  await iniciar(page);
  await previa(page);
  await semear(page, { ...pacote(), id: 'vizinho' });
  const antes = await retrato(page);
  await page.evaluate(() => {
    window.LabJournal = {
      ...window.LabJournal,
      inspecionarPendenciasExistentes: async () => ({ ok: false }),
    };
  });
  await page.locator('#lab-importar-confirmar').click();
  await expect(status(page)).toContainText('Não foi possível conferir as pendências');
  expect(await retrato(page)).toEqual(antes);
});

test('abertura bloqueada após confirmação não anuncia cadastro', async ({ page }) => {
  await iniciar(page);
  await previa(page);
  await page.evaluate(() => {
    window.indexedDB.open = () => {
      const r = {};
      window.setTimeout(() => r.onblocked?.(), 0);
      return r;
    };
  });
  await page.locator('#lab-importar-confirmar').click();
  await expect(status(page)).toContainText('conexão bloqueou');
  expect(await page.evaluate(() => indexedDB.databases())).toEqual([]);
});

test('progresso oficial salvo continua restaurado após importar', async ({ page }) => {
  await iniciar(page);
  await page.locator('#lab-voltar').click();
  await page.locator('[data-materia="ciencias"]').click();
  await page.locator('#tela-revisao [data-opcao]').first().click();
  const antes = await page.evaluate(() =>
    localStorage.getItem('revisoesEscolares.alice.ciencias.origemMateriais')
  );
  await page.locator('#voltar-trilhas').click();
  await page.locator('#abrir-laboratorio').click();
  await importar(page);
  await page.locator('#lab-voltar').click();
  await page.locator('[data-materia="ciencias"]').click();
  await expect(page.locator('#tela-revisao [data-opcao]').first()).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  expect(
    await page.evaluate(() =>
      localStorage.getItem('revisoesEscolares.alice.ciencias.origemMateriais')
    )
  ).toBe(antes);
});

test('6C.2 formato desconhecido não autoriza admissão nem execução', async ({ page }) => {
  await iniciar(page);
  await importar(page);
  const antes = await retrato(page);
  const p = {
    formato: 'lab-questionarios-v3',
    id: 'ditado-futuro',
    versao: 1,
    perfil: 'alice',
    materia: 'gramatica',
    titulo: 'Ditado sintético',
    questoes: [
      {
        id: 'q1',
        bloco: 'Escrita',
        titulo: 'Escute',
        instrucao: 'Ouça e escreva.',
        tipo: 'ditado',
        idioma: 'pt-BR',
        itens: [{ id: 'i1', texto: 'café' }],
      },
    ],
  };
  const r = await page.evaluate(async (p) => {
    const entrada = JSON.stringify(p);
    const estrutura = await window.LabValidador.validarContratoDitado(entrada);
    const repo = await window.LabRepositorio.abrirRepositorioExistente();
    let cadastro;
    try {
      cadastro = await repo.repositorio.cadastrar(entrada);
    } finally {
      repo.repositorio.fechar();
    }
    const snapshot = await window.QuestionariosRevisoes.criarValidadorSnapshotLab(entrada);
    const c = window.LabCoordenador.criarSessao();
    try {
      await c.prepararExistente();
      return { estrutura, cadastro, snapshot, journal: await c.adquirirIntencao(entrada) };
    } finally {
      await c.encerrar();
    }
  }, p);
  expect(r.estrutura.valido).toBe(false);
  expect(r.cadastro.ok).toBe(false);
  expect(r.snapshot.ok).toBe(false);
  expect(r.journal.ok).toBe(false);
  await selecionar(page, p);
  await expect(page.locator('#lab-importar-confirmar')).toBeDisabled();
  await expect(page.locator('#lab-importacao-previa')).toBeEmpty();
  expect(await retrato(page)).toEqual(antes);
  await expect(page.locator('#lab-execucao-acoes')).toBeHidden();
  await expect(page.locator('[data-ouvir-ditado-gramatica]')).toHaveCount(0);
});
