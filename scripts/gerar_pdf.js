const path = require("node:path");
const fs = require("node:fs");
const {
  countPdfPages,
  ensureDirectory,
  openHtml,
  resolveInput,
} = require("./_browser");

async function main() {
  const htmlPath = resolveInput(process.argv[2]);
  const destination = process.argv[3];
  let pdfPath;

  if (!destination) {
    pdfPath = htmlPath.replace(/\.html?$/i, ".pdf");
  } else {
    const resolvedDestination = path.resolve(destination);
    const destinationIsDirectory =
      fs.existsSync(resolvedDestination) &&
      fs.statSync(resolvedDestination).isDirectory();
    const looksLikeDirectory = /[\\/]$/.test(destination);

    pdfPath =
      destinationIsDirectory || looksLikeDirectory
        ? path.join(
            resolvedDestination,
            `${path.basename(htmlPath, path.extname(htmlPath))}.pdf`
          )
        : resolvedDestination;
  }

  ensureDirectory(path.dirname(pdfPath));

  const { browser, browserInfo, page } = await openHtml(htmlPath, {
    media: "print",
  });
  try {
    const htmlPages = await page.locator(".page").count();
    if (!htmlPages) {
      throw new Error('nenhum elemento com a classe ".page" foi encontrado.');
    }

    const pdf = await page.pdf({
      path: pdfPath,
      format: "A4",
      preferCSSPageSize: true,
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
    const pdfPages = countPdfPages(pdf);

    console.log(`PDF gerado: ${pdfPath}`);
    console.log(`Navegador: ${browserInfo.name}`);
    console.log(`Páginas HTML: ${htmlPages}`);
    console.log(`Páginas PDF: ${pdfPages || "não foi possível contar"}`);

    if (pdfPages && pdfPages !== htmlPages) {
      console.warn(
        `Aviso: o HTML tem ${htmlPages} páginas, mas o PDF tem ${pdfPages}.`
      );
      process.exitCode = 2;
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(`Erro ao gerar PDF: ${error.message}`);
  process.exit(1);
});
