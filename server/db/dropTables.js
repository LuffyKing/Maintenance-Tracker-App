import { Pool } from 'pg';
import configJs from '../config/config';

const env = process.env.NODE_ENV || 'development';
const config = configJs[env];
const pool = new Pool({
  connectionString: config.DATABASE_URL || process.env.DATABASE_URL
});

if (process.env.NODE_ENV !== 'test') {
  console.log('running');
  pool.connect().then(client => client.query(`
  DROP TABLE IF EXISTS USERS,REQUESTS;`).then(() => client.release())
    .catch((error) => {
      client.release();
    }));
}
