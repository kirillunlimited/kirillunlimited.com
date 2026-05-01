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

    let url = req.url.split('?')[0];
    if (url === '/') url = 'index.html';
    else url = url.slice(1);

    const filePath = path.join(dist, url);

    try {
      await stat(filePath);

      const ext = path.extname(filePath);

      res.writeHead(200, {
        'Content-Type': MIME[ext] || 'application/octet-stream',
      });

      createReadStream(filePath).pipe(res);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
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
