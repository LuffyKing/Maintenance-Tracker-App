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

export { pool, connectionString };
