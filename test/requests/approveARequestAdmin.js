import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server/server';
import { requestsValues } from '../../server/db/seeds/requestsSeed';

const existingUserAdmin = {
  email: 'arthur@gmail.com',
  password: 'test_password',
};
chai.should();
chai.use(chaiHttp);
describe('Requests API Tests', () => {
  /**
   * Testing put request on the Requests API -success case
   */
  describe('/PUT requests admin', () => {
    it('should PUT a request with valid token, Not Approved/Rejected status and admin profile', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUserAdmin)
        .then((responseLogin) => {
          responseLogin.body.should.have.property('token');
          chai.request(server)
            .put(`/api/v1/requests/${requestsValues[0]}/approve`)
            .send({ reason: 'It looks like a good repair' })
            .set('authorization', responseLogin.body.token)
            .end((err, response) => {
              response.body.message.should.eql('The request has been updated.');
              response.should.have.status(200);
              response.body.updatedRequest.title.should.eql('Leaky toilet');
              response.body.updatedRequest.status.should.eql('Approved');
              done();
            });
        });
    });
  });
  describe('/PUT requests admin', () => {
    it('should PUT a request with valid token, Not Approved/Rejected status and admin profile', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUserAdmin)
        .then((responseLogin) => {
          responseLogin.body.should.have.property('token');
          chai.request(server)
            .put(`/api/v1/requests/${requestsValues[0]}/approve`)
            .send({ reason: 'It looks like a good repair' })
            .set('authorization', responseLogin.body.token)
            .end((err, response) => {
              response.body.message.should.eql('There is no approvable request on TrackerHero with that id');
              response.should.have.status(404);
              done();
            });
        });
    });
  });
  describe('/PUT requests admin', () => {
    it('should PUT a request with valid token, Not Approved/Rejected status and admin profile', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUserAdmin)
        .then((responseLogin) => {
          responseLogin.body.should.have.property('token');
          chai.request(server)
            .put(`/api/v1/requests/${requestsValues[9]}/approve`)
            .send({ reason: 1213 })
            .set('authorization', responseLogin.body.token)
            .end((err, response) => {
              response.body.message.should.eql('Your  Approval was unsuccessful because the field REASON was supposed to be a string');
              response.should.have.status(400);
              done();
            });
        });
    });
  });
  describe('/PUT requests admin', () => {
    it('should PUT a request with valid token, Not Approved/Rejected status and admin profile', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUserAdmin)
        .then((responseLogin) => {
          responseLogin.body.should.have.property('token');
          chai.request(server)
            .put(`/api/v1/requests/${requestsValues[9]}/approve`)
            .send({})
            .set('authorization', responseLogin.body.token)
            .end((err, response) => {
              response.body.message.should.eql('Your  Approval was unsuccessful because the field REASON was not provided');
              response.should.have.status(400);
              done();
            });
        });
    });
  });
  describe('/PUT requests admin', () => {
    it('should PUT a request with valid token, Not Approved/Rejected status and admin profile', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUserAdmin)
        .then((responseLogin) => {
          responseLogin.body.should.have.property('token');
          chai.request(server)
            .put(`/api/v1/requests/${requestsValues[9]}/approve`)
            .send({ reason: '' })
            .set('authorization', responseLogin.body.token)
            .end((err, response) => {
              response.body.message.should.eql('Your  Approval was unsuccessful because the REASON field did not contain a single letter of the alphabet');
              response.should.have.status(400);
              done();
            });
        });
    });
  });
});
