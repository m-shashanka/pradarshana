# Assessment Tool Backend
[![run-tests-and-deploy](https://github.com/adityasm1238/assessment-tool-backend/actions/workflows/test-deploy.yml/badge.svg)](https://github.com/adityasm1238/assessment-tool-backend/actions/workflows/test-deploy.yml)
# Environment vars
This project uses the following environment variables:

| Name                          | Description                         | Default Value                                  |
| ----------------------------- | ------------------------------------| -----------------------------------------------|
|JWT_SECRET           | Secret for JWT hashing           | null     |
|MONGO_URI           | URI to connect to mongo db           | null     |


# Pre-requisites
- Install [Node.js](https://nodejs.org/en/) version 16


# Getting started
- Clone the repository
```
git clone  <git lab template url> <project_name>
```
- Install dependencies
```
cd assessment-tool-backend
npm install
```
- Build and run the project
```
npm start
```
  Navigate to `http://localhost:6000`

- API Document endpoints

  swagger Spec Endpoint : http://localhost:8001/api-docs 

  swagger-ui  Endpoint : http://localhost:8001/docs 



## Project Structure
The folder structure of this app is explained below:

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **node_modules**         | Contains all  npm dependencies                                                            |
| **src**                  | Contains  source code that will be compiled to the dist dir                               |
| **configuration**        | Application configuration including environment-specific configs 
| **src/controllers**      | Controllers define functions to serve various express routes. 
| **src/lib**              | Common libraries to be used across your app.  
| **src/middlewares**      | Express middlewares which process the incoming requests before handling them down to the routes
| **src/routes**           | Contain all express routes, separated by module/area of application                       
| **src/models**           | Models define schemas that will be used in storing and retrieving data from Application database  |
| **src/monitoring**      | Prometheus metrics |
| **src**/index.ts         | Entry point to express app                                                               |
| package.json             | Contains npm dependencies as well as [build scripts](#what-if-a-library-isnt-on-definitelytyped)   | tsconfig.json            | Config settings for compiling source code only written in TypeScript    


