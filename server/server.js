import 'babel-polyfill';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import router from './router/index';
import badApiRequest from './router/badRequests/badApiRequest';
import configJs from './config/config';

const env = process.env.NODE_ENV || 'development';
const config = configJs[env];

const app = express();

const port = process.env.PORT || config.PORT;

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));
/**
 * Middleware for welcome message  on the '/' route
 */
app.get('/', (req, res) => {
  res.status(200).send({
    message: 'Welcome to WeConnect api, go to /api/v1/api-docs/ for current api docs. Current version is v1'
  });
});

app.use('/api/v1', router);

app.use(badApiRequest);

app.listen(port);

export default app;
