import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server/server';


chai.should();
chai.use(chaiHttp);
describe('Requests API Tests', () => {
  /**
   * Testing get request on the Requests API -success case
   */
  describe('/GET requests', () => {
    it('should GET all requests', (done) => {
      chai.request(server)
        .get('/api/v1/fakeAPI')
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.have.property('message');
          response.body.message.should.eql('Bad API - Request');
          done();
        });
    });
  });
});
