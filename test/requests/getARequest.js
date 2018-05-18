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
    it('should GET try to get a request and succeed', (done) => {
      chai.request(server)
        .get('/api/v1/users/requests/0')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message');
          res.body.message.should.eql('Success - repair/maintenance request retrieved.');
          res.body.request.should.eql(requests[0]);
          done();
        });
    });
  });

  describe('/GET requests', () => {
    it('should try to GET a request with an id that does not exist and fail', (done) => {
      chai.request(server)
        .get('/api/v1/users/requests/4')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message');
          res.body.message.should.eql('Maintenance/Repair with the specified id was not found');
          done();
        });
    });
  });

  describe('/GET requests', () => {
    it('should try to GET a request with an invalid requestid and fail', (done) => {
      chai.request(server)
        .get('/api/v1/users/requests/badid')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.message.should.eql('The id provided is invalid because it is not an integer');
          done();
        });
    });
  });
});
