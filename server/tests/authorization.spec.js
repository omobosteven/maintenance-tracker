import { describe, it } from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);

let userToken;

describe('Tests for Authorization', () => {
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

  it('should return message if no token is provided', (done) => {
    chai.request(app)
      .post('/api/v1/users/requests')
      .set('Content-type', 'application/json')
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal('No Token provided');
        done();
      });
  });

  it('should return message if token is invalid', (done) => {
    chai.request(app)
      .post('/api/v1/users/requests')
      .set('Content-type', 'application/json')
      .set('x-access-token', 'balst')
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal('Invalid credentials supplied');
        done();
      });
  });

  it(`should return error 
      if authenticated user tries to access protected routes`, (done) => {
    chai.request(app)
      .get('/api/v1/requests')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.message).to.equal('Unauthorized');
        done();
      });
  });
});
