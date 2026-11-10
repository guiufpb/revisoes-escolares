'use strict';
const fs = require('node:fs/promises');
const path = require('node:path');
const mesmaIdentidade = (a, b) => a && b && a.ino !== 0n && a.dev === b.dev && a.ino === b.ino;

// Somente autoria Node. O nome definitivo é publicado por hard link exclusivo,
// depois de escrita, sync e fechamento completos. Nunca remover o destino.
async function publicarZipExclusivo(destino, bytes) {
  const final = path.resolve(destino);
  let pasta,
    identidadePasta,
    identidadeArquivo,
    handle,
    principal,
    publicado = false;
  const limpeza = [];
  try {
    pasta = await fs.mkdtemp(path.join(path.dirname(final), '.lab-v3-zip-'));
    identidadePasta = await fs.lstat(pasta, { bigint: true });
    handle = await fs.open(path.join(pasta, 'pacote.tmp'), 'wx', 0o600);
    identidadeArquivo = await handle.stat({ bigint: true });
    await handle.writeFile(bytes);
    await handle.sync();
    await handle.close();
    handle = null;
    await fs.link(path.join(pasta, 'pacote.tmp'), final);
    publicado = true;
  } catch (e) {
    principal = e;
  }
  if (handle) {
    try {
      await handle.close();
    } catch (e) {
      limpeza.push(e);
    }
  }
  if (pasta) {
    const temporario = path.join(pasta, 'pacote.tmp');
    if (identidadeArquivo) {
      try {
        const atual = await fs.lstat(temporario, { bigint: true });
        if (!atual.isFile() || !mesmaIdentidade(atual, identidadeArquivo))
          throw new Error('AUTORIA_RESIDUO_NAO_RECONHECIDO');
        await fs.unlink(temporario);
      } catch (e) {
        if (e.code !== 'ENOENT') limpeza.push(e);
      }
    }
    try {
      const atual = await fs.lstat(pasta, { bigint: true });
      if (!atual.isDirectory() || !mesmaIdentidade(atual, identidadePasta))
        throw new Error('AUTORIA_RESIDUO_NAO_RECONHECIDO');
      await fs.rmdir(pasta); // Nunca recursivo; arquivos não reconhecidos permanecem.
    } catch (e) {
      if (e.code !== 'ENOENT') limpeza.push(e);
    }
  }
  if (principal || limpeza.length) {
    const e = principal || new Error('AUTORIA_LIMPEZA_FALHOU', { cause: limpeza[0] });
    e.falhasLimpeza = limpeza;
    e.publicado = publicado;
    throw e;
  }
}
module.exports = { publicarZipExclusivo };
