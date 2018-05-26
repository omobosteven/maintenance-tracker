import { describe, it } from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);

let userToken;

describe('Tests for requests API endpoints', () => {
  it('should signin user', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .set('Content-type', 'application/json')
      .send({
        email: 'jamesdoe@gmail.com',
        password: 'mypassword',
      })
      .end((err, res) => {
        userToken = res.body.data.token;
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Sign in successfully');
        done();
      });
  });

  it('should return message if no request is found for user', (done) => {
    chai.request(app)
      .get('/api/v1/users/requests')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('No request was found');
        done();
      });
  });

  it('should fetch the details of a request', (done) => {
    chai.request(app)
      .get('/api/v1/users/requests/2')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.request).to.deep.equal({
          id: 2,
          userId: 1,
          type: 'repairs',
          category: 'electronics',
          item: 'monitor',
          description: 'blank',
          status: 'resolved',
        });
        done();
      });
  });

  it('should return message if invalid id is entered', (done) => {
    chai.request(app)
      .get('/api/v1/users/requests/45yu')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Id is invalid');
        done();
      });
  });

  it('should return error if fields are empty', (done) => {
    chai.request(app)
      .post('/api/v1/users/requests')
      .set('x-access-token', userToken)
      .set('Content-type', 'application/json')
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.data.errors.type[0]).to
          .equal('The type field is required.');
        done();
      });
  });

  it('should return error for wrong value in type', (done) => {
    chai.request(app)
      .post('/api/v1/users/requests')
      .set('x-access-token', userToken)
      .set('Content-type', 'application/json')
      .send({
        type: 'call',
        category: '32ew',
        item: 'laptop',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.data.errors.type[0]).to
          .equal('type must be either of repair or maintenance');
        done();
      });
  });

  it('should return error if description is short', (done) => {
    chai.request(app)
      .post('/api/v1/users/requests')
      .set('x-access-token', userToken)
      .set('Content-type', 'application/json')
      .send({
        type: 'repair',
        category: 'computers',
        item: 'laptop',
        description: 'stop',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.data.errors.description[0]).to
          .equal('The description must be at least 10 characters.');
        done();
      });
  });

  it('should create request if all fields are entered', (done) => {
    chai.request(app)
      .post('/api/v1/users/requests')
      .set('x-access-token', userToken)
      .set('Content-type', 'application/json')
      .send({
        type: 'repair',
        category: 'computers',
        item: 'laptop',
        description: 'faulty battery',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.message).to.equal('request created successfully');
        expect(res.body.data.request.item).to.equal('laptop');
        expect(res.body.data.request.description).to.equal('faulty battery');
        done();
      });
  });

  it('should fetch all the requests of a logged in user', (done) => {
    chai.request(app)
      .get('/api/v1/users/requests')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('My Requests');
        expect(res.body.data.requests).to.be.an('array');
        expect(res.body.data.requests[0]).to.deep.include({
          requestid: 1,
          userid: 2,
          type: 'repair',
          category: 'computers',
          item: 'laptop',
          description: 'faulty battery',
          status: 'processing',
        });
        done();
      });
  });

  it('should return message if request to be updated is not found', (done) => {
    chai.request(app)
      .put('/api/v1/users/requests/45')
      .set('x-access-token', userToken)
      .set('Content-type', 'application/json')
      .send({
        type: 'repair',
        category: 'computers',
        item: 'laptop',
        description: 'faulty keyboard',
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Request was not found');
        done();
      });
  });

  it('should return error if no field to update', (done) => {
    chai.request(app)
      .put('/api/v1/users/requests/1')
      .set('x-access-token', userToken)
      .set('Content-type', 'application/json')
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message)
          .to.equal('Enter a field to update');
        done();
      });
  });

  it('should return error if fields to update are not filled', (done) => {
    chai.request(app)
      .put('/api/v1/users/requests/1')
      .set('x-access-token', userToken)
      .set('Content-type', 'application/json')
      .send({
        type: ' ',
        category: ' ',
        item: 'laptop',
        description: 'faulty keyboard',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.data.errors.type[0])
          .to.equal('The type field cannot be empty');
        expect(res.body.data.errors.category[0])
          .to.equal('The category field cannot be empty');
        done();
      });
  });

  it('should return error if Id is invalid', (done) => {
    chai.request(app)
      .put('/api/v1/users/requests/three')
      .set('x-access-token', userToken)
      .set('Content-type', 'application/json')
      .send({
        type: 'repair',
        category: 'computers',
        item: 'laptop',
        description: 'faulty keyboard',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.data.errors.id[0]).to
          .equal('The request id must be a number');
        done();
      });
  });

  it('should updata a request', (done) => {
    chai.request(app)
      .put('/api/v1/users/requests/1')
      .set('x-access-token', userToken)
      .set('Content-type', 'application/json')
      .send({
        type: 'repair',
        category: 'computers',
        item: 'laptop',
        description: 'faulty keyboard',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('request updated successfully');
        expect(res.body.data.request.description).to.equal('faulty keyboard');
        expect(res.body.data.request.type).to.equal('repair');
        expect(res.body.data.request.category).to.equal('computers');
        expect(res.body.data.request.item).to.equal('laptop');
        done();
      });
  });
});
