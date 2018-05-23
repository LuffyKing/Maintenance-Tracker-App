import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { pool } from '../db';

/**
 * An  object that handles the requests api operation
 */
const Users = {
  /**
* It gets all the requests on the application
* @param {Object} req - request object containing params and body
* @param {Object} res - response object that conveys the result of the request
* @returns {Object} - response object that has a status code of 200 as long as a
request is made
*/
  login: (req, res) => {
    const { email, password } = req.reqBody;
    pool.connect((err, client, done) => {
      if (err) res.status(500).send({ message: err.stack });
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
          return res.status(500).send({ message: err.stack });
        }
        if (result.rows.length > 0) {
          const user = result.rows[0];
          const newUser = Object.keys(user).reduce((accum, current) => {
            if (current !== 'password') {
              accum[current] = user[current];
              return accum;
            }
            return accum;
          }, {});
          if (bcrypt.compareSync(password, user.password) === true) {
            const token = jsonwebtoken.sign({ user }, process.env.SECRET_KEY, { expiresIn: '7d' });
            return res.status(200).send({
              message: 'Login successful',
              token,
              user: newUser
            });
          }
          return res.status(401).send({
            message: 'Invalid Username/Password',
          });
        }
        return res.status(401).send({
          message: 'Invalid Username/Password',
        });
      });
    });
  },
};
export default Users;
