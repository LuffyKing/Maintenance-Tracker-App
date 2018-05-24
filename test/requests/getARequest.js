import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server/server';
import { requestsValues } from '../../server/db/seeds/requestsSeed';

const existingUser = {
  email: 'aderinwale17@gmail.com',
  password: 'test_password'
};
chai.should();
chai.use(chaiHttp);
describe('Requests API Tests', () => {
  /**
   * Testing get request on the Requests API -success case
   */
  describe('/GET requests', () => {
    it('should GET all requests with valid token', (done) => {
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
    it('should GET all requests with valid token', (done) => {
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
    it('should GET all requests with valid token', (done) => {
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
