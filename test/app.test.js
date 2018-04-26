const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const linkServiceFactory = require('../src/linkServiceFactory');
const { expect } = chai;

chai.use(chaiHttp);

function createLinkServiceMock(shortenFn, expandFn) {
  return class LinkServiceMock {
    shorten() {
      return shortenFn();
    }
    expand() {
      return expandFn();
    }
  }
}

describe('app', function() {
  it('should reply to valid /shorten GET request with 200', done => {
    // Arrange
    const LinkServiceMock = createLinkServiceMock(() => Promise.resolve({}));
    linkServiceFactory.initialize({ LinkServiceClass: LinkServiceMock });

    // Act
    chai.request(app)
      .get('/shorten?url=http://www.google.com')
      .then(res => {
        // Assert
        expect(res.text).to.exist;
        expect(res.status).to.equal(200);
        done();
      })
      .catch(error => done(error));
  });

  it('should reply with 400 when missing url in /shorten GET request', done => {
    // Arrange
    const LinkServiceMock = createLinkServiceMock(() => Promise.resolve({}));
    linkServiceFactory.initialize({ LinkServiceClass: LinkServiceMock });

    // Act
    chai.request(app)
      .get('/shorten')
      .then(res => {
        // Assert
        expect(res.status).to.equal(400);
        done();
      })
      .catch(error => done(error));
  });

  it('should reply to invalid /shorten GET request with 500', done => {
    // Arrange
    const LinkServiceMock = createLinkServiceMock(() => Promise.reject(''));
    linkServiceFactory.initialize({ LinkServiceClass: LinkServiceMock });

    // Act
    chai.request(app)
      .get('/shorten?url=http://www.google.com')
      .then(res => {
        // Assert
        expect(res.text).to.exist;
        expect(res.status).to.equal(500);
        done();
      })
      .catch(error => done(error));
  });

  it('should reply to valid /expand GET request with 200', done => {
    // Arrange
    const LinkServiceMock = createLinkServiceMock(null, () => Promise.resolve({}));
    linkServiceFactory.initialize({ LinkServiceClass: LinkServiceMock });

    // Act
    chai.request(app)
      .get('/expand?shortUrl=http://rob.ly/abcdefg')
      .then(res => {
        // Assert
        expect(res.text).to.exist;
        expect(res.status).to.equal(200);
        done();
      })
      .catch(error => done(error));
  });

  it('should reply with 400 when missing shortUrl in /expand GET request', done => {
    // Arrange
    const LinkServiceMock = createLinkServiceMock(null, () => Promise.resolve({}));
    linkServiceFactory.initialize({ LinkServiceClass: LinkServiceMock });

    // Act
    chai.request(app)
      .get('/expand')
      .then(res => {
        // Assert
        expect(res.status).to.equal(400);
        done();
      })
      .catch(error => done(error));
  });

  it('should reply to invalid /expand GET request with 500', done => {
    // Arrange
    const LinkServiceMock = createLinkServiceMock(null, () => Promise.reject(''));
    linkServiceFactory.initialize({ LinkServiceClass: LinkServiceMock });

    // Act
    chai.request(app)
      .get('/expand?shortUrl=http://rob.ly/abcdefg')
      .then(res => {
        // Assert
        expect(res.text).to.exist;
        expect(res.status).to.equal(500);
        done();
      })
      .catch(error => done(error));
  });
});