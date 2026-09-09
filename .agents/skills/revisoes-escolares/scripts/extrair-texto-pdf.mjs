#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

function usage() {
  console.error('Uso: node extrair-texto-pdf.mjs --pdf <arquivo.pdf> [--pages "1,3,8-12"] [--out <saida.txt>]');
  process.exit(2);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (!key.startsWith('--')) continue;
    const value = argv[i + 1];
    if (!value || value.startsWith('--')) usage();
    args[key.slice(2)] = value;
    i += 1;
  }
  return args;
}

function parsePages(spec, total) {
  if (!spec) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set();
  for (const partRaw of spec.split(',')) {
    const part = partRaw.trim();
    if (!part) continue;
    if (part.includes('-')) {
      const [aRaw, bRaw] = part.split('-', 2);
      const a = Number.parseInt(aRaw, 10);
      const b = Number.parseInt(bRaw, 10);
      if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b < a) {
        throw new Error(`Intervalo de paginas invalido: ${part}`);
      }
      for (let p = a; p <= b; p += 1) pages.add(p);
    } else {
      const p = Number.parseInt(part, 10);
      if (!Number.isInteger(p) || p < 1) throw new Error(`Pagina invalida: ${part}`);
      pages.add(p);
    }
  }
  const ordered = [...pages].sort((a, b) => a - b);
  for (const p of ordered) {
    if (p > total) throw new Error(`Pagina ${p} excede o total do PDF (${total}).`);
  }
  return ordered;
}

function textFromItems(items) {
  const lines = [];
  let current = '';
  for (const item of items) {
    if (!('str' in item)) continue;
    current += item.str;
    if (item.hasEOL) {
      lines.push(current.trimEnd());
      current = '';
    } else if (item.str && !item.str.endsWith(' ')) {
      current += ' ';
    }
  }
  if (current.trim()) lines.push(current.trimEnd());
  return lines.join('\n').replace(/[ \t]+\n/g, '\n').trim();
}

const args = parseArgs(process.argv.slice(2));
if (!args.pdf) usage();

const pdfPath = path.resolve(args.pdf);
if (!fs.existsSync(pdfPath)) throw new Error(`PDF nao encontrado: ${pdfPath}`);

const data = new Uint8Array(fs.readFileSync(pdfPath));
const loadingTask = getDocument({ data, isEvalSupported: false, useWorkerFetch: false });
const pdf = await loadingTask.promise;
const selected = parsePages(args.pages, pdf.numPages);

const chunks = [];
for (const pageNumber of selected) {
  const page = await pdf.getPage(pageNumber);
  const content = await page.getTextContent();
  const text = textFromItems(content.items);
  chunks.push(`===== PAGINA ${pageNumber} =====\n${text}`);
}

const output = `${chunks.join('\n\n')}\n`;
if (args.out) {
  const outPath = path.resolve(args.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, output, 'utf8');
  console.error(`Texto extraido de ${selected.length} pagina(s) para: ${outPath}`);
} else {
  process.stdout.write(output);
}

await loadingTask.destroy();
