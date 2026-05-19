#!/usr/bin/env node
// Tiny zero-dependency static file server for local dev.
//
// Use this when you want to serve the built output (or any static file in the
// project — including raw CSVs from public/data/) without spinning up the
// full Next.js dev server. `next dev` is what you want for actual app
// development; this one is for serving CSVs / built /out files / quick
// previews.
//
//   node local-server.js              # serves project root on :4173
//   node local-server.js out          # serves ./out on :4173
//   PORT=8080 node local-server.js    # custom port
//
// Mirrors the pattern from the Construction Calculator project — same shape,
// same defaults, same behavior. No npm install required; uses only Node
// built-ins (http, fs, path, url).

const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const ROOT = path.resolve(process.cwd(), process.argv[2] || '.');
const PORT = Number(process.env.PORT) || 4173;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.htm':  'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.mjs':  'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.csv':  'text/csv; charset=utf-8',
  '.tsv':  'text/tab-separated-values; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.txt':  'text/plain; charset=utf-8',
  '.md':   'text/markdown; charset=utf-8',
  '.xml':  'application/xml',
  '.pdf':  'application/pdf',
};

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': type,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-cache',
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, '');
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method Not Allowed');

  const url = new URL(req.url, `http://${req.headers.host}`);
  let rel = decodeURIComponent(url.pathname);
  if (rel.endsWith('/')) rel += 'index.html';

  // Prevent path traversal
  const filePath = path.normalize(path.join(ROOT, rel));
  if (!filePath.startsWith(ROOT)) return send(res, 403, 'Forbidden');

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback: try `<path>.html` then `<path>/index.html`
      const candidates = [filePath + '.html', path.join(filePath, 'index.html')];
      for (const c of candidates) {
        try { if (fs.statSync(c).isFile()) return stream(c, res); } catch {}
      }
      return send(res, 404, `Not Found: ${rel}`);
    }
    stream(filePath, res);
  });
});

function stream(filePath, res) {
  const type = MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
  res.writeHead(200, {
    'Content-Type': type,
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache',
  });
  fs.createReadStream(filePath).pipe(res);
}

server.listen(PORT, () => {
  console.log(`local-server: http://localhost:${PORT}`);
  console.log(`  serving ${ROOT}`);
  console.log(`  CSVs:    http://localhost:${PORT}/public/data/   (or /data/ if serving public/)`);
  console.log(`  stop:    Ctrl+C`);
});
