'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');

// Only URL/page metadata is reused. The generated text and drawings are original.
const books = [
  ['primeiras-licoes-sobre-dinheiro/infantil-dinheiro.pdf', 25],
  ['quem-e-o-rei-dos-animais/rei-dos-animais.pdf', 32],
  ['a-galinha-dos-ovos-de-ouro/galinha-ovos-ouro.pdf', 35],
  ['a-raposa-e-as-uvas/raposa-e-as-uvas.pdf', 21],
  ['o-dia-que-o-sol-tirou-ferias/o-dia-que-o-sol-tirou-ferias.pdf', 30],
  ['a-formiga-que-queria-cantar/a-formiga-que-queria-cantar.pdf', 36],
  ['um-castelo-bem-assombrado/um-castelo-bem-assombrado.pdf', 25],
  ['a-bela-desadormecida/a-bela-desadormecida.pdf', 30],
  ['a-joaninha-que-perdeu-as-pintinhas/a-joaninha-que-perdeu-as-pintinhas.pdf', 21],
  ['uma-formiga-especial/uma-formiga-especial.pdf', 31],
];
const fixtures = books.map(([bookPath, pages], index) => {
  const id = String(index + 1).padStart(2, '0');
  return Object.freeze({
    id,
    pages,
    url: `/ambiente_interativo/leituras/${bookPath}`,
    file: `leitor-${id}.pdf`,
  });
});
Object.freeze(fixtures);
const directory = 'tests/fixtures/pdfs';
const signature = 'synthetic-v1';

function pageText(fixture, page) {
  return `Fixture sintetica ${fixture.id} - pagina ${page} de ${fixture.pages}`;
}

function generatePdf(fixture) {
  const objects = [
    null,
    '<< /Type /Catalog /Pages 2 0 R >>',
    '',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];
  const pages = [];
  for (let page = 1; page <= fixture.pages; page += 1) {
    const number = objects.length;
    pages.push(`${number} 0 R`);
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${number + 1} 0 R >>`
    );
    const shade = ((page % 5) + 1) / 10;
    const stream = `1 1 1 rg 0 0 595 842 re f\n0.1 ${shade.toFixed(1)} 0.8 rg 36 36 180 70 re f\n0 0 0 rg BT /F1 16 Tf 36 780 Td (${pageText(fixture, page)}) Tj ET\n`;
    objects.push(`<< /Length ${Buffer.byteLength(stream, 'ascii')} >>\nstream\n${stream}endstream`);
  }
  objects[2] = `<< /Type /Pages /Count ${fixture.pages} /Kids [${pages.join(' ')}] >>`;
  let pdf = '%PDF-1.4\n% Revisoes Escolares synthetic fixture v1\n';
  const offsets = [0];
  for (let number = 1; number < objects.length; number += 1) {
    offsets.push(Buffer.byteLength(pdf, 'ascii'));
    pdf += `${number} 0 obj\n${objects[number]}\nendobj\n`;
  }
  const xref = Buffer.byteLength(pdf, 'ascii');
  pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(pdf, 'ascii');
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function fixturePath(root, fixture) {
  if (!fixtures.includes(fixture)) throw new Error('Fixture PDF desconhecida.');
  const segments = [...directory.split('/'), fixture.file];
  let current = path.resolve(root);
  for (const segment of segments) {
    current = path.join(current, segment);
    const stat = fs.lstatSync(current, { throwIfNoEntry: false });
    if (stat?.isSymbolicLink()) {
      throw new Error(`Fixture PDF ${fixture.file}: link simbolico recusado.`);
    }
  }
  return current;
}

function readFixture(root, fixture) {
  const file = fixturePath(root, fixture);
  let bytes;
  try {
    bytes = fs.readFileSync(file);
  } catch {
    throw new Error(
      `Fixture PDF ${fixture.file} ausente ou ilegivel. Execute npm run preparar:pdfs-teste.`
    );
  }
  if (!bytes.equals(generatePdf(fixture))) {
    throw new Error(
      `Fixture PDF ${fixture.file} corrompida ou de outra versao. Remova somente esta fixture sintetica e execute npm run preparar:pdfs-teste.`
    );
  }
  return bytes;
}

function prepareFixtures(root) {
  // Validate existing files before creating anything. Never replace foreign/corrupt files.
  const missing = fixtures.filter((fixture) => {
    const file = fixturePath(root, fixture);
    if (!fs.existsSync(file)) return true;
    readFixture(root, fixture);
    return false;
  });
  for (const fixture of missing) {
    const file = fixturePath(root, fixture);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    try {
      fs.writeFileSync(file, generatePdf(fixture), { flag: 'wx' });
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
    readFixture(root, fixture);
  }
  return { created: missing.length, total: fixtures.length };
}

module.exports = {
  fixtures,
  directory,
  signature,
  pageText,
  generatePdf,
  sha256,
  fixturePath,
  readFixture,
  prepareFixtures,
};
