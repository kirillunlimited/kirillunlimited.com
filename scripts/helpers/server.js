import http from 'node:http';
import path from 'node:path';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

export function createDevServer({ dist, onClient }) {
  const clients = new Set();

  function sendReload() {
    for (const res of clients) {
      res.write('event: reload\n');
      res.write('data: now\n\n');
    }
  }

  // heartbeat
  setInterval(() => {
    for (const res of clients) {
      res.write(': ping\n\n');
    }
  }, 20000);

  const server = http.createServer(async (req, res) => {
    // ---------------------
    // SSE
    // ---------------------
    if (req.url === '/reload') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });

      clients.add(res);
      onClient?.(res);

      req.on('close', () => {
        clients.delete(res);
      });

      return;
    }

    // ---------------------
    // URL normalize
    // ---------------------
    let url = req.url.split('?')[0];

    if (url === '/') url = 'index.html';
    else url = url.slice(1);

    let filePath = path.join(dist, url);

    // ---------------------
    // 1. direct file
    // ---------------------
    try {
      await stat(filePath);
    } catch {
      // ---------------------
      // 2. .html fallback
      // ---------------------
      try {
        filePath = path.join(dist, `${url}.html`);
        await stat(filePath);
      } catch {
        // ---------------------
        // 3. 404 fallback
        // ---------------------
        const notFoundPath = path.join(dist, '404.html');

        try {
          await stat(notFoundPath);

          res.writeHead(404, { 'Content-Type': 'text/html' });
          createReadStream(notFoundPath).pipe(res);
        } catch {
          res.writeHead(404);
          res.end('Not found');
        }

        return;
      }
    }

    const ext = path.extname(filePath);

    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
    });

    createReadStream(filePath).pipe(res);
  });

  return {
    listen(port = 3000) {
      server.listen(port, () => {
        console.log(`🚀 dev server: http://localhost:${port}`);
      });
    },
    reload: sendReload,
  };
}
