const express = require('express');
const authController = express.Router();
const passportGitHub = require('../auth/github');

//router.get('/login', (req,res,next) => {
//  res.render('login', { message: 'please sign in'})
//})

/* GITHUB ROUTER */
// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHub will redirect the user
//   back to this application at /auth/github/callback
authController.get('/github',
  passportGitHub.authenticate('github')); // dont need this: , { scope: [ 'user:email' ] }),

    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.

// GET /auth/github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function will be called,
//   which, in this example, will redirect the user to the home page.
authController.get('/github/callback', passportGitHub.authenticate('github', {  failureRedirect: '/login' }),

  function(req, res) {
      // post to my own post user now?
      //console.log(req);
      console.log("req+user "+req.user);
      res.render('home', {user: req.user}); // may need to change syntax
  });
// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.



module.exports = authController;
