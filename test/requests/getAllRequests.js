import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server/server';

const existingUser = {
  email: 'aderinwale17@gmail.com',
  password: 'test_password'
};
const existingUser2 = {
  email: 'aderino@gmail.com',
  password: 'test_password',
};
const existingUserAdmin = {
  email: 'arthur@gmail.com',
  password: 'test_password',
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
        .then((responseLogin) => {
          responseLogin.body.should.have.property('token');
          chai.request(server)
            .get('/api/v1/users/requests')
            .set('authorization', responseLogin.body.token)
            .end((err, response) => {
              response.body.message.should.eql('Your 4 requests have been found');
              response.should.have.status(200);
              response.body.requests.should.be.an('Array');
              response.body.requests[0].title.should.eql('Broken Toilet');
              response.body.requests[1].title.should.eql('Broken Lightbulb');
              done();
            });
        });
    });
  });
  describe('/GET requests', () => {
    it('should try to GET all requests with an invalid token and fail', (done) => {
      chai.request(server)
        .get('/api/v1/users/requests')
        .set('authorization', 'faketoken')
        .end((err, response) => {
          response.body.message.should.eql('Login Token invalid');
          response.should.have.status(401);
          done();
        });
    });
  });
  describe('/GET requests', () => {
    it('should try to GET all requests with no token and fail', (done) => {
      chai.request(server)
        .get('/api/v1/users/requests')
        .end((err, response) => {
          response.body.message.should.eql('Missing authentication token');
          response.should.have.status(401);
          done();
        });
    });
  });
  describe('/GET requests', () => {
    it('should try to GET all requests with valid token and no requests he/she does not have any.', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUser2)
        .then((responseLogin) => {
          responseLogin.body.should.have.property('token');
          chai.request(server)
            .get('/api/v1/users/requests')
            .set('authorization', responseLogin.body.token)
            .end((err, response) => {
              response.body.message.should.eql('You do not have any requests on TrackerHero, but it is not too late to start making them!');
              response.should.have.status(404);
              done();
            });
        });
    });
  });
  describe('/GET requests', () => {
    it('should try to GET all requests with an valid Admin token and fail', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUserAdmin)
        .then((responseLogin) => {
          responseLogin.body.should.have.property('token');
          chai.request(server)
            .get('/api/v1/users/requests')
            .set('authorization', responseLogin.body.token)
            .end((err, response) => {
              response.body.message.should.eql('You are not allowed to use this API because your profile is not User');
              response.should.have.status(401);
              done();
            });
        });
    });
  });
});
