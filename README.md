## Movie Rental API

The following is an API for a NODEjs Technical Test purpose you can find this API published in heroku: [MovieRentalAPI](https://movierentalapi.herokuapp.com)
if you want to give it a try you can use [Postman](https://www.postman.com/downloads/).

* API in heroku: https://movierentalapi.herokuapp.com
* API Docs : https://documenter.getpostman.com/view/4649025/T1Dngxh2?version=latest

## Prerequisites

In order to get the API running locally alongside with mysql you need to have installed:

  * [Node](https://nodejs.org/en/) and npm
  * [Mysql](https://www.mysql.com/downloads/)
  * [Workbench](https://dev.mysql.com/downloads/workbench/) this is optional, you can use any other software for the database
  * Download or `git clone` the current repository

## Database

Allright, the current repository contains 2 folders in this section we will use the `resources` folder, so:

  * 1. Go inside the folder `resources` 
  * 2. You will find the a file called [movieRentalDB_dump.sql](https://github.com/ashikabi/backend-nodejs-API/blob/master/resources/movieRentalDB_dump.sql). [Import](https://dev.mysql.com/doc/workbench/en/wb-admin-export-import-management.html) this file in mysql using workbench or any other software you want.
  * 3. Then there are a couple of rows in every table, but you can add more.
  * 4. There are two users for testing `admin.user@gmail.com` with ADMIN ROLE and `user.email@gmail.com` with USER ROLE both with the password : `qwerty1234`, or you can create your own user with the API.

## API

Once the Database is imported and online we will focus i the folder `movieRentalAPI` and following the next steps:

  * 1. Open the terminal and navigate inside the folder mentioned before `movieRentalAPI`
  * 2. Execute `npm install` to install all the dependencies of the API
  * 3. Open the project with your [favorite IDE](https://code.visualstudio.com/) and search for the `.env` file.
  * 4. In the `.env` file you need to change the Database Variables with your credentials (`DB_USER` AND `DB_PASS`)
  * 5. Always in the `.env` file you can change the PORT where the API will be running by changing the variable called `API_PORT`
  * 6. And finally in the `.env` file you can change the expiration time of the JWT accessToken in the API by default is 10 minutes.

Once you get all the previous steps, you will be ready to start the API by executing:
```
node app.js
```
And there you go, the API is running locally.

## Routes / postman collection

For testing purpose if you want to export the collection of the API in postman:
 * You can find out insider the folder `resources` the file called [MovieRentalAPI.postman_collection.json](https://github.com/ashikabi/backend-nodejs-API/blob/master/resources/MovieRentalAPI.postman_collection.json)
