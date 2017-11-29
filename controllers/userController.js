'use strict';
const express = require('express');
const async = require('async');
const request = require('request-promise');
const User = require('../models/user');
const Item = require('../models/item');
const apiController = require('./apiController');
//const authController = require('/authController');
// Get an instance of the express router
const userController = express.Router();
//try to link to db connection
const db = require('../db');

// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`)
// see if i can update any post method called to send a notification to url provided
userController.get('/api/inventory/:SKU', checkApi, (req,res) => {
  console.log(req.query);
  Item.find({'SKU': req.query.SKU}, (err,item) => {
    if (err) {res.json(err)}
    else {res.json(item)}
  })
  //console.log(req.body);
})
// get api inventory for an api key user
userController.get('/api/inventory', checkApi, (req,res) => {
  console.log(req.query);
  Item.find({'user_api': req.query.api_key, SKU: req.query.SKU}, (err,result) => {
    if (err) {
      res.send(err);
    } else {
    console.log(result);
    res.json({result});
  }
})
  //res.json('api/inventory routes')
})

userController.post('/api/inventory', checkApi, (req, res) => {
  const apikey = req.query.api_key;
  console.log(apikey);
  const data = req.body.items;
  console.log(data.length-1);
  console.log(data[0].SKU);
  data.forEach(function(obj, index){
    let obj1 = new Item(obj);
    obj1["user_api"] = apikey;
    data[index] = obj1;
  })

  data.forEach(function(obj, index) {
    console.log("step thru inventory1");
    if (obj.Qty < 1 || obj.Qty > 1000) {
      res.status(406).json("Qty is either too high or too log on your input, please check documentation");
    }
    obj.save(function(err, item) {
      if (err) {console.log(err);}

      console.log("step thru inventory2");
      console.log('inventory item saved' + obj);
      })
    console.log("step thru inventory3");
    })

  res.status(201).json("Success, inventory uploaded :" + {data});
    /* validation scenarios
    Item.findOne({user_api: apikey, SKU: x.SKU, Status: x.Status}, (err, item) => {
      if (err) {
        x.save(function(err) {
          if (err) throw err;
          console.log('inventory item saved' + item);
        })
        i++;}
      else {
        Item.update({user_api: apikey, SKU: x.SKU, Status: x.Status}, {$inc: {Qty: x.Qty}}, function(err){
          if (err) { throw err;}
          i++;
        })
      }*/



})

userController.post('/api/orders', checkApi, (req, res) => {
  // need cors here?
  console.log(req.body);
  console.log(req.body.SKU);

  const updateItems = Item.findOne({user_api: req.query.api_key, SKU: req.body.SKU, Status: 'in stock'}, (err, lis) => {
    console.log("here is"+{lis});
    if (err) {res.status(403).json("No item of that kind was found to ship");}
    // extract correct status method
    else if (lis.Qty < req.body.Qty){
      res.status(406).json("Quantity is too low to proces this request");
    }
    let diff = lis.Qty - req.body.Qty;
    //if (req.body.Status == "preparing for shipment")
    //lis.Qty - req.body.Qty
    Item.update({_id: lis.id}, {$set: {'Qty': diff}}, function(err){
      if (err) throw err;
    // reduce qty
      console.log("Item Stock updated");
  })})
  if (updateItems == null){
    res.json("Error: That item was not found in your warehouse or check you have enough Quantity")
  }
  else {
  const item = new Item({
    user_api: req.query.api_key,
    SKU: req.body.SKU,
    Status: req.body.Status,
    Qty: req.body.Qty
  })
  item.save(function(err) {
    if (err) throw err;
    console.log('inventory item saved' + item);
  })
  //check for item validation, if no stock send error
  console.log(req.body);
  sendNoficiations(apikey);
  res.json("Order placed for "+req.body.SKU+" to address: "+req.body.Address);
}
})
function sendNoficiations(key){
  const user = User.find({api_key: key}, (err,it) => {
    if (err) {return null;}
    return it;
  })
  if (!user.Url){
    console.log("No Url added");
    next();
  }

  const options = {
    method: 'POST',
    uri: "http://localhost:3000/pip", // swap out
    body: req.body,
    json: true,
    headers: {
        'Content-Type': 'application/json',
      }
    };
  //const data = JSON.stringify()
  request(options).send();

}
//userController.use('/auth', authController);
userController.get('/home',(req, res) => {
  console.log("req.user "+req.user);
  //res.json("home route" ); // ensureAuthenticated,
  res.render('home', {user: req.user}) //
})
// set up users
userController.get('/setup', (req,res) => {

  const john = new User({
    username: "JohnDoe",
    password: "password",
    token: "ohno",
    api_key: "abcd"
  })
  const b = new User({
    username: "atomek88",
    password: "password",
    token: "haha",
    api_key: "123456"
  })
  b.save(function(err) {
    if (err) throw err;
    console.log('atiomeks saved success');
    res.json({success: true });
  });
  john.save(function(err) {
    if (err) throw err;
    console.log('user saved success');
    //res.json({success: true });
  });
});
//set up some items for users
userController.get('/setup/items', (req,res) => {
  const a = new Item({
    user_api: "abcd",
    SKU: 'B123',
    Status: "in stock",
    Qty: 100
  })
  const x = new Item({
    user_api: "abcd",
    SKU: 'B123',
    Status: "in stock",
    Qty: 150
  })
  const b = new Item({
    user_api: "123456",
    SKU: 'B123',
    Status: "in stock",
    Qty: 100
  })
  const c = new Item({
    user_api: "xyz",
    SKU: 'B123',
    Status: "in stock",
    Qty: 50
  })
  const d = new Item({
    user_api: "abcd",
    SKU: 'A123',
    Status: "in stock",
    Qty: 80
  })
  a.save(function(err) {
    if (err) throw err;
    console.log('item1saved');
    //res.json({success: true });
  });
  x.save(function(err) {
    if (err) throw err;
    console.log('item3saved');
    //res.json({success: true });
  });
  b.save(function(err) {
    if (err) throw err;
    console.log('item2save');
    //res.json({success: true });
  });
  c.save(function(err) {
    if (err) throw err;
    console.log('item4');
    //res.json({success: true });
  });
  d.save(function(err) {
    if (err) throw err;
    console.log('item5');
    res.json({success: true });
  });
});
userController.get('/users', (req,res) => {
  User.find({}, (err,result) => {
    if (err) throw err;
    res.json({result});
  })
})
userController.post('/users/:id',  (req,res) => {
  User.findOneAndRemove({'api_key': req.query.api_key}, (err) => {
    if (err) {throw err;}
    req.logout();
    res.json("the user has been deleted").redirect('/');
  })
})
userController.get('/login', (req, res) => {
  res.render('login')
  console.log("tried login");
})

userController.get('/docs', (req, res) => {
  console.log("tried docs page");
  res.render('../views/docs')
})
userController.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
userController.get('/notify', function(req,res){
  res.statusCode = 302;
  res.setHeader("Location", req.url); // set header to new location
  res.end();
})
userController.post('/api/notifications', checkApi, function(req, res){

  // api query parameter, add user URL ,
  const y = req.body.id;
  console.log(req.body);
  const x = User.findById({_id: y}, (err,user) => {
    if (err) {return null;}
    return user;
  })
  x.update({api_key: user.api_key}, {$set: {Url: req.body.url}}, function(err){
    if (err) throw err;
  })
  res.json("notifications route added");
});
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
function checkApi(req, res, next){
  if (!req.query.api_key) {res.status(403).json("invalid request, no api key");}

  User.findOne({'api_key': req.query.api_key}, (err, user) => {
    console.log("this is user" + user);
    if (err) { res.status(403).send(err)
    } else if (user != null) { return next();
    } else {
      res.redirect('/login');
    }
  })
  //

}


module.exports = userController;
