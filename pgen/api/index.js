const https = require('https');
module.exports = function(req, res) {
  // raw.githubusercontent.com always serves the latest committed version with no CDN lag
  const url = 'https://raw.githubusercontent.com/aandresoares53-bot/abc-resolve/main/pgen/index.html';
  https.get(url, function(r) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=60');
    r.pipe(res);
  }).on('error', function(e) { res.statusCode = 500; res.end(e.message); });
};
