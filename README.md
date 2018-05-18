<img src="logoSmall.png" alt='logo'/>

[![Build Status](https://travis-ci.com/omobosteven/maintenance-tracker.svg?branch=ft-modify-request-157614272)](https://travis-ci.com/omobosteven/maintenance-tracker)
[![Coverage Status](https://coveralls.io/repos/github/omobosteven/maintenance-tracker/badge.svg?branch=ft-modify-request-157614272)](https://coveralls.io/github/omobosteven/maintenance-tracker?branch=ft-modify-request-157614272)
[![Maintainability](https://api.codeclimate.com/v1/badges/a6fde1bb2915cec5032e/maintainability)](https://codeclimate.com/github/omobosteven/maintenance-tracker/maintainability)

# Maintenance-tracker
Maintenance Tracker App is an application that provides users with the ability to reach out to operations or repairs department regarding repair or maintenance requests and monitor the status of their request.

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
* System Dependencies: Node

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
    <td>POST</td>
    <td>/api/v1/users/requests</td>
    <td>Create a request</td>
  </tr>
  <tr>
    <td>PUT</td>
    <td>/api/v1/users/requests/:id</td>
    <td>Modify a request</td>
  </tr>
</table>
<hr>

### Create a Request: `/api/v1/users/requests`
To create a request, send the following parameters
##### NB: description field is optional

```
{
   type: 'repairs',
   category: 'computers',
   item: 'printer',
   description: 'faulty',
}
```
<hr>

### Modify a Request: `/api/v1/users/requests/:id`
To modify a request, send the following parameters
##### NB: description field is optional

```
{
   type: 'repairs',
   category: 'electronic',
   item: 'printer',
   description: 'faulty',
}
```
<hr>

## Contributing

This project is open for contributions. All contributions must adhere to the Airbnb styleguide.

* [Javascript](http://airbnb.io/javascript/)

### Author(s)

* [Omobo Steven](https://github.com/omobosteven)
