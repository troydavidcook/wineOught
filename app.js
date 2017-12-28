const passportLocalMongoose = require('passport-local-mongoose');
const Campground            = require('./models/campground');
const Comment               = require('./models/comment');
const session               = require('express-session');
const LocalStrategy         = require('passport-local');
const User                  = require('./models/user');
const bodyParser            = require('body-parser');
const mongoose              = require('mongoose');
const passport              = require('passport');
const express               = require('express');
const mongoDb               = require('mongodb');
const seedDb                = require('./seeds');
const path                  = require('path');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/yelp_camp', { useMongoClient: true });

// ===============
// Passport Config
// ===============

app.use(session({
  secret: 'Secret Yelpcamp key, again, hoping we\'re changing it soon, environment variable perhaps?',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// This function starts by wiping the db, then populating. Much like 'DROP DB' in pSQL.
seedDb();

// Beginning of RESTful routing
app.get('/', (req, res) => {
  res.redirect('/campgrounds');
});

app.get('/campgrounds', (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log('Error: ', err);
    } else {
      res.render('campgrounds/index', { campgrounds });
    }
  });
});

app.get('/campgrounds/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

app.post('/campgrounds', (req, res) => {
  // OBJECT DESTRUCTURING. Airbnb preferred for some reason.
  const reqBody = { name: req.body.name, image: req.body.image, description: req.body.description };

  Campground.create(reqBody, (err) => {
    if (err) {
      console.log('Error: ', err);
    } else {
      // Redirect goes back to certain route, not a view name.
      res.redirect('/campgrounds');
    }
  });
});

// SHOW
app.get('/campgrounds/:id', (req, res) => {
  const campId = req.params.id;
  // Associating different objects by populating different model into the campground,
  // then executing the callback. Important association line here. IMPORTANT.
  Campground.findById(campId).populate('comments').exec((err, fetchedGround) => {
    if (err) {
      console.log('Error: ', err);
    } else {
      // Setting the object 'campgrounds' to what we retrieved by 'findById()';
      res.render('campgrounds/show', { campgrounds: fetchedGround });
    }
  });
});

// ==========================
//      Comments Routes
// ==========================

app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
  const campgroundId = req.params.id;
  Campground.findById(campgroundId, (err, campground) => {
    if (err) {
      console.log('Error: ', err);
    } else {
      res.render('comments/new', { campground });
    }
  });
});

// Important association
app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
  const campgroundId = req.params.id;
  Campground.findById(campgroundId, (err, campground) => {
    if (err) {
      console.log('Error: ', err);
      res.redirect('/campgrounds');
    } else {
      // Posting and assocciation.
      Comment.create(req.body.comment, (error, comment) => {
        if (err) {
          console.log('Error: ', error);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect(`/campgrounds/${campgroundId}`);
        }
      });
    }
  });
});

// =============================
//      Authorization Routes
// =============================

app.get('/signup', (req, res) => {
  res.render('signup');
});

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

// -------------------------------
//    Logging in
// -------------------------------

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

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
});


// This function is hoisted, and can be used as middleware for any routes you want to use, in this
// case, to make sure User 'isLoggedIn'.

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`YelpCamp running on port ${port}`);
});
