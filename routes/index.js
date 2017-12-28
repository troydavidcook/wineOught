const express = require('express');
const User = require('../models/user');
const passport = require('passport');

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

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
}


router.get('/', (req, res) => {
  res.redirect('/campgrounds');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log('Error: ', err);
      res.render('signup');
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/');
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
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
  },
), (req, res) => {
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
});


// This function is hoisted, and can be used as middleware for any routes you want to use, in this
// case, to make sure User 'isLoggedIn'.

module.exports = router;
