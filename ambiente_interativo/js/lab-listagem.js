(function (root) {
  'use strict';

  let geracao = 0;
  let atualizarAcoes = null;
  let eventosEstudo = false;
  const materias = {
    ciencias: 'Ciências',
    geografia: 'Geografia',
    historia: 'História',
    gramatica: 'Gramática',
    portugues: 'Português',
    matematica: 'Matemática',
    ingles: 'Inglês',
    leitura: 'Leitura',
  };
  const elemento = (id) => root.document.getElementById(id);
  function fechar() {
    ++geracao;
    atualizarAcoes = null;
    elemento('lab-lista').replaceChildren();
    elemento('lab-desktop-amplo').checked = false;
    elemento('lab-aviso').textContent = '';
    elemento('lab-status').textContent = '';
    elemento('lab-conteudo').setAttribute('aria-busy', 'false');
  }
  function mensagem(codigo) {
    if (codigo === 'ORIGEM_NAO_SUPORTADA')
      return 'A lista local precisa do ambiente aberto pelo servidor deste computador. Pelo arquivo, continue usando as revisões escolares.';
    if (codigo === 'VERSAO_INCOMPATIVEL')
      return 'Não foi possível consultar: a versão do banco local é incompatível.';
    if (codigo === 'DADOS_INVALIDOS')
      return 'Não foi possível consultar: há dados locais inválidos. Nada foi alterado.';
    if (codigo === 'IDENTIDADE_ALTERADA' || codigo === 'DESTINO_ALTERADO')
      return 'A cópia local mudou durante a consulta. A lista foi suspensa. Volte às matérias.';
    return 'A lista local está indisponível. Não foi possível confirmar a cópia ou ler seus dados. Volte às matérias para continuar estudando.';
  }
  async function abrir(perfil) {
    fechar();
    if (!eventosEstudo) {
      elemento('lab-estudo').addEventListener('toggle', () => {
        atualizarAcoes?.();
      });
      eventosEstudo = true;
    }
    const token = geracao;
    const vigente = () => token === geracao;
    let repo;
    elemento('lab-perfil').textContent = perfil === 'alice' ? 'Alice' : 'Mariana';
    elemento('lab-status').textContent = 'Consultando atividades locais…';
    elemento('lab-conteudo').setAttribute('aria-busy', 'true');
    try {
      if (!['alice', 'mariana'].includes(perfil)) throw new Error('PERFIL_INVALIDO');
      if (
        !root.LabIdentidade?.resolverIdentidade ||
        !root.LabRepositorio?.abrirRepositorioExistente ||
        !root.LabJournal?.inspecionarPendenciasExistentes
      )
        throw new Error('MODULO_INDISPONIVEL');
      const identidade = await root.LabIdentidade.resolverIdentidade();
      if (!vigente()) return;
      if (identidade.modo !== 'persistente') throw new Error(identidade.codigo);
      const aberto = await root.LabRepositorio.abrirRepositorioExistente();
      repo = aberto.repositorio;
      if (!vigente()) return;
      if (!aberto.ok && aberto.codigo !== 'BANCO_LAB_AUSENTE') throw new Error(aberto.codigo);
      if (aberto.ok && (aberto.copyId !== identidade.copyId || aberto.origem !== identidade.origem))
        throw new Error('DESTINO_ALTERADO');
      let metadados = [];
      let aviso = '';
      if (aberto.ok) {
        const lista = await repo.listar(perfil);
        if (!vigente()) return;
        if (!lista.ok) throw new Error(lista.codigo);
        // Descartar o payload: só esta projeção local participa da apresentação.
        metadados = lista.pacotes.map(({ pacote, administracao }) => ({
          id: pacote.id,
          digest: administracao.digest,
          materiaId: pacote.materia,
          titulo: root.LabValidador.apresentarPacote(pacote, administracao.digest).titulo,
          materia: materias[pacote.materia] || pacote.materia,
          versao: pacote.versao,
          situacao:
            administracao.situacao === 'ativa' ? 'Atividade cadastrada' : 'Situação não confirmada',
        }));
        const pendencias = await root.LabJournal.inspecionarPendenciasExistentes();
        if (!vigente()) return;
        if (!pendencias.ok) {
          metadados.forEach((dado) => {
            dado.bloqueada = true;
          });
          aviso =
            'Atenção: não foi possível verificar as pendências locais. A situação está inconclusiva; apenas consulta.';
        } else {
          metadados.forEach((dado) => {
            dado.bloqueada =
              pendencias.bloqueioGlobalLab ||
              pendencias.atividadesBloqueadas.some(
                (a) => a.perfil === perfil && a.id === dado.id && a.versao === dado.versao
              );
          });
          if (
            pendencias.destino.copyId !== identidade.copyId ||
            pendencias.destino.origem !== identidade.origem
          )
            throw new Error('DESTINO_ALTERADO');
          if (
            pendencias.bloqueioGlobalLab ||
            pendencias.atividadesBloqueadas.some((a) => a.perfil === perfil)
          )
            aviso =
              'Atenção: há uma pendência local ou um registro incompatível. Atividades afetadas estão bloqueadas. A lista é somente de consulta.';
        }
      }
      const atual = await root.LabIdentidade.resolverIdentidade(identidade.copyId);
      if (!vigente()) return;
      if (atual.modo !== 'persistente' || atual.origem !== identidade.origem)
        throw new Error(
          atual.codigo === 'IDENTIDADE_ALTERADA' || atual.origem !== identidade.origem
            ? 'DESTINO_ALTERADO'
            : atual.codigo
        );
      const fragmento = root.document.createDocumentFragment();
      const botoes = new Map();
      const acoes = [];
      metadados.forEach((dado) => {
        const item = root.document.createElement('li');
        const titulo = root.document.createElement('h2');
        const detalhe = root.document.createElement('p');
        const situacao = root.document.createElement('p');
        titulo.textContent = dado.titulo;
        detalhe.textContent = dado.materia + ' · Versão ' + dado.versao;
        situacao.textContent = dado.situacao;
        item.append(titulo, detalhe, situacao);
        const botao = root.document.createElement('button');
        botao.type = 'button';
        botao.className = 'botao-secundario';
        const presenca = root.LabProgresso?.consultarPresenca({
          copyId: identidade.copyId,
          perfil,
          materia: dado.materiaId,
          id: dado.id,
          versao: dado.versao,
          digest: dado.digest,
        });
        botao.textContent = presenca?.existe ? 'Continuar atividade' : 'Iniciar atividade';
        botao.disabled = dado.bloqueada || !presenca?.ok || !root.LabExecucao;
        botao.addEventListener('click', () => {
          if (!vigente()) return;
          root.LabExecucao.abrir(
            { perfil, id: dado.id, versao: dado.versao },
            { copyId: identidade.copyId, origem: identidade.origem, digest: dado.digest }
          );
        });
        botoes.set(JSON.stringify([perfil, dado.id, dado.versao]), botao);
        acoes.push({ item, botao });
        if (elemento('lab-estudo').open) item.append(botao);
        fragmento.append(item);
      });
      elemento('lab-lista').replaceChildren(fragmento);
      atualizarAcoes = () => {
        if (!vigente()) return;
        acoes.forEach(({ item, botao }) => {
          if (elemento('lab-estudo').open) item.append(botao);
          else botao.remove();
        });
      };
      elemento('lab-aviso').textContent = aviso;
      elemento('lab-status').textContent = metadados.length
        ? metadados.length +
          (metadados.length === 1
            ? ' atividade local. Apenas consulta.'
            : ' atividades locais. Apenas consulta.')
        : 'Ainda não há atividades locais para este perfil.';
      return {
        ok: true,
        focar: (id) =>
          botoes.get(JSON.stringify([id.perfil, id.id, id.versao]))?.focus({ preventScroll: true }),
      };
    } catch (erro) {
      if (!vigente()) return;
      elemento('lab-lista').replaceChildren();
      elemento('lab-status').textContent = mensagem(erro.message);
      return { ok: false };
    } finally {
      repo?.fechar();
      if (vigente()) elemento('lab-conteudo').setAttribute('aria-busy', 'false');
    }
  }
  root.LabListagem = Object.freeze({ abrir, fechar });
})(window);
