const express = require('express');
const { MongodHelper } = require('mongodb-prebuilt');
const linkServiceFactory = require('./linkServiceFactory');
const LinkService = require('./LinkService');
const db = require('./db');

const app = express();

app.get('/shorten', (req, res) => {
  const linkService = linkServiceFactory.createLinkService();
  const expandedUrl = req.query.url;
  if (!expandedUrl) {
    // bad request
    return res.status(400).json({ error: '"url" query parameter is required' })
  }
  const slug = req.query.slug;
  linkService.shorten(expandedUrl, slug)
    .then(link => res.json(link))
    // internal server error
    .catch(error => res.status(500).json({ error }));
});

app.get('/expand', (req, res) => {
  const linkService = linkServiceFactory.createLinkService();
  const shortUrl = req.query.shortUrl;
  if (!shortUrl) {
    // bad request
    return res.status(400).json({ error: '"shortUrl" query parameter is required' })
  }
  linkService.expand(shortUrl)
    .then(link => res.json(link))
    // internal server error
    .catch(error => res.status(500).json({ error }));
});

if (process.env.NODE_ENV !== 'test') {
  // bootstrap if we aren't testing,
  // if we're testing then we'll do custom bootstrapping
  const mongodHelper = new MongodHelper(['--port', '27018']);
  mongodHelper.run()
    .then(started => {
      console.log('mongodb started');
      db.connect();
    },
    err => {
      console.log('error starting mongodb', err);
    });
  linkServiceFactory.initialize({
    LinkServiceClass: LinkService,
    db
  });
  app.listen(8081, () => console.log('app started'));
}

module.exports = app;
