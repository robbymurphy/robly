const slugGenerator = require('./slugGenerator');

const domain = 'http://rob.ly/';

function slugToShortUrl(slug) {
  return `${domain}${slug}`;
}

class LinkService {
  constructor(db) {
    this.db = db;
  }

  shorten(expandedUrl, slug) {
    slug = slug || slugGenerator();
    return new Promise((resolve, reject) => {
      this.db.linkExists(slugToShortUrl(slug))
        .then(linkExists => {
          if (linkExists) {
            reject(`link with slug "${slug}" already exists`);
          }
          else {
            this.db.createLink(slugToShortUrl(slug), expandedUrl)
              .then(link => resolve({
                shortUrl: link.shortUrl,
                expandedUrl: link.expandedUrl
              }))
              .catch(err => reject(err));
          }
        })
        .catch(err => reject(err));
    });
  }

  expand(shortUrl) {
    return new Promise((resolve, reject) =>{
      this.db.getLink(shortUrl)
        .then(link => resolve({
          shortUrl: link.shortUrl,
          expandedUrl: link.expandedUrl
        }))
        .catch(err => reject(err));
    });
  }
}

module.exports = LinkService;
