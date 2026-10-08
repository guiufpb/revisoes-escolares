'use strict';

const { fixtures, signature, prepareFixtures, readFixture } = require('./pdfs.cjs');

function pdfMiddleware(root) {
  return (request, response, next) => {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    } catch {
      response.statusCode = 400;
      return response.end('URL invalida.');
    }
    if (!/\.pdf(?:\/|$)/i.test(pathname)) return next();
    response.setHeader('Cache-Control', 'no-store');
    const fixture = fixtures.find((item) => item.url === pathname);
    if (!fixture) {
      response.statusCode = 404;
      return response.end(
        'PDF sem fixture sintetica cadastrada; leitura de PDF privado bloqueada nos testes.'
      );
    }
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.statusCode = 405;
      response.setHeader('Allow', 'GET, HEAD');
      return response.end();
    }
    let bytes;
    try {
      bytes = readFixture(root, fixture);
    } catch (error) {
      response.statusCode = 500;
      return response.end(error.message);
    }
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('X-Revisoes-Pdf-Fixture', signature);
    response.setHeader('Accept-Ranges', 'bytes');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    const range = request.headers.range;
    if (range) {
      const match = /^bytes=(\d+)-(\d*)$/.exec(range);
      const start = match ? Number(match[1]) : -1;
      const end = match && match[2] ? Number(match[2]) : bytes.length - 1;
      if (start < 0 || start > end || end >= bytes.length) {
        response.statusCode = 416;
        response.setHeader('Content-Range', `bytes */${bytes.length}`);
        return response.end();
      }
      response.statusCode = 206;
      response.setHeader('Content-Range', `bytes ${start}-${end}/${bytes.length}`);
      bytes = bytes.subarray(start, end + 1);
    }
    response.setHeader('Content-Length', bytes.length);
    return response.end(request.method === 'HEAD' ? undefined : bytes);
  };
}

function syntheticPdfPlugin() {
  return {
    name: 'revisoes-test-only-synthetic-pdfs',
    apply: 'serve',
    configureServer(server) {
      const result = prepareFixtures(server.config.root);
      server.config.logger.info(
        `PDFs de teste: ${result.total} fixtures sinteticas validadas; ${result.created} criadas.`
      );
      server.middlewares.use(pdfMiddleware(server.config.root));
    },
  };
}

module.exports = { pdfMiddleware, syntheticPdfPlugin };
