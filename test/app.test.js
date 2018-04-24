const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const { expect } = chai;

chai.use(chaiHttp);

describe('app', function() {
  it('should reply to get request', done => {
      chai.request(app)
        .get('/')
        .then(res => {
          expect(res.text).to.equal('Hello Robly');
          expect(res.status).to.equal(200);
          done();
        })
        .catch(error => done(error));
  });
});