/* global globalThis, module, require */
(function (root) {
  'use strict';
  const nucleo =
    typeof module !== 'undefined' && module.exports
      ? require('./lab-visual-zip-nucleo.js')
      : root.LabVisualZipNucleo;
  const api = Object.freeze({ analisarTransporteZipVisual: nucleo.analisarTransporteZipVisual });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LabVisualZip = api;
})(typeof window === 'undefined' ? globalThis : window);
