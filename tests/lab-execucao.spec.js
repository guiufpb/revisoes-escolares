/* global indexedDB, navigator */
const { test, expect } = require('@playwright/test');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const AxeBuilder = require('@axe-core/playwright').default;
const pacote = (perfil = 'alice', id = 'atividade-execucao') => ({
  formato: 'lab-questionarios-v1',
  id,
  versao: 1,
  perfil,
  materia: 'ciencias',
  titulo: 'Experiência de ' + perfil,
  questoes: [
    {
      id: 'q1',
      bloco: 'Observar',
      titulo: 'A luz do dia',
      instrucao: 'Escolha.',
      tipo: 'opcoes',
      dica: 'Observe o céu.',
      itens: [
        { id: 'i1', pergunta: 'Qual ilumina o dia?', opcoes: ['Sol', 'Lua'], respostas: ['Sol'] },
      ],
    },
    {
      id: 'q2',
      bloco: 'Completar',
      titulo: 'O que bebemos',
      instrucao: 'Use o banco: água, pedra.',
      tipo: 'campos',
      dica: 'Pense quando sente sede.',
      itens: [{ id: 'i2', pergunta: 'Bebemos o quê?', respostas: ['água'] }],
    },
  ],
});
async function iniciar(page, perfil = 'alice', entradas = [pacote(perfil)]) {
  await page.goto('/ambiente_interativo/index.html');
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
  await page.evaluate(async (entradas) => {
    const a = await window.LabRepositorio.abrirRepositorio();
    try {
      for (const p of entradas) {
        const r = await a.repositorio.cadastrar(JSON.stringify(p));
        if (!r.ok) throw new Error(r.codigo);
      }
    } finally {
      a.repositorio.fechar();
    }
  }, entradas);
  await page.locator(`[data-aluno="${perfil}"]`).click();
  await page.locator('#abrir-laboratorio').click();
  await expect(page.locator('#lab-conteudo')).toHaveAttribute('aria-busy', 'false');
  await page.locator('#lab-estudo summary').click();
  await expect(page.locator('#lab-lista button')).toHaveCount(
    entradas.filter((p) => p.perfil === perfil).length
  );
}
async function abrir(page, indice = 0) {
  await page.locator('#lab-lista button').nth(indice).click();
  await expect(page.locator('#lab-execucao-acoes')).toBeVisible();
  await expect(page.locator('#tela-gramatica-mariana')).toBeVisible();
}
const status = (page) => page.locator('#lab-execucao-status');
async function salvar(page) {
  await expect(status(page)).toContainText('Respostas salvas neste navegador');
}
async function responder(page, resposta = 'Sol') {
  await page.locator(`[data-opcao-gramatica="${resposta}"]`).click();
}
async function conferir(page) {
  await page.locator('[data-conferir-gramatica]').click();
}
async function sair(page) {
  await page.locator('#lab-execucao-voltar').click();
  await expect(page.locator('#tela-laboratorio')).toBeVisible();
  await expect(page.locator('#lab-conteudo')).toHaveAttribute('aria-busy', 'false');
}

for (const perfil of ['alice', 'mariana'])
  test(`abre atividade importada de ${perfil} sem cadastrar revisão oficial`, async ({ page }) => {
    await iniciar(page, perfil);
    const registro = await page.evaluate(() => window.RegistroRevisoes.listar());
    await abrir(page);
    await expect(page.locator('#lab-execucao-titulo')).toHaveText('Experiência de ' + perfil);
    await expect(page.locator('#gramatica-nome-perfil')).toHaveText(
      perfil === 'alice' ? 'Alice' : 'Mariana'
    );
    expect(await page.evaluate(() => window.RegistroRevisoes.listar())).toEqual(registro);
    await expect(page.locator('#limpar-progresso')).toBeHidden();
    await sair(page);
  });

test('errar conferir corrigir avançar voltar e retomar preserva pontuação única', async ({
  page,
}) => {
  await iniciar(page);
  await abrir(page);
  await responder(page, 'Lua');
  await conferir(page);
  await salvar(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await responder(page);
  await conferir(page);
  await salvar(page);
  await expect(page.locator('#gramatica-pontos')).toContainText('1 de 2');
  await page.locator('#gramatica-proxima').click();
  await page.locator('[data-resposta-gramatica]').fill('pedra');
  await conferir(page);
  await salvar(page);
  await page.locator('[data-resposta-gramatica]').fill('água');
  await conferir(page);
  await salvar(page);
  await expect(page.locator('#gramatica-pontos')).toContainText('2 de 2');
  await page.locator('#gramatica-voltar').click();
  await salvar(page);
  await expect(page.locator('[data-opcao-gramatica="Sol"]')).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  await sair(page);
  await expect(page.locator('#lab-lista button')).toHaveText('Continuar atividade');
  await abrir(page);
  await expect(page.locator('#gramatica-pontos')).toContainText('2 de 2');
  await page.locator('#gramatica-proxima').click();
  await page.locator('#gramatica-proxima').click();
  await salvar(page);
  await expect(page.getByRole('heading', { name: /Parabéns/ })).toBeVisible();
  await page.locator('[data-ir-inicio]').click();
  await expect(page.locator('#tela-laboratorio')).toBeVisible();
});

test('falha de quota bloqueia saída sem descartar respostas e permite retentativa explícita', async ({
  page,
}) => {
  await iniciar(page);
  await abrir(page);
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    window.__quotaLab = true;
    window.__tentativasQuota = 0;
    Storage.prototype.setItem = function (k, v) {
      if (k.startsWith('revisoesEscolares.lab.')) ++window.__tentativasQuota;
      if (window.__quotaLab && k.startsWith('revisoesEscolares.lab.'))
        throw new DOMException('Quota sintética', 'QuotaExceededError');
      return original.call(this, k, v);
    };
  });
  await responder(page);
  await expect(status(page)).toContainText('Não foi possível salvar');
  await page.locator('#lab-execucao-voltar').click();
  await expect(status(page)).toContainText('saída foi bloqueada');
  expect(await page.evaluate(() => window.__tentativasQuota)).toBe(1);
  await expect(page.locator('#tela-gramatica-mariana')).toBeVisible();
  await expect(page.locator('[data-opcao-gramatica="Sol"]')).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  await page.evaluate(() => {
    window.__quotaLab = false;
  });
  await page.locator('#lab-execucao-persistir').click();
  await salvar(page);
  expect(await page.evaluate(() => window.__tentativasQuota)).toBe(2);
  await sair(page);
});

async function chave(page, p = pacote()) {
  return page.evaluate(async (p) => {
    const s = window.LabCoordenador.criarSessao();
    try {
      const a = await s.prepararExistente();
      if (!a.ok) throw new Error(a.codigo);
      const b = await s.adquirir({ perfil: p.perfil, id: p.id, versao: p.versao });
      if (!b.ok) throw new Error(b.codigo);
      return s.abrirProgresso('principal').canal.chave;
    } finally {
      await s.liberar();
      await s.encerrar();
    }
  }, p);
}
async function alterar(page, store, tipo) {
  await page.evaluate(
    async ({ store, tipo, p }) => {
      const i = await window.LabIdentidade.resolverIdentidade();
      const v = await window.LabValidador.validarPacote(JSON.stringify(p));
      const db = await new Promise((resolve, reject) => {
        const q = indexedDB.open('revisoesEscolares.lab.' + i.copyId + '.v1');
        q.onsuccess = () => resolve(q.result);
        q.onerror = () => reject(q.error);
      });
      try {
        await new Promise((resolve, reject) => {
          const tx = db.transaction(store, 'readwrite'),
            s = tx.objectStore(store);
          if (store === 'operacoes') {
            const r = {
              formato: 'lab-journal-v1',
              versao: 1,
              id: window.crypto.randomUUID(),
              destino: { copyId: i.copyId, origem: i.origem },
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
            if (tipo === 'corrompido') delete r.marcadores;
            s.add(r);
          } else {
            const q = s.openCursor();
            q.onsuccess = () => {
              const r = q.result;
              r.update({
                ...r.value,
                ...(store === 'administracao' ? { situacao: tipo } : { conteudo: '{' }),
              });
            };
          }
          tx.oncomplete = resolve;
          tx.onabort = () => reject(tx.error);
        });
      } finally {
        db.close();
      }
    },
    { store, tipo, p: pacote() }
  );
}
async function reterGravacao(page) {
  await page.evaluate(() => {
    const conectar = window.LabCoordenador.conectarMotor;
    window.__labSoltarGravacao = null;
    window.LabCoordenador = {
      ...window.LabCoordenador,
      async conectarMotor(...args) {
        const c = await conectar(...args);
        if (!c.ok) return c;
        const salvar = c.canal.salvar;
        let primeira = true;
        return {
          ...c,
          canal: {
            ...c.canal,
            async salvar(estado) {
              const r = await salvar(estado);
              if (!primeira) return r;
              primeira = false;
              return new Promise((resolve) => {
                window.__labSoltarGravacao = () => resolve(r);
              });
            },
          },
        };
      },
    };
  });
}
async function travas(page) {
  return page.evaluate(
    async () =>
      (await navigator.locks.query()).held.filter((l) =>
        l.name.startsWith('revisoesEscolares.lab.sessao.')
      ).length
  );
}
async function reabrirLista(page) {
  await page.evaluate(() => window.LabListagem.abrir('alice'));
}

for (const tipo of ['arquivada', 'descartada', 'invalida'])
  test(`administração ${tipo} impede abrir`, async ({ page }) => {
    await iniciar(page);
    await alterar(page, 'administracao', tipo);
    await reabrirLista(page);
    await expect(page.locator('#lab-status')).toContainText('dados locais inválidos');
    await expect(page.locator('#lab-execucao-acoes')).toBeHidden();
    expect(await travas(page)).toBe(0);
  });
for (const tipo of ['pendente', 'corrompido'])
  test(`journal ${tipo} bloqueia botão e tentativa direta`, async ({ page }) => {
    await iniciar(page);
    await alterar(page, 'operacoes', tipo);
    await reabrirLista(page);
    await expect(page.locator('#lab-lista button')).toBeDisabled();
    await expect(page.locator('#lab-aviso')).toContainText('bloqueadas');
    await page.evaluate(async () => {
      const i = await window.LabIdentidade.resolverIdentidade();
      const a = await window.LabRepositorio.abrirRepositorioExistente();
      const p = await a.repositorio.consultar({
        perfil: 'alice',
        id: 'atividade-execucao',
        versao: 1,
      });
      a.repositorio.fechar();
      await window.LabExecucao.abrir(
        { perfil: 'alice', id: 'atividade-execucao', versao: 1 },
        { ...i, digest: p.digest }
      );
    });
    await expect(page.locator('#lab-status')).toContainText('Não foi possível abrir');
    expect(await travas(page)).toBe(0);
  });
test('pacote corrompido não abre nem é reparado', async ({ page }) => {
  await iniciar(page);
  await alterar(page, 'pacotes', 'corrompido');
  await reabrirLista(page);
  await expect(page.locator('#lab-status')).toContainText('dados locais inválidos');
  expect(await travas(page)).toBe(0);
});
test('parâmetro forjado não permite pacote de outro perfil', async ({ page }) => {
  await iniciar(page, 'alice', [pacote('alice'), pacote('mariana')]);
  await page.evaluate(async () => {
    const i = await window.LabIdentidade.resolverIdentidade();
    await window.LabExecucao.abrir(
      { perfil: 'mariana', id: 'atividade-execucao', versao: 1 },
      { ...i, digest: 'a'.repeat(64) }
    );
  });
  await expect(page.locator('#lab-status')).toContainText('outro perfil');
  await expect(page.locator('#tela-laboratorio')).toBeVisible();
  expect(await travas(page)).toBe(0);
});
test('digest observado na lista não autoriza conteúdo alterado depois dela', async ({ page }) => {
  await iniciar(page);
  await page.evaluate(async (p) => {
    const i = await window.LabIdentidade.resolverIdentidade();
    const v = await window.LabValidador.validarPacote(JSON.stringify({ ...p, titulo: 'Mudou' }));
    const db = await new Promise((resolve) => {
      const q = indexedDB.open('revisoesEscolares.lab.' + i.copyId + '.v1');
      q.onsuccess = () => resolve(q.result);
    });
    await new Promise((resolve) => {
      const tx = db.transaction(['pacotes', 'administracao'], 'readwrite');
      for (const nome of ['pacotes', 'administracao']) {
        const q = tx.objectStore(nome).openCursor();
        q.onsuccess = () => {
          const c = q.result;
          c.update({
            ...c.value,
            digest: v.digest,
            ...(nome === 'pacotes' ? { conteudo: v.canonico } : {}),
          });
        };
      }
      tx.oncomplete = resolve;
    });
    db.close();
  }, pacote());
  await page.locator('#lab-lista button').click();
  await expect(page.locator('#lab-status')).toContainText('Não foi possível abrir');
  expect(await travas(page)).toBe(0);
});
test('segunda aba é bloqueada pelo Web Lock real e abre após liberação nativa', async ({
  page,
  context,
}) => {
  await iniciar(page);
  await abrir(page);
  expect(await travas(page)).toBe(1);
  const outra = await context.newPage();
  await iniciar(outra);
  await outra.locator('#lab-lista button').click();
  await expect(outra.locator('#lab-status')).toContainText('outra aba');
  await sair(page);
  expect(await travas(page)).toBe(0);
  await abrir(outra);
  expect(await travas(outra)).toBe(1);
  await sair(outra);
});
test('alternativa reversível e edição posterior mantêm ponto histórico sem liberar avanço', async ({
  page,
}) => {
  await iniciar(page);
  await abrir(page);
  await responder(page);
  await conferir(page);
  await salvar(page);
  await responder(page, 'Lua');
  await salvar(page);
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
  await expect(page.locator('#gramatica-pontos')).toContainText('1 de 2');
  await responder(page);
  await conferir(page);
  await salvar(page);
  await expect(page.locator('#gramatica-pontos')).toContainText('1 de 2');
});
test('recarregar e abrir novamente recupera posição, campo e conferências', async ({ page }) => {
  await iniciar(page);
  await abrir(page);
  await responder(page);
  await conferir(page);
  await salvar(page);
  await page.locator('#gramatica-proxima').click();
  await page.locator('[data-resposta-gramatica]').fill('pedra');
  await conferir(page);
  await salvar(page);
  await page.reload();
  await expect(page.locator('#tela-inicial')).toBeVisible();
  await page.locator('[data-aluno="alice"]').click();
  await page.locator('#abrir-laboratorio').click();
  await page.locator('#lab-estudo summary').click();
  await expect(page.locator('#lab-lista button')).toHaveText('Continuar atividade');
  await abrir(page);
  await expect(page.locator('[data-resposta-gramatica]')).toHaveValue('pedra');
  await expect(page.locator('#gramatica-pontos')).toContainText('1 de 2');
});
test('duas atividades independentes não reutilizam memória ou progresso', async ({ page }) => {
  await iniciar(page, 'alice', [pacote('alice', 'a-primeira'), pacote('alice', 'b-segunda')]);
  await abrir(page, 0);
  await responder(page);
  await conferir(page);
  await salvar(page);
  await sair(page);
  await abrir(page, 1);
  await expect(page.locator('#gramatica-pontos')).toContainText('0 de 2');
  await expect(page.locator('[data-opcao-gramatica="Sol"]')).toHaveAttribute(
    'aria-pressed',
    'false'
  );
  await sair(page);
  await abrir(page, 0);
  await expect(page.locator('#gramatica-pontos')).toContainText('1 de 2');
});
test('Alice e Mariana mantêm progressos próprios', async ({ page }) => {
  await iniciar(page, 'alice', [pacote(), pacote('mariana')]);
  await abrir(page);
  await responder(page);
  await conferir(page);
  await salvar(page);
  await page.locator('#botao-inicio').click();
  await expect(page.locator('#tela-inicial')).toBeVisible();
  await page.locator('[data-aluno="mariana"]').click();
  await page.locator('#abrir-laboratorio').click();
  await abrir(page);
  await expect(page.locator('#gramatica-pontos')).toContainText('0 de 2');
  await expect(page.locator('#gramatica-nome-perfil')).toHaveText('Mariana');
});
for (const tipo of ['storage', 'conflito', 'identidade', 'lock'])
  test(`falha ${tipo} preserva respostas em memória e bloqueia saída`, async ({ page }) => {
    await iniciar(page);
    await abrir(page);
    await responder(page);
    await salvar(page);
    if (tipo === 'identidade')
      await page.route('**/__revisoes_local__/identity', (r) =>
        r.fulfill({ status: 503, body: '' })
      );
    else
      await page.evaluate((tipo) => {
        if (tipo === 'storage') {
          const set = Storage.prototype.setItem;
          Storage.prototype.setItem = function (k, v) {
            if (k.startsWith('revisoesEscolares.lab.'))
              throw new DOMException('Bloqueado', 'SecurityError');
            return set.call(this, k, v);
          };
        }
        if (tipo === 'conflito')
          for (const k of Object.keys(localStorage))
            if (k.startsWith('revisoesEscolares.lab.')) localStorage.setItem(k, '{}');
        if (tipo === 'lock') navigator.locks.query = async () => ({ held: [], pending: [] });
      }, tipo);
    await responder(page, 'Lua');
    await expect(status(page)).toContainText(
      tipo === 'conflito' ? 'conflito' : 'Não foi possível salvar'
    );
    if (tipo === 'identidade' || tipo === 'lock')
      await expect(status(page)).toContainText('Atividade suspensa');
    await page.locator('#lab-execucao-voltar').click();
    await expect(status(page)).toContainText('saída foi bloqueada');
    await expect(page.locator('[data-opcao-gramatica="Lua"]')).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await expect(page.locator('#tela-gramatica-mariana')).toBeVisible();
  });
test('saída aguarda gravação pendente e snapshot coalescido mantendo o lock', async ({
  page,
  context,
}) => {
  await iniciar(page);
  await reterGravacao(page);
  await abrir(page);
  await responder(page);
  await expect.poll(() => page.evaluate(() => !!window.__labSoltarGravacao)).toBe(true);
  await responder(page, 'Lua');
  await page.locator('#lab-execucao-voltar').click();
  await expect(status(page)).toContainText('Aguardando');
  expect(await travas(page)).toBe(1);
  await expect(page.locator('#gramatica-conteudo')).toHaveAttribute('inert', '');
  const outra = await context.newPage();
  await iniciar(outra);
  await outra.locator('#lab-lista button').click();
  await expect(outra.locator('#lab-status')).toContainText('outra aba');
  await page.evaluate(() => window.__labSoltarGravacao());
  await expect(page.locator('#tela-laboratorio')).toBeVisible();
  expect(await travas(page)).toBe(0);
  await abrir(outra);
  await expect(outra.locator('[data-opcao-gramatica="Lua"]')).toHaveAttribute(
    'aria-pressed',
    'true'
  );
});
for (const destino of ['inicio', 'materias', 'perfil', 'oficial', 'outra-lab', 'lista'])
  test(`navegação ${destino} aguarda saída segura`, async ({ page }) => {
    await iniciar(page, 'alice', [pacote(), pacote('alice', 'vizinha')]);
    await reterGravacao(page);
    await abrir(page);
    await responder(page);
    await expect.poll(() => page.evaluate(() => !!window.__labSoltarGravacao)).toBe(true);
    if (destino === 'inicio') await page.locator('#botao-inicio').click();
    else if (destino === 'materias')
      await page.locator('#tela-gramatica-mariana [data-voltar-materias]').click();
    else if (destino === 'perfil')
      await page.evaluate(() => document.querySelector('[data-aluno="mariana"]').click());
    else if (destino === 'oficial')
      await page.evaluate(() =>
        window.QuestionariosRevisoes.abrir('alice-gramatica-pontuacao-interpretacao-outubro-2026')
      );
    else if (destino === 'lista') await page.locator('#lab-execucao-voltar').click();
    else
      await page.evaluate(async () => {
        const i = await window.LabIdentidade.resolverIdentidade();
        const r = await window.LabRepositorio.abrirRepositorioExistente();
        const p = await r.repositorio.consultar({ perfil: 'alice', id: 'vizinha', versao: 1 });
        r.repositorio.fechar();
        void window.LabExecucao.abrir(
          { perfil: 'alice', id: 'vizinha', versao: 1 },
          { ...i, digest: p.digest }
        );
      });
    await expect(status(page)).toContainText('Aguardando');
    expect(await travas(page)).toBe(1);
    await page.evaluate(() => window.__labSoltarGravacao());
    if (destino === 'inicio') await expect(page.locator('#tela-inicial')).toBeVisible();
    if (destino === 'materias' || destino === 'perfil')
      await expect(page.locator('#tela-trilhas')).toBeVisible();
    if (destino === 'perfil')
      await expect(page.locator('#saudacao-aluno')).toContainText('Mariana');
    if (destino === 'lista') await expect(page.locator('#tela-laboratorio')).toBeVisible();
    if (destino === 'oficial') await expect(page.locator('#lab-execucao-acoes')).toBeHidden();
    if (destino === 'outra-lab') {
      await expect(status(page)).toContainText('Atividade pronta');
      await expect(page.locator('[data-opcao-gramatica="Sol"]')).toHaveAttribute(
        'aria-pressed',
        'false'
      );
    }
  });
for (const destino of ['inicio', 'perfil'])
  test(`abertura atrasada cancelada por ${destino} não preenche tela posterior`, async ({
    page,
  }) => {
    await iniciar(page);
    await page.evaluate(() => {
      const resolver = window.LabIdentidade.resolverIdentidade;
      let primeira = true;
      window.__labLiberarAbertura = null;
      window.__labAberturaTerminou = false;
      window.LabIdentidade = {
        async resolverIdentidade(...a) {
          const r = await resolver(...a);
          if (!primeira) return r;
          primeira = false;
          return new Promise((resolve) => {
            window.__labLiberarAbertura = () => resolve(r);
          });
        },
      };
      const abrir = window.LabExecucao.abrir;
      window.LabExecucao = {
        ...window.LabExecucao,
        async abrir(...a) {
          try {
            return await abrir(...a);
          } finally {
            window.__labAberturaTerminou = true;
          }
        },
      };
    });
    await page.locator('#lab-lista button').click();
    await expect.poll(() => page.evaluate(() => !!window.__labLiberarAbertura)).toBe(true);
    if (destino === 'inicio') await page.locator('#botao-inicio').click();
    else await page.evaluate(() => document.querySelector('[data-aluno="mariana"]').click());
    await page.evaluate(() => window.__labLiberarAbertura());
    await expect.poll(() => page.evaluate(() => window.__labAberturaTerminou)).toBe(true);
    await expect(
      page.locator(destino === 'inicio' ? '#tela-inicial' : '#tela-trilhas')
    ).toBeVisible();
    await expect(page.locator('#lab-execucao-acoes')).toBeHidden();
    expect(await travas(page)).toBe(0);
  });
test('dois cliques em iniciar ou sair não multiplicam handles e listeners', async ({ page }) => {
  await iniciar(page);
  await page.evaluate(() => {
    const registrar = window.QuestionariosRevisoes.registrarLab;
    window.__labRegistros = 0;
    window.QuestionariosRevisoes.registrarLab = (...a) => {
      ++window.__labRegistros;
      return registrar(...a);
    };
    const b = document.querySelector('#lab-lista button');
    b.click();
    b.click();
  });
  await expect(page.locator('#lab-execucao-acoes')).toBeVisible();
  expect(await page.evaluate(() => window.__labRegistros)).toBe(1);
  await responder(page);
  await salvar(page);
  await page.evaluate(() => {
    const b = document.getElementById('lab-execucao-voltar');
    b.click();
    b.click();
  });
  await expect(page.locator('#tela-laboratorio')).toBeVisible();
  expect(await travas(page)).toBe(0);
  await abrir(page);
  await conferir(page);
  await salvar(page);
  await expect(page.locator('#gramatica-pontos')).toContainText('1 de 2');
});
test('evento antigo não muda outra revisão após liberação', async ({ page }) => {
  await iniciar(page, 'alice', [pacote(), pacote('alice', 'vizinha')]);
  await abrir(page);
  await page.evaluate(() => {
    window.__labEventoAntigo = document.querySelector('[data-opcao-gramatica="Sol"]');
  });
  await sair(page);
  await abrir(page, 1);
  await page.evaluate(() => window.__labEventoAntigo.click());
  await expect(page.locator('[data-opcao-gramatica="Sol"]')).toHaveAttribute(
    'aria-pressed',
    'false'
  );
  await expect(page.locator('#gramatica-pontos')).toContainText('0 de 2');
});
test('beforeunload cancela saída nativa quando há alterações não duráveis', async ({ page }) => {
  await iniciar(page);
  await abrir(page);
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('Quota', 'QuotaExceededError');
    };
  });
  await responder(page);
  await expect(status(page)).toContainText('Não foi possível salvar');
  expect(
    await page.evaluate(() => {
      const e = new window.Event('beforeunload', { cancelable: true });
      window.dispatchEvent(e);
      return e.defaultPrevented;
    })
  ).toBe(true);
});
test('progresso oficial fica byte a byte preservado e revisão antiga segue funcionando', async ({
  page,
}) => {
  await iniciar(page);
  await page.locator('#lab-voltar').click();
  await page.locator('[data-materia="ciencias"]').click();
  await page.locator('#tela-revisao [data-opcao]').first().click();
  const antes = await page.evaluate(() => Object.entries(localStorage).sort());
  await page.locator('#voltar-trilhas').click();
  await page.locator('#abrir-laboratorio').click();
  await abrir(page);
  await responder(page);
  await conferir(page);
  await salvar(page);
  await sair(page);
  const depois = await page.evaluate(() =>
    Object.entries(localStorage)
      .filter(([k]) => !k.startsWith('revisoesEscolares.lab.'))
      .sort()
  );
  expect(depois).toEqual(antes);
  await page.locator('#lab-voltar').click();
  await page.locator('[data-materia="ciencias"]').click();
  await expect(page.locator('#tela-revisao [data-opcao]').first()).toHaveAttribute(
    'aria-pressed',
    'true'
  );
});
test('execução não chama cadastro nem escreve em IndexedDB, administração ou journal', async ({
  page,
}) => {
  await iniciar(page);
  await page.evaluate(() => {
    window.__labIdbEscritas = 0;
    const tx = window.IDBDatabase.prototype.transaction;
    window.IDBDatabase.prototype.transaction = function (...a) {
      if (a[1] === 'readwrite') ++window.__labIdbEscritas;
      return tx.apply(this, a);
    };
    window.LabRepositorio = {
      ...window.LabRepositorio,
      abrirRepositorio() {
        throw new Error('Não cadastrar');
      },
    };
  });
  await abrir(page);
  await responder(page);
  await conferir(page);
  await salvar(page);
  await responsavel(page);
  await responder(page);
  await conferir(page);
  await salvar(page);
  await crianca(page);
  await sair(page);
  expect(await page.evaluate(() => window.__labIdbEscritas)).toBe(0);
});
for (const valor of ['{', '{}', '{"questaoAtual":500,"pontos":999}'])
  test(`progresso inválido ${valor.length} é bloqueado sem reparação`, async ({ page }) => {
    await iniciar(page);
    const k = await chave(page);
    await page.evaluate(({ k, valor }) => localStorage.setItem(k, valor), { k, valor });
    await reabrirLista(page);
    await page.locator('#lab-lista button').click();
    await expect(page.locator('#lab-status')).toContainText(
      'progresso salvo não pôde ser validado'
    );
    expect(await page.evaluate((k) => localStorage.getItem(k), k)).toBe(valor);
    expect(await travas(page)).toBe(0);
  });
test('gabarito não aparece como correção antecipada e campo começa vazio', async ({ page }) => {
  await iniciar(page);
  await abrir(page);
  await expect(page.locator('#gramatica-conteudo .correta')).toHaveCount(0);
  await expect(page.locator('#gramatica-pontos')).toContainText('0 de 2');
  await responder(page);
  await conferir(page);
  await salvar(page);
  await page.locator('#gramatica-proxima').click();
  await expect(page.locator('[data-resposta-gramatica]')).toHaveValue('');
  await expect(page.locator('#gramatica-conteudo')).not.toContainText('respostas');
});
for (const [width, height] of [
  [390, 844],
  [1366, 768],
  [1920, 1080],
])
  test(`execução acessível em ${width}×${height}`, async ({ page }, info) => {
    await page.setViewportSize({ width, height });
    await iniciar(page);
    await abrir(page);
    await responder(page);
    await salvar(page);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    ).toBe(true);
    await expect(status(page)).toHaveAttribute('aria-live', 'polite');
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(r.violations.filter((v) => ['serious', 'critical'].includes(v.impact))).toEqual([]);
    await page.screenshot({
      path: info.outputPath(`execucao-${width}.png`),
      fullPage: true,
      animations: 'disabled',
    });
  });
test('teclado confere, sai e restaura foco na atividade selecionada', async ({ page }) => {
  await iniciar(page);
  await page.locator('#lab-lista button').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#lab-execucao-acoes')).toBeVisible();
  await page.locator('[data-opcao-gramatica="Sol"]').focus();
  await page.keyboard.press('Enter');
  await page.locator('[data-conferir-gramatica]').focus();
  await page.keyboard.press('Enter');
  await salvar(page);
  await page.locator('#lab-execucao-voltar').focus();
  expect(
    await page
      .locator('#lab-execucao-voltar')
      .evaluate((e) => window.getComputedStyle(e).outlineStyle)
  ).not.toBe('none');
  await page.keyboard.press('Enter');
  await expect(page.locator('#lab-lista button')).toBeFocused();
});
test('toque responde e volta ao Laboratório', async ({ browser, baseURL }) => {
  const ctx = await browser.newContext({
    baseURL,
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  });
  try {
    const page = await ctx.newPage();
    await iniciar(page);
    await page.locator('#lab-lista button').tap();
    await expect(page.locator('#lab-execucao-acoes')).toBeVisible();
    await page.locator('[data-opcao-gramatica="Sol"]').tap();
    await page.locator('[data-conferir-gramatica]').tap();
    await salvar(page);
    await page.locator('#lab-execucao-voltar').tap();
    await expect(page.locator('#tela-laboratorio')).toBeVisible();
  } finally {
    await ctx.close();
  }
});
test('file:// mantém aplicativo escolar e não oferece execução persistente LAB', async ({
  page,
}) => {
  await page.goto(pathToFileURL(path.resolve(__dirname, '../ambiente_interativo/index.html')).href);
  await page.locator('[data-aluno="alice"]').click();
  await page.locator('#abrir-laboratorio').click();
  await expect(page.locator('#lab-status')).toContainText('servidor deste computador');
  await page.locator('#lab-voltar').click();
  await page.locator('[data-materia="ciencias"]').click();
  await expect(page.locator('#tela-revisao')).toBeVisible();
});

test('Web Locks indisponível não abre modo temporário nem atividade', async ({ page }) => {
  await iniciar(page);
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'locks', { value: undefined, configurable: true })
  );
  await page.locator('#lab-lista button').click();
  await expect(page.locator('#lab-status')).toContainText('Não foi possível abrir');
  await expect(page.locator('#tela-laboratorio')).toBeVisible();
  await expect(page.locator('#lab-execucao-acoes')).toBeHidden();
});

test('mudança de copyId após listagem bloqueia execução', async ({ page }) => {
  await iniciar(page);
  await page.route('**/__revisoes_local__/identity', (r) =>
    r.fulfill({ json: { application: 'revisoes-escolares', schema: 1, copyId: 'e'.repeat(64) } })
  );
  await page.locator('#lab-lista button').click();
  await expect(page.locator('#lab-status')).toContainText('Não foi possível abrir');
  expect(await travas(page)).toBe(0);
});

test('aviso nativo de recarga permite permanecer com a memória não durável', async ({ page }) => {
  await iniciar(page);
  await abrir(page);
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('Quota', 'QuotaExceededError');
    };
  });
  await responder(page);
  await expect(status(page)).toContainText('Não foi possível salvar');
  const dialogo = page.waitForEvent('dialog');
  await page.evaluate(() => {
    window.setTimeout(() => window.location.reload(), 0);
  });
  const aviso = await dialogo;
  expect(aviso.type()).toBe('beforeunload');
  await aviso.dismiss();
  await expect(page.locator('[data-opcao-gramatica="Sol"]')).toHaveAttribute(
    'aria-pressed',
    'true'
  );
});

test('pacote alterado entre aquisição e conexão não troca identidade da execução', async ({
  page,
}) => {
  await iniciar(page);
  await page.evaluate((p) => {
    const conectar = window.LabCoordenador.conectarMotor;
    window.LabCoordenador = {
      ...window.LabCoordenador,
      async conectarMotor(...args) {
        const i = await window.LabIdentidade.resolverIdentidade();
        const v = await window.LabValidador.validarPacote(
          JSON.stringify({ ...p, materia: 'historia' })
        );
        const db = await new Promise((resolve) => {
          const q = indexedDB.open('revisoesEscolares.lab.' + i.copyId + '.v1');
          q.onsuccess = () => resolve(q.result);
        });
        await new Promise((resolve) => {
          const tx = db.transaction(['pacotes', 'administracao'], 'readwrite');
          for (const nome of ['pacotes', 'administracao']) {
            const q = tx.objectStore(nome).openCursor();
            q.onsuccess = () => {
              const c = q.result;
              c.update({
                ...c.value,
                materia: 'historia',
                digest: v.digest,
                ...(nome === 'pacotes' ? { conteudo: v.canonico } : {}),
              });
            };
          }
          tx.oncomplete = resolve;
        });
        db.close();
        return conectar(...args);
      },
    };
  }, pacote());
  await page.locator('#lab-lista button').click();
  await expect(page.locator('#lab-status')).toContainText('Não foi possível abrir');
  await expect(page.locator('#lab-execucao-acoes')).toBeHidden();
  expect(await travas(page)).toBe(0);
});

// LAB.2D.4: mesma atividade/aquisição, duas sessões privadas.
async function responsavel(page) {
  await page.locator('#lab-execucao-sessao').click();
  await expect(page.locator('#lab-execucao-confirmacao')).toBeVisible();
  await page.locator('#lab-execucao-confirmar').click();
  await expect(page.locator('#lab-execucao-identificacao')).toContainText('Sessão do Responsável');
  await expect(page.locator('#lab-execucao-sessao')).toBeEnabled();
}
async function crianca(page) {
  await page.locator('#lab-execucao-sessao').click();
  await expect(page.locator('#lab-execucao-identificacao')).toHaveText('Sessão da criança');
  await expect(page.locator('#lab-execucao-sessao')).toBeEnabled();
}
async function rawLab(page) {
  return page.evaluate(() =>
    Object.fromEntries(
      Object.keys(localStorage)
        .filter((k) => k.startsWith('revisoesEscolares.lab.v1.'))
        .map((k) => [k, localStorage.getItem(k)])
    )
  );
}
for (const perfil of ['alice', 'mariana'])
  test(`LAB.2D.4 ${perfil}: confirmação cancelável e abertura sem escrita vazia`, async ({
    page,
  }) => {
    await iniciar(page, perfil);
    await abrir(page);
    await page.locator('#lab-execucao-sessao').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#lab-execucao-cancelar')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.locator('#lab-execucao-sessao')).toBeFocused();
    expect(await rawLab(page)).toEqual({});
    await responsavel(page);
    expect(await rawLab(page)).toEqual({});
    await crianca(page);
    expect(await rawLab(page)).toEqual({});
    expect(await travas(page)).toBe(1);
    await sair(page);
    expect(await travas(page)).toBe(0);
    await expect(page.locator('#lab-lista button')).toHaveText('Iniciar atividade');
  });
for (const perfil of ['alice', 'mariana'])
  test(`LAB.2D.4 ${perfil}: ciclos, pontos, posição, conclusão e recarga independentes`, async ({
    page,
  }) => {
    await iniciar(page, perfil);
    await abrir(page);
    await responder(page, 'Lua');
    await conferir(page);
    await responder(page, 'Sol');
    await conferir(page);
    await page.locator('#gramatica-proxima').click();
    await salvar(page);
    const principal = await rawLab(page);
    await responsavel(page);
    await expect(page.locator('[data-opcao-gramatica="Sol"]')).toHaveAttribute(
      'aria-pressed',
      'false'
    );
    await responder(page, 'Lua');
    await conferir(page);
    await responder(page, 'Sol');
    await conferir(page);
    await responder(page, 'Lua');
    await conferir(page);
    await responder(page, 'Sol');
    await conferir(page);
    await page.locator('#gramatica-proxima').click();
    await page.locator('[data-resposta-gramatica]').fill('água');
    await conferir(page);
    await page.locator('#gramatica-proxima').click();
    await expect(page.locator('[data-ir-inicio]')).toBeVisible();
    await salvar(page);
    const ambos = await rawLab(page);
    expect(Object.keys(ambos)).toHaveLength(2);
    for (const [k, v] of Object.entries(principal)) expect(ambos[k]).toBe(v);
    const aux = JSON.parse(Object.entries(ambos).find(([k]) => k.endsWith('.responsavel'))[1]);
    expect(aux.pontos).toBe(2);
    expect(aux.finalizada).toBe(true);
    await crianca(page);
    await expect(page.locator('[data-resposta-gramatica]')).toHaveValue('');
    await page.locator('#gramatica-voltar').click();
    await expect(page.locator('[data-opcao-gramatica="Sol"]')).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await salvar(page);
    await page.reload();
    await page.locator(`[data-aluno="${perfil}"]`).click();
    await page.locator('#abrir-laboratorio').click();
    await expect(page.locator('#lab-conteudo')).toHaveAttribute('aria-busy', 'false');
    await page.locator('#lab-estudo summary').click();
    await abrir(page);
    await expect(page.locator('#lab-execucao-identificacao')).toHaveText('Sessão da criança');
    await responsavel(page);
    await expect(page.locator('[data-ir-inicio]')).toBeVisible();
  });
for (const falha of ['quota', 'storage', 'conflito'])
  for (const auxiliar of [false, true])
    test(`LAB.2D.4 ${falha} na ${auxiliar ? 'responsavel' : 'principal'} bloqueia troca e preserva memória`, async ({
      page,
    }) => {
      await iniciar(page);
      await abrir(page);
      if (auxiliar) await responsavel(page);
      await responder(page);
      await salvar(page);
      await page.evaluate((falha) => {
        window.__setLab = Storage.prototype.setItem;
        window.__getLab = Storage.prototype.getItem;
        window.__falhaLab = true;
        if (falha === 'conflito') {
          const k = Object.keys(localStorage).find((k) =>
            k.endsWith(
              document
                .getElementById('lab-execucao-identificacao')
                .textContent.includes('Responsável')
                ? '.responsavel'
                : '.principal'
            )
          );
          localStorage.setItem(k, '{}');
        } else if (falha === 'quota')
          Storage.prototype.setItem = function (k, v) {
            if (window.__falhaLab && k.startsWith('revisoesEscolares.lab.'))
              throw new DOMException('Sintética', 'QuotaExceededError');
            return window.__setLab.call(this, k, v);
          };
        else
          Storage.prototype.getItem = function (k) {
            if (window.__falhaLab && k.startsWith('revisoesEscolares.lab.'))
              throw new DOMException('Sintética', 'SecurityError');
            return window.__getLab.call(this, k);
          };
      }, falha);
      await responder(page, 'Lua');
      await expect(status(page)).toContainText(/Não foi possível salvar|conflito/);
      if (auxiliar) await page.locator('#lab-execucao-sessao').click();
      else {
        await page.locator('#lab-execucao-sessao').click();
        await page.locator('#lab-execucao-confirmar').click();
      }
      await expect(status(page)).toContainText('troca foi bloqueada');
      await expect(page.locator('[data-opcao-gramatica="Lua"]')).toHaveAttribute(
        'aria-pressed',
        'true'
      );
      expect(await travas(page)).toBe(1);
      if (falha !== 'conflito') {
        await page.evaluate(() => {
          window.__falhaLab = false;
        });
        await page.locator('#lab-execucao-persistir').click();
        await salvar(page);
        await sair(page);
        const dados = await rawLab(page);
        const sessao = auxiliar ? '.responsavel' : '.principal';
        expect(Object.entries(dados).find(([k]) => k.endsWith(sessao))[1]).toContain('Lua');
      }
    });
for (const falha of ['snapshot', 'abertura'])
  test(`LAB.2D.4 destino ${falha}: recuperação explícita da origem no mesmo lock`, async ({
    page,
  }) => {
    await iniciar(page);
    const k = await chave(page);
    if (falha === 'snapshot')
      await page.evaluate(
        (k) => localStorage.setItem(k.replace(/principal$/, 'responsavel'), '{}'),
        k
      );
    else
      await page.evaluate(() => {
        const original = window.LabCoordenador.conectarMotor;
        window.LabCoordenador = {
          ...window.LabCoordenador,
          conectarMotor: (c, s) =>
            s === 'responsavel'
              ? Promise.resolve({ ok: false, codigo: 'FALHA_SINTETICA' })
              : original(c, s),
        };
      });
    await abrir(page);
    await responder(page);
    await salvar(page);
    const antes = await rawLab(page);
    await page.locator('#lab-execucao-sessao').click();
    await page.locator('#lab-execucao-confirmar').click();
    await expect(page.locator('#lab-execucao-recuperar')).toBeVisible();
    await expect(page.locator('#lab-execucao-voltar')).toBeDisabled();
    await page.evaluate(() => window.LabExecucao.voltar());
    await expect(status(page)).toContainText('navegação foi bloqueada');
    expect(await travas(page)).toBe(1);
    await page.locator('#lab-execucao-recuperar').click();
    await expect(status(page)).toContainText('origem recuperada');
    await expect(page.locator('[data-opcao-gramatica="Sol"]')).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(await rawLab(page)).toEqual(antes);
    await sair(page);
  });
test('LAB.2D.4 pendência/coalescência, segunda aba e comandos concorrentes não liberam aquisição', async ({
  page,
  context,
}) => {
  await iniciar(page);
  await reterGravacao(page);
  await abrir(page);
  await responder(page);
  await expect.poll(() => page.evaluate(() => !!window.__labSoltarGravacao)).toBe(true);
  await responder(page, 'Lua');
  await page.evaluate(() => {
    window.__antigaLab = document.querySelector('[data-opcao-gramatica="Sol"]');
  });
  await page.locator('#lab-execucao-sessao').click();
  await page.locator('#lab-execucao-confirmar').click();
  await page.evaluate(() => {
    document.getElementById('lab-execucao-confirmar').click();
    document.querySelector('[data-aluno="mariana"]').click();
    window.QuestionariosRevisoes.abrir('alice-gramatica-pontuacao-interpretacao-outubro-2026');
    window.LabExecucao.voltar();
  });
  await expect(status(page)).toContainText('Aguarde a troca');
  expect(await travas(page)).toBe(1);
  const outra = await context.newPage();
  await iniciar(outra);
  await outra.locator('#lab-lista button').click();
  await expect(outra.locator('#lab-status')).toContainText('outra aba');
  await page.evaluate(() => window.__labSoltarGravacao());
  await expect(page.locator('#lab-execucao-identificacao')).toContainText('Responsável');
  await page.evaluate(() => window.__antigaLab.click());
  await expect(page.locator('[data-opcao-gramatica="Sol"]')).toHaveAttribute(
    'aria-pressed',
    'false'
  );
  expect(Object.keys(await rawLab(page))).toHaveLength(1);
  await crianca(page);
  await expect(page.locator('[data-opcao-gramatica="Lua"]')).toHaveAttribute(
    'aria-pressed',
    'true'
  );
});
test('LAB.2D.4 responsável exclusivo não altera presença principal na lista', async ({ page }) => {
  await iniciar(page);
  await abrir(page);
  await responsavel(page);
  await responder(page);
  await salvar(page);
  await sair(page);
  await expect(page.locator('#lab-lista button')).toHaveText('Iniciar atividade');
  await abrir(page);
  await expect(page.locator('#lab-execucao-identificacao')).toHaveText('Sessão da criança');
  await expect(page.locator('[data-opcao-gramatica="Sol"]')).toHaveAttribute(
    'aria-pressed',
    'false'
  );
  await responsavel(page);
  await expect(page.locator('[data-opcao-gramatica="Sol"]')).toHaveAttribute(
    'aria-pressed',
    'true'
  );
});
test('LAB.2D.4 toque/teclado e foco na sessão separada em 390×844', async ({
  browser,
  baseURL,
}) => {
  const ctx = await browser.newContext({
    baseURL,
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  try {
    const page = await ctx.newPage();
    await iniciar(page);
    await abrir(page);
    await page.locator('#lab-execucao-sessao').tap();
    await page.locator('#lab-execucao-confirmar').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#lab-execucao-identificacao')).toContainText('Responsável');
    await expect(page.locator('#lab-execucao-sessao')).toBeFocused();
    await expect(status(page)).toHaveAttribute('aria-live', 'polite');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    ).toBe(true);
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(r.violations.filter((v) => ['serious', 'critical'].includes(v.impact))).toEqual([]);
    await crianca(page);
  } finally {
    await ctx.close();
  }
});

for (const causa of ['identidade', 'lock'])
  test(`LAB.2D.4 perda de ${causa} na abertura impede recuperação e navegação`, async ({
    page,
  }) => {
    await iniciar(page);
    await page.evaluate((causa) => {
      const conectar = window.LabCoordenador.conectarMotor;
      window.LabCoordenador = {
        ...window.LabCoordenador,
        async conectarMotor(c, s) {
          if (s === 'responsavel') {
            if (causa === 'lock') navigator.locks.query = async () => ({ held: [], pending: [] });
            else
              window.LabIdentidade = {
                ...window.LabIdentidade,
                resolverIdentidade: async () => ({ modo: 'indisponivel' }),
              };
            return { ok: false, codigo: 'FALHA_SINTETICA' };
          }
          return conectar(c, s);
        },
      };
    }, causa);
    await abrir(page);
    await responder(page);
    await salvar(page);
    const antes = await rawLab(page);
    await page.locator('#lab-execucao-sessao').click();
    await page.locator('#lab-execucao-confirmar').click();
    await expect(page.locator('#lab-execucao-recuperar')).toBeVisible();
    if (causa === 'identidade')
      await page.route('**/__revisoes_local__/identity', (r) =>
        r.fulfill({ status: 503, body: '' })
      );
    await page.locator('#lab-execucao-recuperar').click();
    await expect(status(page)).toContainText('troca não foi concluída');
    await expect(page.locator('#lab-execucao-voltar')).toBeDisabled();
    await page.evaluate(() => window.LabExecucao.voltar());
    await expect(page.locator('#tela-gramatica-mariana')).toBeVisible();
    expect(await rawLab(page)).toEqual(antes);
  });
test('LAB.2D.4 alternâncias repetidas preservam handle, aquisição e dados oficiais', async ({
  page,
}) => {
  await iniciar(page);
  await page.evaluate(() => {
    window.__pedidosLab = 0;
    const request = navigator.locks.request.bind(navigator.locks);
    navigator.locks.request = (nome, ...args) => {
      if (nome.startsWith('revisoesEscolares.lab.sessao.')) ++window.__pedidosLab;
      return request(nome, ...args);
    };
    localStorage.setItem('revisoesEscolares.oficial.sentinela.v1', 'preservar byte a byte');
  });
  await abrir(page);
  for (let i = 0; i < 3; ++i) {
    await responsavel(page);
    await crianca(page);
  }
  expect(await page.evaluate(() => window.__pedidosLab)).toBe(1);
  await responsavel(page);
  await responder(page);
  await conferir(page);
  await salvar(page);
  await expect(page.locator('#gramatica-pontos')).toContainText('1 de 2');
  await page.evaluate(() =>
    window.QuestionariosRevisoes.abrir('alice-gramatica-pontuacao-interpretacao-outubro-2026')
  );
  await expect(page.locator('#lab-execucao-acoes')).toBeHidden();
  expect(await travas(page)).toBe(0);
  expect(
    await page.evaluate(() => localStorage.getItem('revisoesEscolares.oficial.sentinela.v1'))
  ).toBe('preservar byte a byte');
  await expect(page.locator('#gramatica-proxima')).toBeDisabled();
});

// LAB.2D.5: preferência somente na abertura, pelo construtor confiável.
async function prepararAmplo(page, perfil = 'alice') {
  const p = pacote(perfil);
  p.questoes[1].itens.push({ id: 'i3', pergunta: 'Outra bebida do banco?', respostas: ['água'] });
  await iniciar(page, perfil, [p]);
  await page.locator('#lab-desktop-amplo').check();
  return p;
}
for (const [width, height] of [
  [390, 844],
  [1366, 768],
  [1920, 1080],
  [2560, 1440],
])
  test(`LAB.2D.5 geometria efetiva alternativas/campos ${width}`, async ({ page }, info) => {
    await page.setViewportSize({ width, height });
    await prepararAmplo(page);
    await page.locator('#lab-desktop-amplo').uncheck();
    await abrir(page);
    const normal = await page.locator('#tela-gramatica-mariana').boundingBox();
    await expect(page.locator('#tela-gramatica-mariana')).not.toHaveClass(/layout-desktop-amplo/);
    await sair(page);
    await page.locator('#lab-desktop-amplo').focus();
    await page.keyboard.press('Space');
    await expect(page.locator('#lab-desktop-amplo')).toBeFocused();
    await abrir(page);
    await expect(page.locator('#tela-gramatica-mariana')).toHaveClass(/layout-desktop-amplo/);
    const amplo = await page.locator('#tela-gramatica-mariana').boundingBox();
    if (width >= 1120) expect(amplo.width).toBeGreaterThan(normal.width + 40);
    else expect(amplo.width).toBeCloseTo(normal.width, 0);
    const [a, b] = await page.locator('[data-opcao-gramatica]').evaluateAll((elementos) =>
      elementos.map((elemento) => {
        const { x, y, width, height } = elemento.getBoundingClientRect();
        return { x, y, width, height };
      })
    );
    expect(a.width).toBeGreaterThan(100);
    expect(a.height).toBeGreaterThanOrEqual(44);
    if (width >= 1120) {
      expect(Math.abs(a.y - b.y)).toBeLessThan(2);
      expect(b.x).toBeGreaterThan(a.x + a.width);
    }
    await page.screenshot({ path: info.outputPath(`amplo-opcoes-${width}.png`), fullPage: true });
    await responder(page);
    await conferir(page);
    await page.locator('#gramatica-proxima').click();
    const campos = page.locator('[data-resposta-gramatica]');
    const [c, d] = await campos.evaluateAll((elementos) =>
      elementos.map((elemento) => {
        const { x, y, width, height } = elemento.getBoundingClientRect();
        return { x, y, width, height };
      })
    );
    expect(c.width).toBeGreaterThan(100);
    if (width >= 1120) {
      expect(Math.abs(c.y - d.y)).toBeLessThan(2);
      expect(d.x).toBeGreaterThan(c.x + c.width);
    } else expect(d.y).toBeGreaterThan(c.y + c.height);
    for (const box of [amplo, a, b, c, d]) {
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    ).toBe(true);
    await page.screenshot({ path: info.outputPath(`amplo-campos-${width}.png`), fullPage: true });
    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(axe.violations.filter((v) => ['serious', 'critical'].includes(v.impact))).toEqual([]);
    await sair(page);
    await expect(page.locator('#lab-desktop-amplo')).not.toBeChecked();
    await abrir(page);
    await expect(page.locator('#tela-gramatica-mariana')).not.toHaveClass(/layout-desktop-amplo/);
  });
for (const perfil of ['alice', 'mariana'])
  test(`LAB.2D.5 ${perfil} sessões, snapshot e pacote independem da preferência`, async ({
    page,
  }) => {
    const p = await prepararAmplo(page, perfil);
    await page.evaluate(() => {
      const original = window.QuestionariosRevisoes.registrarLab;
      window.QuestionariosRevisoes.registrarLab = (construir) => {
        const r = original(construir);
        window.__handleLayout = r.handle;
        return r;
      };
    });
    await abrir(page);
    await responder(page);
    await conferir(page);
    await salvar(page);
    const snapshot = await page.evaluate(() => window.__handleLayout.exportarSnapshot().snapshot);
    const raw = await rawLab(page);
    const locks = await travas(page);
    await responsavel(page);
    await expect(page.locator('#tela-gramatica-mariana')).toHaveClass(/layout-desktop-amplo/);
    await responder(page, 'Lua');
    await salvar(page);
    await crianca(page);
    expect(await page.evaluate(() => window.__handleLayout.exportarSnapshot().snapshot)).toEqual(
      snapshot
    );
    expect(await travas(page)).toBe(locks);
    for (const [k, v] of Object.entries(raw)) expect((await rawLab(page))[k]).toBe(v);
    await page.locator('#gramatica-proxima').click();
    await page.locator('[data-resposta-gramatica]').nth(0).fill('água');
    await page.locator('#gramatica-voltar').click();
    await salvar(page);
    const antes = await page.evaluate(() => window.__handleLayout.exportarSnapshot().snapshot);
    await sair(page);
    await abrir(page);
    expect(await page.evaluate(() => window.__handleLayout.exportarSnapshot().snapshot)).toEqual(
      antes
    );
    await expect(page.locator('#tela-gramatica-mariana')).not.toHaveClass(/layout-desktop-amplo/);
    const conteudo = await page.evaluate(async (p) => {
      const a = await window.LabRepositorio.abrirRepositorioExistente();
      try {
        return await a.repositorio.consultar({ perfil: p.perfil, id: p.id, versao: p.versao });
      } finally {
        a.repositorio.fechar();
      }
    }, p);
    expect(conteudo.pacote).toEqual(p);
    const v = await page.evaluate((p) => window.LabValidador.validarPacote(JSON.stringify(p)), p);
    expect(conteudo.digest).toBe(v.digest);
    await page.reload();
    await page.locator(`[data-aluno="${perfil}"]`).click();
    await page.locator('#abrir-laboratorio').click();
    await expect(page.locator('#lab-conteudo')).toHaveAttribute('aria-busy', 'false');
    await page.locator('#lab-estudo summary').click();
    await abrir(page);
    await expect(page.locator('#tela-gramatica-mariana')).not.toHaveClass(/layout-desktop-amplo/);
    await expect(page.locator('#lab-execucao-identificacao')).toHaveText('Sessão da criança');
  });
test('LAB.2D.5 falha de persistência conserva layout e memória sem reconstrução', async ({
  page,
}) => {
  await prepararAmplo(page);
  await abrir(page);
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    window.__quotaLayout = true;
    Storage.prototype.setItem = function (k, v) {
      if (window.__quotaLayout && k.startsWith('revisoesEscolares.lab.'))
        throw new DOMException('Sintética', 'QuotaExceededError');
      return original.call(this, k, v);
    };
  });
  await responder(page);
  await expect(status(page)).toContainText('Não foi possível salvar');
  await page.locator('#lab-execucao-voltar').click();
  await expect(status(page)).toContainText('saída foi bloqueada');
  await expect(page.locator('#tela-gramatica-mariana')).toHaveClass(/layout-desktop-amplo/);
  await expect(page.locator('[data-opcao-gramatica="Sol"]')).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  await page.evaluate(() => {
    window.__quotaLayout = false;
  });
  await page.locator('#lab-execucao-persistir').click();
  await salvar(page);
  await sair(page);
});
test('LAB.2D.5 escolha não atravessa outra atividade ou revisão oficial', async ({ page }) => {
  await iniciar(page, 'alice', [pacote(), pacote('alice', 'vizinha')]);
  await page.locator('#lab-desktop-amplo').check();
  await abrir(page);
  await sair(page);
  await abrir(page, 1);
  await expect(page.locator('#tela-gramatica-mariana')).not.toHaveClass(/layout-desktop-amplo/);
  await page.evaluate(() =>
    window.QuestionariosRevisoes.abrir('alice-gramatica-pontuacao-interpretacao-outubro-2026')
  );
  await expect(page.locator('#lab-execucao-acoes')).toBeHidden();
  await expect(page.locator('#tela-gramatica-mariana')).toHaveClass(/layout-desktop-amplo/);
  await page.evaluate(() =>
    window.QuestionariosRevisoes.abrir('alice-gramatica-h-til-vocabulario')
  );
  await expect(page.locator('#tela-gramatica-mariana')).not.toHaveClass(/layout-desktop-amplo/);
  expect(await travas(page)).toBe(0);
});
test('LAB.2D.5 JSON não ganha permissão para layout; escolha por toque', async ({
  browser,
  baseURL,
}) => {
  const ctx = await browser.newContext({
    baseURL,
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  try {
    const page = await ctx.newPage();
    await iniciar(page);
    const r = await page.evaluate(
      (p) =>
        window.LabValidador.validarPacote(JSON.stringify({ ...p, layout: { desktopAmplo: true } })),
      pacote()
    );
    expect(r.valido).toBe(false);
    await page.locator('label[for="lab-desktop-amplo"]').tap();
    await expect(page.locator('#lab-desktop-amplo')).toBeChecked();
    await abrir(page);
    await expect(page.locator('#lab-execucao-layout')).toContainText(
      'Modo Desktop Amplo selecionado'
    );
    await page.locator('[data-opcao-gramatica="Sol"]').tap();
    await conferir(page);
    await salvar(page);
    await expect(page.locator('#gramatica-pontos')).toContainText('1 de 2');
  } finally {
    await ctx.close();
  }
});

// LAB.2D.6B: conexão simulada SOMENTE nesta fixture; nenhum bypass em produção.
async function prepararDitadoSintetico(
  page,
  idioma = 'pt-BR',
  unidade = 'palavra',
  n = 6,
  amplo = false
) {
  const palavras =
    idioma === 'pt-BR'
      ? ['cafe', 'árvore', 'janela', 'chuva', 'lápis', 'livro']
      : ['sun', 'moon', 'window', 'rain', 'bird', 'school'];
  const textos = palavras
    .slice(0, n)
    .map((x) =>
      unidade === 'frase' ? (idioma === 'pt-BR' ? 'Eu vejo ' + x + '.' : 'I see ' + x + '.') : x
    );
  const contrato = {
    formato: 'lab-questionarios-v2',
    id: 'ditado-sintetico',
    versao: 1,
    perfil: 'alice',
    materia: 'gramatica',
    titulo: textos[0],
    questoes: [0, 1].map((q) => ({
      id: q === 0 ? palavras[0] : 'segunda',
      bloco: textos[0],
      titulo: textos[0],
      instrucao: textos[0],
      tipo: 'ditado',
      idioma,
      unidade,
      itens: textos.map((texto, i) => ({ id: 'i' + q + '-' + i, texto })),
    })),
  };
  await audioSintetico(page);
  await iniciar(page);
  await page.evaluate(async (p) => {
    const antes = await window.LabValidador.validarContratoDitado(JSON.stringify(p));
    const a = await window.QuestionariosRevisoes.adaptarContratoDitadoLab(JSON.stringify(p));
    if (!a.ok || a.admissaoOperacional !== false) throw new Error('Adaptação inválida');
    window.__adaptacao = a;
    window.__contratoAntes = antes;
    const registrar = window.QuestionariosRevisoes.registrarLab;
    window.QuestionariosRevisoes.registrarLab = (construir) =>
      registrar(() => ({ ...construir(), titulo: a.titulo, questoes: a.questoes }));
    const conectar = window.LabCoordenador.conectarMotor;
    window.LabCoordenador = {
      ...window.LabCoordenador,
      async conectarMotor(c, sessao) {
        const r = await conectar(c, sessao);
        if (!r.ok) return r;
        return {
          ...r,
          pacote: {
            ...r.pacote,
            titulo: a.titulo,
            questoes: a.questoes.map((q) => {
              const copia = { ...q };
              delete copia.sucesso;
              return copia;
            }),
          },
          canal: {
            ...r.canal,
            async carregar() {
              return {
                ok: true,
                estado: window.__ditado.estados[sessao] || null,
                durabilidade: 'persistido-lido',
              };
            },
            async salvar(estado) {
              ++window.__ditado.writes;
              window.__ditado.estados[sessao] = JSON.parse(JSON.stringify(estado));
              return { ok: true, aceitaPeloNavegador: true, durabilidade: 'gravacao-aceita' };
            },
          },
        };
      },
    };
  }, contrato);
  if (amplo) await page.locator('#lab-desktop-amplo').check();
  await abrir(page);
  return { textos, contrato };
}
async function preencherDitado(page, textos) {
  for (let i = 0; i < textos.length; ++i)
    await page.locator('[data-resposta-gramatica]').nth(i).fill(textos[i]);
}
for (const idioma of ['pt-BR', 'en-US'])
  for (const unidade of ['palavra', 'frase'])
    test(`LAB.2D.6B ${idioma}/${unidade}: seis itens, sigilo, áudio e ciclo de correção`, async ({
      page,
    }) => {
      const { textos, contrato } = await prepararDitadoSintetico(page, idioma, unidade);
      const a = await page.evaluate(() => window.__adaptacao);
      expect(a.questoes[0].id).toBe(contrato.questoes[0].id);
      expect(a.questoes[0].itens.map((x) => x.id)).toEqual(
        contrato.questoes[0].itens.map((x) => x.id)
      );
      expect(a.questoes[0].itens.map((x) => x.respostas)).toEqual(textos.map((x) => [x]));
      const depois = await page.evaluate(
        (p) => window.LabValidador.validarContratoDitado(JSON.stringify(p)),
        contrato
      );
      expect(depois).toEqual(await page.evaluate(() => window.__contratoAntes));
      for (const texto of textos)
        expect(await page.locator('#gramatica-conteudo').innerHTML()).not.toContain(texto);
      await expect(page.locator('[data-resposta-gramatica]')).toHaveCount(6);
      for (const input of await page.locator('[data-resposta-gramatica]').all())
        await expect(input).toHaveValue('');
      expect(await page.evaluate(() => window.__ditado.calls.length)).toBe(0);
      for (let i = 0; i < 6; ++i) {
        await page.locator('[data-ouvir-ditado-gramatica]').nth(i).click();
        const u = await page.evaluate(() => {
          const x = window.__ditado.calls.at(-1);
          return { text: x.text, lang: x.lang };
        });
        expect(u.lang).toBe(idioma);
        expect(u.text).toContain(textos[i]);
      }
      await page.locator('[data-repetir-ditado-gramatica]').click();
      expect(await page.evaluate(() => window.__ditado.calls.at(-1).text)).toContain(textos[5]);
      const c = await page.evaluate(() => window.__ditado.cancels);
      await page.locator('[data-parar-ditado-gramatica]').click();
      expect(await page.evaluate(() => window.__ditado.cancels)).toBeGreaterThan(c);
      expect(await page.evaluate(() => window.__ditado.writes)).toBe(0);
      expect(await rawLab(page)).toEqual({});
      await expect(page.locator('#gramatica-pontos')).toContainText('0 de 2');
      await preencherDitado(page, [...textos.slice(0, 5), 'errado']);
      await expect(page.locator('#gramatica-pontos')).toContainText('0 de 2');
      await conferir(page);
      await expect(page.locator('#gramatica-proxima')).toBeDisabled();
      // Normalização existente: espaços, caixa e acentos; sem remover pontuação.
      const respostas = textos.map(
        (x) =>
          '  ' +
          x
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toUpperCase() +
          '  '
      );
      await preencherDitado(page, respostas);
      await conferir(page);
      await salvar(page);
      await expect(page.locator('#gramatica-pontos')).toContainText('1 de 2');
      await page.locator('[data-resposta-gramatica]').last().fill('errado');
      await conferir(page);
      await expect(page.locator('#gramatica-proxima')).toBeDisabled();
      await page.locator('[data-resposta-gramatica]').last().fill(textos[5]);
      await conferir(page);
      await salvar(page);
      await expect(page.locator('#gramatica-pontos')).toContainText('1 de 2');
      const falas = await page.evaluate(() => window.__ditado.calls.length);
      await page.locator('#gramatica-proxima').click();
      await expect(page.locator('[data-repetir-ditado-gramatica]')).toBeDisabled();
      await page.locator('#gramatica-voltar').click();
      expect(await page.evaluate(() => window.__ditado.calls.length)).toBe(falas);
      await expect(page.locator('[data-resposta-gramatica]').last()).toHaveValue(textos[5]);
      await sair(page);
    });
for (const n of [1, 2, 3, 4, 5])
  test(`LAB.2D.6B cardinalidade ${n} fiel ao avaliador`, async ({ page }) => {
    const { textos } = await prepararDitadoSintetico(page, 'pt-BR', 'palavra', n);
    await preencherDitado(page, textos);
    await conferir(page);
    await salvar(page);
    await expect(page.locator('[data-resposta-gramatica]')).toHaveCount(n);
    await expect(page.locator('#gramatica-pontos')).toContainText('1 de 2');
  });
test('LAB.2D.6B sessão/desativação invalidam controles e callbacks tardios', async ({ page }) => {
  const { textos } = await prepararDitadoSintetico(page);
  await page.locator('[data-ouvir-ditado-gramatica]').first().click();
  await page.evaluate(() => {
    window.__ouvirAntigo = document.querySelector('[data-ouvir-ditado-gramatica]');
    window.__repetirAntigo = document.querySelector('[data-repetir-ditado-gramatica]');
    window.__falaAntiga = window.__ditado.calls.at(-1);
  });
  const cancels = await page.evaluate(() => window.__ditado.cancels);
  await responsavel(page);
  expect(await page.evaluate(() => window.__ditado.cancels)).toBeGreaterThan(cancels);
  const falas = await page.evaluate(() => window.__ditado.calls.length);
  await page.evaluate(() => {
    window.__ouvirAntigo.click();
    window.__repetirAntigo.click();
    window.__falaAntiga.onend?.();
    window.__falaAntiga.onerror?.({ error: 'erro antigo' });
  });
  expect(await page.evaluate(() => window.__ditado.calls.length)).toBe(falas);
  await expect(page.locator('.status-ditado-gramatica')).not.toContainText('erro antigo');
  await preencherDitado(page, textos);
  await conferir(page);
  await salvar(page);
  await crianca(page);
  await expect(page.locator('[data-resposta-gramatica]').first()).toHaveValue('');
  await page.locator('[data-ouvir-ditado-gramatica]').first().click();
  const antes = await page.evaluate(() => window.__ditado.cancels);
  await page.evaluate(() =>
    window.QuestionariosRevisoes.abrir('alice-gramatica-h-til-vocabulario')
  );
  await expect(page.locator('#lab-execucao-acoes')).toBeHidden();
  expect(await page.evaluate(() => window.__ditado.cancels)).toBeGreaterThan(antes);
  expect(await travas(page)).toBe(0);
});
for (const modo of ['erro', 'semvoz'])
  test(`LAB.2D.6B áudio ${modo} não bloqueia correção`, async ({ page }) => {
    const { textos } = await prepararDitadoSintetico(page);
    await page.evaluate((modo) => {
      window.__ditado.modo = modo;
    }, modo);
    await page.locator('[data-ouvir-ditado-gramatica]').first().click();
    await preencherDitado(page, textos);
    await conferir(page);
    await salvar(page);
    await expect(page.locator('#gramatica-proxima')).toBeEnabled();
  });
for (const [width, height] of [
  [390, 844],
  [1366, 768],
  [1920, 1080],
])
  test(`LAB.2D.6B layout, foco e controles ${width}`, async ({ browser, baseURL }, info) => {
    const ctx = await browser.newContext({ baseURL, viewport: { width, height }, hasTouch: true });
    try {
      const page = await ctx.newPage();
      await prepararDitadoSintetico(page, 'en-US', 'frase', 6, true);
      await page.locator('[data-ouvir-ditado-gramatica]').first().focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('[data-ouvir-ditado-gramatica]').first()).toBeFocused();
      expect(await page.evaluate(() => window.__ditado.calls.length)).toBe(1);
      await page.locator('[data-parar-ditado-gramatica]').tap();
      for (const input of await page.locator('[data-resposta-gramatica]').all()) {
        const b = await input.boundingBox();
        expect(b.width).toBeGreaterThan(100);
        expect(b.x + b.width).toBeLessThanOrEqual(width + 1);
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
      ).toBe(true);
      const axe = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(axe.violations.filter((v) => ['serious', 'critical'].includes(v.impact))).toEqual([]);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: info.outputPath(`ditado-${width}.png`), fullPage: true });
    } finally {
      await ctx.close();
    }
  });
test('LAB.2D.6B adaptação não aceita objeto forjado nem muda a admissão', async ({ page }) => {
  await iniciar(page);
  const r = await page.evaluate(() =>
    window.QuestionariosRevisoes.adaptarContratoDitadoLab({ valido: true, contratoNormalizado: {} })
  );
  expect(r.ok).toBe(false);
});

async function audioSintetico(page) {
  await page.addInitScript(() => {
    window.__ditado = { calls: [], cancels: 0, writes: 0, modo: 'ok', estados: {} };
    window.SpeechSynthesisUtterance = function (text) {
      this.text = text;
    };
    window.speechSynthesis.getVoices = () =>
      window.__ditado.modo === 'semvoz'
        ? []
        : [
            { name: 'PT local', lang: 'pt-BR', localService: true },
            { name: 'EN local', lang: 'en-US', localService: true },
          ];
    window.speechSynthesis.cancel = () => ++window.__ditado.cancels;
    window.speechSynthesis.resume = () => {};
    window.speechSynthesis.speak = (u) => {
      window.__ditado.calls.push(u);
      if (window.__ditado.modo === 'erro') u.onerror?.({ error: 'synthesis-failed' });
    };
  });
}

function ditadoReal(idioma, unidade, n) {
  const palavras =
    idioma === 'pt-BR'
      ? ['cafe', 'árvore', 'janela', 'chuva', 'lápis', 'livro']
      : ['cloud', 'moon', 'window', 'rain', 'bird', 'school'];
  const textos = palavras
    .slice(0, n)
    .map((p) =>
      unidade === 'palavra' ? p : (idioma === 'pt-BR' ? 'Eu vejo ' : 'I see ') + p + '.'
    );
  return {
    formato: 'lab-questionarios-v2',
    id: palavras[0],
    versao: 1,
    perfil: 'alice',
    materia: 'gramatica',
    titulo: textos[0],
    questoes: [0, 1].map((q) => ({
      id: 'alvo-' + palavras[0] + q,
      bloco: textos[0],
      titulo: textos[0],
      instrucao: textos[0],
      tipo: 'ditado',
      idioma,
      unidade,
      itens: textos.map((texto, i) => ({ id: 'original-' + palavras[0] + q + '-' + i, texto })),
    })),
  };
}
async function importarReal(page, p) {
  await page.goto('/ambiente_interativo/index.html');
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
  await page.locator('[data-aluno="alice"]').click();
  await page.locator('#abrir-laboratorio').click();
  await expect(page.locator('#lab-conteudo')).toHaveAttribute('aria-busy', 'false');
  await page.locator('#lab-importacao summary').click();
  const antes = await rawLab(page);
  await page.locator('#lab-arquivo').setInputFiles({
    name: 'sintetico.json',
    mimeType: 'application/json',
    buffer: require('node:buffer').Buffer.from(JSON.stringify(p)),
  });
  await expect(page.locator('#lab-importar-confirmar')).toBeEnabled();
  for (const alvo of [p.id, p.titulo])
    expect(await page.locator('#lab-importacao-previa').innerHTML()).not.toContain(alvo);
  expect(await rawLab(page)).toEqual(antes);
  await page.locator('#lab-importar-confirmar').click();
  await expect(page.locator('#lab-importacao-status')).toContainText('Importação concluída');
  await expect(page.locator('#lab-lista li')).toHaveCount(1);
  expect(await rawLab(page)).toEqual(antes);
  await page.locator('#lab-estudo summary').click();
}
for (const idioma of ['pt-BR', 'en-US'])
  for (const unidade of ['palavra', 'frase'])
    for (let n = 1; n <= 6; ++n)
      test(`6C.2 importação/identidade/persistência reais ${idioma}/${unidade}/${n}`, async ({
        page,
      }) => {
        await page.setViewportSize({
          width: n === 1 ? 390 : n === 3 ? 1920 : 1366,
          height: n === 1 ? 844 : 1080,
        });
        await audioSintetico(page);
        const p = ditadoReal(idioma, unidade, n);
        await importarReal(page, p);
        if (n % 2 === 0) await page.locator('#lab-desktop-amplo').check();
        await abrir(page);
        const inputs = page.locator('[data-resposta-gramatica]');
        await expect(inputs).toHaveCount(n);
        for (const i of await inputs.all()) await expect(i).toHaveValue('');
        expect(await rawLab(page)).toEqual({});
        for (const alvo of [p.id, p.titulo, p.questoes[0].id])
          expect(await page.locator('#gramatica-conteudo').innerHTML()).not.toContain(alvo);
        expect(await page.evaluate(() => window.__ditado.calls.length)).toBe(0);
        await page.locator('[data-ouvir-ditado-gramatica]').first().click();
        expect(await page.evaluate(() => window.__ditado.calls.at(-1).lang)).toBe(idioma);
        await expect(inputs.first()).toHaveValue('');
        await page.locator('[data-parar-ditado-gramatica]').click();
        for (const i of await inputs.all()) await i.fill('incorreta');
        await conferir(page);
        for (let i = 0; i < n; ++i) await inputs.nth(i).fill(p.questoes[0].itens[i].texto);
        await conferir(page);
        await salvar(page);
        const dados = await rawLab(page);
        const [key, texto] = Object.entries(dados)[0];
        const v = await page.evaluate(
          (p) => window.LabValidador.validarPacote(JSON.stringify(p)),
          p
        );
        expect(key).toContain('.' + v.digest + '.principal');
        expect(JSON.parse(texto).pontos).toBe(1);
        expect(JSON.parse(texto).respostas[p.questoes[0].id]).toEqual(
          p.questoes[0].itens.map((i) => i.texto)
        );
        await page.locator('#gramatica-proxima').click();
        await expect(inputs.first()).toHaveValue('');
        await page.locator('#gramatica-voltar').click();
        await expect(inputs.first()).toHaveValue(p.questoes[0].itens[0].texto);
        if (n === 6) {
          await responsavel(page);
          await expect(inputs.first()).toHaveValue('');
          await inputs.first().fill('auxiliar');
          await salvar(page);
          await crianca(page);
          await expect(inputs.first()).toHaveValue(p.questoes[0].itens[0].texto);
        }
        expect(
          JSON.parse(Object.entries(await rawLab(page)).find(([k]) => k.endsWith('.principal'))[1])
            .pontos
        ).toBe(1);
        await page.reload();
        await page.locator('[data-aluno="alice"]').click();
        await page.locator('#abrir-laboratorio').click();
        await expect(page.locator('#lab-conteudo')).toHaveAttribute('aria-busy', 'false');
        await page.locator('#lab-estudo summary').click();
        await abrir(page);
        await expect(page.locator('#lab-execucao-identificacao')).toHaveText('Sessão da criança');
        await expect(inputs.first()).toHaveValue(p.questoes[0].itens[0].texto);
        if (n === 6) {
          await responsavel(page);
          await expect(inputs.first()).toHaveValue('auxiliar');
          for (let q = 0; q < 2; ++q) {
            for (let i = 0; i < n; ++i) await inputs.nth(i).fill(p.questoes[q].itens[i].texto);
            await conferir(page);
            await page.locator('#gramatica-proxima').click();
          }
          await expect(page.locator('[data-ir-inicio]')).toBeVisible();
          await salvar(page);
          const estados = Object.fromEntries(
            Object.entries(await rawLab(page)).map(([k, v]) => [k.split('.').at(-1), JSON.parse(v)])
          );
          expect(estados.principal.pontos).toBe(1);
          expect(estados.principal.finalizada).toBe(false);
          expect(estados.responsavel.pontos).toBe(2);
          expect(estados.responsavel.finalizada).toBe(true);
          await page.reload();
          await page.locator('[data-aluno="alice"]').click();
          await page.locator('#abrir-laboratorio').click();
          await expect(page.locator('#lab-conteudo')).toHaveAttribute('aria-busy', 'false');
          await page.locator('#lab-estudo summary').click();
          await abrir(page);
          await expect(inputs.first()).toHaveValue(p.questoes[0].itens[0].texto);
          await responsavel(page);
          await expect(page.locator('[data-ir-inicio]')).toBeVisible();
          expect(await page.evaluate(() => window.__ditado.calls.length)).toBe(0);
        }
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
        ).toBe(true);
      });

for (const falha of ['quota', 'storage', 'conflito'])
  test(`6C.2 durabilidade ${falha}: memória e aquisição preservadas`, async ({ page }) => {
    await importarReal(page, ditadoReal('pt-BR', 'palavra', 1));
    await abrir(page);
    const input = page.locator('[data-resposta-gramatica]').first();
    await input.fill('cafe');
    await conferir(page);
    await salvar(page);
    await page.evaluate((falha) => {
      window.__setLab = Storage.prototype.setItem;
      window.__getLab = Storage.prototype.getItem;
      window.__falhaLab = true;
      if (falha === 'conflito') {
        const k = Object.keys(localStorage).find((k) => k.endsWith('.principal'));
        localStorage.setItem(k, '{}');
      } else if (falha === 'quota')
        Storage.prototype.setItem = function (k, v) {
          if (window.__falhaLab && k.startsWith('revisoesEscolares.lab.'))
            throw new DOMException('Sintética', 'QuotaExceededError');
          return window.__setLab.call(this, k, v);
        };
      else
        Storage.prototype.getItem = function (k) {
          if (window.__falhaLab && k.startsWith('revisoesEscolares.lab.'))
            throw new DOMException('Sintética', 'SecurityError');
          return window.__getLab.call(this, k);
        };
    }, falha);
    await input.fill('recente');
    await expect(status(page)).toContainText(/Não foi possível salvar|conflito/);
    await page.locator('#lab-execucao-sessao').click();
    await page.locator('#lab-execucao-confirmar').click();
    await expect(status(page)).toContainText('troca foi bloqueada');
    await expect(input).toHaveValue('recente');
    expect(await travas(page)).toBe(1);
    if (falha !== 'conflito') {
      await page.evaluate(() => {
        window.__falhaLab = false;
      });
      await page.locator('#lab-execucao-persistir').click();
      await salvar(page);
      expect(Object.values(await rawLab(page))[0]).toContain('recente');
    }
  });

test('6C.2 duplicata e conflito entre formatos não sobrescrevem registro nem progresso', async ({
  page,
}) => {
  const p = ditadoReal('pt-BR', 'palavra', 1);
  await importarReal(page, p);
  const r = await page.evaluate(async (p) => {
    const a = await window.LabRepositorio.abrirRepositorio();
    try {
      const id = { perfil: p.perfil, id: p.id, versao: p.versao };
      const antes = await a.repositorio.consultar(id);
      const duplicata = await a.repositorio.cadastrar(JSON.stringify(p));
      const outro = {
        ...p,
        formato: 'lab-questionarios-v1',
        questoes: [
          {
            id: 'q1',
            bloco: 'Exemplo',
            titulo: 'Exemplo',
            instrucao: 'Escolha.',
            tipo: 'opcoes',
            dica: 'Observe.',
            itens: [{ id: 'i1', pergunta: 'Luz?', opcoes: ['Sol', 'Lua'], respostas: ['Sol'] }],
          },
        ],
      };
      const conflito = await a.repositorio.cadastrar(JSON.stringify(outro));
      const depois = await a.repositorio.consultar(id);
      return { antes, depois, duplicata, conflito };
    } finally {
      a.repositorio.fechar();
    }
  }, p);
  expect(r.duplicata.ok).toBe(true);
  expect(r.duplicata.criado).toBe(false);
  expect(r.conflito.codigo).toBe('CONFLITO_DIGEST');
  expect(r.depois).toEqual(r.antes);
  expect(await rawLab(page)).toEqual({});
});

test('6C.2 v2 mantém exclusividade real em segunda aba', async ({ page }) => {
  const p = ditadoReal('en-US', 'frase', 1);
  await importarReal(page, p);
  await abrir(page);
  const segunda = await page.context().newPage();
  try {
    await iniciar(segunda, 'alice', [p]);
    await segunda.locator('#lab-lista button').click();
    await expect(segunda.locator('#lab-status')).toContainText('outra aba');
    await expect(segunda.locator('#lab-execucao-acoes')).toBeHidden();
    expect(await travas(page)).toBe(1);
  } finally {
    await segunda.close();
  }
});

test('6C.2 toque, teclado, foco e acessibilidade de ditado real em 390px', async ({ browser }) => {
  const ctx = await browser.newContext({
    hasTouch: true,
    reducedMotion: 'reduce',
    viewport: { width: 390, height: 844 },
  });
  try {
    const page = await ctx.newPage();
    await importarReal(page, ditadoReal('pt-BR', 'palavra', 1));
    await page.locator('#lab-lista button').tap();
    await expect(page.locator('#lab-execucao-acoes')).toBeVisible();
    await page.locator('[data-resposta-gramatica]').first().fill('cafe');
    await page.locator('[data-conferir-gramatica]').focus();
    await page.keyboard.press('Enter');
    await salvar(page);
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          window.requestAnimationFrame(() => window.requestAnimationFrame(resolve))
        )
    );
    expect(
      (await new AxeBuilder({ page }).include('#tela-gramatica-mariana').analyze()).violations
    ).toEqual([]);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    ).toBe(true);
  } finally {
    await ctx.close();
  }
});

for (const modo of ['erro', 'semvoz'])
  test('6C.2 áudio ' + modo + ' não impede correção ou navegação', async ({ page }) => {
    await audioSintetico(page);
    await importarReal(page, ditadoReal('en-US', 'frase', 1));
    await abrir(page);
    await page.evaluate((modo) => {
      window.__ditado.modo = modo;
    }, modo);
    await page.locator('[data-ouvir-ditado-gramatica]').first().click();
    await expect(page.locator('.status-ditado-gramatica')).toContainText(
      modo === 'erro' ? 'Não foi possível' : 'Não foi encontrada'
    );
    await page.locator('[data-resposta-gramatica]').first().fill('I see cloud.');
    await conferir(page);
    await salvar(page);
    await page.locator('#gramatica-proxima').click();
    await expect(page.locator('[data-resposta-gramatica]').first()).toHaveValue('');
    expect(JSON.parse(Object.values(await rawLab(page))[0]).pontos).toBe(1);
  });
