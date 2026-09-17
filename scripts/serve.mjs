import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cvNames, readCV } from './cv.mjs';

const project = fileURLToPath(new URL('../', import.meta.url));
const root = path.resolve(project, process.argv[2] || 'site');
const port = Number(process.env.PORT || 4173);
const base = (process.env.BASE_PATH || '').replace(/^\/+|\/+$/g, '');
const prefix = base ? `/${base}` : '';
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp',
  '.pdf': 'application/pdf', '.xml': 'application/xml', '.txt': 'text/plain',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
};
const server = http.createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD' }).end(); return;
  }
  try {
    const url = new URL(req.url, 'http://localhost');
    let pathname = decodeURIComponent(url.pathname);
    if (prefix && pathname !== prefix && !pathname.startsWith(`${prefix}/`)) {
      res.writeHead(404).end('Not found'); return;
    }
    pathname = pathname.slice(prefix.length) || '/';
    // Resolve on every request, so replacing the PDF needs no server restart.
    if (root === path.join(project, 'site') && cvNames.some(name => pathname === `/assets/pdf/${name}`)) {
      try {
        const cv = await readCV();
        res.writeHead(200, { 'Content-Type': 'application/pdf', 'Content-Length': cv.bytes.length, 'Cache-Control': 'no-store' });
        res.end(req.method === 'HEAD' ? undefined : cv.bytes);
      } catch (error) {
        console.error(error.message);
        res.writeHead(503, { 'Cache-Control': 'no-store' }).end('CV unavailable. Check CV_SOURCE and the source PDF.');
      }
      return;
    }
    let file = path.resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(`${root}${path.sep}`)) {
      res.writeHead(403).end('Forbidden'); return;
    }
    let info;
    let status = 200;
    try {
      info = await stat(file);
      if (info.isDirectory()) {
        if (!url.pathname.endsWith('/')) {
          res.writeHead(301, { Location: `${url.pathname}/${url.search}` }).end(); return;
        }
        file = path.join(file, 'index.html');
        info = await stat(file);
      }
    } catch {
      status = 404;
      file = path.join(root, '404.html');
      info = await stat(file);
    }
    res.writeHead(status, {
      'Content-Type': types[path.extname(file)] || 'application/octet-stream',
      'Content-Length': info.size,
      'Cache-Control': 'no-store',
    });
    if (req.method === 'HEAD') res.end();
    else createReadStream(file).on('error', () => res.destroy()).pipe(res);
  } catch {
    res.writeHead(400).end('Unable to serve this path. Run npm run build before previewing dist.');
  }
});
server.on('error', error => { console.error(error.message); process.exit(1); });
server.listen(port, '127.0.0.1', () => console.log(`Local: http://localhost:${port}${prefix}/`));
