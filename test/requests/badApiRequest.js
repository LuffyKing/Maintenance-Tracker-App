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
    it('it should GET all requests', (done) => {
      chai.request(server)
        .get('/api/v1/users/fakeAPI')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.message.should.eql('Bad API - Request');
          done();
        });
    });
  });
});
