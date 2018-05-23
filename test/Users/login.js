import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server/server';

const existingUser = {
  email: 'aderinwale17@gmail.com',
  password: 'test_password'
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
});
