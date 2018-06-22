import express from 'express';
import path from 'path';

import { verifyTokenUI } from '../authMiddleware/jwt';
import { pool } from '../db';
import { htmlFilePath } from '../helperFunctions/htmlFilePath';
import { messageResponse } from '../helperFunctions/messageResponse';

const UIRouter = express.Router();

const routeHandler = (route, file, htmlFilePathVar = htmlFilePath) =>
  UIRouter.get(route, (request, response) =>
    response.sendFile(path.resolve(__dirname, `${htmlFilePathVar}/${file}`)));

const responseHandler = (response, file) => response.sendFile(path.resolve(__dirname, `${htmlFilePath}/${file}`));

routeHandler('/', 'LandingPage.html');

routeHandler('/forgotPassword', 'LandingPage.html');

routeHandler('/UserViewRequests.html', 'UserViewRequests.html');

routeHandler('/SigninPage.html', 'SigninPage.html');

routeHandler('/SignupPage.html', 'SignupPage.html');

routeHandler('/UserViewRequests.html', 'UserViewRequests.html');

routeHandler('/create/requests', 'MakeRequest.html');

routeHandler('/requests/edit/:requestid', 'EditRequest.html');

routeHandler('/requests/:requestid', 'UserRequestDetailPage.html');

routeHandler('/requests/admin/:requestid', 'AdminUserRequestDetailPage.html');

routeHandler('/requests', 'AdminViewRequests.html');

routeHandler('/profile', 'UserProfilePage.html');

UIRouter.post('/verify', verifyTokenUI);

UIRouter.get('/resetPassword', (request, response) => {
  pool.connect((error, client, done) => {
    if (error) {
      return messageResponse(response, 500, { message: error.stack });
    }
    client.query('SELECT * FROM RESETPASSWORD where resetid=$1;', [
      request.query.token
    ], (error1, result) => {
      done();
      if (error1) {
        return messageResponse(response, 500, { message: error1.stack });
      }
      if (result.rows.length > 0) {
        const tokenResult = result.rows[0];
        const now = new Date();
        if (tokenResult.expirydate < now) {
          return responseHandler(response, 'resetPasswordExpired.html');
        }
        return responseHandler(response, 'resetPassword.html');
      }
      return responseHandler(response, 'resetPasswordInvalidToken.html');
    });
  });
});

UIRouter.use((request, response) => responseHandler(response, '404.html'));


export default UIRouter;
