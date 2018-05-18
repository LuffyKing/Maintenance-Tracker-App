import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server/server';

chai.should();
chai.use(chaiHttp);
const newRequest = {
  title: 'Broken Desk',
  description: 'The desk is broken',
  location: 'Room 404, Kingsbury Factory',
  type: 'Repair',
  userid: 0
};
describe('Requests API Tests', () => {
  /**
   * Testing post request on the Requests API -success case
   */
  describe('/POST requests', () => {
    it('it should GET all requests', (done) => {
      chai.request(server)
        .post('/api/v1/users/requests')
        .send(newRequest)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('message');
          res.body.message.should.eql('Success - repair/maintenance request created.');
          res.body.request.title.should.eql(newRequest.title);
          res.body.request.description.should.eql(newRequest.description);
          res.body.request.location.should.eql(newRequest.location);
          res.body.request.type.should.eql(newRequest.type);
          res.body.request.userid.should.eql(newRequest.userid);
          res.body.request.should.have.property('id');
          res.body.request.should.have.property('dateSubmitted');
          res.body.request.should.have.property('status');
          done();
        });
    });
  });
});
