var express = require('express');
var app = express();

app.get('/', (req, res) => {
  res.send('Hello Robly');
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(8081, () => console.log('app started'));
}

module.exports = app;
