const express = require('express');
const routes = express();

 
//Separating the movies logic in different files to make it clean and readable.
routes.use(require('./user'));//users, login, roles
routes.use(require('./movie'));//movies, updates logs, likes
routes.use(require('./movieRental')); //tracking of the date, penalties etc
routes.use(require('./purchaseAndRental'));// purchase and rental transaction

module.exports = routes;