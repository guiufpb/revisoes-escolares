'use strict';
/* global window, document, localStorage */

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { chromium } = require('playwright');
const { expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { fixture } = require('./helpers/adicao-fixture.cjs');
const { proveAddition, CONTRACT } = require('../../scripts/validacao/planejador-adicao.cjs');
const ROOT = path.resolve(__dirname, '../..');
const QUESTION = 'Na mesa há três ____ para o suco. Escreva o plural de copo.';

// Browser contract over real HTML and real sources, before the official build.
// The synthetic registration exists only inside this disposable browser context.
// No school revision, registry/card or bundle is installed or modified.
for (const profile of ['alice', 'mariana'])
  test(
    'campos integrados: ' + profile + ' renderiza contexto, nome acessível e correção recuperável',
    async (t) => {
      const f = fixture(profile);
      f.config.questoes[1].itens = [{ id: 'q2-a', pergunta: QUESTION, respostas: ['copos'] }];
      f.files.set(
        f.file,
        "(function(){'use strict';window.QuestionariosRevisoes.registrar(" +
          JSON.stringify(f.config) +
          ');})();'
      );
      const proof = proveAddition(f.input);
      assert.equal(proof.contract, 'questionarios-adicao-integrada-v3');
      assert.equal(proof.contract, CONTRACT);
      assert.equal(proof.structuralStatus, 'proven');
      const browser = await chromium.launch();
      t.after(() => browser.close());
      const context = await browser.newContext({ reducedMotion: 'reduce' });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
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
        for (const name of [
          'armazenamento',
          'questionarios-interacoes',
          'gramatica-ditado',
          'gramatica-questionarios',
        ])
          await page.addScriptTag({
            path: path.join(ROOT, 'ambiente_interativo/js/' + name + '.js'),
          });
        await page.addStyleTag({ path: path.join(ROOT, 'ambiente_interativo/css/estilo.css') });
        await page.evaluate((config) => {
          window.QuestionariosRevisoes.inicializar({
            mostrarTela() {
              document.querySelectorAll('.tela').forEach((panel) => {
                panel.hidden = panel.id !== 'tela-gramatica-mariana';
              });
            },
          });
          window.QuestionariosRevisoes.registrar(config);
          window.QuestionariosRevisoes.abrir(config.id);
        }, f.config);
      };
      const checkPresentation = async (index) => {
        const question = f.config.questoes[index];
        await expect(page.locator('#gramatica-conteudo .etiqueta')).toHaveText(question.bloco);
        await expect(page.locator('#gramatica-titulo-questao')).toHaveText(question.titulo);
        await expect(page.locator('#gramatica-conteudo .explicacao-mariana')).toHaveText(
          question.instrucao
        );
        await expect(page.locator('#gramatica-conteudo')).not.toContainText('undefined');
        if (question.tipo === 'opcoes')
          await expect(
            page.getByRole('group', { name: question.itens[0].pergunta, exact: true })
          ).toBeVisible();
        else
          await expect(page.getByRole('textbox')).toHaveAccessibleName(question.itens[0].pergunta);
      };
      await mount();
      await checkPresentation(0);
      await page.getByRole('button', { name: 'Foto', exact: true }).click();
      await page.locator('[data-conferir-gramatica]').click();
      await page.locator('#gramatica-proxima').click();
      await checkPresentation(1);
      const input = page.getByRole('textbox', { name: QUESTION, exact: true });
      await expect(input).toBeVisible();
      await expect(input).toHaveAccessibleName(QUESTION);
      await expect(page.locator('#gramatica-conteudo')).toContainText(
        'Na mesa há três ____ para o suco.'
      );
      await expect(input.locator('..')).toHaveText(QUESTION);
      await expect(input.locator('..')).not.toContainText('undefined');
      await input.fill('copo');
      await input.press('Enter');
      await expect(input).toHaveAttribute('aria-invalid', 'true');
      await expect(page.locator('#gramatica-proxima')).toBeDisabled();
      await expect(page.locator('#gramatica-pontos')).toHaveText('1 de 2');
      await mount();
      await checkPresentation(1);
      await expect(input).toHaveValue('copo');
      await expect(input).toHaveAttribute('aria-invalid', 'true');
      await input.fill(' COPOS ');
      await input.press('Enter');
      await expect(page.locator('#gramatica-proxima')).toBeEnabled();
      await page.locator('[data-conferir-gramatica]').click();
      await expect(page.locator('#gramatica-pontos')).toHaveText('2 de 2');
      await page.locator('#gramatica-voltar').click();
      await checkPresentation(0);
      await page.locator('#gramatica-proxima').click();
      await mount();
      await checkPresentation(1);
      await expect(input).toHaveValue(' COPOS ');
      await expect(input).toHaveClass(/campo-correto/);
      await expect(page.locator('#gramatica-pontos')).toHaveText('2 de 2');
      const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), f.key);
      assert.equal(saved.respostas.q2[0], ' COPOS ');
      assert.equal(saved.corrigidas.q2, true);
      assert.equal(Object.keys(saved.pontuadas).length, 2);
      for (const width of [1366, 390]) {
        await page.setViewportSize({ width, height: 844 });
        await page.evaluate(
          () =>
            new Promise((resolve) =>
              window.requestAnimationFrame(() => window.requestAnimationFrame(resolve))
            )
        );
        assert.equal(
          await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
          true
        );
        const axe = await new AxeBuilder({ page })
          .include('#tela-gramatica-mariana')
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();
        assert.deepEqual(
          axe.violations.filter((v) => ['serious', 'critical'].includes(v.impact)),
          []
        );
      }
      assert.deepEqual(errors, []);
    }
  );
