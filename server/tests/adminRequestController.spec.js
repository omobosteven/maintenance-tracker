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
      .end((error, response) => {
        userToken = response.body.data.token;
        expect(response).to.have.status(200);
        expect(response.body.message).to.equal('Sign in successfully');
        expect(response.body.data.role).to.equal('admin');
        expect(response.body.data.email).to.equal('admin@gmail.com');
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
      .end((error, response) => {
        expect(response).to.have.status(201);
        expect(response.body.message).to.equal('request created successfully');
        expect(response.body.data.request.item).to.equal('laptop');
        expect(response.body.data.request.description).to
          .equal('faulty screen');
        done();
      });
  });

  it('should fetch a request', (done) => {
    chai.request(app)
      .get('/api/v1/requests/2')
      .set('x-access-token', userToken)
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.body.data.request.item).to.equal('laptop');
        expect(response.body.data.request.category).to.equal('computers');
        expect(response.body.data.request.status).to.equal('pending');
        done();
      });
  });

  it('should return error if request is not found', (done) => {
    chai.request(app)
      .get('/api/v1/requests/45')
      .set('x-access-token', userToken)
      .end((error, response) => {
        expect(response).to.have.status(404);
        expect(response.body.message).to.equal('Request not found');
        done();
      });
  });

  it('should return error if request to be modified is not found', (done) => {
    chai.request(app)
      .put('/api/v1/requests/45/approve')
      .set('x-access-token', userToken)
      .end((error, response) => {
        expect(response).to.have.status(404);
        expect(response.body.message).to.equal('Request was not found');
        done();
      });
  });

  it('should fetch all the requests in the system', (done) => {
    chai.request(app)
      .get('/api/v1/requests')
      .set('x-access-token', userToken)
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.body.message).to.equal('All Requests');
        expect(response.body.data.requests).to.be.an('array');
        expect(response.body.data.requests[0].requestid).to.equal(2);
        expect(response.body.data.requests[0].description).to
          .equal('faulty screen');
        expect(response.body.data.requests[0].type).to.equal('maintenance');
        expect(response.body.data.requests[0].category).to.equal('computers');
        expect(response.body.data.requests[0].item).to.equal('laptop');
        done();
      });
  });

  it('should approve a request', (done) => {
    chai.request(app)
      .put('/api/v1/requests/1/approve')
      .set('x-access-token', userToken)
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.body.message).to.equal('Request Approved');
        expect(response.body.data.request.status).to.equal('approved');
        done();
      });
  });

  it('should disapprove a request', (done) => {
    chai.request(app)
      .put('/api/v1/requests/2/disapprove')
      .set('x-access-token', userToken)
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.body.message).to.equal('Request Disapproved');
        expect(response.body.data.request.status).to.equal('disapproved');
        done();
      });
  });

  it('should approved a disapporved request', (done) => {
    chai.request(app)
      .put('/api/v1/requests/2/approve')
      .set('x-access-token', userToken)
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.message).to.equal('Request Approved');
        expect(response.body.data.request.status).to.equal('approved');
        done();
      });
  });

  it('should resolve a request', (done) => {
    chai.request(app)
      .put('/api/v1/requests/1/resolve')
      .set('x-access-token', userToken)
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.body.message).to.equal('Request Resolved');
        expect(response.body.data.request.status).to.equal('resolved');
        done();
      });
  });

  it('should fail if admin tries to approve a resolved request', (done) => {
    chai.request(app)
      .put('/api/v1/requests/1/approve')
      .set('x-access-token', userToken)
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body.message).to
          .equal('Request has already been resolved');
        done();
      });
  });

  it('should fail if user tries to update a processed requests', (done) => {
    chai.request(app)
      .put('/api/v1/users/requests/2')
      .set('x-access-token', userToken)
      .send({
        type: 'maintenance',
        category: 'computers',
        item: 'laptop',
        description: 'faulty screen',
      })
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body.message).to
          .equal('Not allowed, requests has been processed');
        done();
      });
  });
});
