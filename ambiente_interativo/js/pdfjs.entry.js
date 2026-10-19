import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

// Relative to this module, not the HTML page or the worker's embedded data URL.
const wasmUrl = new URL('./pdfjs-wasm/', import.meta.url).href;

function getDocumentLocal(source = {}) {
  // Keep all document options and avoid mutating the caller's object.
  return pdfjsLib.getDocument({ ...source, wasmUrl: source.wasmUrl ?? wasmUrl });
}

window.PDFJSLocal = Object.freeze({ ...pdfjsLib, getDocument: getDocumentLocal });
