'use strict';
/* global window, document, localStorage */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { chromium } = require('playwright');
const { expect } = require('@playwright/test');
const { optinsFixture } = require('./helpers/optins-fixture.cjs');
const ROOT = path.resolve(__dirname, '../..');

// Minimal opt-ins literal: the existing equivalents also enable extra capabilities.
// Register only inside a disposable browser, without creating a school module/card.
for (const profile of ['alice', 'mariana'])
  test('opt-ins mínimo renderizado: ' + profile, async (t) => {
    const f = optinsFixture(profile),
      browser = await chromium.launch();
    t.after(() => browser.close());
    const page = await browser.newPage(),
      errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.addInitScript(() => {
      window.__optins = { calls: [] };
      window.SpeechSynthesisUtterance = function (text) {
        this.text = text;
      };
      window.speechSynthesis.getVoices = () => [
        { name: 'Local', lang: 'pt-BR', localService: true },
      ];
      window.speechSynthesis.speak = (u) => window.__optins.calls.push(u);
      window.speechSynthesis.cancel = () => {};
      window.speechSynthesis.resume = () => {};
    });
    await page.route('**/*', (route) =>
      route.fulfill({
        contentType: route.request().resourceType() === 'document' ? 'text/html' : 'text/plain',
        body:
          route.request().resourceType() === 'document'
            ? fs.readFileSync(path.join(ROOT, 'ambiente_interativo/index.html'), 'utf8')
            : '',
      })
    );
    const mount = async () => {
      await page.goto('http://127.0.0.1/ambiente_interativo/index.html');
      for (const module of [
        'armazenamento',
        'audio',
        'questionarios-interacoes',
        'gramatica-ditado',
        'gramatica-questionarios',
      ])
        await page.addScriptTag({
          path: path.join(ROOT, 'ambiente_interativo/js/' + module + '.js'),
        });
      await page.addStyleTag({ path: path.join(ROOT, 'ambiente_interativo/css/estilo.css') });
      await page.evaluate((config) => {
        window.QuestionariosRevisoes.inicializar({
          mostrarTela() {
            document
              .querySelectorAll('.tela')
              .forEach((p) => (p.hidden = p.id !== 'tela-gramatica-mariana'));
          },
        });
        window.QuestionariosRevisoes.registrar(config);
        window.QuestionariosRevisoes.abrir(config.id);
      }, f.config);
    };
    await mount();
    await expect(page.locator('#tela-gramatica-mariana')).toHaveClass(/layout-desktop-amplo/);
    await page.getByRole('button', { name: 'Foto', exact: true }).click();
    await page.locator('[data-conferir-gramatica]').click();
    await page.locator('#gramatica-proxima').click();
    await expect(page.getByRole('textbox')).toHaveAccessibleName(
      'Escreva a palavra que você ouviu.'
    );
    await expect(page.locator('#gramatica-conteudo')).not.toContainText('foto');
    await page.getByRole('textbox').fill('errada');
    await page.locator('[data-conferir-gramatica]').click();
    await expect(page.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    await mount();
    await expect(page.getByRole('textbox')).toHaveValue('errada');
    await expect(page.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    await page.getByRole('textbox').fill(' FOTO ');
    await page.locator('[data-conferir-gramatica]').click();
    await page.locator('[data-conferir-gramatica]').click();
    await expect(page.locator('#gramatica-pontos')).toHaveText('2 de 3');
    await page.locator('[data-ouvir-ditado-gramatica]').click();
    assert.equal(await page.evaluate(() => window.__optins.calls[0].text), 'A palavra é: foto');
    await page.locator('#gramatica-titulo-questao').focus();
    await page.keyboard.press('Control+Alt+R');
    await page.locator('#gramatica-modo-responsavel-sessao').selectOption('responsavel');
    const main = await page.evaluate((k) => localStorage.getItem(k), f.key);
    await expect(page.locator('#gramatica-pontos')).toHaveText('0 de 3');
    const before = await page.locator('#tela-gramatica-mariana').innerHTML();
    await page.evaluate(() => {
      const u = window.__optins.calls[0];
      u.onstart?.();
      u.onend?.();
      u.onerror?.({ error: 'late' });
    });
    assert.equal(await page.locator('#tela-gramatica-mariana').innerHTML(), before);
    assert.equal(await page.evaluate((k) => localStorage.getItem(k), f.key), main);
    await page.locator('#gramatica-modo-responsavel-questao').fill('3');
    await page.getByRole('button', { name: 'Ir', exact: true }).click();
    await page.keyboard.press('Escape');
    await expect(page.locator('#gramatica-conteudo')).not.toContainText('A folha caiu.');
    await page.locator('[data-ouvir-ditado-gramatica]').click();
    assert.equal(
      await page.evaluate(() => window.__optins.calls.at(-1).text),
      'A frase é: A folha caiu.'
    );
    await page.getByRole('textbox').fill('A folha caiu.');
    await page.locator('[data-conferir-gramatica]').click();
    await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 3');
    assert.equal(await page.evaluate((k) => localStorage.getItem(k), f.key), main);
    assert.deepEqual(errors, []);
  });
