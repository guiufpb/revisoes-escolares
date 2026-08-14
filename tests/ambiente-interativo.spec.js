const path = require('node:path');
const { env } = require('node:process');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');

const CAMINHO = '/ambiente_interativo/index.html';
const CHAVE_ALICE = 'revisoesEscolares.alice.ciencias.origemMateriais';
const CHAVE_MARIANA = 'revisoesEscolares.mariana.matematica.revisaoAmpla';
const CHAVE_CENTENAS = 'revisoesEscolares.mariana.matematica.centenasEmAcao.v2';
const CHAVE_LEITURA_ALICE = 'revisoesEscolares.alice.leitura.primeirasLicoesDinheiro.v1';
const CHAVE_LEITURA_MARIANA = 'revisoesEscolares.mariana.leitura.primeirasLicoesDinheiro.v1';
const CHAVE_REI_ALICE = 'revisoesEscolares.alice.leitura.quemEReiAnimais.v1';
const CHAVE_REI_MARIANA = 'revisoesEscolares.mariana.leitura.quemEReiAnimais.v1';
const CHAVE_GALINHA_ALICE = 'revisoesEscolares.alice.leitura.galinhaOvosOuro.v1';
const CHAVE_GALINHA_MARIANA = 'revisoesEscolares.mariana.leitura.galinhaOvosOuro.v1';
const CHAVE_RAPOSA_ALICE = 'revisoesEscolares.alice.leitura.raposaEUvas.v1';
const CHAVE_RAPOSA_MARIANA = 'revisoesEscolares.mariana.leitura.raposaEUvas.v1';
const CHAVE_SOL_ALICE = 'revisoesEscolares.alice.leitura.solTirouFerias.v1';
const CHAVE_SOL_MARIANA = 'revisoesEscolares.mariana.leitura.solTirouFerias.v1';
const CHAVE_FORMIGA_ALICE = 'revisoesEscolares.alice.leitura.formigaQueriaCantar.v1';
const CHAVE_FORMIGA_MARIANA = 'revisoesEscolares.mariana.leitura.formigaQueriaCantar.v1';
const CHAVE_CASTELO_ALICE = 'revisoesEscolares.alice.leitura.casteloBemAssombrado.v1';
const CHAVE_CASTELO_MARIANA = 'revisoesEscolares.mariana.leitura.casteloBemAssombrado.v1';
const CHAVE_BELA_ALICE = 'revisoesEscolares.alice.leitura.belaDesadormecida.v1';
const CHAVE_BELA_MARIANA = 'revisoesEscolares.mariana.leitura.belaDesadormecida.v1';
const CHAVE_JOANINHA_ALICE = 'revisoesEscolares.alice.leitura.joaninhaPerdeuPintinhas.v1';
const CHAVE_JOANINHA_MARIANA = 'revisoesEscolares.mariana.leitura.joaninhaPerdeuPintinhas.v1';
const CHAVE_FORMIGA_ESPECIAL_ALICE = 'revisoesEscolares.alice.leitura.umaFormigaEspecial.v1';
const CHAVE_FORMIGA_ESPECIAL_MARIANA = 'revisoesEscolares.mariana.leitura.umaFormigaEspecial.v1';
const CHAVE_INGLES_ALICE = 'revisoesEscolares.alice.ingles.atSchoolUnidade3.v1';
const CHAVE_INGLES_MARIANA = 'revisoesEscolares.mariana.ingles.atSchoolUnidade3.v1';
const CHAVE_ANTIGA = 'revisoes-escolares-progresso-v1';
const LIVRO_DINHEIRO = 'primeiras-licoes-dinheiro';
const LIVRO_REI = 'quem-e-o-rei-dos-animais';
const LIVRO_GALINHA = 'a-galinha-dos-ovos-de-ouro';
const LIVRO_RAPOSA = 'a-raposa-e-as-uvas';
const LIVRO_SOL = 'o-dia-que-o-sol-tirou-ferias';
const LIVRO_FORMIGA = 'a-formiga-que-queria-cantar';
const LIVRO_CASTELO = 'um-castelo-bem-assombrado';
const LIVRO_BELA = 'a-bela-desadormecida';
const LIVRO_JOANINHA = 'a-joaninha-que-perdeu-as-pintinhas';
const LIVRO_FORMIGA_ESPECIAL = 'uma-formiga-especial';
const DADOS_LIVROS = {
  [LIVRO_DINHEIRO]: { titulo: 'Primeiras Lições sobre Dinheiro', paginas: 25 },
  [LIVRO_REI]: { titulo: 'Quem é o rei dos animais?', paginas: 32 },
  [LIVRO_GALINHA]: { titulo: 'A Galinha dos Ovos de Ouro', paginas: 35 },
  [LIVRO_RAPOSA]: { titulo: 'A Raposa e as Uvas', paginas: 21 },
  [LIVRO_SOL]: { titulo: 'O dia que o Sol tirou férias', paginas: 30 },
  [LIVRO_FORMIGA]: { titulo: 'A formiga que queria cantar', paginas: 36 },
  [LIVRO_CASTELO]: { titulo: 'Um castelo bem assombrado', paginas: 25 },
  [LIVRO_BELA]: { titulo: 'A Bela Desadormecida', paginas: 30 },
  [LIVRO_JOANINHA]: { titulo: 'A Joaninha que Perdeu as Pintinhas', paginas: 21 },
  [LIVRO_FORMIGA_ESPECIAL]: { titulo: 'Uma Formiga Especial', paginas: 31 },
};

async function conferirTamanhoPdfLocal(resposta, tamanhoEsperado) {
  if (env.CI) return;
  expect((await resposta.body()).byteLength).toBe(tamanhoEsperado);
}

const CHAVES_DOS_TESTES = [
  CHAVE_ALICE,
  CHAVE_MARIANA,
  CHAVE_CENTENAS,
  CHAVE_LEITURA_ALICE,
  CHAVE_LEITURA_MARIANA,
  CHAVE_REI_ALICE,
  CHAVE_REI_MARIANA,
  CHAVE_GALINHA_ALICE,
  CHAVE_GALINHA_MARIANA,
  CHAVE_RAPOSA_ALICE,
  CHAVE_RAPOSA_MARIANA,
  CHAVE_SOL_ALICE,
  CHAVE_SOL_MARIANA,
  CHAVE_FORMIGA_ALICE,
  CHAVE_FORMIGA_MARIANA,
  CHAVE_CASTELO_ALICE,
  CHAVE_CASTELO_MARIANA,
  CHAVE_BELA_ALICE,
  CHAVE_BELA_MARIANA,
  CHAVE_JOANINHA_ALICE,
  CHAVE_JOANINHA_MARIANA,
  CHAVE_FORMIGA_ESPECIAL_ALICE,
  CHAVE_FORMIGA_ESPECIAL_MARIANA,
  CHAVE_INGLES_ALICE,
  CHAVE_INGLES_MARIANA,
  CHAVE_ANTIGA,
];

async function limparSomenteChavesDoAmbiente(page) {
  await page.evaluate(
    (chaves) => chaves.forEach((chave) => localStorage.removeItem(chave)),
    CHAVES_DOS_TESTES
  );
}

async function abrirAlice(page) {
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.getByRole('button', { name: /Ciências/ }).click();
  await expect(page.getByRole('heading', { name: 'Origem dos materiais' })).toBeVisible();
}

async function abrirTrilhaMariana(page) {
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.getByRole('button', { name: /Matemática/ }).click();
  await expect(page.getByRole('heading', { name: 'Escolha uma revisão' })).toBeVisible();
}

async function abrirRevisaoMariana(page) {
  await abrirTrilhaMariana(page);
  await page.getByRole('button', { name: /Revisão ampla/ }).click();
  await expect(page.getByRole('progressbar')).toBeVisible();
}

async function abrirBiblioteca(page, perfil) {
  await page.getByRole('button', { name: new RegExp(perfil, 'i') }).click();
  await page.getByRole('button', { name: /Leitura/ }).click();
  await expect(page.getByRole('heading', { name: 'Escolha uma leitura' })).toBeVisible();
}

async function abrirLivro(page, perfil, livroId = LIVRO_DINHEIRO) {
  await abrirBiblioteca(page, perfil);
  const livro = DADOS_LIVROS[livroId];
  const cartao = page.locator(`.cartao-livro[data-livro-id="${livroId}"]`);
  await cartao
    .getByRole('button', { name: /Começar leitura|Continuar da página|Ler novamente/ })
    .click();
  await expect(page.locator('#canvas-livro')).toHaveAttribute(
    'aria-label',
    new RegExp(`Página \\d+ do livro ${livro.titulo.replace('?', '\\?')}`)
  );
  await expect(page.locator('#estado-carregamento-pdf')).toBeHidden();
}

async function clicarAlternativaCorreta(page, livroId, indicePerguntaObjetiva) {
  const respostaCorreta = await page.evaluate(
    ({ idLivro, indice }) =>
      window.RegistroLeituras.obter(idLivro).questionario.filter(
        (pergunta) => pergunta.tipo !== 'ditado'
      )[indice].respostaCorreta,
    { idLivro: livroId, indice: indicePerguntaObjetiva }
  );
  const alternativa = page.locator(`[data-alternativa-id="${respostaCorreta}"]`);
  await expect(alternativa).toHaveCount(1);
  const letra = await alternativa.locator('.letra-opcao').textContent();
  await alternativa.click();
  return letra;
}

function verificarDistribuicaoEquilibrada(letras) {
  expect(new Set(letras)).toEqual(new Set(['A', 'B', 'C', 'D']));
  const quantidades = ['A', 'B', 'C', 'D'].map(
    (letra) => letras.filter((item) => item === letra).length
  );
  expect(Math.max(...quantidades) - Math.min(...quantidades)).toBeLessThanOrEqual(1);
  expect(letras.join('')).not.toBe('ABCDABCDAB'.slice(0, letras.length));
}

test.beforeEach(async ({ page }) => {
  await page.goto(CAMINHO);
  await limparSomenteChavesDoAmbiente(page);
  await page.reload();
});

test('carrega a tela inicial e registra todas as revisões sem chaves duplicadas', async ({
  page,
}) => {
  await expect(page.getByRole('heading', { name: 'Revisões Escolares' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Alice/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Mariana/ })).toBeVisible();
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);

  const registro = await page.evaluate(() =>
    window.RegistroRevisoes.listar().map(({ id, cartaoId, painelId, chaveArmazenamento }) => ({
      id,
      cartaoId,
      painelId,
      chaveArmazenamento,
      elementosExistem: Boolean(
        document.getElementById(cartaoId) && document.getElementById(painelId)
      ),
    }))
  );
  expect(registro).toHaveLength(25);
  expect(new Set(registro.map((item) => item.chaveArmazenamento)).size).toBe(25);
  expect(registro.every((item) => item.elementosExistem)).toBe(true);
});

test('oferece Inglês para os dois perfis e usa áudio bilíngue local com repetição', async ({
  page,
}) => {
  await page.evaluate(() => {
    window.__falasIngles = [];
    window.__cancelamentosIngles = 0;
    window.SpeechSynthesisUtterance = function (texto) {
      this.text = texto;
    };
    window.speechSynthesis.getVoices = function () {
      return [
        { name: 'Microsoft Zira Desktop', lang: 'en-US', localService: true },
        { name: 'Microsoft Maria Desktop', lang: 'pt-BR', localService: true },
        { name: 'Remote English', lang: 'en-US', localService: false },
      ];
    };
    window.speechSynthesis.cancel = function () {
      window.__cancelamentosIngles += 1;
    };
    window.speechSynthesis.resume = function () {};
    window.speechSynthesis.speak = function (fala) {
      window.__falasIngles.push({
        texto: fala.text,
        idioma: fala.lang,
        velocidade: fala.rate,
        volume: fala.volume,
        voz: fala.voice && fala.voice.name,
      });
      if (typeof fala.onstart === 'function') fala.onstart();
      if (typeof fala.onend === 'function') fala.onend();
    };
    window.AudioRevisoes.atualizarVozes();
  });

  await page.getByRole('button', { name: /Alice/ }).click();
  await expect(page.getByRole('button', { name: /Inglês/ })).toBeVisible();
  await page.getByRole('button', { name: /Inglês/ }).click();
  await expect(page.getByRole('heading', { name: 'English Review – Unit 3' })).toBeVisible();
  await expect(page.getByText(/Microsoft Zira Desktop/)).toBeVisible();
  await expect(page.getByText(/Microsoft Maria Desktop/)).toBeVisible();

  await page.locator('[data-item-ingles="book"]').click();
  await page.getByRole('button', { name: '🔊 Ouvir em inglês' }).click();
  await expect(page.getByRole('status')).toContainText('começará em 1 segundo');
  await page.waitForTimeout(700);
  expect(await page.evaluate(() => window.__falasIngles)).toHaveLength(0);
  await expect.poll(() => page.evaluate(() => window.__falasIngles.length)).toBe(3);

  await page.getByRole('button', { name: '🐢 Ouvir devagar' }).click();
  await expect.poll(() => page.evaluate(() => window.__falasIngles.length)).toBe(6);
  await page.getByRole('button', { name: '🔁 Repetir' }).click();
  await expect.poll(() => page.evaluate(() => window.__falasIngles.length)).toBe(9);
  await page.getByRole('button', { name: '🔊 Ouvir instrução' }).click();
  await expect.poll(() => page.evaluate(() => window.__falasIngles.length)).toBe(12);

  const falas = await page.evaluate(() => window.__falasIngles);
  expect(falas.slice(0, 3).map((fala) => fala.texto)).toEqual(['Ready.', 'Listen.', 'book']);
  expect(falas[0]).toMatchObject({ idioma: 'en-US', volume: 0.01 });
  expect(falas[1]).toMatchObject({ texto: 'Listen.', idioma: 'en-US', volume: 1 });
  expect(falas[2]).toMatchObject({
    idioma: 'en-US',
    velocidade: 0.62,
    voz: 'Microsoft Zira Desktop',
  });
  expect(falas[5]).toMatchObject({ texto: 'book', idioma: 'en-US', velocidade: 0.5 });
  expect(falas[8]).toMatchObject({ texto: 'book', idioma: 'en-US', velocidade: 0.5 });
  expect(falas[9]).toMatchObject({ texto: 'Preparando.', idioma: 'pt-BR', volume: 0.01 });
  expect(falas[10]).toMatchObject({ texto: 'Atenção.', idioma: 'pt-BR', volume: 1 });
  expect(falas[11].texto).toContain('Escolha um objeto escolar');
  expect(falas[11]).toMatchObject({ idioma: 'pt-BR', voz: 'Microsoft Maria Desktop' });

  await page.getByRole('button', { name: '⏹ Parar' }).click();
  await expect(page.getByRole('status')).toContainText('Áudio interrompido');
  const salvo = await page.evaluate(
    (chave) => JSON.parse(localStorage.getItem(chave)),
    CHAVE_INGLES_ALICE
  );
  expect(salvo.itensOuvidos).toContain('book');
  expect(salvo.reproducoes).toBe(3);
  await expect(page.getByText('1 de 27 palavras e frases ouvidas')).toBeVisible();

  await page.getByRole('button', { name: 'Voltar ao início' }).click();
  await page.getByRole('button', { name: /Mariana/ }).click();
  await expect(page.getByRole('button', { name: /Inglês/ })).toBeVisible();
  await page.getByRole('button', { name: /Inglês/ }).click();
  await expect(page.getByText('0 de 27 palavras e frases ouvidas')).toBeVisible();
  expect(
    await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_INGLES_MARIANA)
  ).toBeNull();
});

test('libera 10 atividades após os 27 áudios, corrige somente ao final e separa os perfis', async ({
  page,
}) => {
  await page.evaluate((chave) => {
    const unidade = window.RegistroIngles.obter('at-school-unidade-3');
    const itensOuvidos = unidade.grupos.flatMap((grupo) => grupo.itens.map((item) => item.id));
    localStorage.setItem(
      chave,
      JSON.stringify({
        unidadeId: unidade.id,
        versao: 1,
        grupoAtual: unidade.grupos[0].id,
        itemAtual: unidade.grupos[0].itens[0].id,
        itensOuvidos,
        reproducoes: itensOuvidos.length,
        iniciado: true,
      })
    );
  }, CHAVE_INGLES_ALICE);
  await page.reload();

  await page.getByRole('button', { name: /Alice/ }).click();
  await page.getByRole('button', { name: /Inglês/ }).click();
  await expect(page.getByText('27 de 27 palavras e frases ouvidas')).toBeVisible();
  await page.getByRole('button', { name: 'Começar as 10 atividades →' }).click();
  await expect(page.getByText('Atividade 1 de 10')).toBeVisible();

  const posicoesCorretas = [];
  for (let indice = 0; indice < 10; indice += 1) {
    const dados = await page.evaluate(() => {
      const estado = window.InglesRevisoes.obterEstado('alice');
      const questao =
        window.RegistroIngles.obter('at-school-unidade-3').atividades[estado.questaoAtual];
      return {
        indice: estado.questaoAtual,
        correta: questao.respostaCorreta,
        errada: questao.alternativas.find(
          (alternativa) => alternativa.id !== questao.respostaCorreta
        ).id,
      };
    });
    const alternativas = page.locator('[data-alternativa-atividade-ingles]');
    const idsExibidos = await alternativas.evaluateAll((elementos) =>
      elementos.map((elemento) => elemento.dataset.alternativaAtividadeIngles)
    );
    posicoesCorretas.push(idsExibidos.indexOf(dados.correta));
    await page
      .locator(
        `[data-alternativa-atividade-ingles="${indice === 0 ? dados.errada : dados.correta}"]`
      )
      .click();
    await expect(
      page.getByRole('status').filter({ hasText: /correção aparecerá somente/ })
    ).toBeVisible();
    await expect(page.locator('.item-revisao-ingles')).toHaveCount(0);
    await page
      .getByRole('button', { name: indice === 9 ? 'Conferir respostas ✓' : 'Próxima →' })
      .click();
  }

  expect(new Set(posicoesCorretas)).toEqual(new Set([0, 1, 2, 3]));
  await expect(page.getByText('Alice, você acertou 9 de 10 atividades.')).toBeVisible();
  await expect(page.locator('.item-revisao-ingles')).toHaveCount(10);
  await expect(page.locator('.item-revisao-ingles.errou')).toHaveCount(1);
  await expect(page.locator('.item-revisao-ingles.errou')).toContainText('Resposta certa:');
  await expect(page.locator('.item-revisao-ingles.errou')).toContainText('Por quê?');

  const salvoAlice = await page.evaluate(
    (chave) => JSON.parse(localStorage.getItem(chave)),
    CHAVE_INGLES_ALICE
  );
  expect(salvoAlice.atividadeFinalizada).toBe(true);
  expect(Object.keys(salvoAlice.respostasAtividades)).toHaveLength(10);

  await page.getByRole('button', { name: 'Voltar ao início' }).click();
  await page.getByRole('button', { name: /Mariana/ }).click();
  await page.getByRole('button', { name: /Inglês/ }).click();
  await expect(page.getByText('0 de 27 palavras e frases ouvidas')).toBeVisible();
  await expect(page.getByRole('button', { name: '🔒 Ouça os 27 itens primeiro' })).toBeDisabled();
  expect(
    await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_INGLES_MARIANA)
  ).toBeNull();
});

test('mostra a recompensa final da Mita com a mensagem correta para cada menina', async ({
  page,
}) => {
  await page.evaluate(
    ({ chaveAlice, chaveMariana }) => {
      const unidade = window.RegistroIngles.obter('at-school-unidade-3');
      const estadoConcluido = {
        itensOuvidos: unidade.grupos.flatMap((grupo) => grupo.itens.map((item) => item.id)),
        respostasAtividades: Object.fromEntries(
          unidade.atividades.map((questao) => [questao.id, questao.respostaCorreta])
        ),
        iniciado: true,
        atividadeIniciada: true,
        atividadeFinalizada: true,
        tentativasAtividade: 1,
      };
      localStorage.setItem(chaveAlice, JSON.stringify(estadoConcluido));
      localStorage.setItem(chaveMariana, JSON.stringify(estadoConcluido));
    },
    { chaveAlice: CHAVE_INGLES_ALICE, chaveMariana: CHAVE_INGLES_MARIANA }
  );
  await page.reload();

  const mensagens = {
    Alice:
      'Alice, invadi o computador de vocês, li tudo e vi que você é muito estudiosa, espero que você volte a jogar e me liberte da Mita Day Mochi má! Como prova da minha gratidão, vou te enviar pelos correios um presentinho. Ah, vi que você gosta de Minecraft, né?',
    Mariana:
      'Mariana, invadi o computador de vocês, li tudo e vi que você é muito estudiosa, e em breve deve me libertar da Mita Day Mochi má, como prova da minha gratidão, vou te enviar pelos correios um presentinho. Ah, vi que você gosta de Minecraft, né?',
  };

  for (const [indice, perfil] of ['Alice', 'Mariana'].entries()) {
    if (indice > 0) await page.getByRole('button', { name: 'Voltar ao início' }).click();
    await page.getByRole('button', { name: new RegExp(perfil) }).click();
    await page.getByRole('button', { name: /Inglês/ }).click();
    await page.getByRole('button', { name: 'Ver resultado das atividades →' }).click();
    await expect(page.getByText(mensagens[perfil], { exact: true })).toBeVisible();
    await expect(page.getByText('Beijos.')).toBeVisible();
    await expect(page.getByText('Mita.', { exact: true })).toBeVisible();
    const imagemCarregada = await page
      .locator('#ingles-surpresa-final img')
      .evaluate((imagem) => imagem.complete && imagem.naturalWidth > 0);
    expect(imagemCarregada).toBe(true);
  }
});

test('mostra Leitura e o mesmo catálogo para Alice e Mariana', async ({ page }) => {
  for (const perfil of ['Alice', 'Mariana']) {
    await abrirBiblioteca(page, perfil);
    const dinheiro = page.locator(`[data-livro-id="${LIVRO_DINHEIRO}"]`);
    const rei = page.locator(`[data-livro-id="${LIVRO_REI}"]`);
    const galinha = page.locator(`[data-livro-id="${LIVRO_GALINHA}"]`);
    const raposa = page.locator(`[data-livro-id="${LIVRO_RAPOSA}"]`);
    const sol = page.locator(`[data-livro-id="${LIVRO_SOL}"]`);
    const formiga = page.locator(`[data-livro-id="${LIVRO_FORMIGA}"]`);
    const castelo = page.locator(`[data-livro-id="${LIVRO_CASTELO}"]`);
    const bela = page.locator(`[data-livro-id="${LIVRO_BELA}"]`);
    const joaninha = page.locator(`[data-livro-id="${LIVRO_JOANINHA}"]`);
    const formigaEspecial = page.locator(`[data-livro-id="${LIVRO_FORMIGA_ESPECIAL}"]`);
    await expect(
      dinheiro.getByRole('heading', { name: 'Primeiras Lições sobre Dinheiro' })
    ).toBeVisible();
    await expect(dinheiro.getByText('Anderson Abreu')).toBeVisible();
    await expect(dinheiro.getByText('25 páginas')).toBeVisible();
    await expect(dinheiro.getByText('Não iniciado')).toBeVisible();
    await expect(rei.getByRole('heading', { name: 'Quem é o rei dos animais?' })).toBeVisible();
    await expect(rei.getByText('Nádia Aguiar')).toBeVisible();
    await expect(rei.getByText('32 páginas')).toBeVisible();
    await expect(rei.getByText('Não iniciado')).toBeVisible();
    await expect(
      galinha.getByRole('heading', { name: 'A Galinha dos Ovos de Ouro' })
    ).toBeVisible();
    await expect(galinha.getByText('Esopo')).toBeVisible();
    await expect(galinha.getByText(/Adaptação: Anderson Abreu/)).toBeVisible();
    await expect(galinha.getByText('35 páginas')).toBeVisible();
    await expect(galinha.getByText('Não iniciado')).toBeVisible();
    await expect(raposa.getByRole('heading', { name: 'A Raposa e as Uvas' })).toBeVisible();
    await expect(raposa.getByText(/Esopo/)).toBeVisible();
    await expect(raposa.getByText(/Adaptação: Anderson Abreu/)).toBeVisible();
    await expect(raposa.getByText(/Ilustrações: Elder Franca/)).toBeVisible();
    await expect(raposa.getByText('21 páginas')).toBeVisible();
    await expect(raposa.getByText('Não iniciado')).toBeVisible();
    await expect(sol.getByRole('heading', { name: 'O dia que o Sol tirou férias' })).toBeVisible();
    await expect(sol.getByText(/Barbara Samel Rocha Tostes/)).toBeVisible();
    await expect(sol.getByText(/Ilustrações: Lionel Mota/)).toBeVisible();
    await expect(sol.getByText('30 páginas')).toBeVisible();
    await expect(sol.getByText('Não iniciado')).toBeVisible();
    await expect(
      formiga.getByRole('heading', { name: 'A formiga que queria cantar' })
    ).toBeVisible();
    await expect(formiga.getByText(/Aparecida Machado/)).toBeVisible();
    await expect(formiga.getByText(/Ilustrações: Raisa Christina/)).toBeVisible();
    await expect(formiga.getByText('36 páginas')).toBeVisible();
    await expect(formiga.getByText('Não iniciado')).toBeVisible();
    await expect(castelo.getByRole('heading', { name: 'Um castelo bem assombrado' })).toBeVisible();
    await expect(castelo.getByText(/Lícia Holanda/)).toBeVisible();
    await expect(castelo.getByText(/Ilustrações: Juliana Chagas/)).toBeVisible();
    await expect(castelo.getByText('25 páginas')).toBeVisible();
    await expect(castelo.getByText('Não iniciado')).toBeVisible();
    await expect(bela.getByRole('heading', { name: 'A Bela Desadormecida' })).toBeVisible();
    await expect(bela.getByText(/Frances Minters/)).toBeVisible();
    await expect(bela.getByText(/Ilustrações: G\. Brian Karas/)).toBeVisible();
    await expect(bela.getByText('30 páginas')).toBeVisible();
    await expect(bela.getByText('Não iniciado')).toBeVisible();
    await expect(
      joaninha.getByRole('heading', { name: 'A Joaninha que Perdeu as Pintinhas' })
    ).toBeVisible();
    await expect(joaninha.getByText(/Ducarmo Paes/)).toBeVisible();
    await expect(joaninha.getByText(/Ilustrações: Jefferson Pereira Galdino/)).toBeVisible();
    await expect(joaninha.getByText('21 páginas')).toBeVisible();
    await expect(joaninha.getByText('Não iniciado')).toBeVisible();
    await expect(
      formigaEspecial.getByRole('heading', { name: 'Uma Formiga Especial' })
    ).toBeVisible();
    await expect(formigaEspecial.getByText(/Márcia Honora/)).toBeVisible();
    await expect(formigaEspecial.getByText(/Ilustrações: Index Art & Studio/)).toBeVisible();
    await expect(formigaEspecial.getByText('31 páginas')).toBeVisible();
    await expect(formigaEspecial.getByText('Não iniciado')).toBeVisible();
    await page.getByRole('button', { name: 'Voltar ao início' }).click();
  }
});

test('serve e renderiza A Galinha dos Ovos de Ouro para os dois perfis', async ({
  page,
  request,
}) => {
  const resposta = await request.get(
    '/ambiente_interativo/leituras/a-galinha-dos-ovos-de-ouro/galinha-ovos-ouro.pdf'
  );
  expect(resposta.ok()).toBe(true);
  await conferirTamanhoPdfLocal(resposta, 3_254_433);

  for (const perfil of ['Alice', 'Mariana']) {
    await abrirLivro(page, perfil, LIVRO_GALINHA);
    await expect(page.getByText('Página 1 de 35')).toBeVisible();
    await expect(page.locator('#canvas-livro')).toHaveAttribute(
      'aria-label',
      'Página 1 do livro A Galinha dos Ovos de Ouro'
    );
    await page.getByRole('button', { name: 'Voltar ao início' }).click();
  }

  const dados = await page.evaluate(async () => {
    const livro = window.RegistroLeituras.obter('a-galinha-dos-ovos-de-ouro');
    const documento = await window.PDFJSLocal.getDocument({
      url: new window.URL(livro.arquivoPdf, document.baseURI).href,
    }).promise;
    return {
      paginasPdf: documento.numPages,
      perguntas: livro.questionario.length,
      ditados: livro.questionario.filter((pergunta) => pergunta.tipo === 'ditado').length,
    };
  });
  expect(dados).toEqual({ paginasPdf: 35, perguntas: 12, ditados: 3 });
});

test('serve e renderiza A Raposa e as Uvas para os dois perfis', async ({ page, request }) => {
  const resposta = await request.get(
    '/ambiente_interativo/leituras/a-raposa-e-as-uvas/raposa-e-as-uvas.pdf'
  );
  expect(resposta.ok()).toBe(true);
  await conferirTamanhoPdfLocal(resposta, 5_223_267);

  for (const perfil of ['Alice', 'Mariana']) {
    await abrirLivro(page, perfil, LIVRO_RAPOSA);
    await expect(page.getByText('Página 1 de 21')).toBeVisible();
    await expect(page.locator('#canvas-livro')).toHaveAttribute(
      'aria-label',
      'Página 1 do livro A Raposa e as Uvas'
    );
    await page.getByRole('button', { name: 'Voltar ao início' }).click();
  }

  const dados = await page.evaluate(async () => {
    const livro = window.RegistroLeituras.obter('a-raposa-e-as-uvas');
    const documento = await window.PDFJSLocal.getDocument({
      url: new window.URL(livro.arquivoPdf, document.baseURI).href,
    }).promise;
    return {
      paginasPdf: documento.numPages,
      perguntas: livro.questionario.length,
      objetivas: livro.questionario.filter((pergunta) => pergunta.tipo !== 'ditado').length,
      ditados: livro.questionario.filter((pergunta) => pergunta.tipo === 'ditado').length,
      alternativas: livro.questionario
        .filter((pergunta) => pergunta.tipo !== 'ditado')
        .map((pergunta) => pergunta.alternativas.length),
    };
  });
  expect(dados).toEqual({
    paginasPdf: 21,
    perguntas: 13,
    objetivas: 10,
    ditados: 3,
    alternativas: Array(10).fill(4),
  });
});

test('serve e renderiza O dia que o Sol tirou férias para os dois perfis', async ({
  page,
  request,
}) => {
  const resposta = await request.get(
    '/ambiente_interativo/leituras/o-dia-que-o-sol-tirou-ferias/o-dia-que-o-sol-tirou-ferias.pdf'
  );
  expect(resposta.ok()).toBe(true);
  await conferirTamanhoPdfLocal(resposta, 8_568_669);
  const imagemEclipse = await request.get(
    '/ambiente_interativo/leituras/o-dia-que-o-sol-tirou-ferias/eclipse-solar.png'
  );
  expect(imagemEclipse.ok()).toBe(true);
  expect((await imagemEclipse.body()).byteLength).toBe(1_794_553);

  for (const perfil of ['Alice', 'Mariana']) {
    await abrirLivro(page, perfil, LIVRO_SOL);
    await expect(page.getByText('Página 1 de 30')).toBeVisible();
    await expect(page.locator('#canvas-livro')).toHaveAttribute(
      'aria-label',
      'Página 1 do livro O dia que o Sol tirou férias'
    );
    await page.getByRole('button', { name: 'Voltar ao início' }).click();
  }

  const dados = await page.evaluate(async () => {
    const livro = window.RegistroLeituras.obter('o-dia-que-o-sol-tirou-ferias');
    const documento = await window.PDFJSLocal.getDocument({
      url: new window.URL(livro.arquivoPdf, document.baseURI).href,
    }).promise;
    return {
      paginasPdf: documento.numPages,
      perguntas: livro.questionario.length,
      objetivas: livro.questionario.filter((pergunta) => pergunta.tipo !== 'ditado').length,
      ditados: livro.questionario.filter((pergunta) => pergunta.tipo === 'ditado').length,
      alternativas: livro.questionario
        .filter((pergunta) => pergunta.tipo !== 'ditado')
        .map((pergunta) => pergunta.alternativas.length),
      glossario: livro.glossarioPorPagina,
      explicacao: livro.explicacaoFinal.titulo,
    };
  });
  expect(dados).toEqual({
    paginasPdf: 30,
    perguntas: 13,
    objetivas: 10,
    ditados: 3,
    alternativas: Array(10).fill(4),
    glossario: {
      5: ['apavoradas'],
      9: ['famintas'],
      11: ['substituto'],
      15: ['intelectuais'],
      23: ['desanimados'],
      30: ['eclipseSolar'],
    },
    explicacao: 'O que aconteceu? Foi um eclipse solar!',
  });
});

test('serve e renderiza A formiga que queria cantar para os dois perfis', async ({
  page,
  request,
}) => {
  const resposta = await request.get(
    '/ambiente_interativo/leituras/a-formiga-que-queria-cantar/a-formiga-que-queria-cantar.pdf'
  );
  expect(resposta.ok()).toBe(true);
  await conferirTamanhoPdfLocal(resposta, 7_373_329);

  for (const perfil of ['Alice', 'Mariana']) {
    await abrirLivro(page, perfil, LIVRO_FORMIGA);
    await expect(page.getByText('Página 1 de 36')).toBeVisible();
    await expect(page.locator('#canvas-livro')).toHaveAttribute(
      'aria-label',
      'Página 1 do livro A formiga que queria cantar'
    );
    await page.getByRole('button', { name: 'Voltar ao início' }).click();
  }

  const dados = await page.evaluate(async () => {
    const livro = window.RegistroLeituras.obter('a-formiga-que-queria-cantar');
    const documento = await window.PDFJSLocal.getDocument({
      url: new window.URL(livro.arquivoPdf, document.baseURI).href,
    }).promise;
    return {
      paginasPdf: documento.numPages,
      perguntas: livro.questionario.length,
      objetivas: livro.questionario.filter((pergunta) => pergunta.tipo !== 'ditado').length,
      ditados: livro.questionario.filter((pergunta) => pergunta.tipo === 'ditado').length,
      alternativas: livro.questionario
        .filter((pergunta) => pergunta.tipo !== 'ditado')
        .map((pergunta) => pergunta.alternativas.length),
      glossario: livro.glossarioPorPagina,
    };
  });
  expect(dados).toEqual({
    paginasPdf: 36,
    perguntas: 13,
    objetivas: 10,
    ditados: 3,
    alternativas: Array(10).fill(4),
    glossario: {
      7: ['rouxinol'],
      11: ['altiva'],
      16: ['rebulico', 'melancolica'],
      19: ['clamou'],
      21: ['celestial'],
      22: ['orquestra'],
      29: ['ensaios'],
      30: ['estreia', 'radiante'],
      33: ['plateia', 'delirou'],
    },
  });
});

test('serve e renderiza Um castelo bem assombrado para os dois perfis', async ({
  page,
  request,
}) => {
  const resposta = await request.get(
    '/ambiente_interativo/leituras/um-castelo-bem-assombrado/um-castelo-bem-assombrado.pdf'
  );
  expect(resposta.ok()).toBe(true);
  await conferirTamanhoPdfLocal(resposta, 19_039_385);

  for (const perfil of ['Alice', 'Mariana']) {
    await abrirLivro(page, perfil, LIVRO_CASTELO);
    await expect(page.getByText('Página 1 de 25')).toBeVisible();
    await expect(page.locator('#canvas-livro')).toHaveAttribute(
      'aria-label',
      'Página 1 do livro Um castelo bem assombrado'
    );
    await page.getByRole('button', { name: 'Voltar ao início' }).click();
  }

  const dados = await page.evaluate(async () => {
    const livro = window.RegistroLeituras.obter('um-castelo-bem-assombrado');
    const documento = await window.PDFJSLocal.getDocument({
      url: new window.URL(livro.arquivoPdf, document.baseURI).href,
    }).promise;
    return {
      paginasPdf: documento.numPages,
      perguntas: livro.questionario.length,
      objetivas: livro.questionario.filter((pergunta) => pergunta.tipo !== 'ditado').length,
      ditados: livro.questionario.filter((pergunta) => pergunta.tipo === 'ditado').length,
      alternativas: livro.questionario
        .filter((pergunta) => pergunta.tipo !== 'ditado')
        .map((pergunta) => pergunta.alternativas.length),
      glossario: livro.glossarioPorPagina,
    };
  });
  expect(dados).toEqual({
    paginasPdf: 25,
    perguntas: 13,
    objetivas: 10,
    ditados: 3,
    alternativas: Array(10).fill(4),
    glossario: {
      6: ['lenda', 'paradeiro'],
      9: ['casarao', 'inconformados', 'vagavam'],
      13: ['pasma', 'desvendar'],
      17: ['lustre'],
      20: ['traumatizados'],
      21: ['reforma'],
    },
  });
});

test('serve e renderiza A Bela Desadormecida para os dois perfis', async ({ page, request }) => {
  const resposta = await request.get(
    '/ambiente_interativo/leituras/a-bela-desadormecida/a-bela-desadormecida.pdf'
  );
  expect(resposta.ok()).toBe(true);
  await conferirTamanhoPdfLocal(resposta, 12_308_597);

  for (const perfil of ['Alice', 'Mariana']) {
    await abrirLivro(page, perfil, LIVRO_BELA);
    await expect(page.getByText('Página 1 de 30')).toBeVisible();
    await expect(page.locator('#canvas-livro')).toHaveAttribute(
      'aria-label',
      'Página 1 do livro A Bela Desadormecida'
    );
    await page.getByRole('button', { name: 'Voltar ao início' }).click();
  }

  const dados = await page.evaluate(async () => {
    const livro = window.RegistroLeituras.obter('a-bela-desadormecida');
    const documento = await window.PDFJSLocal.getDocument({
      url: new window.URL(livro.arquivoPdf, document.baseURI).href,
    }).promise;
    return {
      paginasPdf: documento.numPages,
      perguntas: livro.questionario.length,
      objetivas: livro.questionario.filter((pergunta) => pergunta.tipo !== 'ditado').length,
      ditados: livro.questionario.filter((pergunta) => pergunta.tipo === 'ditado').length,
      alternativas: livro.questionario
        .filter((pergunta) => pergunta.tipo !== 'ditado')
        .map((pergunta) => pergunta.alternativas.length),
      glossario: livro.glossarioPorPagina,
    };
  });
  expect(dados).toEqual({
    paginasPdf: 30,
    perguntas: 13,
    objetivas: 10,
    ditados: 3,
    alternativas: Array(10).fill(4),
    glossario: {
      1: ['desadormecida'],
      7: ['cotoveladas'],
      9: ['formosa'],
      16: ['longPlay'],
      18: ['desalmada', 'seculo'],
      23: ['feitico'],
      26: ['intrometida'],
    },
  });
});

test('serve e renderiza A Joaninha que Perdeu as Pintinhas para os dois perfis', async ({
  page,
  request,
}) => {
  const resposta = await request.get(
    '/ambiente_interativo/leituras/a-joaninha-que-perdeu-as-pintinhas/a-joaninha-que-perdeu-as-pintinhas.pdf'
  );
  expect(resposta.ok()).toBe(true);
  await conferirTamanhoPdfLocal(resposta, 1_133_910);

  for (const perfil of ['Alice', 'Mariana']) {
    await abrirLivro(page, perfil, LIVRO_JOANINHA);
    await expect(page.getByText('Página 1 de 21')).toBeVisible();
    await expect(page.locator('#canvas-livro')).toHaveAttribute(
      'aria-label',
      'Página 1 do livro A Joaninha que Perdeu as Pintinhas'
    );
    await page.getByRole('button', { name: 'Voltar ao início' }).click();
  }

  const dados = await page.evaluate(async () => {
    const livro = window.RegistroLeituras.obter('a-joaninha-que-perdeu-as-pintinhas');
    const documento = await window.PDFJSLocal.getDocument({
      url: new window.URL(livro.arquivoPdf, document.baseURI).href,
    }).promise;
    return {
      paginasPdf: documento.numPages,
      perguntas: livro.questionario.length,
      objetivas: livro.questionario.filter((pergunta) => pergunta.tipo !== 'ditado').length,
      ditados: livro.questionario.filter((pergunta) => pergunta.tipo === 'ditado').length,
      alternativas: livro.questionario
        .filter((pergunta) => pergunta.tipo !== 'ditado')
        .map((pergunta) => pergunta.alternativas.length),
      glossario: livro.glossarioPorPagina,
    };
  });
  expect(dados).toEqual({
    paginasPdf: 21,
    perguntas: 13,
    objetivas: 10,
    ditados: 3,
    alternativas: Array(10).fill(4),
    glossario: {
      3: ['debatia'],
      4: ['margem'],
      9: ['navegar'],
      13: ['lancada'],
      15: ['cabisbaixa'],
      16: ['retratava'],
      20: ['inseparavel'],
    },
  });
});

test('serve e renderiza o novo livro completo para os dois perfis', async ({ page, request }) => {
  const resposta = await request.get(
    '/ambiente_interativo/leituras/quem-e-o-rei-dos-animais/rei-dos-animais.pdf'
  );
  expect(resposta.ok()).toBe(true);
  await conferirTamanhoPdfLocal(resposta, 4_371_565);

  for (const perfil of ['Alice', 'Mariana']) {
    await abrirLivro(page, perfil, LIVRO_REI);
    await expect(page.getByText('Página 1 de 32')).toBeVisible();
    await expect(page.locator('#canvas-livro')).toHaveAttribute(
      'aria-label',
      'Página 1 do livro Quem é o rei dos animais?'
    );
    await page.getByRole('button', { name: 'Voltar ao início' }).click();
  }

  const paginasPdf = await page.evaluate(async () => {
    const livro = window.RegistroLeituras.obter('quem-e-o-rei-dos-animais');
    const documento = await window.PDFJSLocal.getDocument({
      url: new window.URL(livro.arquivoPdf, document.baseURI).href,
    }).promise;
    return documento.numPages;
  });
  expect(paginasPdf).toBe(32);
});

test('serve o PDF local completo e renderiza a primeira página no canvas', async ({
  page,
  request,
}) => {
  const resposta = await request.get(
    '/ambiente_interativo/leituras/primeiras-licoes-sobre-dinheiro/infantil-dinheiro.pdf'
  );
  expect(resposta.ok()).toBe(true);
  await conferirTamanhoPdfLocal(resposta, 14_842_959);

  await abrirLivro(page, 'Alice');
  await expect(page.getByText('Página 1 de 25')).toBeVisible();
  await expect(page.locator('#pagina-anterior-leitura')).toBeDisabled();
  await expect(page.locator('#canvas-livro')).toHaveAttribute(
    'aria-label',
    'Página 1 do livro Primeiras Lições sobre Dinheiro'
  );
  const dadosCanvas = await page.locator('#canvas-livro').evaluate((canvas) => ({
    width: canvas.width,
    height: canvas.height,
    pixel: Array.from(canvas.getContext('2d').getImageData(20, 20, 1, 1).data),
  }));
  expect(dadosCanvas.width).toBeGreaterThan(500);
  expect(dadosCanvas.height).toBeGreaterThan(300);
  expect(dadosCanvas.pixel[3]).toBe(255);
  const paginasPdf = await page.evaluate(async () => {
    const livro = window.RegistroLeituras.obter('primeiras-licoes-dinheiro');
    const documento = await window.PDFJSLocal.getDocument({
      url: new window.URL(livro.arquivoPdf, document.baseURI).href,
    }).promise;
    return documento.numPages;
  });
  expect(paginasPdf).toBe(25);
});

test('salva a navegação, restaura a página e cancela renderizações antigas', async ({ page }) => {
  await abrirLivro(page, 'Alice');
  await page.getByRole('button', { name: 'Próxima página' }).click();
  await expect(page.locator('#canvas-livro')).toHaveAttribute(
    'aria-label',
    'Página 2 do livro Primeiras Lições sobre Dinheiro'
  );
  await expect
    .poll(() =>
      page.evaluate(
        (chave) => JSON.parse(localStorage.getItem(chave)).paginaAtual,
        CHAVE_LEITURA_ALICE
      )
    )
    .toBe(2);

  await page.reload();
  await abrirBiblioteca(page, 'Alice');
  const cartaoDinheiro = page.locator(`[data-livro-id="${LIVRO_DINHEIRO}"]`);
  await expect(cartaoDinheiro.getByRole('button', { name: /Continuar da página 2/ })).toBeVisible();
  await cartaoDinheiro.getByRole('button', { name: /Continuar da página 2/ }).click();
  await expect(page.locator('#canvas-livro')).toHaveAttribute(
    'aria-label',
    'Página 2 do livro Primeiras Lições sobre Dinheiro'
  );

  await page.evaluate(() => {
    window.LeituraRevisoes.irParaPagina(5);
    window.LeituraRevisoes.irParaPagina(6);
    window.LeituraRevisoes.irParaPagina(7);
  });
  await expect(page.locator('#canvas-livro')).toHaveAttribute(
    'aria-label',
    'Página 7 do livro Primeiras Lições sobre Dinheiro'
  );
  await expect(page.getByText('Página 7 de 25')).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        (chave) => JSON.parse(localStorage.getItem(chave)).paginaAtual,
        CHAVE_LEITURA_ALICE
      )
    )
    .toBe(7);
});

test('chega à página 25, responde às 10 perguntas e salva a conclusão', async ({ page }) => {
  await abrirLivro(page, 'Alice');
  await page.locator('#ir-pagina-leitura').fill('25');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await expect(page.locator('#canvas-livro')).toHaveAttribute(
    'aria-label',
    'Página 25 do livro Primeiras Lições sobre Dinheiro'
  );
  await page.getByRole('button', { name: 'Terminei a leitura - responder perguntas' }).click();
  await expect(page.getByText('Pergunta 1 de 10')).toBeVisible();

  const letrasCorretas = [];
  for (let indice = 1; indice <= 10; indice += 1) {
    await expect(page.locator('.opcao-leitura')).toHaveCount(4);
    letrasCorretas.push(await clicarAlternativaCorreta(page, LIVRO_DINHEIRO, indice - 1));
    await page.getByRole('button', { name: 'Conferir resposta' }).click();
    await expect(page.locator('.retorno-pergunta-leitura')).not.toBeEmpty();
    await page
      .getByRole('button', { name: indice === 10 ? 'Ver resultado' : 'Próxima pergunta' })
      .click();
  }
  verificarDistribuicaoEquilibrada(letrasCorretas);

  await expect(page.getByRole('heading', { name: 'Leitura concluída!' })).toBeVisible();
  await expect(page.getByText('10 de 10 acertos')).toBeVisible();
  const salvo = await page.evaluate(
    (chave) => JSON.parse(localStorage.getItem(chave)),
    CHAVE_LEITURA_ALICE
  );
  expect(salvo.questionarioConcluido).toBe(true);
  expect(salvo.leituraConcluida).toBe(true);
  expect(Object.keys(salvo.respostas)).toHaveLength(10);
  expect(salvo.acertos).toBe(10);
});

test('conclui Quem é o rei dos animais com 10 perguntas para Mariana', async ({ page }) => {
  await abrirLivro(page, 'Mariana', LIVRO_REI);
  await page.locator('#ir-pagina-leitura').fill('32');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await expect(page.locator('#canvas-livro')).toHaveAttribute(
    'aria-label',
    'Página 32 do livro Quem é o rei dos animais?'
  );
  await page.getByRole('button', { name: 'Terminei a leitura - responder perguntas' }).click();
  await expect(page.getByText('Pergunta 1 de 10')).toBeVisible();

  const letrasCorretas = [];
  for (let indice = 1; indice <= 10; indice += 1) {
    await expect(page.locator('.opcao-leitura')).toHaveCount(4);
    letrasCorretas.push(await clicarAlternativaCorreta(page, LIVRO_REI, indice - 1));
    await page.getByRole('button', { name: 'Conferir resposta' }).click();
    await page
      .getByRole('button', { name: indice === 10 ? 'Ver resultado' : 'Próxima pergunta' })
      .click();
  }
  verificarDistribuicaoEquilibrada(letrasCorretas);

  await expect(page.getByRole('heading', { name: 'Leitura concluída!' })).toBeVisible();
  await expect(page.getByText('10 de 10 acertos')).toBeVisible();
  const salvo = await page.evaluate(
    (chave) => JSON.parse(localStorage.getItem(chave)),
    CHAVE_REI_MARIANA
  );
  expect(salvo.livroId).toBe(LIVRO_REI);
  expect(salvo.leituraConcluida).toBe(true);
  expect(Object.keys(salvo.respostas)).toHaveLength(10);
  expect(
    await page.evaluate(
      ({ antigo, irma }) => ({
        antigo: localStorage.getItem(antigo),
        irma: localStorage.getItem(irma),
      }),
      { antigo: CHAVE_LEITURA_MARIANA, irma: CHAVE_REI_ALICE }
    )
  ).toEqual({ antigo: null, irma: null });
});

test('conclui A Galinha dos Ovos de Ouro com 9 perguntas e 3 ditados', async ({ page }) => {
  await abrirLivro(page, 'Alice', LIVRO_GALINHA);
  await page.locator('#ir-pagina-leitura').fill('35');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await expect(page.locator('#canvas-livro')).toHaveAttribute(
    'aria-label',
    'Página 35 do livro A Galinha dos Ovos de Ouro'
  );
  await page.getByRole('button', { name: 'Terminei a leitura - responder perguntas' }).click();
  await expect(page.getByText('Pergunta 1 de 12')).toBeVisible();

  const letrasCorretas = [];
  for (let indice = 1; indice <= 9; indice += 1) {
    await expect(page.locator('.opcao-leitura')).toHaveCount(4);
    letrasCorretas.push(await clicarAlternativaCorreta(page, LIVRO_GALINHA, indice - 1));
    await page.getByRole('button', { name: 'Conferir resposta' }).click();
    await page.getByRole('button', { name: 'Próxima pergunta' }).click();
  }
  verificarDistribuicaoEquilibrada(letrasCorretas);

  await page.evaluate(() => {
    window.__ditadosNoTeste = [];
    window.__preparacoesDitadoNoTeste = [];
    window.speechSynthesis.cancel = function () {};
    window.speechSynthesis.speak = function (fala) {
      if (fala.text === 'Atenção.') {
        window.__preparacoesDitadoNoTeste.push({
          texto: fala.text,
          iniciadoEm: window.performance.now(),
        });
      } else {
        window.__ditadosNoTeste.push({ texto: fala.text, iniciadoEm: window.performance.now() });
      }
      if (typeof fala.onstart === 'function') fala.onstart();
      if (typeof fala.onend === 'function') fala.onend();
    };
  });

  const respostasDitado = [
    'A gratidao protege a gente da cobica',
    'Um ovo por dia era o bastante.',
    'Tudo o que é vivo e bom cresce devagar.',
  ];
  for (let indice = 0; indice < respostasDitado.length; indice += 1) {
    await expect(page.getByText(`Pergunta ${indice + 10} de 12`)).toBeVisible();
    const cliqueEm = await page.evaluate(() => window.performance.now());
    await page.getByRole('button', { name: '🔊 Ouvir ditado' }).click();
    await expect(page.getByText(/O ditado começará em 1 segundo/)).toBeVisible();
    await page.waitForTimeout(700);
    expect(await page.evaluate(() => window.__ditadosNoTeste.length)).toBe(indice);
    await expect.poll(() => page.evaluate(() => window.__ditadosNoTeste.length)).toBe(indice + 1);
    const atrasoInicial = await page.evaluate(
      ({ posicao, inicio }) => window.__ditadosNoTeste[posicao].iniciadoEm - inicio,
      { posicao: indice, inicio: cliqueEm }
    );
    expect(atrasoInicial).toBeGreaterThanOrEqual(1450);
    await page.getByLabel('Digite o que você ouviu').fill(respostasDitado[indice]);
    await page.getByRole('button', { name: 'Conferir resposta' }).click();
    await page
      .getByRole('button', { name: indice === 2 ? 'Ver resultado' : 'Próxima pergunta' })
      .click();
  }

  await expect(page.getByRole('heading', { name: 'Leitura concluída!' })).toBeVisible();
  await expect(page.getByText('12 de 12 acertos')).toBeVisible();
  expect(await page.evaluate(() => window.__ditadosNoTeste.map((ditado) => ditado.texto))).toEqual([
    'A gratidão protege a gente da cobiça.',
    'Um ovo por dia era o bastante.',
    'Tudo o que é vivo e bom cresce devagar.',
  ]);
  expect(
    await page.evaluate(() =>
      window.__preparacoesDitadoNoTeste.map((preparacao) => preparacao.texto)
    )
  ).toEqual(['Atenção.', 'Atenção.', 'Atenção.']);
  const salvo = await page.evaluate(
    (chave) => JSON.parse(localStorage.getItem(chave)),
    CHAVE_GALINHA_ALICE
  );
  expect(salvo.livroId).toBe(LIVRO_GALINHA);
  expect(salvo.leituraConcluida).toBe(true);
  expect(Object.keys(salvo.respostas)).toHaveLength(12);
  expect(salvo.acertos).toBe(12);
  expect(
    await page.evaluate(
      ({ outraLeitura, irma }) => ({
        outraLeitura: localStorage.getItem(outraLeitura),
        irma: localStorage.getItem(irma),
      }),
      { outraLeitura: CHAVE_LEITURA_ALICE, irma: CHAVE_GALINHA_MARIANA }
    )
  ).toEqual({ outraLeitura: null, irma: null });
});

test('explica cobiça no questionário sem alterar resposta, pontos ou progresso', async ({
  page,
}) => {
  const indicePergunta = await page.evaluate(
    (livroId) =>
      window.RegistroLeituras.obter(livroId).questionario.findIndex(
        (pergunta) => pergunta.id === 'mudanca-agricultor'
      ),
    LIVRO_GALINHA
  );
  await page.evaluate(
    ({ chave, perguntaAtual }) => {
      localStorage.setItem(
        chave,
        JSON.stringify({
          paginaAtual: 35,
          maiorPaginaAlcancada: 35,
          paginasVisitadas: [35],
          perguntaAtual,
          leituraIniciada: true,
        })
      );
    },
    { chave: CHAVE_GALINHA_ALICE, perguntaAtual: indicePergunta }
  );
  await page.reload();
  await abrirLivro(page, 'Alice', LIVRO_GALINHA);
  await page.getByRole('button', { name: 'Terminei a leitura - responder perguntas' }).click();

  const ajuda = page.getByRole('button', { name: 'Ver significado de cobiça' });
  await expect(ajuda).toBeVisible();
  const estadoAntes = await page.evaluate(
    (chave) => localStorage.getItem(chave),
    CHAVE_GALINHA_ALICE
  );
  await ajuda.click();
  const dialogo = page.getByRole('dialog');
  await expect(dialogo.getByRole('heading', { name: 'cobiça' })).toBeVisible();
  await expect(
    dialogo.getByText('Vontade muito forte de possuir alguma coisa, mesmo sem precisar dela.')
  ).toBeVisible();
  await expect(
    dialogo.getByText('Ela sentiu cobiça ao ver a coleção de brinquedos da amiga.')
  ).toBeVisible();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_GALINHA_ALICE)).toBe(
    estadoAntes
  );
  await dialogo.getByRole('button', { name: 'Fechar explicação' }).click();
  await expect(ajuda).toBeFocused();
});

test('mostra somente as palavras cadastradas para a página atual do PDF', async ({ page }) => {
  await abrirLivro(page, 'Alice', LIVRO_REI);
  const botaoPalavras = page.getByRole('button', { name: '📘 Palavras desta página' });
  await expect(botaoPalavras).toBeHidden();
  await page.locator('#ir-pagina-leitura').fill('10');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await expect(page.locator('#canvas-livro')).toHaveAttribute(
    'aria-label',
    'Página 10 do livro Quem é o rei dos animais?'
  );
  await expect(botaoPalavras).toBeVisible();
  const estadoAntes = await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_REI_ALICE);
  await botaoPalavras.click();
  const dialogo = page.getByRole('dialog');
  await expect(dialogo.getByRole('heading', { name: 'Palavras desta página' })).toBeVisible();
  await expect(dialogo.getByRole('heading', { name: 'convivência' })).toBeVisible();
  await expect(
    dialogo.getByText('É viver, estudar ou passar tempo junto com outras pessoas.')
  ).toBeVisible();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_REI_ALICE)).toBe(
    estadoAntes
  );
  await dialogo.getByRole('button', { name: 'Fechar explicação' }).click();
  await page.getByRole('button', { name: 'Próxima página →' }).click();
  await expect(page.locator('#canvas-livro')).toHaveAttribute(
    'aria-label',
    'Página 11 do livro Quem é o rei dos animais?'
  );
  await expect(botaoPalavras).toBeHidden();
});

test('conclui A Raposa e as Uvas com 10 perguntas e 3 ditados', async ({ page }) => {
  await abrirLivro(page, 'Mariana', LIVRO_RAPOSA);
  await page.locator('#ir-pagina-leitura').fill('21');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await expect(page.locator('#canvas-livro')).toHaveAttribute(
    'aria-label',
    'Página 21 do livro A Raposa e as Uvas'
  );
  await page.getByRole('button', { name: 'Terminei a leitura - responder perguntas' }).click();
  await expect(page.getByText('Pergunta 1 de 13')).toBeVisible();

  const letrasCorretas = [];
  for (let indice = 1; indice <= 10; indice += 1) {
    await expect(page.locator('.opcao-leitura')).toHaveCount(4);
    letrasCorretas.push(await clicarAlternativaCorreta(page, LIVRO_RAPOSA, indice - 1));
    await page.getByRole('button', { name: 'Conferir resposta' }).click();
    await page.getByRole('button', { name: 'Próxima pergunta' }).click();
  }
  verificarDistribuicaoEquilibrada(letrasCorretas);

  await page.evaluate(() => {
    window.__ditadosRaposaNoTeste = [];
    window.__preparacoesDitadoRaposaNoTeste = [];
    window.speechSynthesis.cancel = function () {};
    window.speechSynthesis.speak = function (fala) {
      if (fala.text === 'Atenção.') {
        window.__preparacoesDitadoRaposaNoTeste.push({
          texto: fala.text,
          iniciadoEm: window.performance.now(),
        });
      } else {
        window.__ditadosRaposaNoTeste.push({
          texto: fala.text,
          iniciadoEm: window.performance.now(),
        });
      }
      if (typeof fala.onstart === 'function') fala.onstart();
      if (typeof fala.onend === 'function') fala.onend();
    };
  });

  const respostasDitado = [
    'As uvas estavam maduras e doces',
    'Eu tentei e ainda nao consegui.',
    'Dizer a verdade ajuda a gente a crescer.',
  ];
  for (let indice = 0; indice < respostasDitado.length; indice += 1) {
    await expect(page.getByText(`Pergunta ${indice + 11} de 13`)).toBeVisible();
    const cliqueEm = await page.evaluate(() => window.performance.now());
    await page.getByRole('button', { name: '🔊 Ouvir ditado' }).click();
    await expect(page.getByText(/O ditado começará em 1 segundo/)).toBeVisible();
    await page.waitForTimeout(700);
    expect(await page.evaluate(() => window.__ditadosRaposaNoTeste.length)).toBe(indice);
    await expect
      .poll(() => page.evaluate(() => window.__ditadosRaposaNoTeste.length))
      .toBe(indice + 1);
    const atrasoInicial = await page.evaluate(
      ({ posicao, inicio }) => window.__ditadosRaposaNoTeste[posicao].iniciadoEm - inicio,
      { posicao: indice, inicio: cliqueEm }
    );
    expect(atrasoInicial).toBeGreaterThanOrEqual(1450);
    await page.getByLabel('Digite o que você ouviu').fill(respostasDitado[indice]);
    await page.getByRole('button', { name: 'Conferir resposta' }).click();
    await page
      .getByRole('button', { name: indice === 2 ? 'Ver resultado' : 'Próxima pergunta' })
      .click();
  }

  await expect(page.getByRole('heading', { name: 'Leitura concluída!' })).toBeVisible();
  await expect(page.getByText('13 de 13 acertos')).toBeVisible();
  expect(
    await page.evaluate(() => window.__ditadosRaposaNoTeste.map((ditado) => ditado.texto))
  ).toEqual([
    'As uvas estavam maduras e doces.',
    'Eu tentei e ainda não consegui.',
    'Dizer a verdade ajuda a gente a crescer.',
  ]);
  expect(
    await page.evaluate(() =>
      window.__preparacoesDitadoRaposaNoTeste.map((preparacao) => preparacao.texto)
    )
  ).toEqual(['Atenção.', 'Atenção.', 'Atenção.']);
  const salvo = await page.evaluate(
    (chave) => JSON.parse(localStorage.getItem(chave)),
    CHAVE_RAPOSA_MARIANA
  );
  expect(salvo.livroId).toBe(LIVRO_RAPOSA);
  expect(salvo.leituraConcluida).toBe(true);
  expect(Object.keys(salvo.respostas)).toHaveLength(13);
  expect(salvo.acertos).toBe(13);
  expect(
    await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_RAPOSA_ALICE)
  ).toBeNull();
});

test('explica o eclipse e conclui O dia que o Sol tirou férias com 13 perguntas', async ({
  page,
}) => {
  await abrirLivro(page, 'Mariana', LIVRO_SOL);
  await page.locator('#ir-pagina-leitura').fill('30');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await expect(page.locator('#canvas-livro')).toHaveAttribute(
    'aria-label',
    'Página 30 do livro O dia que o Sol tirou férias'
  );
  await expect(
    page.getByRole('heading', { name: 'O que aconteceu? Foi um eclipse solar!' })
  ).toBeVisible();
  await expect(
    page.getByText('O Sol não tirou férias de verdade.', { exact: false })
  ).toBeVisible();
  await expect(page.getByText(/nunca olhe diretamente para o Sol/)).toBeVisible();
  await expect(page.locator('#imagem-explicacao-final-leitura')).toHaveAttribute(
    'alt',
    /a Lua escura passa na frente do Sol/
  );
  await expect(
    page.getByRole('button', { name: 'Ver significado de eclipse solar' })
  ).toBeVisible();
  await page.getByRole('button', { name: 'Ver significado de eclipse solar' }).click();
  await expect(page.getByRole('dialog').getByText(/a Lua passa na frente do Sol/)).toBeVisible();
  await page.getByRole('dialog').getByRole('button', { name: 'Fechar explicação' }).click();
  await page.getByRole('button', { name: 'Entendi o eclipse - responder perguntas' }).click();
  await expect(page.getByText('Pergunta 1 de 13')).toBeVisible();

  const letrasCorretas = [];
  for (let indice = 1; indice <= 10; indice += 1) {
    await expect(page.locator('.opcao-leitura')).toHaveCount(4);
    letrasCorretas.push(await clicarAlternativaCorreta(page, LIVRO_SOL, indice - 1));
    await page.getByRole('button', { name: 'Conferir resposta' }).click();
    await page.getByRole('button', { name: 'Próxima pergunta' }).click();
  }
  verificarDistribuicaoEquilibrada(letrasCorretas);

  await page.evaluate(() => {
    window.__ditadosSolNoTeste = [];
    window.__preparacoesDitadoSolNoTeste = [];
    window.speechSynthesis.cancel = function () {};
    window.speechSynthesis.speak = function (fala) {
      if (fala.text === 'Atenção.') {
        window.__preparacoesDitadoSolNoTeste.push({ texto: fala.text, volume: fala.volume });
      } else {
        window.__ditadosSolNoTeste.push({
          texto: fala.text,
          iniciadoEm: window.performance.now(),
        });
      }
      if (typeof fala.onstart === 'function') fala.onstart();
      if (typeof fala.onend === 'function') fala.onend();
    };
  });

  const respostasDitado = [
    'A floresta ficou escura sem a luz do Sol',
    'Os animais esperaram juntos pelo Sol.',
    'No eclipse solar, a Lua passa na frente do Sol.',
  ];
  for (let indice = 0; indice < respostasDitado.length; indice += 1) {
    await expect(page.getByText(`Pergunta ${indice + 11} de 13`)).toBeVisible();
    const cliqueEm = await page.evaluate(() => window.performance.now());
    await page.getByRole('button', { name: '🔊 Ouvir ditado' }).click();
    await expect(page.getByText(/O ditado começará em 1 segundo/)).toBeVisible();
    await page.waitForTimeout(700);
    expect(await page.evaluate(() => window.__ditadosSolNoTeste.length)).toBe(indice);
    await expect
      .poll(() => page.evaluate(() => window.__ditadosSolNoTeste.length))
      .toBe(indice + 1);
    const atrasoInicial = await page.evaluate(
      ({ posicao, inicio }) => window.__ditadosSolNoTeste[posicao].iniciadoEm - inicio,
      { posicao: indice, inicio: cliqueEm }
    );
    expect(atrasoInicial).toBeGreaterThanOrEqual(1450);
    await page.getByLabel('Digite o que você ouviu').fill(respostasDitado[indice]);
    await page.getByRole('button', { name: 'Conferir resposta' }).click();
    await page
      .getByRole('button', { name: indice === 2 ? 'Ver resultado' : 'Próxima pergunta' })
      .click();
  }

  await expect(page.getByRole('heading', { name: 'Leitura concluída!' })).toBeVisible();
  await expect(page.getByText('13 de 13 acertos')).toBeVisible();
  expect(
    await page.evaluate(() => window.__ditadosSolNoTeste.map((ditado) => ditado.texto))
  ).toEqual([
    'A floresta ficou escura sem a luz do Sol.',
    'Os animais esperaram juntos pelo Sol.',
    'No eclipse solar, a Lua passa na frente do Sol.',
  ]);
  expect(await page.evaluate(() => window.__preparacoesDitadoSolNoTeste)).toEqual([
    { texto: 'Atenção.', volume: 1 },
    { texto: 'Atenção.', volume: 1 },
    { texto: 'Atenção.', volume: 1 },
  ]);
  const salvo = await page.evaluate(
    (chave) => JSON.parse(localStorage.getItem(chave)),
    CHAVE_SOL_MARIANA
  );
  expect(salvo.livroId).toBe(LIVRO_SOL);
  expect(salvo.leituraConcluida).toBe(true);
  expect(Object.keys(salvo.respostas)).toHaveLength(13);
  expect(salvo.acertos).toBe(13);
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_SOL_ALICE)).toBeNull();
});

test('conclui A formiga que queria cantar com glossário, quatro alternativas e ditados sem corte', async ({
  page,
}) => {
  await abrirLivro(page, 'Alice', LIVRO_FORMIGA);
  await page.locator('#ir-pagina-leitura').fill('16');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await expect(page.locator('#canvas-livro')).toHaveAttribute(
    'aria-label',
    'Página 16 do livro A formiga que queria cantar'
  );
  await page.getByRole('button', { name: /Palavras desta página/ }).click();
  const dialogo = page.getByRole('dialog');
  await expect(dialogo.getByRole('heading', { name: 'rebuliço' })).toBeVisible();
  await expect(dialogo.getByRole('heading', { name: 'melancólica' })).toBeVisible();
  await dialogo.getByRole('button', { name: 'Fechar explicação' }).click();

  await page.locator('#ir-pagina-leitura').fill('36');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await expect(page.locator('#canvas-livro')).toHaveAttribute(
    'aria-label',
    'Página 36 do livro A formiga que queria cantar'
  );
  await page.getByRole('button', { name: 'Terminei a leitura - responder perguntas' }).click();
  await expect(page.getByText('Pergunta 1 de 13')).toBeVisible();

  const letrasCorretas = [];
  for (let indice = 1; indice <= 10; indice += 1) {
    await expect(page.locator('.opcao-leitura')).toHaveCount(4);
    letrasCorretas.push(await clicarAlternativaCorreta(page, LIVRO_FORMIGA, indice - 1));
    await page.getByRole('button', { name: 'Conferir resposta' }).click();
    await page.getByRole('button', { name: 'Próxima pergunta' }).click();
  }
  verificarDistribuicaoEquilibrada(letrasCorretas);

  await page.evaluate(() => {
    window.__falasFormigaNoTeste = [];
    window.speechSynthesis.cancel = function () {};
    window.speechSynthesis.speak = function (fala) {
      window.__falasFormigaNoTeste.push({
        texto: fala.text,
        iniciadoEm: window.performance.now(),
      });
      if (typeof fala.onstart === 'function') fala.onstart();
      if (typeof fala.onend === 'function') fala.onend();
    };
  });

  const respostasDitado = [
    'Felipa sonhava em cantar para o mundo',
    'Dom convidou Felipa para a orquestra da floresta.',
    'Quem acredita no sonho encontra coragem para continuar.',
  ];
  const frasesEsperadas = [
    'Felipa sonhava em cantar para o mundo.',
    'Dom convidou Felipa para a orquestra da floresta.',
    'Quem acredita no sonho encontra coragem para continuar.',
  ];
  for (let indice = 0; indice < respostasDitado.length; indice += 1) {
    await expect(page.getByText(`Pergunta ${indice + 11} de 13`)).toBeVisible();
    await expect(page.getByText(/Você ouvirá “Atenção” e, depois, a frase/)).toBeVisible();
    const cliqueEm = await page.evaluate(() => window.performance.now());
    await page.getByRole('button', { name: '🔊 Ouvir ditado' }).click();
    await expect(page.getByText(/O ditado começará em 1 segundo/)).toBeVisible();
    await page.waitForTimeout(700);
    expect(await page.evaluate(() => window.__falasFormigaNoTeste.length)).toBe(indice * 2);
    await expect
      .poll(() => page.evaluate(() => window.__falasFormigaNoTeste.length))
      .toBe(indice * 2 + 2);
    const tempos = await page.evaluate(
      ({ posicao, inicio }) => ({
        preparacao: window.__falasFormigaNoTeste[posicao].iniciadoEm - inicio,
        frase:
          window.__falasFormigaNoTeste[posicao + 1].iniciadoEm -
          window.__falasFormigaNoTeste[posicao].iniciadoEm,
      }),
      { posicao: indice * 2, inicio: cliqueEm }
    );
    expect(tempos.preparacao).toBeGreaterThanOrEqual(900);
    expect(tempos.frase).toBeGreaterThanOrEqual(550);
    await page.getByLabel('Digite o que você ouviu').fill(respostasDitado[indice]);
    await page.getByRole('button', { name: 'Conferir resposta' }).click();
    await page
      .getByRole('button', { name: indice === 2 ? 'Ver resultado' : 'Próxima pergunta' })
      .click();
  }

  await expect(page.getByRole('heading', { name: 'Leitura concluída!' })).toBeVisible();
  await expect(page.getByText('13 de 13 acertos')).toBeVisible();
  expect(await page.evaluate(() => window.__falasFormigaNoTeste.map((fala) => fala.texto))).toEqual(
    frasesEsperadas.flatMap((frase) => ['Atenção.', frase])
  );
  const salvo = await page.evaluate(
    (chave) => JSON.parse(localStorage.getItem(chave)),
    CHAVE_FORMIGA_ALICE
  );
  expect(salvo.livroId).toBe(LIVRO_FORMIGA);
  expect(salvo.leituraConcluida).toBe(true);
  expect(Object.keys(salvo.respostas)).toHaveLength(13);
  expect(salvo.acertos).toBe(13);
  expect(
    await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_FORMIGA_MARIANA)
  ).toBeNull();
});

test('conclui Um castelo bem assombrado com glossário, respostas misturadas e ditados sem corte', async ({
  page,
}) => {
  await abrirLivro(page, 'Mariana', LIVRO_CASTELO);
  await page.locator('#ir-pagina-leitura').fill('9');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await expect(page.locator('#canvas-livro')).toHaveAttribute(
    'aria-label',
    'Página 9 do livro Um castelo bem assombrado'
  );
  await page.getByRole('button', { name: /Palavras desta página/ }).click();
  const dialogo = page.getByRole('dialog');
  await expect(dialogo.getByRole('heading', { name: 'casarão' })).toBeVisible();
  await expect(dialogo.getByRole('heading', { name: 'inconformados' })).toBeVisible();
  await expect(dialogo.getByRole('heading', { name: 'vagavam' })).toBeVisible();
  await dialogo.getByRole('button', { name: 'Fechar explicação' }).click();

  await page.locator('#ir-pagina-leitura').fill('25');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await expect(page.locator('#canvas-livro')).toHaveAttribute(
    'aria-label',
    'Página 25 do livro Um castelo bem assombrado'
  );
  await page.getByRole('button', { name: 'Terminei a leitura - responder perguntas' }).click();
  await expect(page.getByText('Pergunta 1 de 13')).toBeVisible();

  const letrasCorretas = [];
  for (let indice = 1; indice <= 10; indice += 1) {
    await expect(page.locator('.opcao-leitura')).toHaveCount(4);
    letrasCorretas.push(await clicarAlternativaCorreta(page, LIVRO_CASTELO, indice - 1));
    await page.getByRole('button', { name: 'Conferir resposta' }).click();
    await page.getByRole('button', { name: 'Próxima pergunta' }).click();
  }
  verificarDistribuicaoEquilibrada(letrasCorretas);

  await page.evaluate(() => {
    window.__falasCasteloNoTeste = [];
    window.speechSynthesis.cancel = function () {};
    window.speechSynthesis.speak = function (fala) {
      window.__falasCasteloNoTeste.push({
        texto: fala.text,
        iniciadoEm: window.performance.now(),
      });
      if (typeof fala.onstart === 'function') fala.onstart();
      if (typeof fala.onend === 'function') fala.onend();
    };
  });

  const respostasDitado = [
    'Julia era corajosa e queria descobrir a verdade',
    'Os lencois balancavam com o vento.',
    'Lorena explicou os misterios do velho casarao.',
  ];
  const frasesEsperadas = [
    'Júlia era corajosa e queria descobrir a verdade.',
    'Os lençóis balançavam com o vento.',
    'Lorena explicou os mistérios do velho casarão.',
  ];
  for (let indice = 0; indice < respostasDitado.length; indice += 1) {
    await expect(page.getByText(`Pergunta ${indice + 11} de 13`)).toBeVisible();
    await expect(page.getByText(/Você ouvirá “Atenção” e, depois, a frase/)).toBeVisible();
    const cliqueEm = await page.evaluate(() => window.performance.now());
    await page.getByRole('button', { name: '🔊 Ouvir ditado' }).click();
    await expect(page.getByText(/O ditado começará em 1 segundo/)).toBeVisible();
    await page.waitForTimeout(700);
    expect(await page.evaluate(() => window.__falasCasteloNoTeste.length)).toBe(indice * 2);
    await expect
      .poll(() => page.evaluate(() => window.__falasCasteloNoTeste.length))
      .toBe(indice * 2 + 2);
    const tempos = await page.evaluate(
      ({ posicao, inicio }) => ({
        preparacao: window.__falasCasteloNoTeste[posicao].iniciadoEm - inicio,
        frase:
          window.__falasCasteloNoTeste[posicao + 1].iniciadoEm -
          window.__falasCasteloNoTeste[posicao].iniciadoEm,
      }),
      { posicao: indice * 2, inicio: cliqueEm }
    );
    expect(tempos.preparacao).toBeGreaterThanOrEqual(900);
    expect(tempos.frase).toBeGreaterThanOrEqual(550);
    await page.getByLabel('Digite o que você ouviu').fill(respostasDitado[indice]);
    await page.getByRole('button', { name: 'Conferir resposta' }).click();
    await page
      .getByRole('button', { name: indice === 2 ? 'Ver resultado' : 'Próxima pergunta' })
      .click();
  }

  await expect(page.getByRole('heading', { name: 'Leitura concluída!' })).toBeVisible();
  await expect(page.getByText('13 de 13 acertos')).toBeVisible();
  expect(await page.evaluate(() => window.__falasCasteloNoTeste.map((fala) => fala.texto))).toEqual(
    frasesEsperadas.flatMap((frase) => ['Atenção.', frase])
  );
  const salvo = await page.evaluate(
    (chave) => JSON.parse(localStorage.getItem(chave)),
    CHAVE_CASTELO_MARIANA
  );
  expect(salvo.livroId).toBe(LIVRO_CASTELO);
  expect(salvo.leituraConcluida).toBe(true);
  expect(Object.keys(salvo.respostas)).toHaveLength(13);
  expect(salvo.acertos).toBe(13);
  expect(
    await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_CASTELO_ALICE)
  ).toBeNull();
});

test('conclui A Bela Desadormecida com glossário, respostas misturadas e ditados sem corte', async ({
  page,
}) => {
  await abrirLivro(page, 'Alice', LIVRO_BELA);
  await page.locator('#ir-pagina-leitura').fill('18');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await expect(page.locator('#canvas-livro')).toHaveAttribute(
    'aria-label',
    'Página 18 do livro A Bela Desadormecida'
  );
  await page.getByRole('button', { name: /Palavras desta página/ }).click();
  const dialogo = page.getByRole('dialog');
  await expect(dialogo.getByRole('heading', { name: 'desalmada' })).toBeVisible();
  await expect(dialogo.getByRole('heading', { name: 'século' })).toBeVisible();
  await dialogo.getByRole('button', { name: 'Fechar explicação' }).click();

  await page.locator('#ir-pagina-leitura').fill('30');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await expect(page.locator('#canvas-livro')).toHaveAttribute(
    'aria-label',
    'Página 30 do livro A Bela Desadormecida'
  );
  await page.getByRole('button', { name: 'Terminei a leitura - responder perguntas' }).click();
  await expect(page.getByText('Pergunta 1 de 10')).toBeVisible();

  const letrasCorretas = [];
  for (let indice = 1; indice <= 10; indice += 1) {
    await expect(page.locator('.opcao-leitura')).toHaveCount(4);
    await expect(page.getByRole('button', { name: 'Conferir resposta' })).toHaveCount(0);
    if (indice === 2) {
      const respostaCorreta = await page.evaluate(
        ({ idLivro, indicePergunta }) =>
          window.RegistroLeituras.obter(idLivro).questionario.filter(
            (pergunta) => pergunta.tipo !== 'ditado'
          )[indicePergunta].respostaCorreta,
        { idLivro: LIVRO_BELA, indicePergunta: indice - 1 }
      );
      letrasCorretas.push(
        await page.locator(`[data-alternativa-id="${respostaCorreta}"] .letra-opcao`).textContent()
      );
      await page
        .locator(`.opcao-leitura:not([data-alternativa-id="${respostaCorreta}"])`)
        .first()
        .click();
    } else {
      letrasCorretas.push(await clicarAlternativaCorreta(page, LIVRO_BELA, indice - 1));
    }
    await expect(page.locator('.opcao-leitura.correta, .opcao-leitura.incorreta')).toHaveCount(0);
    await page
      .getByRole('button', {
        name: indice === 10 ? 'Finalizar perguntas e ver revisão' : 'Próxima pergunta',
      })
      .click();
  }
  verificarDistribuicaoEquilibrada(letrasCorretas);

  await expect(page.getByRole('heading', { name: 'Vamos revisar suas respostas!' })).toBeVisible();
  await expect(page.getByText('Você acertou 9 de 10 perguntas.', { exact: true })).toBeVisible();
  await expect(page.getByText('✓ Você acertou').first()).toBeVisible();
  const questaoErrada = page
    .locator('.item-revisao-questionario.incorreta')
    .filter({ hasText: 'Por que os pais de Bela organizaram uma festa?' });
  await expect(questaoErrada).toContainText('Você marcou:');
  await expect(questaoErrada).toContainText('Resposta certa: Para comemorar o nascimento de Bela');
  await expect(questaoErrada).toContainText(
    'A festa foi preparada para comemorar a chegada de Bela'
  );
  await expect(page.getByRole('button', { name: '🔊 Ouvir ditado' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Continuar para os ditados' }).click();

  await page.evaluate(() => {
    window.__falasBelaNoTeste = [];
    window.speechSynthesis.cancel = function () {};
    window.speechSynthesis.speak = function (fala) {
      window.__falasBelaNoTeste.push({
        texto: fala.text,
        iniciadoEm: window.performance.now(),
      });
      if (typeof fala.onstart === 'function') fala.onstart();
      if (typeof fala.onend === 'function') fala.onend();
    };
  });

  const respostasDitado = [
    'Bela acordou com o toque do despertador',
    'A bruxa levou um disco antigo de presente',
    'Bela escreveu um bilhete para o roqueiro',
  ];
  const frasesEsperadas = [
    'Bela acordou com o toque do despertador.',
    'A bruxa levou um disco antigo de presente.',
    'Bela escreveu um bilhete para o roqueiro.',
  ];
  for (let indice = 0; indice < respostasDitado.length; indice += 1) {
    await expect(page.getByText(`Ditado ${indice + 1} de 3`)).toBeVisible();
    await expect(page.getByText(/Você ouvirá “Atenção” e, depois, a frase/)).toBeVisible();
    const cliqueEm = await page.evaluate(() => window.performance.now());
    await page.getByRole('button', { name: '🔊 Ouvir ditado' }).click();
    await expect(page.getByText(/O ditado começará em 1 segundo/)).toBeVisible();
    await page.waitForTimeout(700);
    expect(await page.evaluate(() => window.__falasBelaNoTeste.length)).toBe(indice * 2);
    await expect
      .poll(() => page.evaluate(() => window.__falasBelaNoTeste.length))
      .toBe(indice * 2 + 2);
    const tempos = await page.evaluate(
      ({ posicao, inicio }) => ({
        preparacao: window.__falasBelaNoTeste[posicao].iniciadoEm - inicio,
        frase:
          window.__falasBelaNoTeste[posicao + 1].iniciadoEm -
          window.__falasBelaNoTeste[posicao].iniciadoEm,
      }),
      { posicao: indice * 2, inicio: cliqueEm }
    );
    expect(tempos.preparacao).toBeGreaterThanOrEqual(900);
    expect(tempos.frase).toBeGreaterThanOrEqual(550);
    await page.getByLabel('Digite o que você ouviu').fill(respostasDitado[indice]);
    await page.getByRole('button', { name: 'Conferir resposta' }).click();
    await page
      .getByRole('button', { name: indice === 2 ? 'Ver resultado' : 'Próxima pergunta' })
      .click();
  }

  await expect(page.getByRole('heading', { name: 'Leitura concluída!' })).toBeVisible();
  await expect(page.getByText('12 de 13 acertos')).toBeVisible();
  expect(await page.evaluate(() => window.__falasBelaNoTeste.map((fala) => fala.texto))).toEqual(
    frasesEsperadas.flatMap((frase) => ['Atenção.', frase])
  );
  const salvo = await page.evaluate(
    (chave) => JSON.parse(localStorage.getItem(chave)),
    CHAVE_BELA_ALICE
  );
  expect(salvo.livroId).toBe(LIVRO_BELA);
  expect(salvo.leituraConcluida).toBe(true);
  expect(Object.keys(salvo.respostas)).toHaveLength(13);
  expect(salvo.acertos).toBe(12);
  expect(
    await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_BELA_MARIANA)
  ).toBeNull();
});

test('aplica a correção conjunta de A Bela Desadormecida também para Mariana', async ({ page }) => {
  await abrirLivro(page, 'Mariana', LIVRO_BELA);
  await page.locator('#ir-pagina-leitura').fill('30');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await page.getByRole('button', { name: 'Terminei a leitura - responder perguntas' }).click();

  for (let indice = 1; indice <= 10; indice += 1) {
    await expect(page.getByText(`Pergunta ${indice} de 10`)).toBeVisible();
    await clicarAlternativaCorreta(page, LIVRO_BELA, indice - 1);
    await expect(page.locator('.retorno-pergunta-leitura')).toHaveCount(0);
    await page
      .getByRole('button', {
        name: indice === 10 ? 'Finalizar perguntas e ver revisão' : 'Próxima pergunta',
      })
      .click();
  }

  await expect(page.getByRole('heading', { name: 'Vamos revisar suas respostas!' })).toBeVisible();
  await expect(page.getByText('Você acertou 10 de 10 perguntas.', { exact: true })).toBeVisible();
  await expect(page.locator('.item-revisao-questionario.correta')).toHaveCount(10);
  const salvo = await page.evaluate(
    (chave) => JSON.parse(localStorage.getItem(chave)),
    CHAVE_BELA_MARIANA
  );
  expect(Object.keys(salvo.perguntasCorrigidas)).toHaveLength(10);
  expect(salvo.acertos).toBe(10);
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_BELA_ALICE)).toBeNull();
});

test('conclui A Joaninha que Perdeu as Pintinhas com glossário, mistura e ditados protegidos', async ({
  page,
}) => {
  await abrirLivro(page, 'Alice', LIVRO_JOANINHA);
  await page.locator('#ir-pagina-leitura').fill('15');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await page.getByRole('button', { name: /Palavras desta página/ }).click();
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'cabisbaixa' })).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText('Com a cabeça abaixada');
  await page.getByRole('dialog').getByRole('button', { name: 'Fechar explicação' }).click();

  await page.locator('#ir-pagina-leitura').fill('21');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await page.getByRole('button', { name: 'Terminei a leitura - responder perguntas' }).click();

  const letrasAlice = [];
  for (let indice = 1; indice <= 10; indice += 1) {
    await expect(page.getByText(`Pergunta ${indice} de 10`)).toBeVisible();
    await expect(page.locator('.opcao-leitura')).toHaveCount(4);
    letrasAlice.push(await clicarAlternativaCorreta(page, LIVRO_JOANINHA, indice - 1));
    await expect(page.locator('.opcao-leitura.correta, .opcao-leitura.incorreta')).toHaveCount(0);
    await page
      .getByRole('button', {
        name: indice === 10 ? 'Finalizar perguntas e ver revisão' : 'Próxima pergunta',
      })
      .click();
  }
  verificarDistribuicaoEquilibrada(letrasAlice);
  await expect(page.getByRole('heading', { name: 'Vamos revisar suas respostas!' })).toBeVisible();
  await expect(page.getByText('Você acertou 10 de 10 perguntas.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Continuar para os ditados' }).click();

  await page.evaluate(() => {
    window.__falasJoaninhaNoTeste = [];
    window.speechSynthesis.cancel = function () {};
    window.speechSynthesis.speak = function (fala) {
      window.__falasJoaninhaNoTeste.push({
        texto: fala.text,
        iniciadoEm: window.performance.now(),
      });
      if (typeof fala.onstart === 'function') fala.onstart();
      if (typeof fala.onend === 'function') fala.onend();
    };
  });

  const respostasDitado = [
    'Tininha voltou ao rio para procurar suas pintinhas',
    'O pintor desenhou novas pintas em suas asas',
    'Dona Joana abraçou a filha quando ela voltou',
  ];
  const frasesEsperadas = [
    'Tininha voltou ao rio para procurar suas pintinhas.',
    'O pintor desenhou novas pintas em suas asas.',
    'Dona Joana abraçou a filha quando ela voltou.',
  ];
  for (let indice = 0; indice < respostasDitado.length; indice += 1) {
    await expect(page.getByText(`Ditado ${indice + 1} de 3`)).toBeVisible();
    const cliqueEm = await page.evaluate(() => window.performance.now());
    await page.getByRole('button', { name: '🔊 Ouvir ditado' }).click();
    await expect(page.getByText(/O ditado começará em 1 segundo/)).toBeVisible();
    await page.waitForTimeout(700);
    expect(await page.evaluate(() => window.__falasJoaninhaNoTeste.length)).toBe(indice * 2);
    await expect
      .poll(() => page.evaluate(() => window.__falasJoaninhaNoTeste.length))
      .toBe(indice * 2 + 2);
    const tempos = await page.evaluate(
      ({ posicao, inicio }) => ({
        preparacao: window.__falasJoaninhaNoTeste[posicao].iniciadoEm - inicio,
        frase:
          window.__falasJoaninhaNoTeste[posicao + 1].iniciadoEm -
          window.__falasJoaninhaNoTeste[posicao].iniciadoEm,
      }),
      { posicao: indice * 2, inicio: cliqueEm }
    );
    expect(tempos.preparacao).toBeGreaterThanOrEqual(900);
    expect(tempos.frase).toBeGreaterThanOrEqual(550);
    await page.getByLabel('Digite o que você ouviu').fill(respostasDitado[indice]);
    await page.getByRole('button', { name: 'Conferir resposta' }).click();
    await page
      .getByRole('button', { name: indice === 2 ? 'Ver resultado' : 'Próxima pergunta' })
      .click();
  }

  await expect(page.getByRole('heading', { name: 'Leitura concluída!' })).toBeVisible();
  await expect(page.getByText('13 de 13 acertos')).toBeVisible();
  expect(
    await page.evaluate(() => window.__falasJoaninhaNoTeste.map((fala) => fala.texto))
  ).toEqual(frasesEsperadas.flatMap((frase) => ['Atenção.', frase]));
  const salvoAlice = await page.evaluate(
    (chave) => JSON.parse(localStorage.getItem(chave)),
    CHAVE_JOANINHA_ALICE
  );
  expect(salvoAlice.livroId).toBe(LIVRO_JOANINHA);
  expect(salvoAlice.leituraConcluida).toBe(true);
  expect(Object.keys(salvoAlice.respostas)).toHaveLength(13);
  expect(salvoAlice.acertos).toBe(13);
  expect(
    await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_JOANINHA_MARIANA)
  ).toBeNull();

  await page.getByRole('button', { name: 'Voltar ao início' }).click();
  await abrirLivro(page, 'Mariana', LIVRO_JOANINHA);
  await page.locator('#ir-pagina-leitura').fill('21');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await page.getByRole('button', { name: 'Terminei a leitura - responder perguntas' }).click();
  const letrasMariana = [];
  for (let indice = 1; indice <= 10; indice += 1) {
    letrasMariana.push(await clicarAlternativaCorreta(page, LIVRO_JOANINHA, indice - 1));
    await page
      .getByRole('button', {
        name: indice === 10 ? 'Finalizar perguntas e ver revisão' : 'Próxima pergunta',
      })
      .click();
  }
  verificarDistribuicaoEquilibrada(letrasMariana);
  expect(letrasMariana.join('')).not.toBe(letrasAlice.join(''));
  const salvoMariana = await page.evaluate(
    (chave) => JSON.parse(localStorage.getItem(chave)),
    CHAVE_JOANINHA_MARIANA
  );
  expect(Object.keys(salvoMariana.respostas)).toHaveLength(10);
  expect(
    await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_JOANINHA_ALICE)
  ).not.toBeNull();
});

test('conclui Uma Formiga Especial com inclusão, glossário, mistura e ditados protegidos', async ({
  page,
  request,
}) => {
  const respostaPdf = await request.get(
    '/ambiente_interativo/leituras/uma-formiga-especial/uma-formiga-especial.pdf'
  );
  expect(respostaPdf.ok()).toBe(true);
  await conferirTamanhoPdfLocal(respostaPdf, 13_799_382);

  await abrirLivro(page, 'Alice', LIVRO_FORMIGA_ESPECIAL);
  await expect(page.getByText('Página 1 de 31')).toBeVisible();
  await page.locator('#ir-pagina-leitura').fill('20');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await page.getByRole('button', { name: /Palavras desta página/ }).click();
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'olfato' })).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText('Sentido usado para perceber');
  await page.getByRole('dialog').getByRole('button', { name: 'Fechar explicação' }).click();

  const dados = await page.evaluate(async (livroId) => {
    const livro = window.RegistroLeituras.obter(livroId);
    const documento = await window.PDFJSLocal.getDocument({
      url: new window.URL(livro.arquivoPdf, document.baseURI).href,
    }).promise;
    return {
      paginasPdf: documento.numPages,
      objetivas: livro.questionario.filter((pergunta) => pergunta.tipo !== 'ditado').length,
      ditados: livro.questionario.filter((pergunta) => pergunta.tipo === 'ditado').length,
      alternativas: livro.questionario
        .filter((pergunta) => pergunta.tipo !== 'ditado')
        .map((pergunta) => pergunta.alternativas.length),
      glossario: livro.glossarioPorPagina,
    };
  }, LIVRO_FORMIGA_ESPECIAL);
  expect(dados).toEqual({
    paginasPdf: 31,
    objetivas: 10,
    ditados: 3,
    alternativas: Array(10).fill(4),
    glossario: {
      6: ['colonia'],
      10: ['maternidade'],
      14: ['locomocao'],
      16: ['bengala'],
      18: ['sustento'],
      20: ['olfato'],
      26: ['conciliar'],
    },
  });

  await page.locator('#ir-pagina-leitura').fill('31');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await page.getByRole('button', { name: 'Terminei a leitura - responder perguntas' }).click();

  const letrasAlice = [];
  for (let indice = 1; indice <= 10; indice += 1) {
    await expect(page.getByText(`Pergunta ${indice} de 10`)).toBeVisible();
    await expect(page.locator('.opcao-leitura')).toHaveCount(4);
    letrasAlice.push(await clicarAlternativaCorreta(page, LIVRO_FORMIGA_ESPECIAL, indice - 1));
    await expect(page.locator('.opcao-leitura.correta, .opcao-leitura.incorreta')).toHaveCount(0);
    await page
      .getByRole('button', {
        name: indice === 10 ? 'Finalizar perguntas e ver revisão' : 'Próxima pergunta',
      })
      .click();
  }
  verificarDistribuicaoEquilibrada(letrasAlice);
  await expect(page.getByRole('heading', { name: 'Vamos revisar suas respostas!' })).toBeVisible();
  await expect(page.getByText('Você acertou 10 de 10 perguntas.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Continuar para os ditados' }).click();

  await page.evaluate(() => {
    window.__falasFormigaEspecialNoTeste = [];
    window.speechSynthesis.cancel = function () {};
    window.speechSynthesis.speak = function (fala) {
      window.__falasFormigaEspecialNoTeste.push({
        texto: fala.text,
        iniciadoEm: window.performance.now(),
      });
      if (typeof fala.onstart === 'function') fala.onstart();
      if (typeof fala.onend === 'function') fala.onend();
    };
  });

  const respostasDitado = [
    'Danilo aprendeu a usar a bengala com segurança',
    'O olfato ajudava Danilo a seguir o caminho',
    'A família apoiou Danilo durante o treinamento',
  ];
  const frasesEsperadas = [
    'Danilo aprendeu a usar a bengala com segurança.',
    'O olfato ajudava Danilo a seguir o caminho.',
    'A família apoiou Danilo durante o treinamento.',
  ];
  for (let indice = 0; indice < respostasDitado.length; indice += 1) {
    await expect(page.getByText(`Ditado ${indice + 1} de 3`)).toBeVisible();
    const cliqueEm = await page.evaluate(() => window.performance.now());
    await page.getByRole('button', { name: '🔊 Ouvir ditado' }).click();
    await expect(page.getByText(/O ditado começará em 1 segundo/)).toBeVisible();
    await page.waitForTimeout(700);
    expect(await page.evaluate(() => window.__falasFormigaEspecialNoTeste.length)).toBe(indice * 2);
    await expect
      .poll(() => page.evaluate(() => window.__falasFormigaEspecialNoTeste.length))
      .toBe(indice * 2 + 2);
    const tempos = await page.evaluate(
      ({ posicao, inicio }) => ({
        preparacao: window.__falasFormigaEspecialNoTeste[posicao].iniciadoEm - inicio,
        frase:
          window.__falasFormigaEspecialNoTeste[posicao + 1].iniciadoEm -
          window.__falasFormigaEspecialNoTeste[posicao].iniciadoEm,
      }),
      { posicao: indice * 2, inicio: cliqueEm }
    );
    expect(tempos.preparacao).toBeGreaterThanOrEqual(900);
    expect(tempos.frase).toBeGreaterThanOrEqual(550);
    await page.getByLabel('Digite o que você ouviu').fill(respostasDitado[indice]);
    await page.getByRole('button', { name: 'Conferir resposta' }).click();
    await page
      .getByRole('button', { name: indice === 2 ? 'Ver resultado' : 'Próxima pergunta' })
      .click();
  }

  await expect(page.getByRole('heading', { name: 'Leitura concluída!' })).toBeVisible();
  await expect(page.getByText('13 de 13 acertos')).toBeVisible();
  expect(
    await page.evaluate(() => window.__falasFormigaEspecialNoTeste.map((fala) => fala.texto))
  ).toEqual(frasesEsperadas.flatMap((frase) => ['Atenção.', frase]));
  const salvoAlice = await page.evaluate(
    (chave) => JSON.parse(localStorage.getItem(chave)),
    CHAVE_FORMIGA_ESPECIAL_ALICE
  );
  expect(salvoAlice.livroId).toBe(LIVRO_FORMIGA_ESPECIAL);
  expect(salvoAlice.leituraConcluida).toBe(true);
  expect(Object.keys(salvoAlice.respostas)).toHaveLength(13);
  expect(salvoAlice.acertos).toBe(13);
  expect(
    await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_FORMIGA_ESPECIAL_MARIANA)
  ).toBeNull();

  await page.getByRole('button', { name: 'Voltar ao início' }).click();
  await abrirLivro(page, 'Mariana', LIVRO_FORMIGA_ESPECIAL);
  await page.locator('#ir-pagina-leitura').fill('31');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await page.getByRole('button', { name: 'Terminei a leitura - responder perguntas' }).click();
  const letrasMariana = [];
  for (let indice = 1; indice <= 10; indice += 1) {
    letrasMariana.push(await clicarAlternativaCorreta(page, LIVRO_FORMIGA_ESPECIAL, indice - 1));
    await page
      .getByRole('button', {
        name: indice === 10 ? 'Finalizar perguntas e ver revisão' : 'Próxima pergunta',
      })
      .click();
  }
  verificarDistribuicaoEquilibrada(letrasMariana);
  expect(letrasMariana.join('')).not.toBe(letrasAlice.join(''));
  const salvoMariana = await page.evaluate(
    (chave) => JSON.parse(localStorage.getItem(chave)),
    CHAVE_FORMIGA_ESPECIAL_MARIANA
  );
  expect(Object.keys(salvoMariana.respostas)).toHaveLength(10);
  expect(
    await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_FORMIGA_ESPECIAL_ALICE)
  ).not.toBeNull();
});

test('isola o livro entre perfis e limpa somente a leitura ativa', async ({ page }) => {
  await page.evaluate(
    ({ ciencias, matematica, leituraMariana }) => {
      localStorage.setItem(ciencias, JSON.stringify({ marcador: 'ciencias-preservada' }));
      localStorage.setItem(matematica, JSON.stringify({ marcador: 'matematica-preservada' }));
      localStorage.setItem(
        leituraMariana,
        JSON.stringify({ paginaAtual: 9, maiorPaginaAlcancada: 9, leituraIniciada: true })
      );
    },
    { ciencias: CHAVE_ALICE, matematica: CHAVE_MARIANA, leituraMariana: CHAVE_LEITURA_MARIANA }
  );
  await page.reload();
  await abrirLivro(page, 'Alice');
  await page.locator('#ir-pagina-leitura').fill('4');
  await page.getByRole('button', { name: 'Ir', exact: true }).click();
  await expect(page.getByText('Página 4 de 25')).toBeVisible();
  await page.getByRole('button', { name: 'Voltar ao início' }).click();

  await abrirBiblioteca(page, 'Mariana');
  await expect(
    page
      .locator(`[data-livro-id="${LIVRO_DINHEIRO}"]`)
      .getByRole('button', { name: /Continuar da página 9/ })
  ).toBeVisible();
  await page.getByRole('button', { name: 'Voltar ao início' }).click();
  await abrirBiblioteca(page, 'Alice');
  await expect(
    page
      .locator(`[data-livro-id="${LIVRO_DINHEIRO}"]`)
      .getByRole('button', { name: /Continuar da página 4/ })
  ).toBeVisible();
  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('#limpar-progresso-leitura').click();
  await expect(
    page.locator(`[data-livro-id="${LIVRO_DINHEIRO}"]`).getByText('Não iniciado')
  ).toBeVisible();

  const preservados = await page.evaluate(
    ({ ciencias, matematica, leituraAlice, leituraMariana }) => ({
      ciencias: JSON.parse(localStorage.getItem(ciencias)).marcador,
      matematica: JSON.parse(localStorage.getItem(matematica)).marcador,
      leituraAlice: localStorage.getItem(leituraAlice),
      leituraMariana: JSON.parse(localStorage.getItem(leituraMariana)).paginaAtual,
    }),
    {
      ciencias: CHAVE_ALICE,
      matematica: CHAVE_MARIANA,
      leituraAlice: CHAVE_LEITURA_ALICE,
      leituraMariana: CHAVE_LEITURA_MARIANA,
    }
  );
  expect(preservados).toEqual({
    ciencias: 'ciencias-preservada',
    matematica: 'matematica-preservada',
    leituraAlice: null,
    leituraMariana: 9,
  });
});

test('normaliza páginas, JSON e respostas malformadas da leitura', async ({ page }) => {
  await page.evaluate(
    ({ alice, mariana }) => {
      localStorage.setItem(alice, '{quebrado');
      localStorage.setItem(
        mariana,
        JSON.stringify({
          paginaAtual: 999,
          maiorPaginaAlcancada: -8,
          paginasVisitadas: [-1, 1, 1, 88, '4'],
          respostas: { 'nome-menina': 'inexistente', passeio: 'mercado' },
          perguntasCorrigidas: { 'nome-menina': true, passeio: true },
          tentativas: -4,
          questionarioConcluido: true,
          leituraConcluida: true,
        })
      );
    },
    { alice: CHAVE_LEITURA_ALICE, mariana: CHAVE_LEITURA_MARIANA }
  );
  await page.reload();
  await abrirBiblioteca(page, 'Alice');
  await expect(
    page.locator(`[data-livro-id="${LIVRO_DINHEIRO}"]`).getByText('Não iniciado')
  ).toBeVisible();
  await page.getByRole('button', { name: 'Voltar ao início' }).click();
  await abrirBiblioteca(page, 'Mariana');
  const normalizado = await page.evaluate(() =>
    window.LeituraRevisoes.normalizarParaTeste(
      'mariana',
      JSON.parse(
        localStorage.getItem('revisoesEscolares.mariana.leitura.primeirasLicoesDinheiro.v1')
      )
    )
  );
  expect(normalizado.paginaAtual).toBe(25);
  expect(normalizado.maiorPaginaAlcancada).toBe(25);
  expect(normalizado.paginasVisitadas).toEqual([1, 4]);
  expect(normalizado.respostas).toEqual({ passeio: 'mercado' });
  expect(normalizado.perguntasCorrigidas).toEqual({ passeio: true });
  expect(normalizado.questionarioConcluido).toBe(false);
  expect(normalizado.leituraConcluida).toBe(false);
  expect(normalizado.tentativas).toBe(0);
});

test('mantém a leitura utilizável em memória quando localStorage está bloqueado', async ({
  browser,
}) => {
  const contexto = await browser.newContext();
  const page = await contexto.newPage();
  await page.addInitScript(() => {
    for (const metodo of ['getItem', 'setItem', 'removeItem']) {
      Storage.prototype[metodo] = function () {
        throw new DOMException('Bloqueado pelo teste', 'SecurityError');
      };
    }
  });
  await page.goto(CAMINHO);
  await abrirLivro(page, 'Alice');
  await page.getByRole('button', { name: 'Próxima página' }).click();
  await expect(page.getByText('Página 2 de 25')).toBeVisible();
  await contexto.close();
});

test('não ultrapassa a viewport móvel na biblioteca e no leitor', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await abrirLivro(page, 'Mariana');
  const medidas = await page.evaluate(() => ({
    documento: document.documentElement.scrollWidth,
    canvas: document.getElementById('canvas-livro').getBoundingClientRect().width,
    recipiente: document.getElementById('recipiente-canvas-livro').clientWidth,
  }));
  expect(medidas.documento).toBeLessThanOrEqual(390);
  expect(medidas.canvas).toBeLessThanOrEqual(medidas.recipiente);
});

test('abre apenas a revisão escolhida e retorna à tela inicial', async ({ page }) => {
  await abrirAlice(page);
  await expect(page.locator('#tela-mariana-revisao')).toBeHidden();
  await page.getByRole('button', { name: 'Voltar ao início' }).click();
  await expect(page.locator('#tela-inicial')).toBeVisible();
  await expect(page.locator('#tela-revisao')).toBeHidden();

  await abrirRevisaoMariana(page);
  await expect(page.locator('#tela-revisao')).toBeHidden();
  await page.getByRole('button', { name: 'Voltar ao início' }).click();
  await expect(page.locator('#tela-inicial')).toBeVisible();
});

test('mostra e persiste os estados não iniciada, em andamento e concluída', async ({ page }) => {
  await page.getByRole('button', { name: /Alice/ }).click();
  const cartao = page.locator('#materia-ciencias');
  await expect(cartao).toHaveAttribute('data-estado-revisao', 'nao-iniciada');
  await expect(cartao.getByText('Não iniciada')).toBeVisible();

  await cartao.click();
  await page.getByRole('button', { name: /Lã de ovelha/ }).click();
  await page.getByRole('button', { name: 'Alice' }).click();
  await expect(cartao).toHaveAttribute('data-estado-revisao', 'em-andamento');

  await cartao.click();
  await page.getByRole('button', { name: /Madeira de árvores/ }).click();
  await page.getByRole('button', { name: 'Conferir resposta' }).click();
  await expect(page.getByRole('status')).toContainText('Muito bem');
  await page.reload();
  await page.getByRole('button', { name: /Alice/ }).click();
  await expect(page.locator('#materia-ciencias')).toHaveAttribute(
    'data-estado-revisao',
    'concluida'
  );
  await expect(page.locator('#materia-ciencias').getByText('Concluída')).toBeVisible();
});

test('restaura a etapa e respeita os limites da navegação', async ({ page }) => {
  await abrirRevisaoMariana(page);
  await expect(page.locator('#mariana-voltar')).toBeDisabled();
  await page.getByRole('button', { name: 'Começar revisão' }).click();
  await expect(page.getByText('Etapa 2 de 25')).toBeVisible();
  await page.reload();
  await abrirRevisaoMariana(page);
  await expect(page.getByText('Etapa 2 de 25')).toBeVisible();
  await page.locator('#mariana-voltar').click();
  await expect(page.getByText('Etapa 1 de 25')).toBeVisible();
});

test('restaura e permite corrigir cartões na etapa de ordem crescente e decrescente', async ({
  page,
}) => {
  await page.evaluate((chave) => {
    localStorage.setItem(
      chave,
      JSON.stringify({
        etapaAtual: 13,
        respostas: { 13: { ordens: { 0: ['14', '12', '13'] } } },
        pontuacoes: {},
        concluidas: {},
        canvases: {},
        pontos: 0,
        finalizada: false,
      })
    );
  }, CHAVE_MARIANA);
  await page.reload();
  await abrirRevisaoMariana(page);

  await expect(page.getByText('Etapa 14 de 25')).toBeVisible();
  const grupos = page.locator('.grupo-ordem');
  const primeiroDestino = grupos.nth(0).locator('[data-destino]');
  await expect(primeiroDestino.locator('[data-token]')).toHaveText(['14', '12', '13']);

  await primeiroDestino.getByRole('button', { name: /Retirar 14/ }).click();
  await grupos
    .nth(0)
    .getByRole('button', { name: /Colocar 14/ })
    .click();
  await expect(primeiroDestino.locator('[data-token]')).toHaveText(['12', '13', '14']);

  const respostas = [
    ['16', '17', '18'],
    ['13', '12', '11'],
    ['18', '17', '16'],
  ];
  for (let indice = 0; indice < respostas.length; indice += 1) {
    for (const token of respostas[indice]) {
      await grupos
        .nth(indice + 1)
        .getByRole('button', { name: new RegExp(`Colocar ${token}`) })
        .click();
    }
  }

  await page.getByRole('button', { name: 'Conferir' }).click();
  await expect(page.getByRole('status')).toContainText('Muito bem');
  await page.reload();
  await abrirRevisaoMariana(page);
  await expect(primeiroDestino.locator('[data-token]')).toHaveText(['12', '13', '14']);
});

test('isola o armazenamento entre as revisões', async ({ page }) => {
  await abrirAlice(page);
  await page.getByRole('button', { name: /Madeira de árvores/ }).click();
  const aliceAntes = await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_ALICE);
  expect(aliceAntes).toBeTruthy();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_MARIANA)).toBeNull();

  await page.getByRole('button', { name: 'Voltar ao início' }).click();
  await abrirRevisaoMariana(page);
  await page.getByRole('button', { name: 'Começar revisão' }).click();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_MARIANA)).toBeTruthy();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_ALICE)).toBe(aliceAntes);
});

test('migra de modo idempotente o progresso antigo da Alice sem removê-lo', async ({ page }) => {
  const legado = JSON.stringify({
    alunoAtual: 'alice',
    alice: { cienciasOrigemMateriais: { concluida: true, tentativas: 3 } },
    mariana: {},
  });
  await page.evaluate(
    ({ chaveNova, chaveAntiga, dados }) => {
      localStorage.removeItem(chaveNova);
      localStorage.setItem(chaveAntiga, dados);
    },
    { chaveNova: CHAVE_ALICE, chaveAntiga: CHAVE_ANTIGA, dados: legado }
  );
  await page.reload();
  await page.getByRole('button', { name: /Alice/ }).click();
  await expect(page.locator('#materia-ciencias')).toHaveAttribute(
    'data-estado-revisao',
    'concluida'
  );
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_ANTIGA)).toBe(legado);
  const primeiraMigracao = await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_ALICE);
  await page.reload();
  expect(await page.evaluate((chave) => localStorage.getItem(chave), CHAVE_ALICE)).toBe(
    primeiraMigracao
  );
});

test('desenha, salva e restaura um canvas em alta densidade', async ({ page }) => {
  await page.evaluate(
    ({ chave }) =>
      localStorage.setItem(
        chave,
        JSON.stringify({
          etapaAtual: 20,
          respostas: {},
          pontuacoes: {},
          concluidas: {},
          canvases: {},
          pontos: 0,
          finalizada: false,
        })
      ),
    { chave: CHAVE_MARIANA }
  );
  await page.reload();
  await abrirRevisaoMariana(page);
  const canvas = page.locator('#canvas-mariana-vistas');
  await expect(canvas).toBeVisible();
  const caixa = await canvas.boundingBox();
  await page.mouse.move(caixa.x + 30, caixa.y + 30);
  await page.mouse.down();
  await page.mouse.move(caixa.x + 130, caixa.y + 90, { steps: 8 });
  await page.mouse.up();
  await expect(canvas).toHaveAttribute('data-tem-desenho', 'true');
  await expect
    .poll(() =>
      page.evaluate(
        (chave) => JSON.parse(localStorage.getItem(chave)).canvases.vistas,
        CHAVE_MARIANA
      )
    )
    .toMatch(/^data:image\/png/);

  const resolucao = await canvas.evaluate((elemento) => ({
    interna: elemento.width,
    visual: elemento.getBoundingClientRect().width,
  }));
  expect(resolucao.interna).toBeGreaterThanOrEqual(Math.round(resolucao.visual));

  await page.reload();
  await abrirRevisaoMariana(page);
  await expect(page.locator('#canvas-mariana-vistas')).toHaveAttribute('data-tem-desenho', 'true');
});

test('normaliza etapa inválida e ignora JSON corrompido', async ({ page }) => {
  await page.evaluate(
    ({ alice, mariana }) => {
      localStorage.setItem(alice, '{invalido');
      localStorage.setItem(mariana, JSON.stringify({ etapaAtual: 999, respostas: 'ruim' }));
    },
    { alice: CHAVE_ALICE, mariana: CHAVE_MARIANA }
  );
  await page.reload();
  await abrirRevisaoMariana(page);
  await expect(page.getByText('Etapa 25 de 25')).toBeVisible();
  await expect(page.locator('#mariana-proxima')).toBeHidden();
});

test('continua utilizável quando localStorage está indisponível', async ({ browser }) => {
  const contexto = await browser.newContext();
  const page = await contexto.newPage();
  await page.addInitScript(() => {
    for (const metodo of ['getItem', 'setItem', 'removeItem']) {
      Storage.prototype[metodo] = function () {
        throw new DOMException('Bloqueado pelo teste', 'SecurityError');
      };
    }
  });
  await page.goto(CAMINHO);
  await abrirAlice(page);
  await page.getByRole('button', { name: /Madeira de árvores/ }).click();
  await page.getByRole('button', { name: 'Conferir resposta' }).click();
  await expect(page.getByRole('status')).toContainText('Muito bem');
  await contexto.close();
});

test('abre também por arquivo local usando o bundle gerado', async ({ browser }) => {
  const contexto = await browser.newContext();
  const page = await contexto.newPage();
  const arquivo = path.resolve(__dirname, '..', 'ambiente_interativo', 'index.html');
  await page.goto(pathToFileURL(arquivo).href);
  await expect(page.getByRole('heading', { name: 'Revisões Escolares' })).toBeVisible();
  await expect(page.locator('html')).toHaveClass(/aplicacao-pronta/);
  await page.getByRole('button', { name: /Alice/ }).click();
  await page.getByRole('button', { name: /Leitura/ }).click();
  await page
    .locator(`[data-livro-id="${LIVRO_DINHEIRO}"]`)
    .getByRole('button', { name: /Começar leitura/ })
    .click();
  await expect(page.getByRole('alert')).toContainText('arquivo local');
  await expect(page.locator('#abrir-pdf-janela')).toBeVisible();
  await expect(page.locator('#concluir-leitura-arquivo')).toBeVisible();
  await expect(page.locator('#abrir-leitor-dedicado')).toHaveText(/Abrir PDF em nova janela/);
  await expect(page.locator('#proxima-pagina-leitura')).toBeDisabled();
  await expect(page.getByRole('link', { name: /PDF original/ })).toBeVisible();
  await contexto.close();
});

test('abre o leitor dedicado, sincroniza a página e retorna ao questionário', async ({ page }) => {
  await abrirLivro(page, 'Alice');
  const popupPendente = page.waitForEvent('popup');
  await page.locator('#abrir-leitor-dedicado').click();
  const leitor = await popupPendente;

  await leitor.waitForLoadState();
  await expect(leitor).toHaveURL(
    /leitor\.html\?perfil=alice&livro=primeiras-licoes-dinheiro&pagina=1/
  );
  await expect(leitor.locator('html')).toHaveClass(/leitor-pronto/);
  await expect(leitor.locator('#canvas-leitor-dedicado')).toHaveAttribute(
    'aria-label',
    'Página 1 do livro Primeiras Lições sobre Dinheiro'
  );
  await expect(leitor.locator('#alternar-tela-cheia')).toBeVisible();

  await leitor.locator('#proxima-pagina-dedicado').click();
  await expect(leitor.locator('#canvas-leitor-dedicado')).toHaveAttribute(
    'aria-label',
    'Página 2 do livro Primeiras Lições sobre Dinheiro'
  );
  await expect
    .poll(() =>
      page.evaluate(
        (chave) => JSON.parse(localStorage.getItem(chave)).paginaAtual,
        CHAVE_LEITURA_ALICE
      )
    )
    .toBe(2);

  await leitor.goto(
    '/ambiente_interativo/leitor.html?perfil=alice&livro=primeiras-licoes-dinheiro&pagina=25'
  );
  await expect(leitor.locator('html')).toHaveClass(/leitor-pronto/);
  await leitor.locator('#terminar-leitura-dedicado').click();
  await expect(page.getByRole('heading', { name: 'Vamos conversar sobre o livro?' })).toBeVisible();
  await expect.poll(() => leitor.isClosed()).toBe(true);
});

test('não produz erros graves no console durante os dois fluxos', async ({ page }) => {
  const erros = [];
  page.on('pageerror', (erro) => erros.push(erro.message));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') erros.push(mensagem.text());
  });
  await abrirAlice(page);
  await page.getByRole('button', { name: 'Voltar ao início' }).click();
  await abrirRevisaoMariana(page);
  await page.getByRole('button', { name: 'Começar revisão' }).click();
  await page.getByRole('button', { name: 'Voltar ao início' }).click();
  await abrirLivro(page, 'Alice');
  await page.getByRole('button', { name: 'Voltar ao início' }).click();
  await abrirLivro(page, 'Mariana');
  expect(erros).toEqual([]);
});
