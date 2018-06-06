import express from 'express';
import path from 'path';
import { verifyTokenUI } from '../authMiddleware/jwt';

const UIRouter = express.Router();

UIRouter.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../../client/UI/html/SigninPage.html'));
});

UIRouter.get('/SigninPage.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../../client/UI/html/SigninPage.html'));
});

UIRouter.get('/UserViewRequests.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../../client/UI/html/UserViewRequests.html'));
});

UIRouter.get('/SignupPage.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../../client/UI/html/SignupPage.html'));
});


UIRouter.post('/verify', verifyTokenUI);

UIRouter.use((req, res) => {
  res.sendFile(path.resolve(__dirname, '../../../client/UI/html/404.html'));
});

export default UIRouter;
