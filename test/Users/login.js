import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server/server';

const existingUser = {
  email: 'aderinwale17@gmail.com',
  password: 'test_password'
};
const existingUserWrongPassword = {
  email: 'aderinwale17@gmail.com',
  password: 'wrong_password'
};
const existingUserInvalidEmail = {
  email: 'invalid17@gmail.com',
  password: 'wrong_password'
};
const existingUserEmptyStrings = {
  email: '',
  password: ''
};
const existingUserEmptyObject = {

};
const existingUserNonStringInput = {
  email: 1,
  password: 1
};

chai.should();
chai.use(chaiHttp);
describe('Requests login Tests', () => {
  describe('/POST users', () => {
    it('should POST valid user information and succeed', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUser)
        .end((err, res) => {
          res.body.message.should.eql('Login successful');
          res.should.have.status(200);
          res.body.should.have.property('message');
          res.body.user.first_name.should.eql('Oyindamola');
          res.body.user.last_name.should.eql('Aderinwale');
          res.body.user.email.should.eql('aderinwale17@gmail.com');
          res.body.user.job_title.should.eql('King slayer');
          res.body.user.department.should.eql('Guardians');
          res.body.user.profile.should.eql('User');
          res.body.user.location.should.eql('4 Tawdry Lane');
          done();
        });
    });
  });
  describe('/POST users', () => {
    it('should POST valid user email put invalid password and fail', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUserWrongPassword)
        .end((err, res) => {
          res.body.message.should.eql('Invalid Username/Password');
          res.should.have.status(401);
          res.body.should.have.property('message');
          done();
        });
    });
  });
  describe('/POST users', () => {
    it('should POST invalid user email and fail', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUserInvalidEmail)
        .end((err, res) => {
          res.body.message.should.eql('Invalid Username/Password');
          res.should.have.status(401);
          res.body.should.have.property('message');
          done();
        });
    });
  });
  describe('/POST users', () => {
    it('should POST empty strings for email and username, and fail', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUserEmptyStrings)
        .end((err, res) => {
          res.body.message.should.eql('Your log in attempt was unsuccessful because the email value is not an email ,the PASSWORD field did not contain a single letter of the alphabet');
          res.should.have.status(400);
          res.body.should.have.property('message');
          done();
        });
    });
  });
  describe('/POST users', () => {
    it('should POST an empty object, and fail', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUserEmptyObject)
        .end((err, res) => {
          res.body.message.should.eql('Your log in attempt was unsuccessful because the fields EMAIL ,PASSWORD were not provided');
          res.should.have.status(400);
          res.body.should.have.property('message');
          done();
        });
    });
  });
  describe('/POST users', () => {
    it('should POST an object wtith non string input and fail', (done) => {
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(existingUserNonStringInput)
        .end((err, res) => {
          res.body.message.should.eql('Your log in attempt was unsuccessful because the fields EMAIL ,PASSWORD were supposed to be strings');
          res.should.have.status(400);
          res.body.should.have.property('message');
          done();
        });
    });
  });
});
