import 'babel-polyfill';
import bodyParser from 'body-parser';
import cors from 'cors';
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

app.use(express.static(path.resolve(__dirname, '../../client/UI')));

app.use(express.static(path.resolve(__dirname, './UI')));

const port = process.env.PORT || config.PORT;

app.use(cors({ credentials: true, origin: true }));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));

app.use('/api/v1', router);

app.use('/', UIRouter);

app.use('/api/v1/*', badApiRequest);

app.use((error, request, response, next) => {
  if (error instanceof URIError) {
    return response.redirect('/badApiRequest');
  }
});

app.listen(port);

export default app;
