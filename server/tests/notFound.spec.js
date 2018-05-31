import { describe, it } from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);

describe('Test for non existing page', () => {
  it('should return a message if page does not exist', (done) => {
    chai.request(app)
      .get('/api')
      .end((error, response) => {
        expect(response.body.message).to.equal('Does not exist');
        done();
      });
  });
});
