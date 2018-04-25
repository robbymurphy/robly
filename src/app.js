var express = require('express');
const slugGenerator = require('./slugGenerator');
var app = express();

app.get('/shorten', (req, res) => {
  res.json({
    longUrl: req.query.longUrl,
    shortUrl: `http://rob.ly/${slugGenerator()}`
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(8081, () => console.log('app started'));
}

module.exports = app;
