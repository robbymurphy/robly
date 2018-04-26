const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  expandedUrl: String,
  shortUrl: String
});

const Link = mongoose.model('Link', linkSchema);

// db abstracts the database logic to adhere to the SRP.
// This also makes it easier to mock during testing.
// This object should contain as little business logic as possible
// since the only way to test it is with an end-to-end test.
const db = {
  linkExists: shortUrl => {
    return new Promise((resolve, reject) => {
      Link.count({ shortUrl }, (err, count) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(count > 0);
        }
      });
    });
  },
  createLink: (shortUrl, expandedUrl) => {
    return new Promise( (resolve, reject) => {
      Link.create({ shortUrl, expandedUrl }, function (err, link) {
        if (err) {
          reject(err);
        }
        else {
          resolve(link);
        }
      });
    });
  },
  getLink: shortUrl => {
    return new Promise((resolve, reject) => {
      Link.findOne({ shortUrl }, (err, link) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(link);
        }
      });
    });
  },
  connect: () => mongoose.connect('mongodb://localhost:27018/robly')
};

module.exports = db;
