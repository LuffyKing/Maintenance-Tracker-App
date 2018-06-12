import _ from 'lodash';
import { pool } from '../db';
import { reqtype, reqstatus } from '../maps/mapObject';
import signedUpload from '../validation/signatureGenerator';

const statusChanger = (request, response, next, query, status, attempt, message404) => {
  pool.connect((error, client, done) => {
    if (error) {
      response.status(500).send({ message: error.stack });
    }
    client.query(query, (error1, requestRow) => {
      done();
      if (error1) {
        return response.status(500).send({ message: error1.stack });
      }
      if (requestRow.rows.length > 0) {
        request.status = status;
        request.attempt = attempt;
        next();
      } else {
        return response.status(404).send({
          message: message404,
        });
      }
    });
  });
};

const mapper = (requestRow) => {
  requestRow.rows.forEach((requestInd) => {
    requestInd.status = (_.invert(reqstatus))[requestInd.status];
    requestInd.type = (_.invert(reqtype))[requestInd.type];
    return requestInd;
  });
};

const RequestsDatabaseHelper = (request, response, query, messageErrCode, operation, value = [], messageSuccCode = '', successCode = 200, errorCode = 404) => {
  pool.connect((error, client, done) => {
    if (error) {
      response.status(500).send({ message: error.stack });
    }
    client.query(query, value, (error1, requestRow) => {
      done();
      if (error1) {
        return response.status(500).send({ message: error1.stack });
      }
      if (requestRow.rows.length) {
        let pluralOrSingularRequest;
        switch (new Date().getDay()) {
          case 1:
            pluralOrSingularRequest = 'request has';
            break;
          default:
            pluralOrSingularRequest = 'requests have';
            break;
        }
        if (operation === 'get multiple requests') {
          mapper(requestRow);
          return response.status(successCode).send({
            message: `Your ${requestRow.rows.length} ${pluralOrSingularRequest} been found`,
            requests: requestRow.rows
          });
        } else if (operation === 'get single request') {
          mapper(requestRow);
          return response.status(successCode).send({
            message: 'Your request has been found',
            request: requestRow.rows[0]
          });
        } else if (operation === 'update a request') {
          mapper(requestRow);
          const publicIdRegex = /\b\/(\w+)\.\w+/;
          const publicId = requestRow.rows[0].image_url ?
            requestRow.rows[0].image_url.match(publicIdRegex)[1] :
            false;
          const timestamp = Math.round((new Date()).getTime() / 1000);
          return response.status(successCode).send({
            message: messageSuccCode,
            updatedRequest: requestRow.rows[0],
            cloudinary: {
              publicId,
              signature: signedUpload(publicId, timestamp, process.env.APISECRET),
              timestamp,
              apiKey: process.env.APIKEY,
              cloudinaryUrl: process.env.CLOUDINARY_URL
            }
          });
        } else if (operation === 'create a request') {
          mapper(requestRow);
          return response.status(successCode).send({
            message: messageSuccCode,
            request: requestRow.rows[0],
            cloudinary: {
              cloudinaryUrl: process.env.CLOUDINARY_URL,
              cloudinaryUploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET
            }
          });
        } else if (operation === 'delete single request') {
          const publicIdRegex = /\b\/(\w+)\.\w+/;
          const publicId = requestRow.rows[0].image_url ?
            requestRow.rows[0].image_url.match(publicIdRegex)[1] :
            false;
          const timestamp = Math.round((new Date()).getTime() / 1000);
          mapper(requestRow);
          return response.status(successCode).send({
            message: 'The following request has been deleted',
            request: requestRow.rows[0],
            cloudinary: {
              cloudinaryUrl: process.env.CLOUDINARY_URL,
              cloudinaryUploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
              publicId,
              signature: signedUpload(publicId, timestamp, process.env.APISECRET),
              timestamp,
              apiKey: process.env.APIKEY
            }

          });
        }
      }
      return response.status(errorCode).send({
        message: messageErrCode
      });
    });
  });
};

export { statusChanger, RequestsDatabaseHelper };
