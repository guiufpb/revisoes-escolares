(function (root) {
  'use strict';
  let atual = null;
  let instalado = false;
  let avisoRetorno = '';
  const el = (id) => root.document.getElementById(id);
  const mensagens = {
    LIMITE_BYTES: 'O arquivo ultrapassa 256 KiB. Escolha um arquivo menor.',
    UTF8_INVALIDO: 'O arquivo precisa usar UTF-8 válido.',
    BOM_PROIBIDO: 'Salve o arquivo em UTF-8 sem BOM e selecione novamente.',
    JSON_INVALIDO: 'O arquivo não contém JSON válido.',
    CHAVE_DUPLICADA: 'O JSON repete uma propriedade. Corrija o arquivo antes de importar.',
    FALHA_DIGEST: 'Não foi possível conferir a assinatura do arquivo.',
    CRIPTO_INDISPONIVEL: 'A verificação da assinatura está indisponível.',
    PERFIL_DIFERENTE:
      'Este arquivo pertence a outro perfil. Cancele e selecione novamente no perfil correto.',
    IDENTIDADE_ALTERADA:
      'A cópia ou a origem mudou. Selecione o arquivo novamente na cópia desejada.',
    IDENTIDADE_INDISPONIVEL:
      'Não foi possível confirmar a cópia local. A importação persistente está indisponível.',
    INDEXEDDB_INDISPONIVEL:
      'O armazenamento IndexedDB está indisponível. Não é possível importar nesta aba.',
    ORIGEM_NAO_SUPORTADA:
      'Para importar, abra o ambiente pelo servidor local deste computador. As revisões escolares continuam disponíveis.',
    CONFLITO_DIGEST:
      'Já existe uma atividade diferente com este ID e versão. Uma atividade modificada precisa de uma versão nova.',
    DADOS_INVALIDOS: 'Os dados locais estão inconsistentes. Nada foi reparado ou sobrescrito.',
    JOURNAL_BLOQUEADO:
      'Há uma pendência local relacionada à atividade ou um journal incompatível. A importação está bloqueada.',
    JOURNAL_INCONCLUSIVO:
      'Não foi possível conferir as pendências locais. A importação está bloqueada.',
    VERSAO_INCOMPATIVEL:
      'O banco local tem versão ou estrutura incompatível. A importação está bloqueada.',
    BANCO_BLOQUEADO: 'Outra conexão bloqueou o banco local. Não foi possível confirmar o cadastro.',
    ARMAZENAMENTO_QUOTA: 'O armazenamento está sem espaço. Não foi possível confirmar o cadastro.',
    TRANSACAO_FALHOU: 'O cadastro não foi confirmado. Os dados anteriores foram preservados.',
    ARMAZENAMENTO_TIMEOUT:
      'O armazenamento não respondeu a tempo. Não foi possível confirmar o cadastro.',
    LEITURA_FALHOU: 'Não foi possível ler o arquivo. Selecione novamente.',
  };
  function avisar(texto) {
    el('lab-importacao-status').textContent = texto;
  }
  function controles(ocupado, confirmar = false) {
    el('lab-arquivo').disabled = ocupado;
    el('lab-importar-confirmar').disabled = ocupado || !confirmar;
    el('lab-importar-cancelar').disabled = ocupado;
    el('lab-importacao-conteudo').setAttribute('aria-busy', String(ocupado));
  }
  function limpar(c, apagarArquivo = true) {
    ++c.geracao;
    c.bytes = null;
    c.previa = null;
    c.identidade = null;
    el('lab-importacao-previa').replaceChildren();
    if (apagarArquivo) el('lab-arquivo').value = '';
  }
  function fechar() {
    const c = atual;
    if (!c) return;
    if (c.confirmando)
      avisoRetorno =
        'Uma confirmação foi iniciada antes de sair. Confira a lista; sair não desfaz um cadastro já confirmado.';
    limpar(c);
    c.repo?.fechar();
    atual = null;
  }
  async function conferirIdentidade(base = null) {
    const r = await root.LabIdentidade.resolverIdentidade(base?.copyId);
    if (r.modo !== 'persistente')
      throw new Error(Object.hasOwn(mensagens, r.codigo) ? r.codigo : 'IDENTIDADE_INDISPONIVEL');
    if (base && (r.copyId !== base.copyId || r.origem !== base.origem))
      throw new Error('IDENTIDADE_ALTERADA');
    return r;
  }
  async function validar(bytes, perfil) {
    const r = await root.LabValidador.validarPacote(bytes);
    if (!r.valido) throw new Error(r.erros?.[0]?.codigo || 'PACOTE_INVALIDO');
    if (r.pacoteNormalizado.perfil !== perfil) throw new Error('PERFIL_DIFERENTE');
    return r;
  }
  async function consultar(base, p, digest) {
    const a = await root.LabRepositorio.abrirRepositorioExistente();
    if (!a.ok) {
      if (a.codigo !== 'BANCO_LAB_AUSENTE') throw new Error(a.codigo);
      await conferirIdentidade(base);
      return;
    }
    try {
      if (a.copyId !== base.copyId || a.origem !== base.origem)
        throw new Error('IDENTIDADE_ALTERADA');
      const r = await a.repositorio.consultar({ perfil: p.perfil, id: p.id, versao: p.versao });
      if (!r.ok) throw new Error(r.codigo);
      if (r.pacote && r.digest !== digest) throw new Error('CONFLITO_DIGEST');
      const j = await root.LabJournal.inspecionarPendenciasExistentes();
      if (!j.ok) throw new Error('JOURNAL_INCONCLUSIVO');
      if (j.destino.copyId !== base.copyId || j.destino.origem !== base.origem)
        throw new Error('IDENTIDADE_ALTERADA');
      if (
        j.bloqueioGlobalLab ||
        j.atividadesBloqueadas.some(
          (a) => a.perfil === p.perfil && a.id === p.id && a.versao === p.versao
        )
      )
        throw new Error('JOURNAL_BLOQUEADO');
    } finally {
      a.repositorio.fechar();
    }
  }
  function falhar(c, erro) {
    limpar(c);
    controles(false);
    avisar(
      mensagens[erro.message] ||
        'O arquivo ou o acesso local não atende ao contrato de importação. Selecione novamente.'
    );
    el('lab-arquivo').focus({ preventScroll: true });
  }
  async function selecionar() {
    const c = atual;
    if (!c || c.confirmando) return;
    const arquivo = el('lab-arquivo').files[0];
    limpar(c, false);
    controles(false);
    if (!arquivo) {
      avisar('Nenhum arquivo selecionado.');
      return;
    }
    const token = c.geracao;
    const vigente = () => atual === c && token === c.geracao;
    controles(false);
    avisar('Validando o arquivo. Ainda não foi salvo.');
    el('lab-importacao-conteudo').setAttribute('aria-busy', 'true');
    try {
      if (arquivo.size > root.LabValidador.LIMITES.bytes) throw new Error('LIMITE_BYTES');
      let bytes;
      try {
        bytes = new root.Uint8Array(await arquivo.arrayBuffer());
      } catch {
        throw new Error('LEITURA_FALHOU');
      }
      if (!vigente()) return;
      const v = await validar(bytes, c.perfil);
      if (!vigente()) return;
      const base = await conferirIdentidade();
      if (!vigente()) return;
      await consultar(base, v.pacoteNormalizado, v.digest);
      if (!vigente()) return;
      await conferirIdentidade(base);
      if (!vigente()) return;
      const p = v.pacoteNormalizado;
      const apresentacao = root.LabValidador.apresentarPacote(p, v.digest);
      c.previa = {
        perfil: p.perfil,
        materia: p.materia,
        titulo: p.titulo,
        id: p.id,
        versao: p.versao,
        questoes: p.questoes.length,
        digest: v.digest,
      };
      c.bytes = bytes;
      c.identidade = base;
      const lista = root.document.createElement('dl');
      for (const [nome, valor] of [
        ['Perfil', p.perfil === 'alice' ? 'Alice' : 'Mariana'],
        ['Matéria', p.materia],
        ['Título', apresentacao.titulo],
        ['ID', apresentacao.id],
        ['Versão', p.versao],
        ['Questões', p.questoes.length],
      ]) {
        const termo = root.document.createElement('dt');
        const dado = root.document.createElement('dd');
        termo.textContent = nome;
        dado.textContent = String(valor);
        lista.append(termo, dado);
      }
      el('lab-importacao-previa').replaceChildren(lista);
      controles(false, true);
      avisar('Prévia válida. Confira as informações e confirme para salvar. Nada foi salvo ainda.');
    } catch (erro) {
      if (vigente()) falhar(c, erro);
    }
  }
  async function confirmar() {
    const c = atual;
    if (!c || !c.previa || !c.bytes || c.confirmando) return;
    c.confirmando = true;
    const token = c.geracao;
    const vigente = () => atual === c && token === c.geracao;
    let bytes = c.bytes;
    const previa = c.previa,
      base = c.identidade;
    let repo, validacao;
    controles(true);
    avisar('Confirmando o cadastro. Aguarde a verificação do armazenamento.');
    try {
      await conferirIdentidade(base);
      if (!vigente()) return;
      validacao = await validar(bytes, c.perfil);
      if (!vigente()) return;
      if (validacao.digest !== previa.digest) throw new Error('PACOTE_INVALIDO');
      await consultar(base, validacao.pacoteNormalizado, validacao.digest);
      if (!vigente()) return;
      // Só o clique confirmado chega à abertura que pode criar schema.
      const a = await root.LabRepositorio.abrirRepositorio();
      repo = a.repositorio;
      c.repo = repo;
      if (!vigente()) return;
      if (!a.ok) throw new Error(a.codigo);
      if (a.copyId !== base.copyId || a.origem !== base.origem)
        throw new Error('IDENTIDADE_ALTERADA');
      await consultar(base, validacao.pacoteNormalizado, validacao.digest);
      if (!vigente()) return;
      await conferirIdentidade(base);
      if (!vigente()) return;
      // cadastrar revalida os bytes originais e só confirma após transaction.oncomplete.
      const r = await repo.cadastrar(bytes);
      bytes = null;
      validacao = null;
      if (!vigente()) return;
      if (!r.ok) throw new Error(r.codigo);
      limpar(c);
      const sucesso = r.criado
        ? 'Importação concluída. Atividade salva nesta cópia local.'
        : 'Esta atividade já estava salva. Nenhuma duplicação ou alteração de progresso foi feita.';
      avisar(sucesso);
      const g = c.geracao;
      let lista;
      try {
        lista = await root.LabListagem?.abrir(c.perfil);
      } catch {
        lista = null;
      }
      if (atual === c && c.geracao === g) {
        avisar(
          lista?.ok
            ? sucesso
            : sucesso + ' Cadastro confirmado, mas a atualização da lista está indisponível.'
        );
        controles(false);
        el('lab-arquivo').focus({ preventScroll: true });
      }
    } catch (erro) {
      if (vigente()) falhar(c, erro);
    } finally {
      bytes = null;
      validacao = null;
      repo?.fechar();
      c.repo = null;
      c.confirmando = false;
    }
  }
  function cancelar() {
    const c = atual;
    if (!c || c.confirmando) return;
    limpar(c);
    controles(false);
    avisar('Importação cancelada antes da confirmação. Nada foi cadastrado.');
    el('lab-arquivo').focus({ preventScroll: true });
  }
  function abrir(perfil) {
    fechar();
    const c = {
      perfil,
      geracao: 0,
      bytes: null,
      previa: null,
      identidade: null,
      confirmando: false,
      repo: null,
    };
    atual = c;
    if (!instalado) {
      el('lab-arquivo').addEventListener('change', selecionar);
      el('lab-importar-confirmar').addEventListener('click', confirmar);
      el('lab-importar-cancelar').addEventListener('click', cancelar);
      instalado = true;
    }
    limpar(c);
    controles(false);
    let disponivel = false,
      motivo = 'A importação está indisponível nesta aba.';
    try {
      if (root.location.protocol !== 'http:') motivo = mensagens.ORIGEM_NAO_SUPORTADA;
      else if (!root.indexedDB) motivo = mensagens.INDEXEDDB_INDISPONIVEL;
      else
        disponivel = !!(
          root.LabValidador &&
          root.LabIdentidade &&
          root.LabRepositorio &&
          root.LabJournal
        );
    } catch {
      motivo = mensagens.INDEXEDDB_INDISPONIVEL;
    }
    el('lab-arquivo').disabled = !disponivel;
    avisar(
      disponivel
        ? avisoRetorno ||
            'Escolha um arquivo para conferir a prévia. Nada será salvo sem confirmação.'
        : motivo
    );
    avisoRetorno = '';
  }
  root.LabImportacao = Object.freeze({ abrir, fechar });
})(window);
