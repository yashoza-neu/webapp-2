# CloudProject
# CSYE 6225 - Spring 2020

## Team Information

| Name | NEU ID | Email Address |
| --- | --- | --- |
| Yash Devan Oza | 001407273 | oza.y@husky.neu.edu |

## Technology Stack
* Node.js
* MySQL
* Postman ,Mocha & Chai for testing

## Build Instructions
* testing 
* Pre-requisites: Install Node.js,npm,MySQL
* Set environment variables for MySQL connection and node server port
* On terminal navigate to path :webapp/webapp
* Run npm install, npm start to start node server
* In Postman:
* User:
1. POST request: http://localhost:3000/v1/user
2. GET request: http://localhost:3000/v1/user/self
3. PUT request: http://localhost:3000/v1/user/self
* Bill:
1. GET request: http://localhost:3000/v1/bill/{id} 
2. POST request: http://localhost:3000/v1/bill
3. DELETE request: http://localhost:3000/v1/bill/{id}
4. PUT request: http://localhost:3000/v1/bill/{id}
5. GET request: http://localhost:3000/v1/bill
6. POst Attachment

## Deploy Instructions

## Running Tests
Run npm start to start node server & npm test for running test cases

## CI/CD

CircleCI...