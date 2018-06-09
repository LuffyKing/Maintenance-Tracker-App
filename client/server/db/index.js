import { Pool } from 'pg';
import configJs from '../config/config';
import { loginValues, loginValuesAdmin } from './seeds/loginSeed';
import { requestsColumns, requestsValues } from './seeds/requestsSeed';

const env = process.env.NODE_ENV || 'development';
const config = configJs[env];
const connectionString = config.DATABASE_URL || process.env.DATABASE_URL;
const pool = new Pool({
  connectionString
});
pool.connect((err, client, done) => {
  if (err) { throw err; }
  if (process.env.NODE_ENV) {
    client.query(
      'INSERT INTO USERS(FIRST_NAME,LAST_NAME,EMAIL,PASSWORD,JOB_TITLE,DEPARTMENT,PROFILE,LOCATION) VALUES($1,$2,$3,$4,$5,$6,$7,$8);',
      loginValues, () => {
        done();
        client.query(
          `INSERT INTO REQUESTS(${requestsColumns}) VALUES($1,$2,$3,$4,$5,$6,$7,$8),($9,$10,$11,$12,$13,$14,$15,$16),($17,$18,$19,$20,$21,$22,$23,$24),($25,$26,$27,$28,$29,$30,$31,$32);`,
          requestsValues, (error) => {
            console.log(error)
            done();

            client.query(
              'INSERT INTO USERS(FIRST_NAME,LAST_NAME,EMAIL,PASSWORD,JOB_TITLE,DEPARTMENT,PROFILE,LOCATION) VALUES($1,$2,$3,$4,$5,$6,$7,$8);',
              loginValuesAdmin, () => {
                done();
              }
            );
          }
        );
      }
    );
  }
});
export { pool, connectionString };
