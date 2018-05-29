import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server/server';


chai.should();
chai.use(chaiHttp);
const newUser = {
  firstName: 'Oyindamola',
  lastName: 'Aderinwale',
  email: 'aderino@gmail.com',
  password: 'test_password',
  jobTitle: 'King slayer',
  department: 'Guardians',
  location: '4 Tawdry Lane',
};
const newUserIncompleteFields = {
  firstName: 'Oyindamola',
  lastName: 'Aderinwale',
  email: 'aderino@gmail.com',
  location: '4 Tawdry Lane',
};
const newUserNonStringFields = {
  firstName: 1,
  lastName: 1,
  email: 'aderino@gmail.com',
  password: 'test_password',
  jobTitle: 'King slayer',
  department: 'Guardians',
  location: '4 Tawdry Lane',
};
const newUserInvalidInfo = {
  firstName: 'Oyindamola',
  lastName: '',
  email: 'aderino@',
  password: 'test_password',
  jobTitle: 'King slayer',
  department: 'Guardians',
  location: '4 Tawdry Lane',
};
describe('Requests signup Tests', () => {
  describe('/POST users', () => {
    it('should POST valid user information and succeed', (done) => {
      chai.request(server)
        .post('/api/v1/auth/signup')
        .send(newUser)
        .end((err, response) => {
          response.body.message.should.eql('Signup successful');
          response.should.have.status(200);
          response.body.should.have.property('message');
          response.body.user.firstName.should.eql('Oyindamola');
          response.body.user.lastName.should.eql('Aderinwale');
          response.body.user.email.should.eql('aderino@gmail.com');
          response.body.user.jobTitle.should.eql('King slayer');
          response.body.user.department.should.eql('Guardians');
          response.body.user.profile.should.eql('User');
          response.body.user.location.should.eql('4 Tawdry Lane');
          done();
        });
    });
  });
  describe('/POST users', () => {
    it('should POST duplicate user information and fail', (done) => {
      chai.request(server)
        .post('/api/v1/auth/signup')
        .send(newUser)
        .end((err, response) => {
          response.body.message.should.eql('Your sign up attempt was unsuccessful because the EMAIL you provided already exists!');
          response.should.have.status(400);
          response.body.should.have.property('message');
          done();
        });
    });
  });
  describe('/POST users', () => {
    it('should POST user information with non string fields and fail', (done) => {
      chai.request(server)
        .post('/api/v1/auth/signup')
        .send(newUserNonStringFields)
        .end((err, response) => {
          response.body.message.should.eql('Your sign up attempt was unsuccessful because the fields FIRST NAME ,LAST NAME were supposed to be strings');
          response.should.have.status(400);
          response.body.should.have.property('message');
          done();
        });
    });
  });
  describe('/POST users', () => {
    it('should POST user information with fields missing and fail', (done) => {
      chai.request(server)
        .post('/api/v1/auth/signup')
        .send(newUserIncompleteFields)
        .end((err, response) => {
          response.body.message.should.eql('Your sign up attempt was unsuccessful because the fields PASSWORD ,JOB TITLE ,DEPARTMENT were not provided');
          response.should.have.status(400);
          response.body.should.have.property('message');
          done();
        });
    });
  });
  describe('/POST users', () => {
    it('should POST user information with invalid fields and fail', (done) => {
      chai.request(server)
        .post('/api/v1/auth/signup')
        .send(newUserInvalidInfo)
        .end((err, response) => {
          response.body.message.should.eql('Your sign up attempt was unsuccessful because the LASTNAME field did not contain a single letter of the alphabet ,the email value is not an email');
          response.should.have.status(400);
          response.body.should.have.property('message');
          done();
        });
    });
  });
});
