const Campground = require('./models/campground');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user');
const Comment = require('./models/comment');
const express = require('express');
const path = require('path');
const seedDb = require('./seeds');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/yelp_camp', { useMongoClient: true });

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// This function starts by wiping the db, then populating. Much like 'DROP DB' in pSQL.
seedDb();

// Beginning of RESTful routing
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/campgrounds', (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log('Error: ', err);
    } else {
      res.render('index', { campgrounds });
    }
  });
});

app.get('/campgrounds/new', (req, res) => {
  res.render('new')
});

app.post('/campgrounds', (req, res) => {
  // OBJECT DESTRUCTURING. Airbnb preferred for some reason.
  const reqBody =
    {
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
    };

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
      // Setting the object 'campgrounds' to what we retrieved by 'findById()'
      res.render('show', { campgrounds: fetchedGround });
    }
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`YelpCamp running on port ${port}`);
});
