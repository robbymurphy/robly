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
    const slugProvidedByUser = !!slug;
    slug = slug || slugGenerator();
    return new Promise((resolve, reject) => {
      this.db.linkExists(slugToShortUrl(slug))
        .then(linkExists => {
          if (linkExists && slugProvidedByUser) {
            reject(`link with slug "${slug}" already exists`);
          }
          // This is a very unlikely scenario, but we have to account for it.
          // If the regenerated slug exists (this will "never" happen) then
          // let the error flow back to the user.
          if (linkExists && !slugProvidedByUser) {
            slug = slugGenerator();
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

  getAll(pageNumber) {
    return new Promise((resolve, reject) => {
      this.db.getAllLinks(pageNumber)
        .then(links => resolve(links))
        .catch(err => reject(err));
    });
  }

  deleteLink(shortUrl) {
    return new Promise((resolve, reject) => {
      this.db.deleteLink(shortUrl)
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }
}

module.exports = LinkService;
