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
Get all maintenance and repair requests
GET /users/requests

Get a maintenance or repair request
GET /users/requests/:requestid

Create a maintenance or service request
POST /users/requests

Modify a maintenance or service request
PUT /users/requests/<requestId>
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
