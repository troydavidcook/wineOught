## User Authentication
___
* Express Tools
  * Passport
  * Passport Local
  * Passport Local Mongoose
___
##### Creating a user with a Sign In form with Passport.js

```js
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

app.post('/signup', (req, res) => {
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
```
___
##### Handling logging in and logging out with Passport.js

```js
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', passport.authenticate(
  'local',
  {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
  },
), (req, res) => {
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
```