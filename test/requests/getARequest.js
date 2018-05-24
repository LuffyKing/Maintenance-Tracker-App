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
describe('Requests API Tests', () => {
  /**
   * Testing get request on the Requests API -success case
   */
  describe('/GET requests', () => {
    it('should GET a request he/she owns with valid token and succeed', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUser)
        .end((err, responseLogin) => {
          responseLogin.body.should.have.property('token');
          chai.request(server)
            .get(`/api/v1/users/requests/${requestsValues[0]}`)
            .set('authorization', responseLogin.body.token)
            .end((err, response) => {
              response.body.message.should.eql('Your request has been found');
              response.should.have.status(200);
              response.body.request.title.should.eql('Broken Toilet');
              done();
            });
        });
    });
  });
  describe('/GET requests', () => {
    it('should try GET a request he/she does not own with valid token and fail', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUser2)
        .end((err, responseLogin) => {
          responseLogin.body.should.have.property('token');
          chai.request(server)
            .get(`/api/v1/users/requests/${requestsValues[0]}`)
            .set('authorization', responseLogin.body.token)
            .end((err, response) => {
              response.body.message.should.eql('You do not have any request on TrackerHero with that id');
              response.should.have.status(404);
              done();
            });
        });
    });
  });

  describe('/GET requests', () => {
    it('should GET a request with an invalid request with valid token and fail', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUser)
        .end((err, responseLogin) => {
          responseLogin.body.should.have.property('token');
          chai.request(server)
            .get('/api/v1/users/requests/1')
            .set('authorization', responseLogin.body.token)
            .end((err, response) => {
              response.body.message.should.eql('The id provided is invalid because it is not of the type UUID 4');
              response.should.have.status(400);
              done();
            });
        });
    });
  });

  describe('/GET requests', () => {
    it('should GET a request with an invalid request with valid token and fail', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUser)
        .end((err, responseLogin) => {
          responseLogin.body.should.have.property('token');
          chai.request(server)
            .get('/api/v1/users/requests/[]')
            .set('authorization', responseLogin.body.token)
            .end((err, response) => {
              response.body.message.should.eql('The id provided is invalid because it is not of the type UUID 4');
              response.should.have.status(400);
              done();
            });
        });
    });
  });
});
