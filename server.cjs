const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;

const DIST_DIR = path.join(__dirname, 'dist');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
};

function serveFile(res, filePath, fallbackToIndex = false) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT' && fallbackToIndex) {
        const idx = path.join(DIST_DIR, 'index.html');
        fs.readFile(idx, (e2, d2) => {
          if (e2) { res.writeHead(500); res.end('Error'); return; }
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(d2);
        });
      } else {
        res.writeHead(404);
        res.end('Not found');
      }
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

const srv = http.createServer((req, res) => {
  let url = req.url === '/' ? '/index.html' : req.url;
  // Handle SPA routing — any non-file route serves index.html
  const hasExt = path.extname(url) !== '';
  const filePath = path.join(DIST_DIR, url);
  if (!hasExt) {
    const idx = path.join(DIST_DIR, 'index.html');
    fs.readFile(idx, (e, d) => {
      if (e) { res.writeHead(500); res.end('Error'); return; }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(d);
    });
    return;
  }
  serveFile(res, filePath, true);
});

srv.listen(PORT, '0.0.0.0', () => {
  const url = `http://localhost:${PORT}`;
  console.log('');
  console.log('  🏦  Bank Simulator Game');
  console.log('  ─────────────────────────');
  console.log(`  📡  ${url}`);
  console.log('');
  console.log('  Press Ctrl+C to stop');
  console.log('');

  const cmd = process.platform === 'win32'
    ? `start "" "${url}"`
    : process.platform === 'darwin'
      ? `open "${url}"`
      : `xdg-open "${url}"`;
  exec(cmd);
});
