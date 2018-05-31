import { describe, it } from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);

describe('Tests for Users API endpoint', () => {
  it('should create a new user', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .send({
        email: 'jamesdoe@gmail.com',
        password: 'mypassword',
      })
      .end((error, response) => {
        expect(response).to.have.status(201);
        expect(response.body.message).to.equal('User created successfully');
        expect(response.body.data.role).to.equal('user');
        expect(response.body.data.email).to.equal('jamesdoe@gmail.com');
        expect(response.body.data).to.have.property('token');
        done();
      });
  });

  it('should return a message if user already exists', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .send({
        email: 'jamesdoe@gmail.com',
        password: 'mypassword',
      })
      .end((error, response) => {
        expect(response).to.have.status(409);
        expect(response.body.message).to
          .equal('User with this email already exist');
        done();
      });
  });

  it('should return error if email field is empty', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .send({
        email: '',
        password: 'mypassword',
      })
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body.data.errors.email[0]).to
          .equal('The email field is required.');
        done();
      });
  });

  it('should return error if password length is short', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .send({
        email: 'jamesdoe@gmail.com',
        password: 'mypas',
      })
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body.data.errors.password[0]).to
          .equal('The password must be at least 6 characters.');
        done();
      });
  });

  it('should signin user', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .set('Content-type', 'application/json')
      .send({
        email: 'jamesdoe@gmail.com',
        password: 'mypassword',
      })
      .end((error, response) => {
        const { token } = response.body.data;
        expect(response).to.have.status(200);
        expect(response.body.message).to.equal('Sign in successfully');
        expect(response.body.data.role).to.equal('user');
        expect(response.body.data.email).to.equal('jamesdoe@gmail.com');
        expect(response.body.data.token).to.equal(token);
        done();
      });
  });

  it('should return message if user is not found', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .set('Content-type', 'application/json')
      .send({
        email: 'jamedoe@gmail.com',
        password: 'mypassword',
      })
      .end((error, response) => {
        expect(response).to.have.status(404);
        expect(response.body.message).to.equal('User not found');
        done();
      });
  });

  it('should return message if user inputs wrong password', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .set('Content-type', 'application/json')
      .send({
        email: 'jamesdoe@gmail.com',
        password: 'mypasswor',
      })
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body.message).to.equal('Wrong password');
        done();
      });
  });
});
