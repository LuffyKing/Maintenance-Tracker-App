import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server/server';

chai.should();
chai.use(chaiHttp);
const requestUpdateDetails = {
  title: 'Leaky toilet',
  description: 'The toilet is leaking'
};
describe('Requests API Tests', () => {
  /**
   * Testing post request on the Requests API -success case
   */
  describe('/PUT requests', () => {
    it('it should PUT new details on a request and successfully change it', (done) => {
      chai.request(server)
        .put('/api/v1/users/requests/0')
        .send(requestUpdateDetails)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message');
          res.body.message.should.eql('Success - repair/maintenance request updated.');
          res.body.updatedRequest.title.should.eql(requestUpdateDetails.title);
          res.body.updatedRequest.description.should.eql(requestUpdateDetails.description);
          done();
        });
    });
  });
  describe('/PUT requests', () => {
    it('it should try to PUT details on a request with an id that does not exist and fail', (done) => {
      chai.request(server)
        .put('/api/v1/users/requests/90')
        .send(requestUpdateDetails)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message');
          res.body.message.should.eql('Maintenance/Repair with the specified id was not found');
          done();
        });
    });
  });
  describe('/PUT requests', () => {
    it('it should try to PUT details on a request with an inavlid id and fail', (done) => {
      chai.request(server)
        .put('/api/v1/users/requests/fakeId')
        .send(requestUpdateDetails)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.message.should.eql('The id provided is invalid because it is not an integer');
          done();
        });
    });
  });
});
