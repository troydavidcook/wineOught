## User Authentication
___
* Express Tools
  * Passport
  * Passport Local
  * Passport Local Mongoose

#### Creating a user with a Sign In form.
```
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