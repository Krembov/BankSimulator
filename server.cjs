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

function safeEnd(res, status, data, contentType) {
  try {
    if (contentType) {
      res.writeHead(status, { 'Content-Type': contentType });
    } else {
      res.writeHead(status);
    }
    res.end(data || '');
  } catch {}
}

function serveFile(res, filePath, fallbackToIndex = false) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT' && fallbackToIndex) {
        const idx = path.join(DIST_DIR, 'index.html');
        fs.readFile(idx, (e2, d2) => {
          if (e2) { safeEnd(res, 500, 'Error'); return; }
          safeEnd(res, 200, d2, 'text/html; charset=utf-8');
        });
      } else {
        safeEnd(res, 404, 'Not found');
      }
      return;
    }
    const ext = path.extname(filePath);
    safeEnd(res, 200, data, MIME[ext] || 'application/octet-stream');
  });
}

function onRequestError(err) {
  if (err.code === 'ECONNRESET' || err.code === 'EPIPE') return;
  console.error('Request error:', err.message);
}

const srv = http.createServer((req, res) => {
  res.on('error', onRequestError);
  req.on('error', onRequestError);
  try {
    let url = req.url === '/' ? '/index.html' : req.url;
    const hasExt = path.extname(url) !== '';
    const filePath = path.join(DIST_DIR, url);
    if (!hasExt) {
      const idx = path.join(DIST_DIR, 'index.html');
      fs.readFile(idx, (e, d) => {
        if (e) { safeEnd(res, 500, 'Error'); return; }
        safeEnd(res, 200, d, 'text/html; charset=utf-8');
      });
      return;
    }
    serveFile(res, filePath, true);
  } catch (err) {
    onRequestError(err);
    try { res.writeHead(500); res.end('Server error'); } catch {}
  }
});

srv.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`  Port ${PORT} is already in use. Close the other process or change the port.`);
    process.exit(1);
  } else {
    console.error('Server error:', err.message);
  }
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
  try { exec(cmd); } catch {}
});
