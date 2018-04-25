const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const { expect } = chai;

chai.use(chaiHttp);

describe('app', function() {
  it('should reply to /shorten GET request', done => {
      chai.request(app)
        .get('/shorten')
        .then(res => {
          expect(res.text).to.exist;
          expect(res.status).to.equal(200);
          done();
        })
        .catch(error => done(error));
  });
});