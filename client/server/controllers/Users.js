import _ from 'lodash';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { pool } from '../db';
import { profile } from '../maps/mapObject';
import { transporter, mailOptions } from '../nodemailer';
/**
 * An  object that handles the requests api operation
 */
const Users = {
  /**
* @desc It removes the password from the user object
* @param {object} user - user object the details of a user
* @returns {object} - a passowrdless user object
*/
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
* @desc It retrieves the details of an authenticated user
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @returns {object} - response object that has a status code of 200, 500 if there is
* a database error and 404 if the user was not found
*/
  getAUser(request, response) {
    const { decodedUser } = request;
    pool.connect((error, client, done) => {
      if (error) {
        response.status(500).send({ message: error.stack });
      }
      client.query(`SELECT ID,
        FIRST_NAME,
        LAST_NAME,
        EMAIL,
        JOB_TITLE,
        DEPARTMENT,
        PROFILE,
        LOCATION,
        IMAGE_URL from USERS where id = $1`, [decodedUser.user.id], (error1, result) => {
        done();
        if (error1) {
          return response.status(500).send({ message: error1.stack });
        }
        if (result.rows.length > 0) {
          const user = result.rows[0];
          user.profile = (_.invert(profile))[user.profile];
          return response.status(200).send({
            message: 'User found',
            user
          });
        }
        return response.status(404).send({
          message: 'User not found'
        });
      });
    });
  },
  /**
* @desc It logins a user in to the application
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @returns {object} - response object that has a status code of 200, 500 if there is
* a database error and 401 if the email or password are invalid
*/
  login(request, response) {
    const { email, password } = request.reqBody;
    pool.connect((error, client, done) => {
      if (error) {
        response.status(500).send({ message: error.stack });
      }
      client.query(`SELECT ID,
        FIRST_NAME,
        LAST_NAME,
        EMAIL,
        PASSWORD,
        JOB_TITLE,
        DEPARTMENT,
        PROFILE,
        LOCATION from USERS where EMAIL = $1`, [email], (error1, result) => {
        done();
        if (error1) {
          return response.status(500).send({ message: error1.stack });
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
  /**
* @desc It changes the password of the user
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @returns {object} - response object that has a status code of 200, 500 if there is
* a database error and 404 if the email or password are invalid
*/
  changePassword(request, response) {
    let { password } = request.reqBody;
    const { resetToken } = request.query;
    password = bcrypt.hashSync(password, 8);
    pool.connect((error, client, done) => {
      if (error) {
        return response.status(500).send({ message: error.stack });
      }
      client.query('UPDATE USERS set PASSWORD = $1 from RESETPASSWORD where users.id = RESETPASSWORD.userid and RESETPASSWORD.resetid = $2 RETURNING *;', [password, resetToken], (error1) => {
        done();
        if (error1) {
          return response.status(500).send({ message: error1.stack });
        }
        return response.status(200).send({ message: 'Your password was successfully changed' });
      });
    });
  },
  /**
* @desc It sends reset email to the user
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @returns {object} - response object that has a status code of 200, 500 if there is
* a database error and 404 if the email or password are invalid
*/
  forgotPassword(request, response) {
    const { email } = request.reqBody;
    pool.connect((error, client, done) => {
      if (error) {
        return response.status(500).send({ message: error.stack });
      }
      client.query(`SELECT ID,
        FIRST_NAME,
        LAST_NAME,
        EMAIL from USERS where EMAIL = $1;`, [email], (error1, result) => {
        done();
        if (error1) {
          return response.status(500).send({ message: error1.stack });
        }
        if (result.rows.length > 0) {
          const user = result.rows[0];
          const expHours = 4;
          const expirydate = new Date();
          expirydate.setHours(expirydate.getHours() + expHours);
          client.query('INSERT INTO RESETPASSWORD(USERID, EXPIRYDATE) VALUES ($1, $2) ON CONFLICT(USERID) DO UPDATE SET resetid=EXCLUDED.resetid, expirydate=EXCLUDED.expirydate RETURNING *;', [
            user.id,
            expirydate
          ], (error2, resultToken) => {
            done();
            if (error2) {
              return response.status(500).send({ message: error2.stack });
            }
            const tokenReset = resultToken.rows[0].resetid.trim();
            mailOptions.to = `${user.email}`;
            mailOptions.subject = 'Reset your password';
            mailOptions.html = `
              <h1>Reset your password</h1>
              <p>Dear ${user.first_name} ${user.last_name},</p>
              <p>You can reset your password by clicking <a href="${request.headers.host}/resetPassword?token=${tokenReset}">Reset Password</a></p>
              <p>Your link expires in ${expHours} hours</p>
            `;
            transporter.sendMail(mailOptions, (errorSendMail, info) => {
              if (error) {
                return response.status(500).send({ message: errorSendMail });
              }
              return response.status(200).send({
                message: 'Reset password email sent',
                info: info.response,
                tokenReset
              });
            });
          });
        } else {
          return response.status(404).send({
            message: 'No account with that email exists',
          });
        }
      });
    });
  },
  /**
* @desc It signs a user up to the application
* @param {object} request - request object containing params and body
* @param {object} response - response object that conveys the result of the request
* @returns {object} - response object that has a status code of 201 and 500 when
* when a database error is encountered.
*/
  signUp(request, response) {
    const newUser = {
      ...request.reqBody,
      password: bcrypt.hashSync(request.reqBody.password, 8),
    };
    pool.connect((error, client, done) => {
      if (error) {
        return response.status(500).send({ message: error.stack });
      }
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
      ], (error1, result) => {
        done();
        if (error1) {
          return response.status(500).send({ message: error1.stack });
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
