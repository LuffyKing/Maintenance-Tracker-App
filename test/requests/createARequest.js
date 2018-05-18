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
const newRequestInvalidIntFields = {
  title: 'Broken Desk',
  description: 'The desk is broken',
  location: 0,
  type: 0,
  userid: 0
};
const newRequestEmptyFields = {
  title: 'Broken Desk',
  description: 'The desk is broken',
  location: 'Room 404, Kingsbury Factory'
};
const newRequestNonStringFields = {
  title: 'Broken Desk',
  description: 'The desk is broken',
  location: {},
  type: 'Maintenance',
  userid: 0
};
const newRequestFieldsEmpty = {
  title: '',
  description: '',
  location: '',
  type: '',
  userid: 0
};
describe('Requests API Tests', () => {
  /**
   * Testing post request on the Requests API -success case
   */
  describe('/POST requests', () => {
    it('should POST the details of valid request and succeed', (done) => {
      chai.request(server)
        .post('/api/v1/users/requests')
        .send(newRequest)
        .end((err, res) => {
          res.body.message.should.eql('Success - repair/maintenance request created.');
          res.should.have.status(201);
          res.body.should.have.property('message');
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
  describe('/POST requests', () => {
    it('should POST the details of a request with integer fields in place of text and fail', (done) => {
      chai.request(server)
        .post('/api/v1/users/requests')
        .send(newRequestInvalidIntFields)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.message.should.eql('The request could not be created because the fields TYPE ,LOCATION were not supposed to be integers');
          done();
        });
    });
  });
  describe('/POST requests', () => {
    it('should POST the details of a request with empty fields and fail', (done) => {
      chai.request(server)
        .post('/api/v1/users/requests')
        .send(newRequestEmptyFields)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.message.should.eql('The request could not be created because the fields TYPE ,USERID were not provided');
          done();
        });
    });
  });
  describe('/POST requests', () => {
    it('should POST the details of a request with non string fields and fail', (done) => {
      chai.request(server)
        .post('/api/v1/users/requests')
        .send(newRequestNonStringFields)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.message.should.eql('The request could not be created because the field LOCATION was supposed to be a string');
          done();
        });
    });
  });
  describe('/POST requests', () => {
    it('should POST the details of a request with non string fields and fail', (done) => {
      chai.request(server)
        .post('/api/v1/users/requests')
        .send(newRequestFieldsEmpty)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.message.should.eql('The request could not be created because the DESCRIPTION field did not contain a single letter of the alphabet ,the type value is not Repair or Maintenance ,the TITLE field did not contain a single letter of the alphabet ,the LOCATION field did not contain a single letter of the alphabet');
          done();
        });
    });
  });
});
