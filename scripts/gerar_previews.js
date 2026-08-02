const path = require("node:path");
const fs = require("node:fs");
const {
  ensureDirectory,
  openHtml,
  resolveInput,
} = require("./_browser");

async function main() {
  const htmlPath = resolveInput(process.argv[2]);
  const baseName = path.basename(htmlPath, path.extname(htmlPath));
  const outputDirectory = path.resolve(
    process.argv[3] || path.join(path.dirname(htmlPath), "preview_paginas")
  );
  ensureDirectory(outputDirectory);
  for (const file of fs.readdirSync(outputDirectory)) {
    if (/^pagina-\d+\.png$/i.test(file)) {
      fs.rmSync(path.join(outputDirectory, file));
    }
  }

  const { browser, browserInfo, page } = await openHtml(htmlPath, {
    media: "screen",
    viewport: { width: 1200, height: 1600 },
    deviceScaleFactor: 1.25,
  });

  try {
    const pages = page.locator(".page");
    const pageCount = await pages.count();
    if (!pageCount) {
      throw new Error('nenhum elemento com a classe ".page" foi encontrado.');
    }

    for (let index = 0; index < pageCount; index += 1) {
      const output = path.join(
        outputDirectory,
        `pagina-${String(index + 1).padStart(2, "0")}.png`
      );
      await pages.nth(index).screenshot({
        path: output,
        animations: "disabled",
      });
      console.log(`Preview ${index + 1}/${pageCount}: ${output}`);
    }

    console.log(`Navegador: ${browserInfo.name}`);
    console.log(`Cartilha: ${baseName}`);
    console.log(`Previews gerados em: ${outputDirectory}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(`Erro ao gerar previews: ${error.message}`);
  process.exit(1);
});
