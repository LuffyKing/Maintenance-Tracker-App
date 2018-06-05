import _ from 'lodash';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { pool } from '../db';
import { profile } from '../maps/mapObject';

/**
 * An  object that handles the requests api operation
 */
const Users = {
  removePassword(user) {
    return Object.keys(user).reduce((accumulator, current) => {
      if (current !== 'password') {
        accumulator[current] = user[current];
        return accumulator;
      }
      return accumulator;
    }, {});
  },
  /**
* It gets all the requests on the application
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @returns {object} - response object that has a status code of 200 as long as a
request is made
*/
  login(request, response) {
    const { email, password } = request.reqBody;
    pool.connect((err, client, done) => {
      if (err) {
        response.status(500).send({ message: err.stack });
      }
      client.query(`SELECT ID,
        FIRST_NAME,
        LAST_NAME,
        EMAIL,
        PASSWORD,
        JOB_TITLE,
        DEPARTMENT,
        PROFILE,
        LOCATION from USERS where EMAIL = $1`, [email], (err, result) => {
        done();
        if (err) {
          return response.status(500).send({ message: err.stack });
        }
        if (result.rows.length > 0) {
          const user = result.rows[0];
          const newUser = Users.removePassword(user);
          const newUserToken = { id: newUser.id, profile: (_.invert(profile))[newUser.profile] };
          newUser.profile = (_.invert(profile))[newUser.profile];
          if (bcrypt.compareSync(password, user.password) === true) {
            const token = jsonwebtoken.sign({ user: newUserToken }, process.env.SECRET_KEY, { expiresIn: '7d' });
            return response.status(200).send({
              message: 'Login successful',
              token,
              user: newUser,
            });
          }
          return response.status(401).send({
            message: 'Invalid Username/Password',
          });
        }
        return response.status(401).send({
          message: 'Invalid Username/Password',
        });
      });
    });
  },
  signUp(request, response) {
    const newUser = {
      ...request.reqBody,
      password: bcrypt.hashSync(request.reqBody.password, 8),
      profile: 'User',
    };
    pool.connect((err, client, done) => {
      if (err) response.status(500).send({ message: err.stack });
      client.query(`INSERT INTO USERS(FIRST_NAME,LAST_NAME,EMAIL,PASSWORD,JOB_TITLE,DEPARTMENT,PROFILE,LOCATION)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *;`, [
        newUser.firstName,
        newUser.lastName,
        newUser.email,
        newUser.password,
        newUser.jobTitle,
        newUser.department,
        profile[newUser.profile],
        newUser.location
      ], (err, result) => {
        done();
        if (err) {
          return response.status(500).send({ message: err.stack });
        }
        let resObj = result.rows[0];
        resObj = Users.removePassword(resObj);
        resObj.profile = (_.invert(profile))[resObj.profile];
        const token = jsonwebtoken.sign({ user: { id: resObj.id, profile: resObj.profile } }, process.env.SECRET_KEY, { expiresIn: '7d' });
        return response.status(201).send({
          message: 'Signup successful',
          token,
          user: resObj
        });
      });
    });
  }
};
export default Users;
