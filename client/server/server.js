import 'babel-polyfill';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import badApiRequest from './router/badRequests/badApiRequest';
import configJs from './config/config';
import router from './router';
import UIRouter from './UIRouter';

const env = process.env.NODE_ENV || 'development';

const config = configJs[env];

const app = express();
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, '../../client/UI')));
app.use(express.static(path.resolve(__dirname, './UI')));
const port = process.env.PORT || config.PORT;

app.use(cors({ credentials: true, origin: true }));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));

app.use('/api/v1', router);

app.use('/', UIRouter);

app.use(badApiRequest);

app.listen(port);

export default app;
