'use strict';
//const apiRoutes = require('./api_routes');
const express = require('express');
const routes = express.Router();
const userController = require('./userController');
const authController = require('./authController');
const apiController = require('./apiController');
module.exports = function(app, db) {
  app.use('/api', apiController);
  app.use('/auth', authController);
  app.use('/', userController);
  //userController(app, db);
  //authController(app, db);

};


//routes.use('/', userController);
module.exports = routes;
