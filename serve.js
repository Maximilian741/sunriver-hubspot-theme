// tiny static server for local template previews (not part of the theme)
const http = require('http'), fs = require('fs'), path = require('path');
const root = __dirname;
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/preview-index.html';
  const f = path.join(root, p);
  fs.readFile(f, (e, d) => {
    if (e) { res.writeHead(404); res.end('not found'); return; }
    const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.svg': 'image/svg+xml', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png' }[path.extname(f)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(d);
  });
}).listen(8123, () => console.log('preview server on http://localhost:8123'));
