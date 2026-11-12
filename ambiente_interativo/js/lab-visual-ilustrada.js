/* global globalThis, module, require */
(function (root) {
  'use strict';
  const nucleo =
    typeof module !== 'undefined' && module.exports
      ? require('./lab-visual-zip-nucleo.js')
      : root.LabVisualZipNucleo;
  const api = Object.freeze({
    criarPreparacaoIlustradaVisual: nucleo.criarPreparacaoIlustradaVisual,
  });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LabVisualIlustrada = api;
})(typeof window === 'undefined' ? globalThis : window);
