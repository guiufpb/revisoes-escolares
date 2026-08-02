const fs = require("node:fs");
const path = require("node:path");
const { fileURLToPath } = require("node:url");
const {
  countPdfPages,
  openHtml,
  readPdfMediaBoxes,
  resolveInput,
} = require("./_browser");

const A4_WIDTH_PX = (210 / 25.4) * 96;
const A4_HEIGHT_PX = (297 / 25.4) * 96;
const A4_WIDTH_PT = (210 / 25.4) * 72;
const A4_HEIGHT_PT = (297 / 25.4) * 72;

function getOption(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function nearlyEqual(value, expected, tolerance) {
  return Math.abs(value - expected) <= tolerance;
}

function formatReport(report) {
  const lines = [
    "VALIDACAO AUTOMATICA DA CARTILHA",
    "",
    `Data: ${new Date().toLocaleString("pt-BR")}`,
    `HTML: ${report.html}`,
    `Navegador: ${report.browser}`,
    `Paginas encontradas: ${report.foundPages}`,
    `Paginas esperadas: ${report.expectedPages}`,
    `Regra @page A4: ${report.hasPageRule ? "OK" : "AUSENTE"}`,
    `Imagens quebradas: ${report.brokenImages.length}`,
    `Referencias locais inexistentes: ${report.missingReferences.length}`,
    `Textos possivelmente sem quebra: ${report.longTexts.length}`,
    `Resultado: ${report.valid ? "VALIDO" : "COM PROBLEMAS"}`,
    "",
  ];

  if (report.pdf) {
    lines.push(`PDF verificado: ${report.pdf.path}`);
    lines.push(`Paginas no PDF: ${report.pdf.pages || "nao foi possivel contar"}`);
    lines.push("");
  }

  if (report.issues.length) {
    lines.push("PROBLEMAS ENCONTRADOS:");
    report.issues.forEach((issue) => lines.push(`- ${issue}`));
  } else {
    lines.push("Nenhum problema tecnico foi detectado.");
  }

  lines.push(
    "",
    "OBSERVACAO:",
    "A validacao automatica ajuda a encontrar erros tecnicos, mas nao substitui a conferencia visual dos previews PNG e do PDF final."
  );

  return `${lines.join("\r\n")}\r\n`;
}

async function main() {
  const htmlPath = resolveInput(process.argv[2]);
  const expectedOption = getOption("--paginas");
  const pdfOption = getOption("--pdf");
  const reportOption = getOption("--relatorio");
  const jsonOutput = process.argv.includes("--json");
  const reportPath = path.resolve(
    reportOption || path.join(path.dirname(htmlPath), "VALIDACAO_AUTOMATICA.txt")
  );
  const { browser, browserInfo, page } = await openHtml(htmlPath, {
    media: "print",
  });

  let browserChecks;
  try {
    browserChecks = await page.evaluate(() => {
      const pageElements = [...document.querySelectorAll(".page")];
      const hasPageRule = [...document.querySelectorAll("style")]
        .map((style) => style.textContent || "")
        .some((css) => /@page\s*{[^}]*size\s*:\s*A4/i.test(css));
      const footerMatches = [
        ...document.body.innerText.matchAll(/Página\s+\d+\s+de\s+(\d+)/gi),
      ];
      const inferredExpected = footerMatches.length
        ? Math.max(...footerMatches.map((match) => Number(match[1])))
        : undefined;

      const pages = pageElements.map((element, index) => {
        const rect = element.getBoundingClientRect();
        const outside = [...element.querySelectorAll("*")]
          .filter((child) => !child.closest(".svg-sprite, .sprite"))
          .map((child) => {
            const childRect = child.getBoundingClientRect();
            return {
              tag: child.tagName.toLowerCase(),
              text: (child.textContent || "")
                .trim()
                .replace(/\s+/g, " ")
                .slice(0, 80),
              left: childRect.left < rect.left - 2,
              right: childRect.right > rect.right + 2,
              top: childRect.top < rect.top - 2,
              bottom: childRect.bottom > rect.bottom + 2,
            };
          })
          .filter((item) => item.left || item.right || item.top || item.bottom)
          .slice(0, 10);

        return {
          page: index + 1,
          width: rect.width,
          height: rect.height,
          scrollWidth: element.scrollWidth,
          scrollHeight: element.scrollHeight,
          outside,
        };
      });

      const brokenImages = [...document.images]
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => ({
          src: image.getAttribute("src") || "",
          alt: image.getAttribute("alt") || "",
        }));

      const references = [];
      const attributes = [
        ["img", "src"],
        ["source", "src"],
        ["script", "src"],
        ["link", "href"],
        ["object", "data"],
        ["embed", "src"],
        ["video", "poster"],
      ];
      for (const [selector, attribute] of attributes) {
        document.querySelectorAll(`${selector}[${attribute}]`).forEach((node) => {
          references.push({
            tag: selector,
            attribute,
            raw: node.getAttribute(attribute),
            resolved: node[attribute] || node.href || node.data || "",
          });
        });
      }
      document.querySelectorAll("style, [style]").forEach((node) => {
        const css =
          node.tagName === "STYLE"
            ? node.textContent || ""
            : node.getAttribute("style") || "";
        for (const match of css.matchAll(/url\(\s*(['\"]?)(.*?)\1\s*\)/gi)) {
          try {
            references.push({
              tag: "css",
              attribute: "url",
              raw: match[2],
              resolved: new URL(match[2], document.baseURI).href,
            });
          } catch {
            references.push({
              tag: "css",
              attribute: "url",
              raw: match[2],
              resolved: match[2],
            });
          }
        }
      });

      const longTexts = [...document.querySelectorAll(".page *")]
        .filter((element) => {
          if (element.children.length || element.closest(".svg-sprite, .sprite")) {
            return false;
          }
          const text = (element.textContent || "").trim();
          if (text.length < 25) return false;
          const longestWord = Math.max(...text.split(/\s+/).map((word) => word.length));
          return (
            element.scrollWidth > element.clientWidth + 2 ||
            longestWord >= 40
          );
        })
        .map((element) => ({
          tag: element.tagName.toLowerCase(),
          text: (element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 120),
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth,
        }))
        .slice(0, 30);

      const brokenSvgUses = [...document.querySelectorAll("use[href], use[xlink\\:href]")]
        .map((use) => use.getAttribute("href") || use.getAttribute("xlink:href"))
        .filter((href) => href?.startsWith("#") && !document.querySelector(href));

      return {
        pages,
        hasPageRule,
        inferredExpected,
        brokenImages,
        references,
        longTexts,
        brokenSvgUses,
      };
    });
  } finally {
    await browser.close();
  }

  const expectedPages = Number(
    expectedOption || browserChecks.inferredExpected || browserChecks.pages.length
  );
  const missingReferences = browserChecks.references
    .filter(({ raw, resolved }) => {
      if (
        !raw ||
        raw.startsWith("#") ||
        /^(data:|blob:|https?:|mailto:|javascript:)/i.test(raw)
      ) {
        return false;
      }
      if (!resolved.startsWith("file:")) return false;
      try {
        return !fs.existsSync(fileURLToPath(resolved));
      } catch {
        return true;
      }
    })
    .map(({ tag, attribute, raw }) => ({ tag, attribute, path: raw }));

  const issues = [];
  if (!browserChecks.hasPageRule) {
    issues.push('CSS não contém "@page { size: A4 ... }".');
  }
  if (browserChecks.pages.length !== expectedPages) {
    issues.push(
      `Quantidade de páginas: esperado ${expectedPages}, encontrado ${browserChecks.pages.length}.`
    );
  }
  for (const result of browserChecks.pages) {
    if (
      !nearlyEqual(result.width, A4_WIDTH_PX, 2) ||
      !nearlyEqual(result.height, A4_HEIGHT_PX, 2)
    ) {
      issues.push(
        `Página ${result.page}: ${result.width.toFixed(1)} x ${result.height.toFixed(1)} px, diferente de A4.`
      );
    }
    if (
      result.scrollWidth > result.width + 2 ||
      result.scrollHeight > result.height + 2
    ) {
      issues.push(`Página ${result.page}: conteúdo excede a área da página.`);
    }
    result.outside.forEach((item) =>
      issues.push(
        `Página ${result.page}: elemento ${item.tag} ultrapassa a página (${item.text || "sem texto"}).`
      )
    );
  }
  browserChecks.brokenImages.forEach((image) =>
    issues.push(`Imagem quebrada: ${image.src || image.alt || "sem identificação"}.`)
  );
  missingReferences.forEach((reference) =>
    issues.push(
      `Referência inexistente em ${reference.tag}[${reference.attribute}]: ${reference.path}.`
    )
  );
  browserChecks.brokenSvgUses.forEach((reference) =>
    issues.push(`Referência SVG interna inexistente: ${reference}.`)
  );
  browserChecks.longTexts.forEach((item) =>
    issues.push(`Texto possivelmente sem quebra em ${item.tag}: ${item.text}.`)
  );

  let pdfResult;
  if (pdfOption) {
    const pdfPath = path.resolve(pdfOption);
    if (!fs.existsSync(pdfPath)) {
      issues.push(`PDF informado não foi encontrado: ${pdfPath}.`);
    } else {
      const buffer = fs.readFileSync(pdfPath);
      const mediaBoxes = readPdfMediaBoxes(buffer);
      pdfResult = {
        path: pdfPath,
        pages: countPdfPages(buffer),
        mediaBoxes,
      };
      if (pdfResult.pages && pdfResult.pages !== expectedPages) {
        issues.push(
          `PDF tem ${pdfResult.pages} páginas; eram esperadas ${expectedPages}.`
        );
      }
      mediaBoxes.forEach((box, index) => {
        if (
          !nearlyEqual(box.width, A4_WIDTH_PT, 1) ||
          !nearlyEqual(box.height, A4_HEIGHT_PT, 1)
        ) {
          issues.push(
            `PDF página ${index + 1}: ${box.width} x ${box.height} pt não corresponde a A4.`
          );
        }
      });
    }
  }

  const report = {
    valid: issues.length === 0,
    html: htmlPath,
    browser: browserInfo.name,
    expectedPages,
    foundPages: browserChecks.pages.length,
    hasPageRule: browserChecks.hasPageRule,
    pages: browserChecks.pages,
    brokenImages: browserChecks.brokenImages,
    missingReferences,
    longTexts: browserChecks.longTexts,
    pdf: pdfResult,
    issues,
  };

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, formatReport(report), "utf8");

  if (jsonOutput) {
    console.log(JSON.stringify({ ...report, reportPath }, null, 2));
  } else {
    console.log(`HTML: ${htmlPath}`);
    console.log(`Navegador: ${browserInfo.name}`);
    console.log(`Páginas: ${browserChecks.pages.length}/${expectedPages}`);
    console.log(`Regra @page A4: ${browserChecks.hasPageRule ? "OK" : "AUSENTE"}`);
    console.log(`Imagens quebradas: ${browserChecks.brokenImages.length}`);
    console.log(`Referências inexistentes: ${missingReferences.length}`);
    console.log(`Textos possivelmente sem quebra: ${browserChecks.longTexts.length}`);
    console.log(`Resultado: ${report.valid ? "VÁLIDO" : "COM PROBLEMAS"}`);
    console.log(`Relatório: ${reportPath}`);
    issues.forEach((issue) => console.log(`- ${issue}`));
  }

  if (!report.valid) process.exitCode = 2;
}

main().catch((error) => {
  console.error(`Erro ao validar cartilha: ${error.message}`);
  process.exit(1);
});
