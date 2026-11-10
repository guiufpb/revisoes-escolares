/* global DecompressionStream, Uint8Array */
'use strict';
// Executável sem imports também dentro de page.evaluate.
async function probeDeflate(cases) {
  const results = [];
  for (const [name, bytes, limit] of cases) {
    let writes = 0,
      reads = 0,
      total = 0,
      cancelled = false,
      writeError = false;
    let ds;
    try {
      ds = new DecompressionStream('deflate-raw');
    } catch {
      results.push({ name, unsupported: true });
      continue;
    }
    const writer = ds.writable.getWriter(),
      reader = ds.readable.getReader();
    const feed = (async () => {
      try {
        for (let p = 0; p < bytes.length; p += 64) {
          await writer.write(new Uint8Array(bytes.slice(p, p + 64)));
          writes++;
        }
        await writer.close();
      } catch {
        writeError = true;
      }
    })();
    let accepted = false,
      error = false;
    try {
      for (;;) {
        const r = await reader.read();
        if (r.done) break;
        reads++;
        total += r.value.length;
        if (total > limit) {
          cancelled = true;
          await reader.cancel('limite');
          await writer.abort('limite').catch(() => {});
          break;
        }
      }
      accepted = !cancelled;
    } catch {
      error = true;
    }
    await feed;
    reader.releaseLock();
    writer.releaseLock();
    results.push({ name, accepted, error, total, reads, writes, cancelled, writeError });
  }
  return results;
}
function casosDeflate() {
  const z = require('node:zlib'),
    plain = Buffer.from('Atividade sintética. '.repeat(5000)),
    valid = z.deflateRawSync(plain);
  // Nível 0 garante que a cauda posterior esteja além do primeiro bloco de entrada de 64 bytes.
  const multi = z.deflateRawSync(Buffer.alloc(1000, 32), { level: 0 });
  return [
    ['valido', [...valid], plain.length],
    ['invalido', [7, 255, 255], 1000],
    ['truncado', [...valid.subarray(0, -1)], plain.length],
    ['extra-mesmo-chunk', [...z.deflateRawSync(Buffer.from('abc')), 0], 100],
    ['extra-outro-chunk', [...multi, 0], 1000],
    ['cancelamento', [...valid], 1024],
  ];
}
module.exports = { probeDeflate, casosDeflate };
