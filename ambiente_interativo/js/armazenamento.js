(function () {
  'use strict';

  var memoria = Object.create(null);
  var avisosEmitidos = Object.create(null);

  function copiar(valor) {
    return JSON.parse(JSON.stringify(valor));
  }

  function objeto(valor) {
    return valor && typeof valor === 'object' && !Array.isArray(valor) ? valor : {};
  }

  function avisarUmaVez(operacao, erro) {
    if (avisosEmitidos[operacao]) {
      return;
    }
    avisosEmitidos[operacao] = true;
    console.warn(
      'O armazenamento permanente está indisponível; o progresso será mantido nesta aba.',
      erro
    );
  }

  function lerTexto(chave) {
    try {
      var valor = window.localStorage.getItem(chave);
      return valor == null ? memoria[chave] || null : valor;
    } catch (erro) {
      avisarUmaVez('leitura', erro);
      return memoria[chave] || null;
    }
  }

  function gravarTexto(chave, valor) {
    memoria[chave] = valor;
    try {
      window.localStorage.setItem(chave, valor);
      return true;
    } catch (erro) {
      avisarUmaVez('gravação', erro);
      return false;
    }
  }

  function removerTexto(chave) {
    delete memoria[chave];
    try {
      window.localStorage.removeItem(chave);
      return true;
    } catch (erro) {
      avisarUmaVez('remoção', erro);
      return false;
    }
  }

  function analisar(texto, chave) {
    if (!texto) {
      return null;
    }
    try {
      return JSON.parse(texto);
    } catch (erro) {
      console.warn(
        'O progresso salvo em "' + chave + '" contém JSON inválido e foi ignorado.',
        erro
      );
      return null;
    }
  }

  function normalizarComSeguranca(configuracao, valor) {
    var base = copiar(configuracao.padrao);
    if (typeof configuracao.normalizar !== 'function') {
      return Object.assign(base, objeto(valor));
    }
    try {
      return configuracao.normalizar(valor, base);
    } catch (erro) {
      console.warn(
        'O progresso salvo em "' + configuracao.chave + '" não pôde ser normalizado.',
        erro
      );
      return base;
    }
  }

  function procurarLegado(configuracao) {
    var legados = Array.isArray(configuracao.legados) ? configuracao.legados : [];
    for (var indice = 0; indice < legados.length; indice += 1) {
      var legado = legados[indice];
      var dados = analisar(lerTexto(legado.chave), legado.chave);
      if (dados == null) {
        continue;
      }
      try {
        return typeof legado.migrar === 'function' ? legado.migrar(dados) : dados;
      } catch (erro) {
        console.warn('A migração de "' + legado.chave + '" foi ignorada com segurança.', erro);
      }
    }
    return null;
  }

  function criar(configuracao) {
    if (!configuracao || !configuracao.chave || configuracao.padrao == null) {
      throw new Error('A chave e o estado padrão são obrigatórios para criar um armazenamento.');
    }

    function carregar() {
      var texto = lerTexto(configuracao.chave);
      var dados = analisar(texto, configuracao.chave);
      var veioDeLegado = false;

      if (dados == null && texto == null) {
        dados = procurarLegado(configuracao);
        veioDeLegado = dados != null;
      }

      var estado = normalizarComSeguranca(configuracao, dados);
      if (veioDeLegado) {
        gravarTexto(configuracao.chave, JSON.stringify(estado));
      }
      return estado;
    }

    function salvar(estado) {
      var normalizado = normalizarComSeguranca(configuracao, estado);
      gravarTexto(configuracao.chave, JSON.stringify(normalizado));
      return normalizado;
    }

    return {
      chave: configuracao.chave,
      carregar: carregar,
      salvar: salvar,
      remover: function () {
        return removerTexto(configuracao.chave);
      },
    };
  }

  window.ArmazenamentoRevisoes = {
    criar: criar,
    lerJSON: function (chave, padrao) {
      var dados = analisar(lerTexto(chave), chave);
      return dados == null ? copiar(padrao) : dados;
    },
    salvarJSON: function (chave, valor) {
      return gravarTexto(chave, JSON.stringify(valor));
    },
    remover: removerTexto,
  };
})();
