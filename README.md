[![Build Status](https://travis-ci.com/omobosteven/maintenance-tracker.svg?branch=ch-feedback-server-159420529)](https://travis-ci.com/omobosteven/maintenance-tracker)
[![Coverage Status](https://coveralls.io/repos/github/omobosteven/maintenance-tracker/badge.svg?branch=ch-feedback-server-159420529)](https://coveralls.io/github/omobosteven/maintenance-tracker?branch=ch-feedback-server-159420529)
[![Maintainability](https://api.codeclimate.com/v1/badges/a6fde1bb2915cec5032e/maintainability)](https://codeclimate.com/github/omobosteven/maintenance-tracker/maintainability)

# Maintenance-tracker
MaintenanceTracker App is an application that provides users with the ability to reach out to operations or repairs department regarding repair or maintenance requests and monitor the status of their request. [MaintenanceTracker App](https://maintenance-tracker-stv.herokuapp.com/index.html)

<br />

## Getting Started
This is a javascript application built with [**Express**](https://expressjs.com/) framework on the nodejs platform. It uses the [**postgreSQl**](https://www.postgresql.org/) database. Authentication of users is done using [**JSON Web Token**](https://jwt.io/).

## Techonolgy Stack
**UI & Templates**
1. HTML & CSS
3. Javascript

**Server Side**
1. NodeJS
2. Express

## Dependencies
* [Postgres](https://www.postgresql.org/download/)
* [NodeJS](https://nodejs.org/en/)

## Installation
1. Install [**Node JS**](https://nodejs.org/en/).
2. Install [**Postgres**](https://www.postgresql.org/).
3. Clone project [**repo**](https://github.com/omobosteven/maintenance-tracker.git).
4. [**cd**] into the root of the **project directory**.
5. Run `npm install` on the terminal to install Dependecies.
6. Run `npm run db-migrate` on the terminal.
7. Create a `.env` file in the root directory of the application. Use a different database for your testing and development. Example of the content of a .env file is shown in the .env.sample.
8. Start the application:
**_Different Build Environment_**

**Production**
```
npm run start
```
**Development**
```
npm run start-dev
```

## Usage
- Run database migration with `npm run db-migrate`
- Start app development with `npm run start-dev`
- Install **Postman** and use to test all endpoints

## Limitations
The limitations with this current version of Maintenance tracker includes:
- Authenticated Users cannot reopen a resolved request.
- Authenticated Users cannot cancel a request.

## Testing

Sever side tests - Run `npm test` on the terminal while within the **project root directory**.

Server side testing is achieved through the use of `chai-http`, `mocha` and `chai` packages. `chai-http` is used to make requests to the api and `mocha` is the testing framework and `chai` is the exception library. They will both be installed when you run `npm install` and the tests will run when you run `npm test`.

## Features
MaintenanceTracker consists of the following features:

### Authentication

- It uses JSON Web Token (JWT) for authentication.
- Token is generated on user login
- Token is perpetually verified to check the state of the user if logged in or not.
- Admin User will br pre-seeded into the application with administrative priviledges

### Authenticated Users
- Authenticated Users can register
- Authenticated Users can log in
- Authenticated Users can create a request
- Authenticated Users can modify a request
- Authenticated Users can view all their requests
- Authenticated Users can view the details of a request
- Authenticated Users can search through a list of books

### Admin Users
- Admins can view all requests in the system
- Admins can view the details of a request
- Admins can approve a request
- Admins can disapprove a request
- Admins can resolve a request


## API Documentation
You can view the API Documentation [here](https://maintenance-tracker-stv.herokuapp.com/apidocs)

### Questions
For more details contact omobosteven@gmail.com

## Contributing

This project is open for contributions. All contributions must adhere to the Airbnb styleguide.
* [Airbnb Styleguide](http://airbnb.io/javascript/)

### License
* [MIT License](https://github.com/omobosteven/maintenance-tracker/blob/develop/LICENSE)

### Author(s)
* [Omobo Steven](https://github.com/omobosteven)
