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
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.have.property('message');
          response.body.message.should.eql('Success - All repair/maintenance requests retrieved.');
          response.body.requests.should.eql(requests);
          done();
        });
    });
  });
});
