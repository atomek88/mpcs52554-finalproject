const passport = require('passport')
  , GitHubStrategy = require('passport-github').Strategy;
const User = require('../models/user');

passport.use(new GitHubStrategy({
    clientID: 'a87332d0e09388d7434a',  //process.env.CLIENT_ID, add
    clientSecret: 'ba420a046401160dceefdbc4975b740afb544cea', // process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/github/callback/',
    userAgent: 'mpcs-app'
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({username: profile.displayName}, {password: profile.login},{token: accessToken}, function (err, user) {
      return done(err, user);
    });
  }
));
passport.serializeUser(function(user, done) {
    console.log(user);
    done(null, user._id);
  });

passport.deserializeUser(function(obj, done) {
    //user.findById(id, function(err, user) {
      done(null, obj);
    });

module.exports = passport;
