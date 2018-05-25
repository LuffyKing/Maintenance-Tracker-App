require('dotenv').config();

module.exports = {
  development: {
    DATABASE_URL: process.env.DB_DEV_DATABASE_URL,
    PORT: process.env.DEV_PORT
  },
  test: {
    DATABASE_URL: process.env.DB_TEST_DATABASE_URL,
    PORT: process.env.TEST_PORT
    // might interfere with travis
  },
  production: {

  }
};
