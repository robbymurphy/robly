const { expect } = require('chai');
const LinkService = require('../src/LinkService');

describe('LinkService', () => {
  it('should shorten url when link does not exist', done => {
    // Arrange
    const link = {
      expandedUrl: 'www.google.com',
      shortUrl: 'http://rob.ly/abcdefg'
    };
    const dbMock = {
      linkExists: () => Promise.resolve(false),
      createLink: () => Promise.resolve(link)
    };
    const linkService = new LinkService(dbMock);

    // Act
    linkService.shorten('www.google.com')
      .then(createdLink => {
        // Assert
        expect(createdLink).to.deep.equal(link);
        done();
      })
      .catch(error => done(error));
  });

  it('should shorten url using slug when provided', done => {
    // Arrange
    let pathParam;
    const dbMock = {
      linkExists: () => Promise.resolve(false),
      createLink: (path) => {
        pathParam = path;
        return Promise.resolve({});
      }
    };
    const linkService = new LinkService(dbMock);

    // Act
    linkService.shorten('www.google.com', 'mySlug')
      .then(createdLink => {
        // Assert
        expect(pathParam).to.equal('http://rob.ly/mySlug');
        done();
      })
      .catch(error => done(error));
  });

  // This fails intentionally.  It represents a requirement
  // that has not been implemented.
  // The LinkService should generate a new link path and retry.
  xit('should shorten url when link does exist', done => {
    // Arrange
    const link = {
      expandedUrl: 'www.google.com',
      shortUrl: 'http://rob.ly/abcdefg'
    };
    const dbMock = {
      linkExists: () => Promise.resolve(true),
      createLink: () => Promise.resolve(link)
    };
    const linkService = new LinkService(dbMock);

    // Act
    linkService.shorten('www.google.com')
      .then(createdLink => {
        // Assert
        expect(createdLink).to.equal(link);
        done();
      })
      .catch(error => done(error));
  });

  it('should expand url', done => {
    // Arrange
    const link = {
      expandedUrl: 'www.google.com',
      shortUrl: 'http://rob.ly/abcdefg'
    };
    const dbMock = {
      getLink: () => Promise.resolve(link)
    };
    const linkService = new LinkService(dbMock);

    // Act
    linkService.expand('www.google.com')
      .then(retrievedLink => {
        // Assert
        expect(retrievedLink).to.deep.equal(link);
        done();
      })
      .catch(error => done(error));
  });
});