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
  if (err) throw err;
  if (process.env.NODE_ENV === 'test') {
    client.query(
      'INSERT INTO USERS(ID,FIRST_NAME,LAST_NAME,EMAIL,PASSWORD,JOB_TITLE,DEPARTMENT,PROFILE,LOCATION,UPGRADE_ID) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *;',
      loginValues, (error) => {
        done();
        if (error) {
          throw error;
        }
        client.query(
          `INSERT INTO REQUESTS(${requestsColumns}) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9),($10,$11,$12,$13,$14,$15,$16,$17,$18);`,
          requestsValues, (error1) => {
            if (error1) throw error1;
            done();

            client.query(
              'INSERT INTO USERS(ID,FIRST_NAME,LAST_NAME,EMAIL,PASSWORD,JOB_TITLE,DEPARTMENT,PROFILE,LOCATION,UPGRADE_ID) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *;',
              loginValuesAdmin, (error2) => {
                if (error1) throw error2;
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
