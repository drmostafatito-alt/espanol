/** خادم ثابت لـ dist مع تمرير /api إلى عامل التطوير — لقياس أداء نسخة البناء. */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const args = process.argv.slice(2);
const argOf = (n, d) => (args.indexOf(n) >= 0 ? args[args.indexOf(n) + 1] : d);
const ROOT = argOf('--root', 'dist');
const PORT = Number(argOf('--port', '4173'));
const API = argOf('--api', 'http://127.0.0.1:8787');

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg',
  '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json',
};

const server = createServer(async (req, res) => {
  if (req.url?.startsWith('/api')) {
    const { request } = await import('node:https').catch(() => ({ request: null }));
    void request;
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const upstream = await fetch(API + req.url, {
      method: req.method,
      headers: { ...req.headers, host: '127.0.0.1:8787' },
      body: ['GET', 'HEAD'].includes(req.method ?? 'GET') ? undefined : Buffer.concat(chunks),
      redirect: 'manual',
    });
    // fetch يفكّ ضغط الرد أصلًا؛ تمرير content-encoding كما هو يكسر فك الترميز
    const headers = Object.fromEntries(upstream.headers);
    delete headers['content-encoding'];
    delete headers['content-length'];
    delete headers['transfer-encoding'];
    const body = Buffer.from(await upstream.arrayBuffer());
    headers['content-length'] = String(body.length);
    res.writeHead(upstream.status, headers);
    res.end(body);
    return;
  }
  const clean = normalize(decodeURIComponent((req.url ?? '/').split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  let file = join(ROOT, clean);
  try {
    const info = await stat(file);
    if (info.isDirectory()) file = join(file, 'index.html');
  } catch {
    file = join(ROOT, 'index.html');
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
});
server.listen(PORT, '0.0.0.0', () => console.log(`serving ${ROOT} on ${PORT} (api → ${API})`));
