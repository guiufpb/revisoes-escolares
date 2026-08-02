const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");

const EDGE_PATHS = [
  process.env.EDGE_PATH,
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].filter(Boolean);

function fail(message) {
  console.error(`Erro: ${message}`);
  process.exit(1);
}

function resolveInput(input) {
  if (!input) {
    fail("informe o caminho do arquivo HTML.");
  }

  const resolved = path.resolve(input);
  if (!fs.existsSync(resolved)) {
    fail(`arquivo não encontrado: ${resolved}`);
  }
  return resolved;
}

function findBrowserExecutable() {
  const playwrightChromium = chromium.executablePath();
  if (playwrightChromium && fs.existsSync(playwrightChromium)) {
    return { executablePath: playwrightChromium, name: "Chromium do Playwright" };
  }

  const edge = EDGE_PATHS.find((candidate) => fs.existsSync(candidate));
  if (!edge) {
    fail(
      'Chromium do Playwright e Microsoft Edge não encontrados. Execute "npx playwright install chromium".'
    );
  }
  return { executablePath: edge, name: "Microsoft Edge (fallback)" };
}

async function openHtml(htmlPath, options = {}) {
  const browserInfo = findBrowserExecutable();
  const browser = await chromium.launch({
    executablePath: browserInfo.executablePath,
    headless: true,
  });
  const context = await browser.newContext({
    viewport: options.viewport || { width: 1200, height: 1600 },
    deviceScaleFactor: options.deviceScaleFactor || 1,
  });
  const page = await context.newPage();

  if (options.media) {
    await page.emulateMedia({ media: options.media });
  }

  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "load" });
  await page.waitForFunction(() => document.fonts?.status === "loaded");
  await page.evaluate(async () => {
    await Promise.all(
      [...document.images].map((image) =>
        image.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              image.addEventListener("load", resolve, { once: true });
              image.addEventListener("error", resolve, { once: true });
            })
      )
    );
  });

  return { browser, browserInfo, context, page };
}

function ensureDirectory(directory) {
  fs.mkdirSync(directory, { recursive: true });
}

function countPdfPages(buffer) {
  const text = buffer.toString("latin1");
  const counts = [
    ...text.matchAll(/\/Type\s*\/Pages\b[\s\S]{0,300}?\/Count\s+(\d+)/g),
  ].map((match) => Number(match[1]));

  return counts.length
    ? Math.max(...counts)
    : (text.match(/\/Type\s*\/Page\b/g) || []).length;
}

function readPdfMediaBoxes(buffer) {
  const text = buffer.toString("latin1");
  return [
    ...text.matchAll(
      /\/MediaBox\s*\[\s*0\s+0\s+([\d.]+)\s+([\d.]+)\s*\]/g
    ),
  ].map((match) => ({
    width: Number(match[1]),
    height: Number(match[2]),
  }));
}

module.exports = {
  countPdfPages,
  ensureDirectory,
  findBrowserExecutable,
  openHtml,
  readPdfMediaBoxes,
  resolveInput,
};
