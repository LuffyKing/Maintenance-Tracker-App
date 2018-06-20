import express from 'express';
import path from 'path';
import { verifyTokenUI } from '../authMiddleware/jwt';
import { pool } from '../db';

const UIRouter = express.Router();

UIRouter.get('/', (request, response) => {
  response.sendFile(path.resolve(__dirname, '../../../client/UI/html/LandingPage.html'));
});

UIRouter.get('/forgotPassword', (request, response) => {
  response.sendFile(path.resolve(__dirname, '../../../client/UI/html/ForgotPasswordPage.html'));
});

UIRouter.get('/SigninPage.html', (request, response) => {
  response.sendFile(path.resolve(__dirname, '../../../client/UI/html/SigninPage.html'));
});

UIRouter.get('/UserViewRequests.html', (request, response) => {
  response.sendFile(path.resolve(__dirname, '../../../client/UI/html/UserViewRequests.html'));
});

UIRouter.get('/SignupPage.html', (request, response) => {
  response.sendFile(path.resolve(__dirname, '../../../client/UI/html/SignupPage.html'));
});

UIRouter.get('/create/requests', (request, response) => {
  response.sendFile(path.resolve(__dirname, '../../../client/UI/html/MakeRequest.html'));
});

UIRouter.get('/requests/edit/:requestid', (request, response) => {
  response.sendFile(path.resolve(__dirname, '../../../client/UI/html/EditRequest.html'));
});

UIRouter.get('/requests/:requestid', (request, response) => {
  response.sendFile(path.resolve(__dirname, '../../../client/UI/html/UserRequestDetailPage.html'));
});

UIRouter.get('/requests/admin/:requestid', (request, response) => {
  response.sendFile(path.resolve(__dirname, '../../../client/UI/html/AdminUserRequestDetailPage.html'));
});

UIRouter.get('/requests', (request, response) => {
  response.sendFile(path.resolve(__dirname, '../../../client/UI/html/AdminViewRequests.html'));
});

UIRouter.get('/profile', (request, response) => {
  response.sendFile(path.resolve(__dirname, '../../../client/UI/html/UserProfilePage.html'));
});

UIRouter.post('/verify', verifyTokenUI);

UIRouter.get('/resetPassword', (request, response, next) => {
  pool.connect((error, client, done) => {
    if (error) {
      return response.status(500).send({ message: error.stack });
    }
    client.query('SELECT * FROM RESETPASSWORD where resetid=$1;', [
      request.query.token
    ], (error1, result) => {
      done();
      if (error1) {
        return response.status(500).send({ message: error1.stack });
      }
      if (result.rows.length > 0) {
        const tokenResult = result.rows[0];
        const now = new Date();
        if (tokenResult.expirydate < now) {
          return response.sendFile(path.resolve(__dirname, '../../../client/UI/html/resetPasswordExpired.html'));
        } else {
          return response.sendFile(path.resolve(__dirname, '../../../client/UI/html/resetPassword.html'));
        }
      } else{
      return response.sendFile(path.resolve(__dirname, '../../../client/UI/html/resetPasswordInvalidToken.html'));
    }
    });
  });
});

UIRouter.use((request, response) => {
  response.sendFile(path.resolve(__dirname, '../../../client/UI/html/404.html'));
});


export default UIRouter;
