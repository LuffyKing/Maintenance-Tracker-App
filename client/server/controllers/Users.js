import bcrypt from 'bcrypt';
import uuidv4 from 'uuid/v4';
import jsonwebtoken from 'jsonwebtoken';
import { pool } from '../db';

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
        LOCATION from USERS where EMAIL=$1`, [email], (err, result) => {
        done();
        if (err) {
          return response.status(500).send({ message: err.stack });
        }
        if (result.rows.length > 0) {
          const user = result.rows[0];
          const newUser = Users.removePassword(user);
          if (bcrypt.compareSync(password, user.password) === true) {
            const token = jsonwebtoken.sign({ user }, process.env.SECRET_KEY, { expiresIn: '7d' });
            return response.status(200).send({
              message: 'Login successful',
              token,
              user: newUser,
              status: 200
            });
          }
          return response.status(401).send({
            message: 'Invalid Username/Password',
            status: 401
          });
        }
        return response.status(401).send({
          message: 'Invalid Username/Password',
          status: 401
        });
      });
    });
  },
  signUp(request, response) {
    const newUser = {
      ...request.reqBody,
      id: uuidv4(),
      password: bcrypt.hashSync(request.reqBody.password, 8),
      profile: 'User',
      upgradeId: uuidv4()
    };
    pool.connect((err, client, done) => {
      if (err) response.status(500).send({ message: err.stack });
      client.query(`INSERT INTO USERS(ID,FIRST_NAME,LAST_NAME,EMAIL,PASSWORD,JOB_TITLE,DEPARTMENT,PROFILE,LOCATION,UPGRADE_ID)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *;`, [
        newUser.id,
        newUser.firstName,
        newUser.lastName,
        newUser.email,
        newUser.password,
        newUser.jobTitle,
        newUser.department,
        newUser.profile,
        newUser.location,
        newUser.upgradeId
      ], (err) => {
        done();
        if (err) {
          return response.status(500).send({ message: err.stack });
        }
        const token = jsonwebtoken.sign({ newUser }, process.env.SECRET_KEY, { expiresIn: '7d' });
        const newUserNoPassword = Users.removePassword(newUser);
        return response.status(200).send({
          message: 'Signup successful',
          token,
          user: newUserNoPassword
        });
      });
    });
  }
};
export default Users;
