'use strict';
// server.js
const express        = require('express');
//const User           = require('./models/user');
//const MongoClient    = require('mongodb').MongoClient;
const mongoose       = require('mongoose');
//const User           = require('../models/user');
const bodyParser     = require('body-parser');
const path           = require('path'); // why require path?
const db             = require('./db')
const session        = require('express-session');
const cors           = require('cors');
const passport       = require('./auth/github');
const Strategy       = require('passport-github').Strategy;
const errorhandler   = require('errorhandler');
const jwt            = require('jsonwebtoken');
const authController = require('./controllers/authController');
//const routes         = require('./controllers/index')
const apiController  = require('./controllers/apiController');
const userController = require('./controllers/userController');
//const RedisStore     = require('connect-redis')(session);
const app            = express();

/*
github Strategy
passport.use(new Strategy({
    clientID: 'a87332d0e09388d7434a',  //process.env.CLIENT_ID, add
    clientSecret: 'ba420a046401160dceefdbc4975b740afb544cea', // process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/github/callback/',
    userAgent: 'mpcs-app'
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    User.findOne({username: profile.login}, (err, user) => {
      if (err) throw err;
      if (!user) {
        let user = new User({
          username: profile.login,
          password: "password",
          token: accessToken,
          api: "123-456"
        })
        user.save(function(err) {
          if (err) throw err;
          console.log('new user creation success');
          res.json({success: true });
        });
      } else if (user) {
        // pass git token here?
        let token = jwt.sign(profile.login, app.get('superSecret'), {
          expiresinMinutes: 1440
        });x
        user.token = token;
      }
    } );
    return done(null, profile);
  }

))
    //process.nextTick(function () {
        //User.findOrCreate({ email: profile.id }, function (err, user) { (Find and update user)

        // console.log(user);
    //})

    // In this example, the user's github profile is supplied as the user
    // record.  In a production-quality application, the git profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.

passport.serializeUser(function(user, done) {
    console.log(user);
    done(null, user._id);
  });

passport.deserializeUser(function(obj, done) {
    //user.findById(id, function(err, user) {
      done(null, obj);
    });  */
   //deserializing & serializing may be unnecessary if saving in session*/
app.use(passport.initialize());
app.use(passport.session());
app.use(require('cookie-parser')());
app.use(cors());

app.set('port', process.env.PORT || 3000);
const port = app.get("port");


// set api controller
//app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));
app.use(express.static('public'));
app.use(express.static(__dirname + '/pics')); //__dirname + '/public'));
//app.use(partials());

app.use(require('morgan')('dev')); //check or remove
// connect to mongoose 'mongodb://artemis:atom@ds113606.mlab.com:13606/athena_api'
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://artemis:atom@ds113606.mlab.com:13606/athena_api', { useMongoClient: true}, function(err, db) {
  if (err) console.log(err);
  console.log("db connected");
  // link controllers here
  //require('./controllers/index')(app, db);
  app.listen(app.get("port"), () => {
    console.log("we are live on on "+port)
  })
});

//controller(app, db);
//app.set('superSecret', db.secret);//secret variable here, may delete


app.use(session({
    //store: new RedisStore({
    //  url: config.redicStore.url
    //}),
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'cat in a hat'
}));
/* generate static files this way or next line?
app.get('/account', ensureAuthenticated, function(req, res){
  console.log("tried accoiu nt page" + req);

  // find user here? or add session token?
  res.render('home', { user: req.user });


})*/
// cors enablement
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
//app.use('/api', apiController);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/auth', authController);
app.use('/', userController);
//routes(app,db);

//api



app.get('/', (req, res) => {
  res.render('index');
})
