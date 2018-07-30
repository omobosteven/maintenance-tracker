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
      .end((error, response) => {
        userToken = response.body.data.token;
        expect(response).to.have.status(200);
        expect(response.body.message).to.equal('Sign in successfully');
        expect(response.body.data.role).to.equal('user');
        expect(response.body.data.email).to.equal('jamesdoe@gmail.com');
        done();
      });
  });

  it('should return message if no request is found for user', (done) => {
    chai.request(app)
      .get('/api/v1/users/requests')
      .set('x-access-token', userToken)
      .end((error, response) => {
        expect(response).to.have.status(404);
        expect(response.body.message).to.equal('No request was found');
        done();
      });
  });

  it('should return message if request is not found', (done) => {
    chai.request(app)
      .get('/api/v1/users/requests/45')
      .set('x-access-token', userToken)
      .end((error, response) => {
        expect(response).to.have.status(404);
        expect(response.body.status).to.equal('fail');
        expect(response.body.message).to.equal('Request not found');
        done();
      });
  });

  it('should return message if invalid id is entered', (done) => {
    chai.request(app)
      .get('/api/v1/users/requests/45yu')
      .set('x-access-token', userToken)
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body.data.errors)
          .to.equal('The request id must be a number');
        done();
      });
  });

  it('should return error if fields are empty', (done) => {
    chai.request(app)
      .post('/api/v1/users/requests')
      .set('x-access-token', userToken)
      .set('Content-type', 'application/json')
      .send({})
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body.data.errors.type[0])
          .to.equal('The type field is required.');
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
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body.data.errors.type[0]).to
          .equal('type field must be either of 1:repair or 2:maintenance');
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
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body.data.errors.description[0])
          .to.equal('The description must be at least 10 characters.');
        done();
      });
  });

  it('should create request if all fields are entered', (done) => {
    chai.request(app)
      .post('/api/v1/users/requests')
      .set('x-access-token', userToken)
      .set('Content-type', 'application/json')
      .send({
        type: '1',
        category: 'computers',
        item: 'laptop',
        description: 'faulty battery',
      })
      .end((error, response) => {
        expect(response).to.have.status(201);
        expect(response.body.message).to.equal('request created successfully');
        expect(response.body.data.request.item).to.equal('laptop');
        expect(response.body.data.request.description).to
          .equal('faulty battery');
        done();
      });
  });

  it('should return error if requests already exist', (done) => {
    chai.request(app)
      .post('/api/v1/users/requests')
      .set('x-access-token', userToken)
      .set('Content-type', 'application/json')
      .send({
        type: '1',
        category: 'computers',
        item: 'laptop',
        description: 'faulty battery',
      })
      .end((error, response) => {
        expect(response).to.have.status(409);
        expect(response.body.message).to.equal('request already exist');
        expect(response.body.status).to.equal('fail');
        done();
      });
  });

  it('should fetch all the requests of a logged in user', (done) => {
    chai.request(app)
      .get('/api/v1/users/requests')
      .set('x-access-token', userToken)
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.body.message).to.equal('My Requests');
        expect(response.body.data.requests).to.be.an('array');
        expect(response.body.data.requests[0]).to.deep.include({
          requestId: 1,
          userId: 2,
          typeId: 1,
          category: 'computers',
          item: 'laptop',
          description: 'faulty battery',
          statusId: 1,
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
        type: '1',
        category: 'computers',
        item: 'laptop',
        description: 'faulty keyboard',
      })
      .end((error, response) => {
        expect(response).to.have.status(404);
        expect(response.body.message).to.equal('Request was not found');
        done();
      });
  });

  it('should return error if no field to update', (done) => {
    chai.request(app)
      .put('/api/v1/users/requests/1')
      .set('x-access-token', userToken)
      .set('Content-type', 'application/json')
      .send({})
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body.message)
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
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body.data.errors.type[0])
          .to.equal('The type field cannot be empty');
        expect(response.body.data.errors.category[0])
          .to.equal('The category field cannot be empty');
        done();
      });
  });

  it('should return error if Id is invalid', (done) => {
    chai.request(app)
      .put('/api/v1/users/requests/three')
      .set('x-access-token', userToken)
      .set('Content-type', 'application/json')
      .send({})
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body.data.errors)
          .to.equal('The request id must be a number');
        done();
      });
  });

  it('should return error if Id is negative', (done) => {
    chai.request(app)
      .put('/api/v1/users/requests/-3')
      .set('x-access-token', userToken)
      .set('Content-type', 'application/json')
      .send({})
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body.data.errors)
          .to.equal('Invalid id entered');
        done();
      });
  });

  it('should fetch a request of a logged in user', (done) => {
    chai.request(app)
      .get('/api/v1/users/requests/1')
      .set('x-access-token', userToken)
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.body.data.request.item).to.equal('laptop');
        expect(response.body.data.request.category).to.equal('computers');
        expect(response.body.data.request.statusId).to.equal(1);
        done();
      });
  });

  it('should updata a request', (done) => {
    chai.request(app)
      .put('/api/v1/users/requests/1')
      .set('x-access-token', userToken)
      .set('Content-type', 'application/json')
      .send({
        type: '1',
        category: 'computers',
        item: 'laptop',
        description: 'faulty keyboard',
      })
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.body.message).to.equal('request updated successfully');
        expect(response.body.data.request.description).to
          .equal('faulty keyboard');
        expect(response.body.data.request.typeId).to.equal(1);
        expect(response.body.data.request.category).to.equal('computers');
        expect(response.body.data.request.item).to.equal('laptop');
        done();
      });
  });

  it('should return error if updated requests already exist', (done) => {
    chai.request(app)
      .put('/api/v1/users/requests/1')
      .set('x-access-token', userToken)
      .set('Content-type', 'application/json')
      .send({
        type: '1',
        category: 'computers',
        item: 'laptop',
        description: 'faulty keyboard',
      })
      .end((error, response) => {
        expect(response).to.have.status(409);
        expect(response.body.message).to.equal('request already exist');
        expect(response.body.status).to.equal('fail');
        done();
      });
  });
});
