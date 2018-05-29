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

app.get('/list', (req, res) => {
  const linkService = linkServiceFactory.createLinkService();
  const pageNumber = parseInt(req.query.pageNumber);
  const nextButton = pageNumber ? `<a href="http://localhost:8081/list?pageNumber=${pageNumber + 1}">Next</a>` : '';
  const prevButton = pageNumber ? `<a href="http://localhost:8081/list?pageNumber=${pageNumber - 1}">Previous</a>` : '';
  linkService.getAll(pageNumber)
    .then(links => {
      let linksHtml = '';
      for(let link of links) {
        linksHtml += `<tr><td>${link.expandedUrl}</td><td>${link.shortUrl}</td></tr>`;
      }
      return res.send(`<!doctype html>
      <html class="no-js" lang="">
      
      <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      </head>
      
      <body>
        <table>
          <thead>
            <tr>
              <th>Long Url</th>
              <th>Shortened Url</th>
            </tr>
          </thead>
          <tbody>
            ${linksHtml}
          </tbody>
        </table>
        ${prevButton}&nbsp;${nextButton}
      </body>
      
      </html>`)
    })
  
});

if (process.env.NODE_ENV !== 'test') {
  // bootstrap if we aren't testing,
  // if we're testing then we'll do custom bootstrapping
  const fs = require('fs');
  const dbPath = './db';
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath);
  }
  
  const mongodHelper = new MongodHelper(['--port', '27018', '--dbpath', './db']);
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
