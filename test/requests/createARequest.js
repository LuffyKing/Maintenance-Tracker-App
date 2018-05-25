import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server/server';

chai.should();
chai.use(chaiHttp);

const existingUser = {
  email: 'aderinwale17@gmail.com',
  password: 'test_password'
};

const newRequest = {
  title: 'Broken',
  description: 'The desk is broken',
  location: 'Room 404, Kingsbury Factory',
  type: 'Repair',
};
const newRequestInvalidIntFields = {
  title: 'Broken Desk',
  description: 'The desk is broken',
  location: 0,
  type: 0,
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
};
const newRequestFieldsEmpty = {
  title: '',
  description: '',
  location: '',
  type: '',
};
describe('Requests API Tests', () => {
  /**
   * Testing post request on the Requests API -success case
   */
  describe('/POST requests', () => {
    it('should POST the details of valid request and succeed', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUser)
        .then((responseLogin) => {
          responseLogin.body.should.have.property('token');
          chai.request(server)
            .post('/api/v1/users/requests')
            .send(newRequest)
            .set('authorization', responseLogin.body.token)
            .end((err, response) => {
              response.body.message.should.eql('Your request was successfully created.');
              response.should.have.status(201);
              response.body.should.have.property('message');
              response.body.request.title.should.eql(newRequest.title);
              response.body.request.description.should.eql(newRequest.description);
              response.body.request.location.should.eql(newRequest.location);
              response.body.request.type.should.eql(newRequest.type);
              response.body.request.should.have.property('id');
              response.body.request.should.have.property('date_submitted');
              response.body.request.should.have.property('last_edited');
              response.body.request.should.have.property('status');
              done();
            });
        });
    });
  });
  describe('/POST requests', () => {
    it('should POST the details of a request with empty string fields and fail', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUser)
        .then((responseLogin) => {
          responseLogin.body.should.have.property('token');
          chai.request(server)
            .post('/api/v1/users/requests')
            .send(newRequestFieldsEmpty)
            .set('authorization', responseLogin.body.token)
            .end((err, response) => {
              response.body.message.should.eql('The request could not be created because the TITLE field did not contain a single letter of the alphabet ,the DESCRIPTION field did not contain a single letter of the alphabet ,the type value is not Repair or Maintenance ,the LOCATION field did not contain a single letter of the alphabet');
              response.should.have.status(400);
              response.body.should.have.property('message');
              done();
            });
        });
    });
  });
  describe('/POST requests', () => {
    it('should POST the details of a duplicate request and fail', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUser)
        .then((responseLogin) => {
          responseLogin.body.should.have.property('token');
          chai.request(server)
            .post('/api/v1/users/requests')
            .send(newRequest)
            .set('authorization', responseLogin.body.token)
            .end((err, response) => {
              response.should.have.status(400);
              response.body.should.have.property('message');
              response.body.message.should.eql('The request could not be created because a request with the same LOCATION, DESCRIPTION,TYPE AND TITLE already exists');
              done();
            });
        });
    });
  });
  describe('/POST requests', () => {
    it('should POST the details of a request with empty fields and fail', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUser)
        .then((responseLogin) => {
          responseLogin.body.should.have.property('token');
          chai.request(server)
            .post('/api/v1/users/requests')
            .send(newRequestEmptyFields)
            .set('authorization', responseLogin.body.token)
            .end((err, response) => {
              response.should.have.status(400);
              response.body.should.have.property('message');
              response.body.message.should.eql('The request could not be created because the field TYPE was not provided');
              done();
            });
        });
    });
  });
  describe('/POST requests', () => {
    it('should POST the details of a request with non string fields in place of text and fail', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUser)
        .then((responseLogin) => {
          responseLogin.body.should.have.property('token');
          chai.request(server)
            .post('/api/v1/users/requests')
            .send(newRequestNonStringFields)
            .set('authorization', responseLogin.body.token)
            .end((err, response) => {
              response.should.have.status(400);
              response.body.should.have.property('message');
              response.body.message.should.eql('The request could not be created because the field LOCATION was supposed to be a string');
              done();
            });
        });
    });
  });
  describe('/POST requests', () => {
    it('should POST the details of a request with integer fields in place of text and fail', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUser)
        .then((responseLogin) => {
          responseLogin.body.should.have.property('token');
          chai.request(server)
            .post('/api/v1/users/requests')
            .send(newRequestInvalidIntFields)
            .set('authorization', responseLogin.body.token)
            .end((err, response) => {
              response.should.have.status(400);
              response.body.should.have.property('message');
              response.body.message.should.eql('The request could not be created because the fields TYPE ,LOCATION were supposed to be strings');
              done();
            });
        });
    });
  });
});
