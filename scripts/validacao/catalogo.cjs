'use strict';

const crypto = require('node:crypto');
const path = require('node:path');
const { slash } = require('./fontes.cjs');

function logicalId(file, titles) {
  return (
    'case-' +
    crypto
      .createHash('sha256')
      .update(JSON.stringify([file, titles]))
      .digest('hex')
  );
}

function flattenDiscovery(report) {
  const cases = [];
  function walk(suite, parents = []) {
    const describes =
      suite.file && suite.title === suite.file ? parents : [...parents, suite.title];
    for (const spec of suite.specs || []) {
      for (const test of spec.tests || []) {
        const file = 'tests/' + spec.file.replace(/^tests\//, '');
        const titles = [...describes.filter(Boolean), spec.title];
        cases.push({
          id: logicalId(file, titles),
          file,
          titles,
          fullTitle: titles.join(' › '),
          nativeId: spec.id,
          project: test.projectName || '',
          repeatEachIndex: 0,
          line: spec.line,
        });
      }
    }
    for (const child of suite.suites || []) walk(child, describes);
  }
  for (const suite of report.suites || []) walk(suite);
  return cases;
}

function fromTest(test, root) {
  const titles = [test.title];
  let parent = test.parent;
  while (parent && parent.type === 'describe') {
    titles.unshift(parent.title);
    parent = parent.parent;
  }
  const file = slash(path.relative(root, test.location.file));
  return {
    id: logicalId(file, titles),
    nativeId: test.id,
    file,
    titles,
    fullTitle: titles.join(' › '),
    project: test.parent.project()?.name || '',
    repeatEachIndex: test.repeatEachIndex,
  };
}

function classify(manifest, item) {
  const file = manifest.tests.find((entry) => entry.file === item.file);
  if (!file) throw new Error('Arquivo sem metadados: ' + item.file);
  const matched = file.cases.filter((rule) => new RegExp(rule.pattern, 'u').test(item.fullTitle));
  if (matched.length > 1)
    throw new Error('Classificação ambígua: ' + item.file + ' › ' + item.fullTitle);
  const override = matched[0];
  return {
    ...file.defaults,
    ...override?.metadata,
    associationScope: override?.metadata.revisions ? 'case' : 'file-conservative-superset',
    revisions: override?.metadata.revisions || file.revisions,
    engines: file.engines,
    capabilities: file.capabilities,
    contracts: file.contracts,
    rule: override?.id || 'file-default',
  };
}

module.exports = { logicalId, flattenDiscovery, fromTest, classify };
