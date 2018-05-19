import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server/server';
import { requests } from '../../server/dummy-data/database';

chai.should();
chai.use(chaiHttp);
describe('Requests API Tests', () => {
  /**
   * Testing get request on the Requests API -success case
   */
  describe('/GET requests', () => {
    it('should GET all requests', (done) => {
      chai.request(server)
        .get('/api/v1/users/requests')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message');
          res.body.message.should.eql('Success - All repair/maintenance requests retrieved.');
          res.body.requests.should.eql(requests);
          done();
        });
    });
  });
});
