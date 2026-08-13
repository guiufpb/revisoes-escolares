const fs = require('node:fs');
const path = require('node:path');

const livros = [
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

function criarPdfVazio(totalPaginas) {
  const objetos = [];
  const objetoConteudo = totalPaginas + 3;
  const paginas = Array.from({ length: totalPaginas }, (_, indice) => indice + 3);

  objetos[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objetos[2] =
    '<< /Type /Pages /Count ' +
    totalPaginas +
    ' /Kids [' +
    paginas.map((numero) => numero + ' 0 R').join(' ') +
    '] >>';

  paginas.forEach((numero) => {
    objetos[numero] =
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] ' +
      '/Resources << >> /Contents ' +
      objetoConteudo +
      ' 0 R >>';
  });
  objetos[objetoConteudo] = '<< /Length 0 >>\nstream\n\nendstream';

  let pdf = '%PDF-1.4\n% CI placeholder\n';
  const deslocamentos = [0];
  for (let numero = 1; numero < objetos.length; numero += 1) {
    deslocamentos[numero] = Buffer.byteLength(pdf, 'ascii');
    pdf += numero + ' 0 obj\n' + objetos[numero] + '\nendobj\n';
  }

  const inicioXref = Buffer.byteLength(pdf, 'ascii');
  pdf += 'xref\n0 ' + objetos.length + '\n';
  pdf += '0000000000 65535 f \n';
  for (let numero = 1; numero < objetos.length; numero += 1) {
    pdf += String(deslocamentos[numero]).padStart(10, '0') + ' 00000 n \n';
  }
  pdf += 'trailer\n<< /Size ' + objetos.length + ' /Root 1 0 R >>\n';
  pdf += 'startxref\n' + inicioXref + '\n%%EOF\n';
  return Buffer.from(pdf, 'ascii');
}

const raiz = path.resolve(process.argv[2] || process.cwd());
let criados = 0;

livros.forEach(([arquivoRelativo, totalPaginas]) => {
  const destino = path.join(raiz, 'ambiente_interativo', 'leituras', arquivoRelativo);
  if (fs.existsSync(destino)) return;
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, criarPdfVazio(totalPaginas));
  criados += 1;
});

console.log(
  criados
    ? criados + ' PDFs vazios criados exclusivamente para os testes de CI.'
    : 'Nenhum PDF criado; os arquivos locais existentes foram preservados.'
);
