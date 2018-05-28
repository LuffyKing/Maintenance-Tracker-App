[![Build Status](https://travis-ci.org/LuffyKing/Maintenance-Tracker-App.svg?branch=develop)](https://travis-ci.org/LuffyKing/Maintenance-Tracker-App)
[![Coverage Status](https://coveralls.io/repos/github/LuffyKing/Maintenance-Tracker-App/badge.svg?branch=develop)](https://coveralls.io/github/LuffyKing/Maintenance-Tracker-App?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/a2d1970c212fdbc11a63/maintainability)](https://codeclimate.com/github/LuffyKing/Maintenance-Tracker-App/maintainability)

# Maintenance-Tracker-App
This exciting new project aims to create a new web app called Maintenance-Tracker-App.Maintenance-Tracker-App provides a platform for employees to easily make repair or maintenance requests to the operations or repairs department. The platform aims to make it easier to keep track of repair or maintenance requests for both non-admin users and admin users. Admin users can view all the requests on the app, and they also have the ability to resolve, disapprove or approve all requests. Non-admin users have the ability to make requests, and see all the requests they have made.

### Prerequisites
```
node v8.6.0+
npm v5.7.1+
```

### Dependencies
```
bcrypt - NodeJS library used for hashing password. It is recommended you salt before hashing.
body-parser - NodeJS library for parsing the  body of incoming http requests.
express - NodeJS web application framework for organizing the application into MVC architecture. It manages routing, handles requests and responses,
and can render UI pages to respond to requests.
jsonwebtoken - NodeJS library which implements JSON Web tokens(RFC 7519), JWTs allow for stateless authentication of users.
pg - Asynchronous Postgresql client for NodeJS, this allows the project to interface with Postgresql database.
uuid - NodeJS library that allows for the fast generation of 128-bit numbers used to identify unique information. It was used in this project to
generate ids for users and requests.
validator - NodeJs library used to validate and sanitize strings. It was used in this project to check for valid emails and uuids.
```

#Development Dependencies
```
babel-cli - Command line interface for running babel
babel-plugin-transform-object-rest-spread - Plugin for using the rest operator with objects
babel-polyfill- NodeJS library that emulates a full ES2015+ environment, this allows for the support of bultin-ins
like Promises and WeakMap, static methods like Array.from or Object.assign, instance methods like Array.prototype.includes.
The polyfill adds to the global scope as well as native prototypes like String in order to do this.
babel-preset-env - A Babel preset that configures Babel automatically by enabling the necessary plugins for your project
babel-register - A NodeJS library that provides an alternative way to use babel, this alternative is through hooks
chai - NodeJS is a BDD / TDD assertion library
chai-http - NodeJS HTTP integration testing with Chai assertions
coveralls - A web service to help you track your code coverage over time, and ensure that all your new code is fully covered.
dotenv -  A zero-dependency module that loads environment variables from a .env file into process.env
eslint - ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code,
eslint-config-airbnb-base - This package provides Airbnb's base JS .eslintrc (without React plugins) as an extensible shared config.
eslint-plugin-import - This plugin intends to support linting of ES2015+ (ES6+) import/export syntax, and prevent issues with misspelling of file paths and import names
mocha  - Mocha is a feature-rich JavaScript test framework running on Node.js and in the browser, making asynchronous testing simple and fun.
mocha-lcov-reporter - The mocha-lcov-reporter is a reporter for mocha. In order to get coverage data, the same instructions are to be followed as for the JSONCov and HTMLCov reporters.
morgan - HTTP request logger middleware for node.js
nodemon - Nodemon will watch the files in the directory in which nodemon was started, and if any files change, nodemon will automatically restart your node application,
nyc - Istanbul's state of the art command line interface
```

### Installing
```
mkdir Maintenance-Tracker-App
cd Maintenance-Tracker-App
git init
git clone https://github.com/LuffyKing/Maintenance-Tracker-App.git
cd Maintenance-Tracker-App
npm install
npm start
```
## GitHub Pages Link
https://luffyking.github.io/Maintenance-Tracker-App/


## Running the tests

```
npm run test
```
## APIs

APIs are hosted at https://trackerhero.herokuapp.com/api/v1

APIs available
```
POST /auth/signup Register a user

POST /auth/login Login a user

GET /users/requests Fetch all the requests of a logged in  user

GET /users/requests/<requestId> Fetch a request that belongs to a logged in user

POST /users/requests Create a request.

PUT /users/requests/<requestId> Modify a request.

Get /requests/ Fetch all the requests. admin

PUT /requests/<requestId>/approve Approve a request admin

PUT /requests/<requestId>/disapprove Disapprove a request admin

PUT /requests/<requestId>/resolve Resolve a request admin
```
##
## Deployment

Deplying to heroku https://devcenter.heroku.com/articles/getting-started-with-nodejs#deploy-the-app

## Built With

* [Postgresql](https://www.postgresql.org/) - The database used
* [npm](http://npmjs.com/) - Dependency management tool used

## Authors

**Oyindamola Aderinwale** - https://github.com/LuffyKing

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
