'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { TextEncoder } = require('node:util');
const Backup = require('../../ambiente_interativo/js/lab-backup.js');
const Pacotes = require('../../ambiente_interativo/js/lab-validador.js');
function pacote(id = 'exemplo', perfil = 'alice') {
  return {
    formato: 'lab-questionarios-v1',
    id,
    versao: 1,
    perfil,
    materia: 'ciencias',
    titulo: 'Sintético',
    questoes: [
      {
        id: 'q1',
        bloco: 'Exemplo',
        titulo: 'Dia',
        instrucao: 'Escolha.',
        tipo: 'opcoes',
        dica: 'Observe.',
        itens: [{ id: 'i1', pergunta: 'Luz do dia?', opcoes: ['Sol', 'Lua'], respostas: ['Sol'] }],
      },
    ],
  };
}
async function entrada(p = pacote()) {
  const v = await Pacotes.validarPacote(JSON.stringify(p));
  assert.equal(v.valido, true);
  return { pacote: p, digest: v.digest, situacaoAdministrativa: 'ativa', sessoes: {} };
}
const envelope = (entradas) => ({ formato: 'lab-backup-v1', versao: 1, entradas });
const validar = (dado) => Backup.validarBackup(JSON.stringify(dado));

test('puro: backup mínimo e vazio, bytes UTF-8 e prévia sem respostas', async () => {
  const e = await entrada();
  const r = await validar(envelope([e]));
  assert.equal(r.valido, true);
  assert.equal(r.bytes, Buffer.byteLength(r.json));
  assert.equal(r.previa.totalAtividades, 1);
  assert.equal(r.previa.restauracaoAutorizada, false);
  assert.deepEqual(r.backupNormalizado.entradas[0].sessoes, {});
  const previa = await Backup.inspecionarBackup(r.json);
  assert.equal(previa.valido, true);
  assert.equal(Object.hasOwn(previa, 'json'), false);
  assert.equal(Object.hasOwn(previa, 'backupNormalizado'), false);
  assert.equal(JSON.stringify(previa).includes('respostas'), false);
  assert.equal((await validar(envelope([]))).valido, true);
  assert.equal((await Backup.construirBackup([])).previa.totalAtividades, 0);
});

test('puro: perfis, matérias e alternativas/campos são validados individualmente', async () => {
  const a = pacote();
  const m = pacote('outro', 'mariana');
  m.materia = 'matematica';
  m.questoes[0].tipo = 'campos';
  delete m.questoes[0].itens[0].opcoes;
  const r = await validar(envelope([await entrada(m), await entrada(a)]));
  assert.equal(r.valido, true);
  assert.deepEqual(
    r.previa.atividades.map((e) => [e.perfil, e.materia]),
    [
      ['alice', 'ciencias'],
      ['mariana', 'matematica'],
    ]
  );
});

test('puro: formatação e ordem de entradas equivalentes geram JSON determinístico', async () => {
  const a = await entrada(pacote('a'));
  const b = await entrada(pacote('b'));
  const x = await Backup.validarBackup(JSON.stringify(envelope([b, a]), null, 2));
  const y = await validar(envelope([a, b]));
  assert.equal(x.valido, true);
  assert.equal(x.json, y.json);
  assert.equal((await Backup.validarBackup(x.json)).json, x.json);
});

test('puro: digest divergente, identidade repetida e conflitante recusam o backup todo', async () => {
  const e = await entrada();
  const falso = structuredClone(e);
  falso.digest = '0'.repeat(64);
  assert.equal((await validar(envelope([falso]))).erros[0].codigo, 'DIGEST_BACKUP_DIVERGENTE');
  assert.equal((await validar(envelope([e, e]))).erros[0].codigo, 'IDENTIDADE_BACKUP_REPETIDA');
  const p = pacote();
  p.titulo = 'Outro título';
  const divergente = await entrada(p);
  assert.equal(
    (await validar(envelope([e, divergente]))).erros[0].codigo,
    'IDENTIDADE_BACKUP_CONFLITANTE'
  );
});

test('puro: propriedades desconhecidas e chaves privadas nunca são admitidas', async () => {
  const e = await entrada();
  for (const alvo of ['raiz', 'entrada', 'pacote', 'sessoes'])
    for (const nome of ['copyId', 'chave', 'caminho', 'logs', 'credencial', 'vinculo']) {
      const d = envelope([structuredClone(e)]);
      const objeto = alvo === 'raiz' ? d : alvo === 'entrada' ? d.entradas[0] : d.entradas[0][alvo];
      objeto[nome] = 'SEGREDO_SINTETICO';
      const r = await validar(d);
      assert.equal(r.valido, false, alvo + '/' + nome);
      assert.equal(JSON.stringify(r).includes('SEGREDO_SINTETICO'), false);
      assert.equal(Object.hasOwn(r, 'backupNormalizado'), false);
    }
});

test('puro: descartada, pacote ausente, sessões desconhecidas e tipos incorretos são recusados', async () => {
  const e = await entrada();
  const mudancas = [
    (d) => {
      d.formato = 'outro';
    },
    (d) => {
      d.versao = 2;
    },
    (d) => {
      d.versao = '1';
    },
    (d) => {
      d.entradas = {};
    },
    (d) => {
      d.entradas[0].situacaoAdministrativa = 'descartada';
    },
    (d) => {
      d.entradas[0].pacote = null;
    },
    (d) => {
      delete d.entradas[0].pacote;
    },
    (d) => {
      d.entradas[0].sessoes = [];
    },
    (d) => {
      d.entradas[0].sessoes.outra = {};
    },
    (d) => {
      d.entradas[0].digest = 'A'.repeat(64);
    },
  ];
  for (const mudar of mudancas) {
    const d = envelope([structuredClone(e)]);
    mudar(d);
    assert.equal((await validar(d)).valido, false);
  }
});

test('puro: sem motor não há fallback de correção para snapshots', async () => {
  const e = await entrada();
  e.sessoes.principal = {};
  const r = await validar(envelope([e]));
  assert.equal(r.erros[0].codigo, 'VALIDADOR_SNAPSHOT_INDISPONIVEL');
});

test('puro: objetos executáveis não são uma entrada textual nem são executados', async () => {
  let acessos = 0;
  const dado = {
    get toJSON() {
      ++acessos;
      throw new Error('Não executar');
    },
    toString() {
      ++acessos;
      return '{}';
    },
  };
  assert.equal((await Backup.validarBackup(dado)).valido, false);
  assert.equal(
    (
      await Backup.validarBackup(() => {
        ++acessos;
      })
    ).valido,
    false
  );
  assert.equal(acessos, 0);
  for (const fonte of ['(()=>1)()', '{"x":undefined}', '{"x":NaN}', 'null', '[]', '{} {}'])
    assert.equal((await Backup.validarBackup(fonte)).valido, false);
});

test('puro: UTF-8 estrito, BOM e Unicode inválido literal ou escapado são recusados', async () => {
  for (const octetos of [
    [0xc0, 0xaf],
    [0xed, 0xa0, 0x80],
    [0xf4, 0x90, 0x80, 0x80],
    [0xe2, 0x82],
  ])
    assert.equal(
      (await Backup.validarBackup(new Uint8Array(octetos))).erros[0].codigo,
      'UTF8_INVALIDO'
    );
  for (const fonte of ['\ufeff{}', new Uint8Array([239, 187, 191, 123, 125])])
    assert.equal((await Backup.validarBackup(fonte)).erros[0].codigo, 'BOM_PROIBIDO');
  for (const fonte of ['{"x":"\ud800"}', '{"x":"\\ud800"}', '{"x":"\\udfff"}'])
    assert.equal((await Backup.validarBackup(fonte)).erros[0].codigo, 'UNICODE_INVALIDO');
});

test('puro: chaves duplicadas inclusive escapadas e nomes perigosos são recusados sem vazamento', async () => {
  for (const fonte of ['{"formato":1,"forma\\u0074o":2}', '{"x":{"a":1,"\\u0061":2}}'])
    assert.equal((await Backup.validarBackup(fonte)).erros[0].codigo, 'CHAVE_DUPLICADA');
  for (const nome of ['__proto__', 'constructor', 'prototype'])
    assert.equal((await Backup.validarBackup('{"' + nome + '":{}}')).valido, false);
  const r = await Backup.validarBackup('{"SEGREDO_SINTETICO":1,"SEGREDO_SINTETICO":2}');
  assert.equal(JSON.stringify(r).includes('SEGREDO_SINTETICO'), false);
});

test('puro: 20 entradas são aceitas e 21 recusadas', async () => {
  const entradas = await Promise.all(
    Array.from({ length: 21 }, (_, i) => entrada(pacote('exemplo-' + i)))
  );
  assert.equal((await validar(envelope(entradas.slice(0, 20)))).valido, true);
  assert.equal((await validar(envelope(entradas))).erros[0].codigo, 'ENTRADAS_BACKUP_INVALIDAS');
});

test('puro: limite agregado de bytes é inclusivo, medido em UTF-8', async () => {
  const base = JSON.stringify(envelope([]));
  const fonte = base + ' '.repeat(Backup.LIMITES.bytes - Buffer.byteLength(base));
  assert.equal((await Backup.validarBackup(fonte)).valido, true);
  assert.equal((await Backup.validarBackup(fonte + ' ')).erros[0].codigo, 'LIMITE_BYTES');
  const multibyte = '"' + 'é'.repeat(4194304) + '"';
  assert.equal((await Backup.validarBackup(multibyte)).erros[0].codigo, 'LIMITE_BYTES');
  assert.equal(
    (await Backup.validarBackup(new Uint8Array(Backup.LIMITES.bytes + 1))).erros[0].codigo,
    'LIMITE_BYTES'
  );
});

test('puro: scanner compartilhado mantém os limites independentes de profundidade e tokens', () => {
  assert.equal(Pacotes.lerJSONBackup('['.repeat(16) + '0' + ']'.repeat(16)).valido, true);
  assert.equal(
    Pacotes.lerJSONBackup('['.repeat(17) + '0' + ']'.repeat(17)).erros[0].codigo,
    'LIMITE_ESTRUTURA'
  );
  assert.equal(
    Pacotes.lerJSONBackup('[' + new Array(99999).fill('0').join(',') + ']').valido,
    true
  );
  assert.equal(
    Pacotes.lerJSONBackup('[' + new Array(100000).fill('0').join(',') + ']').erros[0].codigo,
    'LIMITE_ESTRUTURA'
  );
  assert.deepEqual(Pacotes.LIMITES, { bytes: 262144, profundidade: 8, tokens: 10000, erros: 20 });
});

test('puro: pacote interno respeita 256 KiB inclusive sua formatação original', async () => {
  const e = await entrada();
  const compacto = JSON.stringify(e.pacote);
  for (const excesso of [0, 1]) {
    const fontePacote =
      '{' +
      ' '.repeat(Pacotes.LIMITES.bytes - Buffer.byteLength(compacto) + excesso) +
      compacto.slice(1);
    const d = envelope([{ ...e, pacote: null }]);
    const fonte = JSON.stringify(d).replace('"pacote":null', '"pacote":' + fontePacote);
    const r = await Backup.validarBackup(fonte);
    assert.equal(r.valido, excesso === 0);
    if (excesso) assert.equal(r.erros[0].causa, 'LIMITE_BYTES');
  }
});

test('puro: bytes e resultados são independentes, sem mutação da entrada durante await', async () => {
  const fonte = JSON.stringify(envelope([await entrada()]));
  const octetos = new TextEncoder().encode(fonte);
  const prometido = Backup.validarBackup(octetos);
  octetos.fill(0);
  const r = await prometido;
  assert.equal(r.valido, true);
  r.backupNormalizado.entradas[0].pacote.titulo = 'Alterado';
  const novamente = await Backup.validarBackup(fonte);
  assert.equal(novamente.backupNormalizado.entradas[0].pacote.titulo, 'Sintético');
});

test('puro: construção recusa capturas forjadas, getters, extras e listas esparsas', async () => {
  let acessos = 0;
  const fontes = [
    {
      situacaoAdministrativa: 'ativa',
      get capturas() {
        ++acessos;
        return [];
      },
    },
  ];
  assert.equal((await Backup.construirBackup(fontes)).valido, false);
  assert.equal(acessos, 0);
  for (const dado of [
    [{ situacaoAdministrativa: 'ativa', capturas: [{}] }],
    new Array(1),
    [{ situacaoAdministrativa: 'ativa', capturas: [], copyId: 'x' }],
  ])
    assert.equal((await Backup.construirBackup(dado)).valido, false);
  assert.equal(
    Backup.capturar({
      exportarSnapshot() {
        ++acessos;
      },
    }).ok,
    false
  );
  assert.equal(acessos, 0);
});

test('puro: bytes usam slots nativos e não executam getters, subclasses ou proxies', async () => {
  let acessos = 0;
  const fonte = JSON.stringify(envelope([]));
  const dado = new TextEncoder().encode(fonte);
  for (const nome of ['byteLength', 'byteOffset', 'buffer'])
    Object.defineProperty(dado, nome, {
      get() {
        ++acessos;
        throw new Error('Não acessar');
      },
    });
  assert.equal((await Backup.validarBackup(dado)).valido, true);
  class Adversarial extends Uint8Array {
    get byteLength() {
      ++acessos;
      throw new Error('Não acessar');
    }
  }
  assert.equal(
    (await Backup.validarBackup(new Adversarial(new TextEncoder().encode(fonte)))).valido,
    true
  );
  const proxy = new Proxy(
    {},
    {
      getPrototypeOf() {
        ++acessos;
        throw new Error('Não acessar');
      },
    }
  );
  assert.equal((await Backup.validarBackup(proxy)).valido, false);
  assert.equal((await Backup.validarBackup(new DataView(new ArrayBuffer(4)))).valido, false);
  assert.equal((await Backup.validarBackup(Buffer.from(fonte))).valido, true);
  assert.equal(acessos, 0);
});

function ditadoPreparado(id = 'ditado-preparado') {
  return {
    formato: 'lab-questionarios-v2',
    id,
    versao: 1,
    perfil: 'alice',
    materia: 'gramatica',
    titulo: 'café',
    questoes: [
      {
        id: 'q1',
        bloco: 'café',
        titulo: 'café',
        instrucao: 'café',
        tipo: 'ditado',
        idioma: 'pt-BR',
        itens: [{ id: 'i1', texto: 'café' }],
      },
    ],
  };
}
async function entradaReconhecida(p) {
  const v = await Pacotes.reconhecerPacote(JSON.stringify(p));
  assert.equal(v.valido, true);
  return { pacote: p, digest: v.digest, situacaoAdministrativa: 'ativa', sessoes: {} };
}
test('6C.2 envelope backup-v1 admite mistura revalidada preservando análise sem capacidade', async () => {
  const e1 = await entrada();
  const e2 = await entradaReconhecida(ditadoPreparado());
  const antigo = await validar(envelope([e1]));
  const analiseAntiga = await Backup.analisarContratoBackup(JSON.stringify(envelope([e1])));
  assert.equal(analiseAntiga.json, antigo.json);
  const d = JSON.stringify(envelope([e1, e2]));
  const r = await Backup.analisarContratoBackup(d);
  assert.equal(r.valido, true);
  assert.equal(r.admissaoOperacional, false);
  assert.equal(r.previa.restauracaoAutorizada, false);
  assert.equal(r.backupNormalizado.formato, 'lab-backup-v1');
  assert.equal(r.backupNormalizado.versao, 1);
  assert.equal((await validar(JSON.parse(r.json))).valido, true);
  assert.equal((await Backup.inspecionarBackup(d)).valido, true);
  assert.equal((await Backup.construirBackup([e2])).valido, false);
});

test('6C.1 conflito entre formatos usa perfil/id/versao, sem namespace ou aceitação parcial', async () => {
  const e1 = await entrada();
  const e2 = await entradaReconhecida(ditadoPreparado(e1.pacote.id));
  const r = await Backup.analisarContratoBackup(JSON.stringify(envelope([e1, e2])));
  assert.equal(r.valido, false);
  assert.equal(r.erros[0].codigo, 'IDENTIDADE_BACKUP_CONFLITANTE');
  assert.equal(Object.hasOwn(r, 'backupNormalizado'), false);
  e2.pacote.versao++;
  const nova = await entradaReconhecida(e2.pacote);
  assert.equal(
    (await Backup.analisarContratoBackup(JSON.stringify(envelope([e1, nova])))).valido,
    true
  );
  assert.equal(e1.pacote.versao, 1);
});

test('6C.1 análise recusa digest trocado e entrada desconhecida mesmo após entrada válida', async () => {
  const e1 = await entrada();
  const e2 = await entradaReconhecida(ditadoPreparado());
  e2.digest = e1.digest;
  let r = await Backup.analisarContratoBackup(JSON.stringify(envelope([e1, e2])));
  assert.equal(r.erros[0].codigo, 'DIGEST_BACKUP_DIVERGENTE');
  e2.pacote.formato = 'lab-questionarios-v3';
  r = await Backup.analisarContratoBackup(JSON.stringify(envelope([e1, e2])));
  assert.equal(r.valido, false);
  assert.equal(Object.hasOwn(r, 'backupNormalizado'), false);
});
