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
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.message).to.equal('User created successfully');
        expect(res.body.data).to.have.property('token');
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
      .end((err, res) => {
        expect(res).to.have.status(409);
        expect(res.body.message).to.equal('User with this email already exist');
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
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.data.errors.emailAddress[0]).to
          .equal('The emailAddress field is required.');
        done();
      });
  });

  it('should return error if password length is short', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .send({
        email: 'jamesdoe@gmail.com',
        password: 'mypass',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.data.errors.password[0]).to
          .equal('The password must be at least 8 characters.');
        done();
      });
  });
});
