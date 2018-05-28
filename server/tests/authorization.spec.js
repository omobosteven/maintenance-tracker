import { describe, it } from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);

describe('Tests for Authorization', () => {
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
});
