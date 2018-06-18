<img src="logoSmall.png" alt='logo'/>

[![Build Status](https://travis-ci.com/omobosteven/maintenance-tracker.svg?branch=ch-implement-feedback-server-158414602)](https://travis-ci.com/omobosteven/maintenance-tracker)
[![Coverage Status](https://coveralls.io/repos/github/omobosteven/maintenance-tracker/badge.svg?branch=ch-implement-feedback-server-158414602)](https://coveralls.io/github/omobosteven/maintenance-tracker?branch=ch-implement-feedback-server-158414602)
[![Maintainability](https://api.codeclimate.com/v1/badges/a6fde1bb2915cec5032e/maintainability)](https://codeclimate.com/github/omobosteven/maintenance-tracker/maintainability)

# Maintenance-tracker
Maintenance Tracker App is an application that provides users with the ability to reach out to operations or repairs department regarding repair or maintenance requests and monitor the status of their request.

* [Maintenance-tracker API documentation](https://maintenance-tracker-stv.herokuapp.com/apidocs)
* [Maintenance-tracker on Heroku](https://maintenance-tracker-stv.herokuapp.com/signup.html)

## Features
* User can create an account and log in
* User can make maintenance or repairs request
* User can modify their maintenance or repairs request
* User can view all his/her requests
* User can view the details/status of his/her request
* Admin can do the following
    * Approve or disapprove a repair/maintenance request
    * Mark request as resolved once it is done
    * View all maintenance  or repaires request

### Folder Structure
* UI: contains the UI design with HTML/CSS/JAVASCRIPT
* server: contains the project API endpoints created using Node/express, and tests using mocha/chai

## Technologies used

#### Core Technology Stacks
* Front-end: HTML, CSS and Javascript
* Back-end: Expressjs
* Libraries: Babel, eslint, Mocha/Chai + chai-http
* System Dependencies: Node, PostgreSQL

<h3>API Endpoints</h3>
<hr>
<table>
  <tr>
    <th>Request</th>
    <th>End Point</th>
    <th>Action</th>
  </tr>
  <tr>
    <td>GET</td>
    <td>/api/v1/users/requests</td>
    <td>Fetch all the requests of a logged in user</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/api/v1/users/requests/:id</td>
    <td>Fetch a request that belongs to a logged in user</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/api/v1/requests</td>
    <td>Fetch all requests</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/api/v1/requests/:id</td>
    <td>Fetch a requests</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/api/v1/users/requests</td>
    <td>Create a request</td>
  </tr>
  <tr>
    <td>PUT</td>
    <td>/api/v1/users/requests/:id</td>
    <td>Modify a request</td>
  </tr>
  <tr>
    <td>PUT</td>
    <td>/api/v1/requests/:id/approve</td>
    <td>Approve request</td>
  </tr>
  <tr>
    <td>PUT</td>
    <td>/api/v1/requests/:id/disapprove</td>
    <td>Disapprove request</td>
  </tr>
  <tr>
    <td>PUT</td>
    <td>/api/v1/requests/:id/resolve</td>
    <td>Resolve request</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/api/v1/auth/signup</td>
    <td>Register a user</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/api/v1/auth/login</td>
    <td>Login a user</td>
  </tr>
</table>
<hr>

### Getting Started

* Clone project repo - git clone `https://github.com/omobosteven/maintenance-tracker.git`
* Ensure you have installed [NodeJS](https://nodejs.org/en/) and [Postgres](https://www.postgresql.org/download/)
* Navigate into the application root directory: `cd maintenance-tracker`
* Setup PostgresSQL servic on your local machine
* Run `$ npm install` to install all dependencies
* Create a `.env` file in the root directory using the sample `.env.sample` file
* setup your database configurations according to settings in server/config/config.js
* Run `$ npm run db-migrate`
* Run tests using `$ npm run test`

### How to Demo/Run the App

* To start the app in development, run: `npm run start-dev`
* To start the app in a production environment, run: `npm start`


## Contributing

This project is open for contributions. All contributions must adhere to the Airbnb styleguide.

* [Airbnb Styleguide](http://airbnb.io/javascript/)

### License
* [MIT License](https://github.com/omobosteven/maintenance-tracker/blob/develop/LICENSE)

### Author(s)

* [Omobo Steven](https://github.com/omobosteven)
