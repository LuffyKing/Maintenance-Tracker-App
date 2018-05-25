import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server/server';
import { requestsValues } from '../../server/db/seeds/requestsSeed';

const existingUser = {
  email: 'aderinwale17@gmail.com',
  password: 'test_password'
};

const existingUser2 = {
  email: 'aderino@gmail.com',
  password: 'test_password',
};

chai.should();
chai.use(chaiHttp);
const requestUpdateDetails = {
  title: 'Leaky toilet',
  description: 'The toilet is leaking'
};
const requestUpdateDetailsEmptyString = {
  title: 'Leaky toilet',
  description: ''
};
const requestUpdateDetailsNonString = {
  title: 'Leaky toilet',
  description: []
};
const requestUpdateDetailsNonString2 = {
  title: [],
  description: []
};
describe('Requests API Tests', () => {
  /**
   * Testing post request on the Requests API -success case
   */
  describe('/PUT requests', () => {
    it('should PUT the details of a request with valid string fields and succeed', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUser)
        .then((responseLogin) => {
          responseLogin.body.should.have.property('token');
          chai.request(server)
            .put(`/api/v1/users/requests/${requestsValues[0]}`)
            .send(requestUpdateDetails)
            .set('authorization', responseLogin.body.token)
            .end((err, response) => {
              response.body.message.should.eql('Your request has been updated.');
              response.body.should.have.property('message');
              response.should.have.status(200);
              response.body.updatedRequest.title.should.eql(requestUpdateDetails.title);
              response.body.updatedRequest.description.should.eql(requestUpdateDetails.description);
              done();
            });
        });
    });
  });
  describe('/PUT requests', () => {
    it('should try to PUT request with empty string values and fail', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUser)
        .then((responseLogin) => {
          responseLogin.body.should.have.property('token');
          chai.request(server)
            .put(`/api/v1/users/requests/${requestsValues[0]}`)
            .send(requestUpdateDetailsEmptyString)
            .set('authorization', responseLogin.body.token)
            .end((err, response) => {
              response.should.have.status(400);
              response.body.should.have.property('message');
              response.body.message.should.eql('The request could not be created because the DESCRIPTION field did not contain a single letter of the alphabet');
              done();
            });
        });
    });
  });
  describe('/PUT requests', () => {
    it('should to PUT to a request with an empty object', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUser)
        .then((responseLogin) => {
          responseLogin.body.should.have.property('token');
          chai.request(server)
            .put(`/api/v1/users/requests/${requestsValues[0]}`)
            .send({})
            .set('authorization', responseLogin.body.token)
            .end((err, response) => {
              response.should.have.status(200);
              response.body.should.have.property('message');
              response.body.message.should.eql('No update was made to the request');
              done();
            });
        });
    });
  });
  describe('/PUT requests', () => {
    it('should try to PUT request with a non string value and fail', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUser)
        .then((responseLogin) => {
          responseLogin.body.should.have.property('token');
          chai.request(server)
            .put(`/api/v1/users/requests/${requestsValues[0]}`)
            .send(requestUpdateDetailsNonString)
            .set('authorization', responseLogin.body.token)
            .end((err, response) => {
              response.should.have.status(400);
              response.body.should.have.property('message');
              response.body.message.should.eql('The request could not be created because the field DESCRIPTION was supposed to be a string');
              done();
            });
        });
    });
  });
  describe('/PUT requests', () => {
    it('should try to PUT request with non string values and fail', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUser)
        .then((responseLogin) => {
          responseLogin.body.should.have.property('token');
          chai.request(server)
            .put(`/api/v1/users/requests/${requestsValues[0]}`)
            .send(requestUpdateDetailsNonString2)
            .set('authorization', responseLogin.body.token)
            .end((err, response) => {
              response.should.have.status(400);
              response.body.should.have.property('message');
              response.body.message.should.eql('The request could not be created because the fields TITLE ,DESCRIPTION were supposed to be strings');
              done();
            });
        });
    });
  });
  describe('/PUT requests', () => {
    it('should try to PUT details on a request with an id that does not exist and fail', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUser)
        .then((responseLogin) => {
          responseLogin.body.should.have.property('token');
          chai.request(server)
            .put('/api/v1/users/requests/909900')
            .send(requestUpdateDetails)
            .set('authorization', responseLogin.body.token)
            .end((err, response) => {
              response.should.have.status(400);
              response.body.should.have.property('message');
              response.body.message.should.eql('The id provided is invalid because it is not of the type UUID 4');
              done();
            });
        });
    });
  });
  describe('/PUT requests', () => {
    it('should try to PUT details on a request with an id that does not exist and fail', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUser)
        .then((responseLogin) => {
          responseLogin.body.should.have.property('token');
          chai.request(server)
            .put('/api/v1/users/requests/fakeid}')
            .send(requestUpdateDetails)
            .set('authorization', responseLogin.body.token)
            .end((err, response) => {
              response.should.have.status(400);
              response.body.should.have.property('message');
              response.body.message.should.eql('The id provided is invalid because it is not of the type UUID 4');
              done();
            });
        });
    });
  });
});
