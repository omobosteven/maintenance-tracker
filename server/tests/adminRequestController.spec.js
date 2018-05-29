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

  it('should create request', (done) => {
    chai.request(app)
      .post('/api/v1/users/requests')
      .set('x-access-token', userToken)
      .set('Content-type', 'application/json')
      .send({
        type: 'maintenance',
        category: 'computers',
        item: 'laptop',
        description: 'faulty screen',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.message).to.equal('request created successfully');
        expect(res.body.data.request.item).to.equal('laptop');
        expect(res.body.data.request.description).to.equal('faulty screen');
        done();
      });
  });

  it('should fetch a request', (done) => {
    chai.request(app)
      .get('/api/v1/requests/2')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.request.item).to.equal('laptop');
        expect(res.body.data.request.category).to.equal('computers');
        expect(res.body.data.request.status).to.equal('pending');
        done();
      });
  });

  it('should return error if request is not found', (done) => {
    chai.request(app)
      .get('/api/v1/requests/45')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Request not found');
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
        expect(res.body.data.requests[0].requestid).to.equal(2);
        expect(res.body.data.requests[0].description).to
          .equal('faulty screen');
        expect(res.body.data.requests[0].type).to.equal('maintenance');
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

  it('should disapprove a request', (done) => {
    chai.request(app)
      .put('/api/v1/requests/2/disapprove')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Request disapproved');
        expect(res.body.data.request.status).to.equal('disapproved');
        done();
      });
  });

  it('should fail if admin tries to disapporve an approved request', (done) => {
    chai.request(app)
      .put('/api/v1/requests/1/disapprove')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.status).to.equal('fail');
        expect(res.body.message).to.equal('Request was not found');
        done();
      });
  });

  it('should resolve a request', (done) => {
    chai.request(app)
      .put('/api/v1/requests/1/resolve')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Request resolved');
        expect(res.body.data.request.status).to.equal('resolved');
        done();
      });
  });
});
