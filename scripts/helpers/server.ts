import http, { type IncomingMessage, type ServerResponse } from 'node:http';
import path from 'node:path';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';

type DevServerOptions = {
  dist: string;
  onClient?: (res: ServerResponse) => void;
};

type DevServer = {
  listen: (port?: number) => void;
  reload: () => void;
};

const MIME: Record<string, string> = {
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

export function createDevServer({ dist, onClient }: DevServerOptions): DevServer {
  const clients = new Set<ServerResponse>();

  function sendReload(): void {
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

  const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const urlRaw = req.url ?? '/';
    const pathname = urlRaw.split('?')[0];

    // ---------------------
    // SSE
    // ---------------------
    if (pathname === '/reload') {
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
    let url = pathname === '/' ? 'index.html' : pathname.slice(1);

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

    // ---------------------
    // serve file
    // ---------------------
    const ext = path.extname(filePath);

    res.writeHead(200, {
      'Content-Type': MIME[ext] ?? 'application/octet-stream',
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
