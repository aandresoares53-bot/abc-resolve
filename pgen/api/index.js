const https = require('https');
// Commit hash pinned so GitHub raw CDN serves exact version (bypasses branch cache lag)
const COMMIT = 'e8c3d9ec55e1f8e76169b6dd5fc8b0ad43fdf11d';
module.exports = function(req, res) {
  const url = 'https://raw.githubusercontent.com/aandresoares53-bot/abc-resolve/' + COMMIT + '/pgen/index.html';
  https.get(url, function(r) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    r.pipe(res);
  }).on('error', function(e) { res.statusCode = 500; res.end(e.message); });
};
