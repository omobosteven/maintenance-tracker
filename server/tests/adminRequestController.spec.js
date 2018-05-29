import { describe, it } from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);

let userToken;

describe('Tests for admin requests API endpoints', () => {
  it('should signin admin', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .set('Content-type', 'application/json')
      .send({
        email: 'admin@gmail.com',
        password: 'adminpassword',
      })
      .end((err, res) => {
        userToken = res.body.data.token;
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Sign in successfully');
        done();
      });
  });

  it('should fetch all the requests in the system', (done) => {
    chai.request(app)
      .get('/api/v1/requests')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('All Requests');
        expect(res.body.data.requests).to.be.an('array');
        expect(res.body.data.requests[0].requestid).to.equal(1);
        expect(res.body.data.requests[0].description).to
          .equal('faulty keyboard');
        expect(res.body.data.requests[0].type).to.equal('repair');
        expect(res.body.data.requests[0].category).to.equal('computers');
        expect(res.body.data.requests[0].item).to.equal('laptop');
        done();
      });
  });

  it('should approve a request', (done) => {
    chai.request(app)
      .put('/api/v1/requests/1/approve')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Request approved');
        expect(res.body.data.request.status).to.equal('approved');
        done();
      });
  });
});
