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

UIRouter.get('/create/requests', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../../client/UI/html/MakeRequest.html'));
});

UIRouter.get('/requests/edit/:requestid', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../../client/UI/html/EditRequest.html'));
});

UIRouter.get('/requests/:requestid', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../../client/UI/html/UserRequestDetailPage.html'));
});

UIRouter.get('/requests/admin/:requestid', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../../client/UI/html/AdminUserRequestDetailPage.html'));
});

UIRouter.get('/requests', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../../client/UI/html/AdminViewRequests.html'));
});

UIRouter.post('/verify', verifyTokenUI);

UIRouter.use((req, res) => {
  res.sendFile(path.resolve(__dirname, '../../../client/UI/html/404.html'));
});

export default UIRouter;
