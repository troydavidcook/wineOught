const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const middleware = require('../middleware');

const router = express.Router();

// =============================
//      Authorization Routes
// =============================

// -------------------------------
//    Passport User.register tool
// -------------------------------

// var newUser = new User({
//   username : username,
//   email : email,
//   tel : tel,
//   country : country
// });

// User.register(newUser, password, function(err, user) {
//  if (errors) {
//      // handle the error
//  }
//  passport.authenticate("local")(req, res, function() {
//      // redirect user or do whatever you want
//  });
// });
// }

router.get('/', (req, res) => {
  res.render('landing');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', (req, res) => {
  const newUser = new User({ username: req.body.username });
  // Passport sends along the 'err' object that we can access, in this case,
  // the .message for the req.flash();
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/signup');
    }
    passport.authenticate('local')(req, res, () => {
      req.flash('success', `Welcome to Wine Ought, ${user.username}!`);
      return res.redirect('/wines');
    });
  });
});

// -------------------------------
//    Logging in
// -------------------------------

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', passport.authenticate(
  'local',
  {
    successRedirect: '/wines',
    failureRedirect: '/login',
  },
), (req, res) => {
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Successfully logged out!');
  res.redirect('/wines');
});

module.exports = router;
