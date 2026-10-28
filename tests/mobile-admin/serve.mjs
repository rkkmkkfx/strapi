import { createServer } from 'node:http';

import { build } from 'esbuild';

const result = await build({
  entryPoints: ['tests/mobile-admin/fixture.tsx'],
  bundle: true,
  write: false,
  format: 'iife',
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"test"' },
});

createServer((request, response) => {
  if (request.url === '/fixture.js') {
    response.setHeader('Content-Type', 'application/javascript');
    response.end(result.outputFiles[0].contents);
  } else {
    response.setHeader('Content-Type', 'text/html');
    response.end(
      '<!doctype html><html lang="en"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Mobile admin regression fixture</title><div id="root"></div><script src="/fixture.js"></script></html>'
    );
  }
}).listen(4317, '127.0.0.1');
