import { Pool } from 'pg';
import configJs from '../config/config';
import { loginColumns, loginValues } from './seeds/loginSeed';

const env = process.env.NODE_ENV || 'development';
const config = configJs[env];
const pool = new Pool({
  connectionString: config.DATABASE_URL || process.env.DATABASE_URL
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

createEnum('status', ['Not Aprroved/Rejected', 'Approved', 'Rejected', 'Resolved']);

createEnum('profile', ['Admin', 'User']);

createEnum('reqtype', ['Maintenance', 'Repair']);
pool.connect((err, client, done) => {
  if (err) throw err
  if (process.env.NODE_ENV === 'test') {
    client.query('DROP TABLE IF EXISTS USERS,REQUESTS;', () => { done(); });
  }
  client.query(`
  CREATE TABLE IF NOT EXISTS USERS(
  ID UUID PRIMARY KEY NOT NULL,
  FIRST_NAME VARCHAR(80) NOT NULL,
  LAST_NAME VARCHAR(80) NOT NULL,
  EMAIL VARCHAR(80) NOT NULL UNIQUE,
  PASSWORD VARCHAR(90) NOT NULL,
  JOB_TITLE VARCHAR(70) NOT NULL,
  DEPARTMENT VARCHAR(70) NOT NULL,
  PROFILE profile default 'User'  NOT NULL,
  LOCATION VARCHAR(160) NOT NULL,
  UPGRADE_ID UUID NOT NULL UNIQUE
);`, ()=>{done()})

client.query(`
    CREATE TABLE IF NOT EXISTS REQUESTS(
    ID UUID PRIMARY KEY NOT NULL,
    TITLE VARCHAR(50) NOT NULL,
    DESCRIPTION VARCHAR(288) NOT NULL,
    status status default 'Not Aprroved/Rejected' NOT NULL,
    type reqtype NOT NULL,
    date_submitted date NOT NULL,
    last_edited date NOT NULL,
    date_resolved date,
    LOCATION VARCHAR(160) NOT NULL,
    REASON VARCHAR(288) NOT NULL,
    userid UUID references users(ID)
  );`, ()=>{done()});
  if (process.env.NODE_ENV === 'test') {
    client.query(`
        INSERT INTO USERS(ID,FIRST_NAME,LAST_NAME,EMAIL,PASSWORD,JOB_TITLE,DEPARTMENT,PROFILE,LOCATION,UPGRADE_ID)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        loginValues,()=>{
          done();
        }
      );

  }

});
const query = pool.connect;
export { pool };
