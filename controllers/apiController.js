'use strict';
const express = require('express');
const Item = require('../models/item');


// Get an instance of the express router
const apiController = express.Router();
//try to link to db connection
const db = require('../db');



apiController.get('/api', function(req,res) {
  console.log(req.body);
  res.json('api routes');
})
apiController.get('/api/inventory', (req,res) => {
  /*Item.find({api: req.params.api_key}, (err,res) => {
    if (err) {
      res.status(406).json(err);
    } else {
    res.json({res});
}
  });*/
  res.json('api/inventory routes')
})


module.exports = apiController;
