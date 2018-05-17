import { describe, it } from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);


describe('Tests for requests API endpoints', () => {
  it('should fecth all the requests of a logged in user', (done) => {
    chai.request(app)
      .get('/api/v1/requests')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('My Requests');
        expect(res.body.requests).to.be.an('array');
        expect(res.body.requests).to.deep.include({
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
});
