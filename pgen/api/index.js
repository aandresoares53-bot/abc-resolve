const https = require('https');
// Commit hash pinned so GitHub raw CDN serves exact version (bypasses branch cache lag)
const COMMIT = 'dc51484';
module.exports = function(req, res) {
  const url = 'https://raw.githubusercontent.com/aandresoares53-bot/abc-resolve/dc51484/pgen/index.html';
  https.get(url, function(r) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    r.pipe(res);
  }).on('error', function(e) { res.statusCode = 500; res.end(e.message); });
};
