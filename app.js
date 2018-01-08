const passportLocalMongoose = require('passport-local-mongoose');
const expressSanitizer      = require('express-sanitizer');
const Comment               = require('./models/comment');
const methodOverride        = require('method-override');
const session               = require('express-session');
const LocalStrategy         = require('passport-local');
const User                  = require('./models/user');
const Wine                  = require('./models/wine');
const flash                  = require('connect-flash');
const bodyParser            = require('body-parser');
const mongoose              = require('mongoose');
const passport              = require('passport');
const express               = require('express');
const mongoDb               = require('mongodb');
const seedDb                = require('./seeds');
const path                  = require('path');

// Requiring all route files
const commentRoutes         = require('./routes/comments');
const indexRoutes           = require('./routes/index');
const wineRoutes            = require('./routes/wines');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/yelp_camp', { useMongoClient: true });

// ===============
// Passport Config
// ===============

// Start express-session before passport.
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
// ========================

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
// npm package for flash messages.
app.use(flash());


// This creates a user that can be stored across the board.
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.set('view engine', 'ejs');

// This function starts by wiping the db, then populating. Much like 'DROP DB' in pSQL.
// seedDb();

app.use(indexRoutes);
app.use('/wines', wineRoutes);
app.use('/wines/:id/comments', commentRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Wine Ought is running on port ${port}`);
});
