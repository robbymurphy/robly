const linkServiceFactory = {
  initialize: function({ LinkServiceClass, db }) {
    this.LinkServiceClass = LinkServiceClass;
    this.db = db;
  },
  createLinkService: function() {
    return new this.LinkServiceClass(this.db);
  }
};

module.exports = linkServiceFactory;
