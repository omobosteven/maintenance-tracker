import { describe, it } from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);


describe('Tests for requests API endpoints', () => {
  it('should fetch all the requests of a logged in user', (done) => {
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

  it('should fetch the details of a request', (done) => {
    chai.request(app)
      .get('/api/v1/requests/2')
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

  it('should return message if request is not found', (done) => {
    chai.request(app)
      .get('/api/v1/requests/45')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.status).to.equal('fail');
        expect(res.body.message).to.equal('Request not found');
        done();
      });
  });

  it('should return message if invalid id is entered', (done) => {
    chai.request(app)
      .get('/api/v1/requests/45yu')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Id is invalid');
        done();
      });
  });
});
