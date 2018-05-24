import { Pool } from 'pg';
import configJs from '../config/config';
import { loginValues } from './seeds/loginSeed';

const env = process.env.NODE_ENV || 'development';
const config = configJs[env];
const connectionString = config.DATABASE_URL || process.env.DATABASE_URL;
const pool = new Pool({
  connectionString
});

const createEnum = (enumName, values) => {
  pool.query(`select exists (select 1 from pg_type where typname like '${enumName}');`)
    .then(res => res.rows[0])
    .catch(e => e.stack)
    .then((exists) => {
      if (!exists.exists) {
        pool.query(`CREATE TYPE ${enumName} AS ENUM (${values
          .map(item => `'${item}'`)
          .join(', ')});`)
          .catch(e => e.stack);
      }
    });
};

const seedAuto = (table, columns, values, poolClient) => {
  poolClient.connect((err, client, done) => {
    if (err) throw err;
    client.query(`INSERT INTO ${table}(${columns}) VALUES(${values
      .map(item => `'${item}'`)
      .join(', ')});`, values, (err) => {
      done();

      if (err) {
        return err.stack;
      }
    });
  });
};

pool.connect((err, client, done) => {
  if (err) throw err;
  if (process.env.NODE_ENV === 'test') {
    client.query(
      'INSERT INTO USERS(ID,FIRST_NAME,LAST_NAME,EMAIL,PASSWORD,JOB_TITLE,DEPARTMENT,PROFILE,LOCATION,UPGRADE_ID) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);',
      loginValues, () => {
        done();
      }
    );
  }
});

export { pool, connectionString };
